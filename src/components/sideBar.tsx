import { useEffect, useRef, useState, type ReactNode } from "react";
import { Dasboard, PlusIcon } from "../icons/commonIcons";
import {CollectionIcon, CommunityIcon} from "../icons/particularIcons";
import { useLogOutQuery } from "../api/auth/mutate";
import { useNavigate } from "react-router-dom";
import { useSearchQuery, useSideBarAtom, useTabAtom } from "../recoil/clientStates";
import { useGetListQuery } from "../api/user/query";
import React from "react";
import type { AuthUser } from "../App";
import type { ModalType } from "../pages/dashboard";
import { useUserProfile } from "../recoil/user";

interface sideBarTypes {
    setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
    /** 56px icon rail instead of the full panel */
    collapsed?: boolean;
    onToggle: () => void;
}

type Item = { key: string; label: string; icon: ReactNode; onClick: () => void; active?: boolean };
type Group = { label: string; items: Item[] };

/* The source icons ship wrapped in <a href="youtube.com">, so a bare click on
   one used to leave the app instead of filtering. pointer-events-none hands the
   click back to the row. */
const Glyph = ({ children }: { children: ReactNode }) =>
    <span className="pointer-events-none grid size-4 shrink-0 place-items-center text-[#71717A]">{children}</span>;

/* `light` inverts it for the dark chrome bar — the default near-black tile is for
   the white sidebar, and on the navy dither it sank into the darker patches. */
export const LatticeMark = ({ size, light = false }: { size: number; light?: boolean }) => (
    <span className={`grid shrink-0 place-items-center rounded-[7px] ${light ? "bg-white" : "bg-[#18181B]"}`}
        style={{ width: size, height: size }}>
        <svg viewBox="0 0 16 16" width={size * 0.6} height={size * 0.6} fill={light ? "#18181B" : "#fff"} aria-hidden>
            {/* four bars, tall-short-tall — the lattice */}
            <rect x="1.5" y="4.5" width="1.6" height="7" rx="0.8" />
            <rect x="5" y="2" width="1.6" height="12" rx="0.8" />
            <rect x="8.5" y="5.5" width="1.6" height="5" rx="0.8" />
            <rect x="12" y="3.25" width="1.6" height="9.5" rx="0.8" />
        </svg>
    </span>
);

const StatsIcon = () => (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        <path d="M2.5 13.5h11M4.5 13.5V9m3.5 4.5V4.5m3.5 9V7" />
    </svg>
);

// Local, in the StatsIcon idiom above. The nav row always renders a <Glyph>, so
// leaving DeepDive iconless would pull its label out of line with its siblings.
const DeepDiveIcon = () => (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden>
        <path d="M8 1.4l1.6 4.8L14.4 8l-4.8 1.8L8 14.6l-1.6-4.8L1.6 8l4.8-1.8z" />
    </svg>
);

const groupLabel = "px-3 pt-4 pb-1.5 text-[0.62rem] font-[500] uppercase tracking-[0.09em] text-[#A1A1AA]";
const rowBase = "flex w-full cursor-pointer items-center gap-2.5 rounded-md border px-2.5 py-[0.42rem] text-left text-[0.82rem] transition-colors";
const rowOn = "border-[#E7E7E9] bg-[#F4F4F5] text-[#18181B] font-[550]";
const rowOff = "border-transparent text-[#3F3F46] font-[450] hover:bg-[#FAFAFA]";
const pill = "flex w-full cursor-pointer items-center gap-2.5 rounded-md border border-[#E7E7E9] px-2.5 py-[0.42rem] text-left text-[0.82rem] font-[450] text-[#52525B] transition-colors hover:bg-[#FAFAFA]";

const SideBar = ({ setModalNeededBy, setUser, collapsed, onToggle }: sideBarTypes) => {

    const navigate = useNavigate();
    const [logOutOpen, setLogOutOpen] = useState<boolean>(false);

    const [tab, setTab] = useTabAtom();
    const [user] = useUserProfile();
    const [sidebar, setSideBar] = useSideBarAtom();
    const [query, setQuery] = useSearchQuery();
    const search = useRef<HTMLInputElement>(null);

    const { isSuccess: listSuccess, data: lists, refetch: listFetch } = useGetListQuery();

    useEffect(() => {
        listFetch();
    }, [])

    // ⌘F / ⌘K jumps to search — expands the rail first when there's no input yet
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!(e.metaKey || e.ctrlKey) || (e.key !== "f" && e.key !== "k")) return;
            e.preventDefault();
            search.current ? search.current.focus() : onToggle();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onToggle]);

    const handleTabChnage = (tab: string) => {
        setTab(tab);
        if (sidebar && window.innerWidth <= 1024) {
            setSideBar(prev => !prev)
        }
    }

    const { mutateAsync } = useLogOutQuery();
    const handleAsyncLogout = async () => {
        try {
            await mutateAsync(undefined, { onSuccess: () => { setUser?.(null); } });
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (user === null) {
            setTab('dashboard');
            navigate('/');
        }
    }, [user])

    const collections: { id: number, name: string }[] = listSuccess && Array.isArray(lists?.data?.payload?.collectionList)
        ? lists.data.payload.collectionList.filter((c: { name: string }) => c.name !== "dashboard")
        : [];

    const communities: { id: number, name: string }[] = listSuccess && Array.isArray(lists?.data?.payload?.allCommunities)
        ? lists.data.payload.allCommunities
        : [];

    const nav = (key: string, label: string, icon: ReactNode): Item =>
        ({ key, label, icon, active: tab === key, onClick: () => handleTabChnage(key) });

    const groups: Group[] = [
        {
            label: "workspace", items: [
                // "Episodes" is every saved card; the source filter lives in its header now
                { ...nav("dashboard", "Episodes", <Dasboard dim="16" style="[&_path]:stroke-current" />), active: tab.startsWith("dashboard") },
                nav("stats", "Stats", <StatsIcon />),
                nav("chatbot", "DeepDive", <DeepDiveIcon />),
            ]
        },
        {
            label: "collections", items: collections.map(c =>
                nav(`collection-${c.id}`, c.name, <CollectionIcon dim="15" style="fill-current" />))
        },
        {
            label: "community", items: communities.map(c =>
                nav(`community-${c.id}`, c.name, <CommunityIcon dim="16" style="stroke-current" />))
        },
    ];

    const account = (
        <div className="shrink-0 border-t border-[#F0F0F0] p-2.5">
            {logOutOpen && !collapsed &&
                <button onClick={handleAsyncLogout} className={`${pill} mb-2 justify-center border-[#FCA5A5] text-[#B91C1C] hover:bg-[#FEF2F2]`}>
                    log out
                </button>
            }
            <button onClick={() => collapsed ? onToggle() : setLogOutOpen(prev => !prev)} title={user?.userName}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md p-1 text-left transition-colors hover:bg-[#FAFAFA] ${collapsed ? "justify-center" : ""}`}>
                <img src={user?.profilePic} className="size-7 shrink-0 rounded-[7px] ring-1 ring-[#E7E7E9]" />
                {!collapsed &&
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.8rem] font-[550] text-[#18181B]">{user?.userName}</span>
                        <span className="block truncate text-[0.65rem] text-[#A1A1AA]">{user?.email}</span>
                    </span>
                }
            </button>
        </div>
    );

    /* ---- 56px rail ---- */
    if (collapsed) return <div className="flex h-full w-14 flex-col border-r border-[#EAEAEA] bg-white">
        <div className="grid shrink-0 place-items-center pt-3 pb-1">
            <button onClick={onToggle} title="Lattice — expand" className="cursor-pointer"><LatticeMark size={28} /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-2 scrollbar-hidden">
            {groups.map(g => (
                <div key={g.label} className="flex flex-col items-center gap-1 border-t border-[#F0F0F0] py-2 first:border-0">
                    {g.items.map(i => (
                        <button key={i.key} onClick={i.onClick} title={i.label} aria-current={i.active || undefined}
                            className={`grid size-8 cursor-pointer place-items-center rounded-md border transition-colors ${i.active ? rowOn : rowOff}`}>
                            <Glyph>{i.icon}</Glyph>
                        </button>
                    ))}
                </div>
            ))}
        </div>

        {account}
    </div>

    /* ---- 248px panel ---- */
    return <div className="flex h-full w-[248px] flex-col border-r border-[#EAEAEA] bg-white">

        {/* ---- search ---- */}
        <div className="shrink-0 px-2.5 pt-3 pb-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-[#E7E7E9] px-2.5 py-[0.42rem] transition-colors focus-within:border-[#93A4F4] focus-within:ring-2 focus-within:ring-[#1D4ED8]/12">
                <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 text-[#A1A1AA]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
                <input ref={search} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search"
                    onKeyDown={e => { if (e.key === "Escape") { setQuery(""); e.currentTarget.blur(); } }}
                    className="min-w-0 flex-1 bg-transparent text-[0.82rem] text-[#18181B] outline-none placeholder:text-[#A1A1AA]" />
                {query
                    ? <button onClick={() => setQuery("")} className="cursor-pointer text-[0.7rem] text-[#A1A1AA] hover:text-[#52525B]">esc</button>
                    : <kbd className="shrink-0 font-sans text-[0.66rem] text-[#C4C4C8]">⌘F</kbd>
                }
            </div>
        </div>

        {/* ---- nav ---- */}
        <nav className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-4 scrollbar-hidden">
            {groups.map(g => (
                <div key={g.label} className="border-t border-[#F0F0F0] px-2.5 pb-2 first:border-0">
                    <p className={groupLabel}>{g.label}</p>

                    {g.items.map(i => (
                        <button key={i.key} onClick={i.onClick} aria-current={i.active || undefined}
                            className={`${rowBase} ${i.active ? rowOn : rowOff}`}>
                            <Glyph>{i.icon}</Glyph>
                            <span className="truncate">{i.label}</span>
                        </button>
                    ))}

                    {g.label === "collections" &&
                        <button onClick={() => setModalNeededBy("addCollection")} className={`${pill} mt-1`}>
                            <span className="grid size-4 shrink-0 place-items-center"><PlusIcon dim="13" /></span>
                            Add new collection
                        </button>
                    }
                    {g.label === "community" && <div className="mt-1 flex flex-col gap-1">
                        <button onClick={() => setModalNeededBy("addCommunity")} className={pill}>
                            <span className="grid size-4 shrink-0 place-items-center"><PlusIcon dim="13" /></span>
                            Start a community
                        </button>
                        <button onClick={() => setModalNeededBy("joinCommunity")} className={pill}>
                            <span className="grid size-4 shrink-0 place-items-center"><PlusIcon dim="13" /></span>
                            Join a community
                        </button>
                    </div>}
                </div>
            ))}
        </nav>

        {account}
    </div>
}

export default React.memo(SideBar)
