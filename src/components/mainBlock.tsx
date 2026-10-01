import { useState, useEffect, Fragment, useMemo, type CSSProperties, type ReactNode } from "react";
import ButtonEl from "./button"
import CardElement from "./card";
import PaperCard from "./paperCard";
import SourceBar from "./sourceBar";
import QuickAdd from "./quickAdd";
import { Loader } from "../icons/commonIcons";
import type { ChildProps } from "../pages/dashboard";
import { useCardCountAtom, useCurrentCollection, useCurrentCommunity, usePopUpAtom, usePopUpMessage, useSearchQuery, useTabAtom } from "../recoil/clientStates";
import { useFetchQueryCollection, useFetchQueryCommunity, useGetListQuery } from "../api/user/query";
import { useDeletecardQuery, useDeleteCollectionQuery, useGetCommunityMembers, useRemoveShareQuery, useShareCommunityLogin } from "../api/user/mutate";
import { useDeleteID } from "../recoil/deleteId";
import CommunityCard from "./communityCard";
import CardsLoaderSkeleton from "../icons/skeleton";
import RenderMembers from "./membersList";
import React from "react";
import { bucketByWeek, weekOnWeek, type Weekly } from "../utils/weekly";

const WEEKS = 10;
const SOURCES = ["YOUTUBE", "TWITTER", "REDDIT", "INSTAGRAM", "WEB"] as const;

const rule = "border-[var(--rule)]";
const mono = "font-mono text-[0.66rem] uppercase tracking-[0.16em]";
const act = `cursor-pointer border px-3 py-1.5 transition-colors disabled:cursor-default disabled:opacity-50 ${mono}`;
const danger = `${act} border-[#B91C1C]/40 text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white`;

const Head = ({ title, sub }: { title: string, sub: string }) => (
    <div className="min-w-0">
        <h2 className="truncate text-[1.05rem] font-[650] tracking-[-0.015em] text-[#141418]">{title}</h2>
        <p className="mt-1 text-[0.78rem] text-[#71717A]">{sub}</p>
    </div>
);

const Tile = ({ label, value, foot, spark }: { label: string, value: ReactNode, foot: string, spark?: ReactNode }) => (
    <div className={`border ${rule} bg-white/60 p-4`}>
        <p className="font-head text-[0.8rem] italic text-[#52525B]">{label}</p>
        <div className="mt-2.5 flex items-end justify-between gap-3">
            <span className="text-[1.8rem] leading-none font-[700] tracking-[-0.03em] text-[#141418] tabular-nums">{value}</span>
            {spark}
        </div>
        <p className={`mt-3 ${mono} text-[var(--accent)]`}>{foot}</p>
    </div>
);

const Spark = ({ counts }: { counts: number[] }) => {
    const max = Math.max(...counts, 1);
    const span = Math.max(counts.length - 1, 1);
    const pts = counts.map((v, i) => `${(i / span) * 100},${26 - (v / max) * 22}`).join(" ");
    return <svg viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden className="h-7 w-24 shrink-0 text-[var(--accent)]">
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>;
};

/* Bars borrow the card header's dither: solid at the foot, breaking up towards
   the top, so the chart reads as the same material as the cards. */
const Bars = ({ weekly }: { weekly: Weekly }) => {
    const max = Math.max(...weekly.counts, 1);
    return <div className="mt-6 flex h-44 items-end gap-1.5 sm:gap-2.5">
        {weekly.counts.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end gap-2">
                <span className={`${mono} text-center text-[0.6rem] text-[#A1A1AA] tabular-nums`}>{v || ""}</span>
                <div className="dither-strip w-full"
                    style={{ height: `${(v / max) * 100}%`, minHeight: v ? "6px" : "2px", "--dx": `${-i * 29}px`, "--dy": `${-i * 17}px` } as CSSProperties} />
                <span className="text-center font-mono text-[0.55rem] text-[#A1A1AA] tabular-nums">{weekly.labels[i]}</span>
            </div>
        ))}
    </div>;
};

const MainBlock = ({ setModalNeededBy, layout, setLayout, user }: ChildProps) => {

    const [tab, setTab] = useTabAtom();
    const { data: listData, isFetched, isSuccess: isListSuccess } = useGetListQuery();
    const [popUp, setPopUp] = usePopUpAtom();
    const [popUpMessage, setPopupMessage] = usePopUpMessage();
    const [query] = useSearchQuery();

    let collectionList: { name: string, id: number, shared: boolean }[];
    let allCommunities: { name: string, id: number }[];

    const [currentCollection1, setCurrentCollection1] = useCurrentCollection();
    const [currentCommunity1, setCurrentCommunity1] = useCurrentCommunity();

    const [cardsCount, setCardCount] = useCardCountAtom();

    if (isFetched) {
        collectionList = listData?.data?.payload.collectionList;
        allCommunities = listData?.data?.payload.allCommunities;
    }

    useEffect(() => {
        if (!isListSuccess) return;

        if (tab.startsWith('dashboard') || tab === 'stats') {
            // stats measures the whole brain, so it reads the same "dashboard" collection
            setCurrentCollection1({ name: "dashboard", id: collectionList.find((coll) => coll.name === 'dashboard')?.id ?? -1 })
            setCurrentCommunity1({ name: "", id: -1 });
        } else if (tab.startsWith('collection')) {
            const tabId = parseInt(tab.split('-')[1]);
            const matched = collectionList.find((coll) => coll.id === tabId);

            setCurrentCollection1({ name: matched?.name ?? "dashboard", id: tabId });
            setCurrentCommunity1({ name: "", id: -1 });
        } else {
            const tabId = parseInt(tab.split('-')[1]);
            const matched = allCommunities.find((comm) => comm.id === tabId);
            setCurrentCommunity1({ name: matched?.name ?? "", id: tabId });
            setCurrentCollection1({ name: "", id: -1 });
        }
        setMembersList(false);
    }, [tab, listData, isListSuccess]);

    const [deleteId] = useDeleteID();
    const { mutate } = useDeletecardQuery();
    useEffect(() => {
        if (deleteId !== -1) {
            mutate({ contentId: deleteId, collectionId: currentCollection1.id });
        }
    }, [deleteId])

    //getting the memebers of a community
    const [membersList, setMembersList] = useState<boolean>(false)
    const { isPending: membersListPending, mutateAsync: getCommunityMembers, data: membersData } = useGetCommunityMembers();

    const getMembers = async () => {
        if (membersList) {
            setMembersList(false);
            return;
        }
        setMembersList(true);
        await getCommunityMembers({ communityId: currentCommunity1.id });
    }

    //getting paginated data for collections
    const { data: pagesData, isLoading: contentLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useFetchQueryCollection({ collectionId: currentCollection1.id });

    useEffect(() => {
        if (!contentLoading) {
            const totalCards = pagesData?.pages
                ?.map((page) => page.payload?.content?.length ?? 0)
                .reduce((a, b) => a + b, 0);

            setCardCount(totalCards ?? 0);
        }
    }, [pagesData, contentLoading]);

    //getting paginated data for coommunity
    const { data: communityPagesData, isLoading: communityDataLoading, hasNextPage: communityNextPage, isFetchingNextPage: fetchingCommunityNextPage, fetchNextPage: fetchCommunityNextPage } = useFetchQueryCommunity({ communityId: currentCommunity1.id });

    useEffect(() => {
        if (!communityDataLoading) {
            const totalCards = communityPagesData?.pages
                ?.map((page) => page.payload?.content?.length ?? 0)
                .reduce((a, b) => a + b, 0);

            setCardCount(totalCards ?? 0);
        }
    }, [communityPagesData, communityDataLoading]);

    const { mutateAsync: shareLogin, isPending: shareLoginPending, error: shareError } = useShareCommunityLogin();
    const handleShareCommunityCred = async () => {
        try {
            const data = await shareLogin({ communityId: currentCommunity1.id });
            setPopupMessage("Community credentials copied!!");
            setPopUp(true)
            navigator.clipboard.writeText(data.payload.message);
        } catch (e) {
            console.error("error occured :\n", shareError)
        }
    }

    //habdling deletion of a collection
    const [deleting, setDeleting] = useState<boolean>(false);
    const { mutateAsync: deleteCollectionFn } = useDeleteCollectionQuery();
    const deleteCollection = async () => {
        try {
            setDeleting(true);
            await deleteCollectionFn({ collectionId: currentCollection1.id });
            setTab('dashboard');
        } catch (err) {
        } finally {
            setDeleting(false);
        }
    }

    //handling unshare
    const [removingShare, setRemovingShare] = useState<boolean>(false);
    const { mutateAsync: removerShare } = useRemoveShareQuery();
    const handleRemoveShare = async () => {
        try {
            setRemovingShare(true);
            await removerShare({ collectionId: currentCollection1.id });
        } catch (err) {
            console.error(err);
        } finally {
            setRemovingShare(false);
            setPopupMessage('Workspace is no longer shared!!');
            setPopUp(true);
        }
    }

    const community = tab.startsWith("community");
    const stats = tab === "stats";
    const episodes = tab.startsWith("dashboard");

    //the collection/community atoms default to id:-1 until the tab-resolution effect above runs, which
    //disables useFetchQueryCollection/useFetchQueryCommunity (enabled: id !== -1) - react-query's isLoading
    //reads false for a disabled query (it's idle, not fetching), so without this the "no content" message
    //flashed before the real id was even known, ahead of the skeleton it should follow
    const activeIdResolved = community ? currentCommunity1.id !== -1 : currentCollection1.id !== -1;

    /* Numbers over one page of 12 aren't worth a page of their own, so the stats
       view pulls the rest — capped, since there's no aggregate endpoint.
       ponytail: 10 pages = 120 items, raise it the day someone notices. */
    useEffect(() => {
        if (stats && hasNextPage && !isFetchingNextPage && (pagesData?.pages.length ?? 0) < 10) fetchNextPage();
    }, [stats, hasNextPage, isFetchingNextPage, pagesData]);

    // ponytail: stats cover the pages fetched so far (12 per page), not the whole
    // collection — there's no aggregate endpoint, and "+" says so in the tile.
    const cards: any[] = useMemo(
        () => pagesData?.pages.flatMap((p: any) => p?.payload?.content ?? []) ?? [],
        [pagesData]
    );

    const weekly = useMemo(
        () => bucketByWeek(cards.map(c => c.content.createdAt), Date.now(), WEEKS),
        [cards]
    );

    const communityCards: any[] = useMemo(
        () => communityPagesData?.pages.flatMap((p: any) => p?.payload?.content ?? []) ?? [],
        [communityPagesData]
    );

    /* The sidebar's search box filters what has been fetched — titles, notes and
       tags. ponytail: client-side over loaded pages, there's no search endpoint;
       swap the predicate for a query param the day one exists. */
    const q = query.trim().toLowerCase();
    const hit = (c: any) => !q
        || c.content.title?.toLowerCase().includes(q)
        || c.content.note?.toLowerCase().includes(q)
        || c.content.tags?.some((t: any) => t.tag?.title?.toLowerCase().includes(q));

    const typeFilter = tab.startsWith("dashboard") ? tab.split("-")[1] : undefined;

    const visible = useMemo(
        () => cards.filter(c => (!typeFilter || c.content.type === typeFilter) && hit(c)),
        [cards, typeFilter, q]
    );

    const visibleCommunity = useMemo(() => communityCards.filter(hit), [communityCards, q]);

    const shown = community ? visibleCommunity.length : visible.length;

    const bySource = useMemo(() => {
        const n: Record<string, number> = {};
        for (const c of cards) n[c.content.type] = (n[c.content.type] ?? 0) + 1;
        return SOURCES.map(type => ({ type, n: n[type] ?? 0 })).sort((a, b) => b.n - a.n);
    }, [cards]);

    const delta = weekOnWeek(weekly);
    const thisWeek = weekly.counts[WEEKS - 1];
    const sharedCount = isFetched ? (listData?.data?.payload.collectionList ?? []).filter((c: { shared: boolean }) => c.shared).length : 0;
    const collectionsCount = isFetched ? Math.max((listData?.data?.payload.collectionList ?? []).length - 1, 0) : 0;
    const communitiesCount = isFetched ? (listData?.data?.payload.allCommunities ?? []).length : 0;

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    const toggle = (l: "grid" | "list") => `cursor-pointer px-2.5 py-1.5 ${mono} transition-colors ${layout === l
        ? "bg-[var(--accent)] text-white"
        : "text-[var(--accent)] hover:bg-[var(--wash)]"}`;

    return <div className="paper-rails min-h-full px-4 pb-32 sm:px-8 lg:px-10">

        {/* ---- stats live here and nowhere else ---- */}
        {stats && <>
            <section className="pt-9">
                <Head title={`Welcome back, ${user?.userName ?? ""}`} sub={`As of ${today}`} />

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Tile
                        label="Saved items"
                        value={`${cards.length}${hasNextPage ? "+" : ""}`}
                        foot={delta === null ? `${thisWeek} this week` : `${delta >= 0 ? "+" : ""}${delta}% wk/wk`}
                        spark={<Spark counts={weekly.counts} />}
                    />
                    <Tile label="Workspaces" value={collectionsCount} foot={`${sharedCount} shared`} />
                    <Tile label="Communities" value={communitiesCount} foot="joined" />
                </div>
            </section>

            <section className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
                <div className={`border ${rule} bg-white/60 p-5`}>
                    <Head title="Saves over time" sub={`Items added per week · last ${WEEKS} weeks`} />
                    <Bars weekly={weekly} />
                </div>

                <div className={`border ${rule} bg-white/60 p-5`}>
                    <Head title="By source" sub="Where these saves came from" />
                    <table className="mt-5 w-full text-left">
                        <thead>
                            <tr className={`bg-[var(--wash)] text-[#52525B] ${mono}`}>
                                <th className="px-2.5 py-2 font-[500]">source</th>
                                <th className="px-2.5 py-2 text-right font-[500]">items</th>
                                <th className="px-2.5 py-2 text-right font-[500]">share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bySource.map(({ type, n }) => (
                                <tr key={type} className={`border-b ${rule} last:border-0`}>
                                    <td className="px-2.5 py-2.5 text-[0.8rem] text-[#3F3F46]">{type.toLowerCase()}</td>
                                    <td className="px-2.5 py-2.5 text-right text-[0.8rem] text-[#141418] tabular-nums">{n}</td>
                                    <td className="w-24 px-2.5 py-2.5">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="h-[3px] bg-[var(--accent)]"
                                                style={{ width: `${cards.length ? (n / cards.length) * 44 : 0}px` }} />
                                            <span className="font-mono text-[0.62rem] text-[#71717A] tabular-nums">
                                                {cards.length ? Math.round((n / cards.length) * 100) : 0}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>}

        {/* ---- the cards themselves ---- */}
        {!stats && <section>
            {/* Title, layout toggles, quick-add and the source filter stay put while
                only the cards scroll. The negative margins let the bar's background
                span the full panel, since the section itself is padded — otherwise
                cards would show through the gutters as they slide under it.
                z-20 keeps it below the fixed .top-blur band (z-30), so it frosts as
                it passes underneath instead of covering it.
                Opaque, not translucent: at 92% the tops of the cards sliding under
                it showed straight through, which read as a rendering fault.
                The top padding lives HERE, not on the section: with pt-9 on the
                section the bar rested 36px down and then snapped to top-0 on the
                first scroll, so the whole header visibly jumped once. Padding it
                from the inside makes the resting and pinned positions identical —
                it never moves at all. */}
            <div className="sticky top-0 z-20 -mx-4 border-b border-[var(--rule)] bg-[#FBFBF9] px-4 pt-7 pb-4 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <Head
                    title={community ? `Community · ${currentCommunity1.name}` : episodes ? "Episodes" : `Collection · ${currentCollection1.name}`}
                    sub={q
                        ? `${shown} match${shown === 1 ? "" : "es"} for “${query.trim()}” in what's loaded`
                        : `${shown} item${shown === 1 ? "" : "s"} loaded${(community ? communityNextPage : hasNextPage) ? " · more available" : ""}`}
                />

                <div className="flex flex-wrap items-center gap-1.5">
                    <div className="mr-2 flex items-center gap-1">
                        {(["grid", "list"] as const).map(l => (
                            <button key={l} onClick={() => setLayout?.(l)} aria-pressed={layout === l} className={toggle(l)}>
                                {layout === l ? "[x] " : "[ ] "}{l}
                            </button>
                        ))}
                    </div>

                    <button onClick={() => setModalNeededBy("addContent")}
                        className={`${act} border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white`}>
                        [ add content ]
                    </button>
                    {!community ? <>
                        {!tab.startsWith("dashboard") &&
                            <button onClick={deleteCollection} disabled={deleting} className={danger}>
                                {deleting ? <Loader style="h-3 w-8 text-current" dimh="12" dimw="34" /> : "[ delete workspace ]"}
                            </button>
                        }
                        <button onClick={handleRemoveShare} disabled={removingShare} className={danger}>
                            {removingShare ? <Loader style="h-3 w-8 text-current" dimh="12" dimw="34" /> : "[ stop sharing ]"}
                        </button>
                    </> : <>
                        <div className="relative">
                            <button onClick={getMembers} className={`${act} border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white`}>
                                [ members ]
                            </button>
                            {membersList &&
                                <div className={`absolute right-0 top-full z-40 mt-2 w-64 border ${rule} bg-[#FBFBF9] shadow-lg`}>
                                    {membersListPending
                                        ? <p className={`animate-pulse p-3 ${mono} text-[#71717A]`}>loading…</p>
                                        : <div className="max-h-[320px] overflow-y-auto scrollbar-hidden">
                                            <RenderMembers membersList={membersData.payload.usersList} />
                                        </div>}
                                </div>
                            }
                        </div>
                        <button onClick={handleShareCommunityCred} disabled={shareLoginPending}
                            className={`${act} border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white ${shareLoginPending ? "animate-pulse" : ""}`}>
                            [ share login ]
                        </button>
                    </>}
                </div>
            </div>

            {/* paste-a-link on the left, source filter on the right */}
            {!community && <div className="mt-5 flex flex-wrap items-start gap-4">
                <QuickAdd collectionId={currentCollection1.id} communityId={currentCommunity1.id} />
                {episodes && <SourceBar inline tab={tab} onPick={setTab} />}
            </div>}
            </div>

            {/* ---- cards ---- */}
            <div className="mt-5">
                {!activeIdResolved || contentLoading || communityDataLoading
                    ? <CardsLoaderSkeleton />
                    : <div className="flex justify-center">
                        <div className={layout === "grid"
                            ? "card-grid w-full"
                            : "w-full"}>

                            {!community
                                ? visible.map((cardData: any) => {
                                    const card = <CardElement
                                        id={cardData.content.id}
                                        collectionId={currentCollection1.id}
                                        title={cardData.content.title}
                                        cardType={cardData.content.type}
                                        link={cardData.content.hyperlink}
                                        note={cardData.content.note}
                                        tags={cardData.content.tags}
                                        createdAt={cardData.content.createdAt}
                                        layout={layout}
                                        shared={false}
                                    />;

                                    return layout === "grid"
                                        ? <PaperCard key={cardData.content.id} i={cardData.content.id} type={cardData.content.type}>{card}</PaperCard>
                                        : <Fragment key={cardData.content.id}>{card}</Fragment>;
                                })
                                : visibleCommunity.map((cardData: any) => {
                                    const card = <CommunityCard
                                        key={cardData.content.id}
                                        createdAt={cardData.content.createdAt}
                                        title={cardData.content.title}
                                        link={cardData.content.hyperlink}
                                        layout={layout!}
                                        communityId={currentCommunity1.id}
                                        id={cardData.content.id}
                                        note={cardData.content.note}
                                        cardType={cardData.content.type}
                                        posterName={cardData.content.user.userName}
                                        isOwner={cardData.isOwner}
                                        upVoteCount={cardData.upVotes}
                                        downVoteCount={cardData.downVotes}
                                        usersVote={cardData.usersVote}
                                        profilePic={cardData.content.user.profilePic}
                                    />;

                                    return layout === "grid"
                                        ? <PaperCard key={cardData.content.id} i={cardData.content.id} type={cardData.content.type}>{card}</PaperCard>
                                        : <Fragment key={cardData.content.id}>{card}</Fragment>;
                                })
                            }
                        </div>
                    </div>
                }

                {activeIdResolved && !contentLoading && !communityDataLoading && shown === 0 &&
                    <div className="py-16 text-center">
                        <p className={`${mono} text-[#A1A1AA]`}>{q ? "[ no matches ]" : "[ nothing here yet ]"}</p>
                        {!community && !q &&
                            <button onClick={() => setModalNeededBy("addContent")}
                                className={`mt-5 ${act} border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white`}>
                                [ add your first item ]
                            </button>
                        }
                    </div>
                }
            </div>

            <div className="mt-12 flex justify-center">
                <ButtonEl
                    onClickHandler={community ? () => fetchCommunityNextPage() : () => fetchNextPage()}
                    disabled={community ? !communityNextPage : !hasNextPage}
                    buttonType=""
                    placeholder={(community ? fetchingCommunityNextPage : isFetchingNextPage)
                        ? "[ loading... ]"
                        : (community ? communityNextPage : hasNextPage) ? "[ load more ]" : "[ end of collection ]"}
                    particularStyle={`border px-6 py-3 ${mono} transition-colors ${(community ? communityNextPage : hasNextPage)
                        ? "border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                        : "cursor-default border-dashed border-[var(--rule)] text-[#A1A1AA]"}`}
                />
            </div>
        </section>}
    </div>
}

export default React.memo(MainBlock);
