import { useCallback, useEffect, useMemo, useState } from "react";
import { API_URL } from "@/API_URL";
import ProjectsForm from "@/components/projects/ProjectsForm";
import { normalizeProject } from "@/models/PortfolioProject";

type ProjectCard = {
    id?: number;
    title: string;
    description: string;
    tools: string[];
    sourceLink?: string;
    liveLink?: string;
    publishedAt?: string | null;
    featured?: boolean;
    thumbnail?: string;
};

export default function Projects() {
    const [adminOpen, setAdminOpen] = useState(false);
    const [projects, setProjects] = useState<ProjectCard[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/projects?ts=${Date.now()}`, { cache: "no-store" });
            const raw = await res.json();
            const normalized: ProjectCard[] = Array.isArray(raw) ? raw.map(normalizeProject) : [];
            normalized.sort((a, b) => {
                const ad = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
                const bd = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
                return bd - ad;
            });
            setProjects(normalized);
        } catch (e) {
            console.error("Error fetching projects:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void fetchProjects(); }, [fetchProjects]);

    const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
    const others = useMemo(() => projects.filter((p) => !p.featured), [projects]);

    const Card = ({ p }: { p: ProjectCard }) => {
        const clickTarget = p.liveLink || p.sourceLink;
        return (
            <div className="p-4 bg-background rounded-lg shadow-lg text-left border border-transparent hover:border-brand transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-3">
                    {p.thumbnail ? (
                        <img
                            src={p.thumbnail}
                            alt={`${p.title} thumbnail`}
                            className="w-16 h-16 object-cover rounded-md flex-none"
                        />
                    ) : null}
                    <div className="min-w-0">
                        <h3 className="text-xl font-bold text-brand mb-1 truncate">{p.title}</h3>
                        <p className="text-textPrimary mb-3">{p.description}</p>

                        {p.tools?.length ? (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {p.tools.map((t, i) => (
                                    <span
                                        key={`${p.title}-tool-${i}-${t}`}
                                        className="px-2 py-0.5 rounded border border-brand/40 text-xs"
                                    >
                    {t}
                  </span>
                                ))}
                            </div>
                        ) : null}

                        <div className="flex gap-2">
                            {p.liveLink ? (
                                <a
                                    className="px-3 py-1 text-sm border border-accent text-accent rounded-md hover:bg-accent hover:text-black transition"
                                    href={p.liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Live Site
                                </a>
                            ) : null}
                            {p.sourceLink ? (
                                <a
                                    className="px-3 py-1 text-sm border border-brand text-brand rounded-md hover:bg-brand hover:text-white transition"
                                    href={p.sourceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Source
                                </a>
                            ) : null}
                            {clickTarget ? (
                                <a
                                    className="ml-auto text-sm underline text-textMuted hover:text-textPrimary"
                                    href={clickTarget}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="min-h-[60vh] px-4 sm:px-6 lg:px-8 py-16 space-y-6">
            <div className="w-full max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold">Projects</h1>
                    <button
                        onClick={() => setAdminOpen(true)}
                        className="px-3 py-1 text-sm border border-accent text-accent rounded-md hover:bg-accent hover:text-black transition invert dark:invert-0"
                    >
                        Admin
                    </button>
                </div>

                {loading ? (
                    <p className="text-textMuted">Loading projects…</p>
                ) : projects.length === 0 ? (
                    <p className="text-textMuted">No projects yet. Use the Admin button to add one.</p>
                ) : (
                    <>
                        {featured.length ? (
                            <>
                                <h2 className="text-left text-brand font-bold mb-3">Featured</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    {featured.map((p) => (
                                        <Card key={`featured-${p.id ?? p.title}`} p={p} />
                                    ))}
                                </div>
                            </>
                        ) : null}

                        <h2 className="text-left text-brand font-bold mb-3">All Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                            {others.map((p) => (
                                <Card key={`project-${p.id ?? p.title}`} p={p} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <ProjectsForm
                isOpen={adminOpen}
                onClose={() => setAdminOpen(false)}
                onSaved={(updated) => setProjects(updated)}
            />
        </section>
    );
}
