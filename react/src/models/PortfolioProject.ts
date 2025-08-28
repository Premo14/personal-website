export type PortfolioProject = {
    id: number;
    title: string;
    tools: string[];
    description: string;
    sourceLink?: string;
    liveLink?: string;
    publishedAt?: string; // ISO
    featured?: boolean;
    thumbnail?: string;
    createdAt?: string;
    updatedAt?: string;
};

export function normalizeProject(raw: any): PortfolioProject {
    let tools: string[] = [];
    try {
        if (Array.isArray(raw.tools)) {
            tools = raw.tools;
        } else if (typeof raw.tools === "string" && raw.tools.trim().length) {
            const parsed = JSON.parse(raw.tools);
            if (Array.isArray(parsed)) tools = parsed;
        }
    } catch {
        tools = [];
    }

    return {
        id: raw.id,
        title: raw.title ?? "",
        tools,
        description: raw.description ?? "",
        sourceLink: raw.sourceLink || raw.source_link || "",
        liveLink: raw.liveLink || raw.live_link || "",
        publishedAt: raw.publishedAt || raw.published_at || "",
        featured: Boolean(raw.featured),
        thumbnail: raw.thumbnail || "",
        createdAt: raw.createdAt || raw.created_at,
        updatedAt: raw.updatedAt || raw.updated_at,
    };
}
