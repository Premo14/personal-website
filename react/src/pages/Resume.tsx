import { useCallback, useEffect, useMemo, useState } from "react";
import ResumeForm from "@/components/resume/ResumeForm";
import { ResumePDF } from "@/components/resume/ResumePDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumeData from "@/models/ResumeData";
import { API_URL } from "@/API_URL";
import { normalizeProject } from "@/models/PortfolioProject";

function normalizeAndSortResume(data: ResumeData): ResumeData {
    const copy: ResumeData = JSON.parse(JSON.stringify(data));

    const normalizeRange = (s: string) => s.replace(/[\u2013\u2014]/g, "-");
    const parseDate = (range: string) => {
        const parts = normalizeRange(range).split("-").map((s) => s.trim());
        const [startStr, endStr] = [parts[0] || "", parts[1] || "Present"];
        const parse = (str: string) =>
            str.toLowerCase() === "present" ? new Date() : new Date(Date.parse(`1 ${str}`));
        return { start: parse(startStr), end: parse(endStr) };
    };

    try {
        copy.professionalExperience.sort((a, b) => {
            const aDates = parseDate(a.dateRange);
            const bDates = parseDate(b.dateRange);
            return bDates.end.getTime() - aDates.end.getTime();
        });
    } catch {
        // ignore if shape changes
    }

    return copy;
}

export default function Resume() {
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [adminOpen, setAdminOpen] = useState(false);
    const [topProjects, setTopProjects] = useState<{ name: string; description: string }[]>([]);

    const fetchResume = useCallback(async (signal?: AbortSignal) => {
        const response = await fetch(`${API_URL}/resume?ts=${Date.now()}`, {
            signal,
            cache: "no-store",
        });
        const raw: ResumeData = await response.json();
        setResumeData(normalizeAndSortResume(raw));
    }, []);

    useEffect(() => {
        const ac = new AbortController();

        fetchResume(ac.signal).catch((e: any) => {
            if (e?.name !== "AbortError") console.error("Failed to fetch resume:", e);
        });

        // Fetch portfolio projects as a fallback if resume.projects is empty
        (async () => {
            try {
                const res = await fetch(
                    `${API_URL}/projects?limit=5&sort=publishedAt:desc&ts=${Date.now()}`,
                    { signal: ac.signal, cache: "no-store" }
                );
                const raw = await res.json();
                const normalized = Array.isArray(raw) ? raw.map(normalizeProject) : [];
                setTopProjects(normalized.map((p) => ({ name: p.title, description: p.description })));
            } catch (e: any) {
                if (e?.name !== "AbortError") console.error("Failed to fetch top projects:", e);
            }
        })();

        return () => ac.abort();
    }, [fetchResume]);

    // 🔧 Use resume.projects if present; otherwise fall back to portfolio projects
    const displayProjects = useMemo(() => {
        if (resumeData?.projects?.length) {
            // Optional: cap to 5 here if you want
            return resumeData.projects.slice(0, 5);
        }
        return topProjects;
    }, [resumeData, topProjects]);

    const pdfData = useMemo(() => {
        if (!resumeData) return null;
        return { ...resumeData, projects: displayProjects };
    }, [resumeData, displayProjects]);

    const renderSkills = () => {
        if (!resumeData) return null;
        const ts: any = (resumeData as any).technicalSkills;

        if (Array.isArray(ts)) {
            return (
                <div className="flex flex-wrap gap-2">
                    {ts.map((skill: string, i: number) => (
                        <span
                            key={`${skill}-${i}`}
                            className="px-2 py-1 rounded border border-brand/40 text-textPrimary"
                        >
              {skill}
            </span>
                    ))}
                </div>
            );
        }

        if (ts && typeof ts === "object") {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(ts).map(([category, skills]) => (
                        <div key={category}>
                            <h3 className="font-semibold text-brand text-base sm:text-lg">
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </h3>
                            <p>{String(skills)}</p>
                        </div>
                    ))}
                </div>
            );
        }

        return <p className="text-textMuted">No skills listed.</p>;
    };

    return (
        <div className="h-full overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-white scrollbar-track-[#121212]">
            <section className="container mx-auto px-4 py-10 min-h-screen flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-4">
                        {pdfData && (
                            <PDFDownloadLink
                                document={<ResumePDF data={pdfData} />}
                                fileName="Anthony_Premo_Resume.pdf"
                                className="px-3 py-1 text-sm border border-brand text-brand rounded-md hover:bg-brand hover:text-white transition"
                            >
                                {({ loading }) => (loading ? "Preparing..." : "Print to PDF")}
                            </PDFDownloadLink>
                        )}
                        <button
                            onClick={() => setAdminOpen(true)}
                            className="px-3 py-1 text-sm border border-accent text-accent rounded-md hover:bg-accent hover:text-black transition invert dark:invert-0"
                        >
                            Admin
                        </button>
                    </div>
                </div>

                {resumeData ? (
                    <div className="mt-8 space-y-8 text-sm sm:text-base">
                        {/* Technical Skills */}
                        <section>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-brand uppercase">
                                Technical Skills
                            </h2>
                            {renderSkills()}
                        </section>

                        {/* Professional Experience */}
                        <section>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-brand uppercase">
                                Professional Experience
                            </h2>
                            {resumeData.professionalExperience.map((exp, idx) => (
                                <div key={idx} className="mb-6">
                                    <h3 className="font-semibold text-brand text-base sm:text-lg">
                                        {exp.title} @ {exp.company} ({exp.location})
                                    </h3>
                                    <p className="italic text-xs sm:text-sm">{exp.dateRange}</p>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {exp.bullets.map((bullet, bulletIdx) => (
                                            <li key={bulletIdx}>{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        {/* Projects — now reflects Resume Admin edits */}
                        <section>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-brand uppercase">
                                Projects
                            </h2>
                            {displayProjects.length ? (
                                displayProjects.map((proj, idx) => (
                                    <div key={idx} className="mb-4">
                                        <h3 className="font-semibold text-brand text-base sm:text-lg">{proj.name}</h3>
                                        <p>{proj.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-textMuted">No recent projects.</p>
                            )}
                        </section>

                        {/* Education */}
                        <section>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-brand uppercase">
                                Education
                            </h2>
                            {resumeData.education.map((edu, idx) => (
                                <div key={idx} className="mb-4">
                                    <h3 className="font-semibold text-brand text-base sm:text-lg">{edu.institution}</h3>
                                    <p>{edu.degree}</p>
                                </div>
                            ))}
                        </section>
                    </div>
                ) : (
                    <div className="text-center text-textMuted italic mt-10 text-sm sm:text-base">
                        Loading resume...
                    </div>
                )}

                <ResumeForm
                    isOpen={adminOpen}
                    onClose={() => setAdminOpen(false)}
                    onSaved={(updated) => {
                        setResumeData(normalizeAndSortResume(updated));
                    }}
                />
            </section>
        </div>
    );
}
