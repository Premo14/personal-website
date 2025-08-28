import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ProjectsAdminPanel } from "./ProjectsAdminPanel";
import { portfolioProjectSchema, PortfolioProjectFormValues } from "@/schemas/projectSchema";
import { API_URL } from "@/API_URL";
import { normalizeProject } from "@/models/PortfolioProject";

interface ProjectsFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: (updated: Array<{
        id?: number;
        title: string;
        description: string;
        tools: string[];
        sourceLink?: string;
        liveLink?: string;
        publishedAt?: string | null;
        featured?: boolean;
        thumbnail?: string;
    }>) => void;
}

export default function ProjectsForm({ isOpen, onClose, onSaved }: ProjectsFormProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [projects, setProjects] = useState<PortfolioProjectFormValues[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isAuthenticated) void fetchProjects();
    }, [isAuthenticated]);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/projects?ts=${Date.now()}`, { cache: "no-store" });
            const raw = await response.json();
            const normalized = Array.isArray(raw) ? raw.map(normalizeProject) : [];
            const mapped: PortfolioProjectFormValues[] = normalized.map((p) => ({
                title: p.title || "",
                tools: Array.isArray(p.tools) ? p.tools : [],
                description: p.description || "",
                // ensure strings (never undefined)
                sourceLink: typeof p.sourceLink === "string" ? p.sourceLink : "",
                liveLink: typeof p.liveLink === "string" ? p.liveLink : "",
            }));
            setProjects(mapped);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // sanitize & validate, **always** send strings for links
            const payload = projects.map((p) => {
                const sanitized = {
                    title: (p.title ?? "").trim(),
                    tools: (p.tools ?? []).map((t) => t.trim()).filter(Boolean),
                    description: (p.description ?? "").trim(),
                    sourceLink:
                        p.sourceLink.trim(),
                    liveLink:
                        p.liveLink.trim(),
                };

                // Zod now allows "" or a valid URL
                portfolioProjectSchema.parse(sanitized);
                return sanitized;
            });

            const response = await fetch(`${API_URL}/projects`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("Failed to update projects");

            // refetch and bubble up to page
            const refreshedRaw = await (await fetch(`${API_URL}/projects?ts=${Date.now()}`, { cache: "no-store" })).json();
            const normalized = Array.isArray(refreshedRaw) ? refreshedRaw.map(normalizeProject) : [];
            onSaved?.(normalized);

            alert("Projects updated successfully!");
            onClose();
            setIsAuthenticated(false);
        } catch (err) {
            console.error("Save failed:", err);
            alert("Save failed");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        onClose();
        setIsAuthenticated(false);
        setProjects([]);
    };

    const addProject = () => {
        setProjects((prev) => [
            ...prev,
            { title: "", tools: [], description: "", sourceLink: "", liveLink: "" },
        ]);
    };

    const deleteProject = (index: number) => {
        setProjects((prev) => prev.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleCancel}>
            {!isAuthenticated ? (
                <ProjectsAdminPanel
                    onAuthenticated={() => setIsAuthenticated(true)}
                    onError={(err) => console.error(err)}
                />
            ) : (
                <div className="overflow-y-auto max-h-[70vh]">
                    <h2 className="text-2xl font-bold mb-4 text-center">Edit Projects</h2>

                    {projects.map((project, idx) => (
                        <div key={idx} className="text-black mb-6 p-4 rounded-lg bg-background shadow">
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={project.title}
                                onChange={(e) => {
                                    const updated = [...projects];
                                    updated[idx].title = e.target.value;
                                    setProjects(updated);
                                }}
                                className="w-full mb-3 p-2 border rounded"
                                placeholder="Project Title"
                            />

                            <label className="block text-sm font-medium mb-1">Tools</label>
                            <input
                                type="text"
                                value={(project.tools || []).join(", ")}
                                onChange={(e) => {
                                    const updated = [...projects];
                                    updated[idx].tools = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                                    setProjects(updated);
                                }}
                                className="w-full mb-3 p-2 border rounded"
                                placeholder="Tools (comma separated)"
                            />

                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={project.description}
                                onChange={(e) => {
                                    const updated = [...projects];
                                    updated[idx].description = e.target.value;
                                    setProjects(updated);
                                }}
                                className="w-full mb-3 p-2 border rounded"
                                placeholder="Project Description"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Source Link</label>
                                    <input
                                        type="text"
                                        value={project.sourceLink ?? ""}
                                        onChange={(e) => {
                                            const updated = [...projects];
                                            updated[idx].sourceLink = e.target.value;
                                            setProjects(updated);
                                        }}
                                        className="w-full p-2 border rounded"
                                        placeholder="https://github.com/…"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Live Link</label>
                                    <input
                                        type="text"
                                        value={project.liveLink ?? ""}
                                        onChange={(e) => {
                                            const updated = [...projects];
                                            updated[idx].liveLink = e.target.value;
                                            setProjects(updated);
                                        }}
                                        className="w-full p-2 border rounded"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => deleteProject(idx)}
                                className="mt-3 block text-xs text-red-500 underline hover:text-red-700"
                            >
                                🗑️ Delete Project
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addProject}
                        className="mt-2 px-3 py-1 text-sm bg-accent text-black rounded hover:opacity-90"
                    >
                        ➕ Add Project
                    </button>

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-bold"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-dark font-bold"
                            disabled={saving}
                        >
                            {saving ? "Saving…" : "Save Projects"}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
