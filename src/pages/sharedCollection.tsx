import { useLocation } from "react-router-dom"
import CardElement from "../components/card"
import { useFEctchData, useSharedMetaData } from "../api/shared/query"
import { Fragment } from "react/jsx-runtime"
import ButtonEl from "../components/button"
import Dither from "../components/Dither"
import PaperCard from "../components/paperCard"
import { hexRgb, themeFor } from "../utils/theme"
import { useUserProfile } from "../recoil/user"

export const SharedCollection = ({ layout, setLayout }: { layout: "grid" | "list", setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">> }) => {
    const location = useLocation();
    const hash = new URLSearchParams(location.search).get('id') || "";

    // whoever is signed in brings their avatar's theme along; visitors get the default blue
    const [user] = useUserProfile();
    const theme = themeFor(user?.profilePic);

    const { data: metadata, isLoading: metadataLoading, isSuccess } = useSharedMetaData({ hash });

    const { data: sharedData, isLoading: sharedDataLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useFEctchData({ hash });

    const cardCount = sharedData?.pages.reduce((n, g) => n + (g?.data?.payload?.content?.length ?? 0), 0) ?? 0;

    // ponytail: only `bg` reaches the paper side of the page — `wave` is a pale
    // tint on the light themes but a mid grey on the black ones, so it would go
    // unreadable behind text. It stays in the shader, where it's the crest colour.
    const vars = { "--accent": theme.bg, "--wash": theme.bg + "14" } as React.CSSProperties;

    const eyebrow = "font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--accent)]";

    return <div style={vars} className="relative min-h-screen w-full bg-[#FBFBF9] font-jakarta">

        {/* One dithered canvas pinned behind the whole page — the opaque paper
            column masks the middle, leaving it visible as rails down both edges. */}
        <div className="fixed inset-0">
            <Dither
                bgColor={hexRgb(theme.bg)}
                waveColor={hexRgb(theme.wave)}
                waveSpeed={0.03}
                waveFrequency={3}
                waveAmplitude={0.3}
                colorNum={4}
                pixelSize={2}
                enableMouseInteraction={false}
                mouseRadius={0.4}
            />
        </div>

        <div className="paper-rails mx-auto min-h-screen w-full max-w-[1180px] border-x border-[var(--accent)] bg-[#FBFBF9]">

            {/* ---- chrome bar ---- */}
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-[var(--accent)] bg-[#FBFBF9]/95 px-4 backdrop-blur sm:px-8">
                <span className={eyebrow}>[ shared brain ]</span>

                <div className="flex items-center gap-1">
                    {(["grid", "list"] as const).map(l => (
                        <button key={l} onClick={() => setLayout(l)}
                            aria-pressed={layout === l}
                            className={`cursor-pointer px-2.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] transition-colors ${layout === l
                                ? "bg-[var(--accent)] text-white"
                                : "text-[var(--accent)] hover:bg-[var(--wash)]"}`}>
                            {layout === l ? "[x] " : "[ ] "}{l}
                        </button>
                    ))}
                </div>
            </header>

            {/* ---- masthead ---- */}
            <section className="px-4 pt-12 pb-10 sm:px-10 lg:px-16">
                <p className={eyebrow}>[ shared workspace ]</p>

                <h1 className="mt-5 text-[2rem] leading-[1.06] font-[700] tracking-[-0.03em] text-[#141418] sm:text-[2.6rem] lg:text-[3.1rem]">
                    {metadataLoading
                        ? <span className="inline-block h-[1em] w-[min(60vw,22rem)] animate-pulse bg-[var(--wash)] align-middle" />
                        : isSuccess && <>{metadata.payload.userName}'s shared brain</>}
                </h1>

                {isSuccess &&
                    <p className="mt-4 font-mono text-[0.78rem] tracking-[0.02em] text-[#52525B]">
                        collection <span className="bg-[var(--wash)] px-1.5 py-0.5 text-[var(--accent)]">{metadata.payload.collectionName}</span>
                    </p>
                }

                <p className="mt-7 max-w-[620px] text-[0.95rem] leading-[1.75] text-[#3F3F46]">
                    secondbrain helps you capture and share insights from the web —{" "}
                    <span className="bg-[var(--wash)] px-1">your second brain, curated for the world.</span>
                </p>
            </section>

            {/* ---- perforated divider, echoing the reference's torn paper edge ---- */}
            <div className="mx-4 flex items-center gap-4 border-t border-dashed border-[var(--accent)] pt-4 sm:mx-10 lg:mx-16">
                <span className={eyebrow}>
                    [ {sharedDataLoading ? "loading" : `${cardCount} saved`} ]
                </span>
            </div>

            {/* ---- cards ---- */}
            <section className="px-4 pt-8 sm:px-10 lg:px-16">
                {!sharedDataLoading && cardCount === 0
                    ? <p className="py-20 text-center font-mono text-[0.75rem] uppercase tracking-[0.2em] text-[#A1A1AA]">[ nothing shared here yet ]</p>
                    : <div className="flex justify-center">
                        <div className={layout === "grid"
                            ? "card-grid w-full"
                            : "w-full"}>
                            {sharedData?.pages.map((group, i) => (
                                <Fragment key={i}>
                                    {group?.data?.payload?.content?.map((cardData: any) => {
                                        const card = <CardElement
                                            title={cardData.content.title}
                                            collectionId={group.data.payload.collectionId}
                                            id={cardData.content.id}
                                            note={cardData.content.note}
                                            createdAt={cardData.content.createdAt}
                                            tags={cardData.content.tags}
                                            cardType={cardData.content.type}
                                            layout={layout}
                                            link={cardData.content.hyperlink}
                                            shared={true}
                                        />;

                                        return layout === "grid"
                                            ? <PaperCard key={cardData.content.id} i={cardData.content.id} type={cardData.content.type}>{card}</PaperCard>
                                            : <Fragment key={cardData.content.id}>{card}</Fragment>;
                                    })}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                }
            </section>

            <div className="flex justify-center px-4 pt-14 pb-20">
                <ButtonEl
                    onClickHandler={() => fetchNextPage()}
                    disabled={!hasNextPage}
                    buttonType=""
                    placeholder={isFetchingNextPage ? "[ loading... ]" : hasNextPage ? "[ load more ]" : "[ end of collection ]"}
                    particularStyle={`border border-[var(--accent)] px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors ${hasNextPage
                        ? "text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                        : "cursor-default border-dashed text-[#A1A1AA] opacity-70"}`}
                />
            </div>
        </div>
    </div>
}
