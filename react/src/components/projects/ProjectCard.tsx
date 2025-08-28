import { PortfolioProject } from "@/models/PortfolioProject";
import * as React from "react";

type Props = {
    project: PortfolioProject;
};

function fmtMonthYear(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}

export default function ProjectCard({ project }: Props) {
    const liveHref = project.liveLink?.trim() || "";
    const sourceHref = project.sourceLink?.trim() || "";
    const cardHref = liveHref || sourceHref || "";

    const openCard = () => {
        if (cardHref) window.open(cardHref, "_blank", "noopener,noreferrer");
    };

    const onKey = (e: React.KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && cardHref) {
            e.preventDefault();
            openCard();
        }
    };

    return (
        <article
            role={cardHref ? "link" : undefined}
            tabIndex={cardHref ? 0 : -1}
            onClick={openCard}
            onKeyDown={onKey}
            aria-label={project.title}
            className={`group block rounded-2xl border border-border/60 bg-surface/70 hover:border-brand/70 hover:shadow-[0_8px_30px_rgb(218,165,32,0.12)] transition-all ${
                cardHref ? "cursor-pointer" : ""
            }`}
        >
            <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-gradient-to-br from-background to-surface">
                {project.thumbnail ? (
                    <img
                        src={project.thumbnail}
                        alt={`${project.title} thumbnail`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 grid place-items-center text-textMuted bg-background-dark">
                        No Image
                    </div>
                )}
                {project.featured && (
                    <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-brand/90 text-white">
            Featured
          </span>
                )}
            </div>

            <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-textPrimary group-hover:text-brand transition-colors">
                        {project.title}
                    </h3>
                    <span className="text-xs text-textMuted whitespace-nowrap">
            {fmtMonthYear(project.publishedAt)}
          </span>
                </div>

                <p className="text-sm text-textMuted line-clamp-3">{project.description}</p>

                {project.tools?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {project.tools.slice(0, 6).map((tool, i) => (
                            <span
                                key={`${tool}-${i}`}
                                className="text-xs px-2 py-0.5 rounded border border-brand/30 text-textPrimary/90"
                            >
                {tool}
              </span>
                        ))}
                        {project.tools.length > 6 && (
                            <span className="text-xs text-textMuted">
                +{project.tools.length - 6} more
              </span>
                        )}
                    </div>
                )}

                <div className="mt-2 flex gap-2">
                    {liveHref && (
                        <a
                            href={liveHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-center text-sm border border-accent text-accent rounded-md px-3 py-1 hover:bg-accent hover:text-black transition"
                        >
                            Live
                        </a>
                    )}
                    {sourceHref && (
                        <a
                            href={sourceHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-center text-sm border border-brand text-brand rounded-md px-3 py-1 hover:bg-brand hover:text-white transition"
                        >
                            Source
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
