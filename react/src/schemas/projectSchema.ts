import * as z from "zod";

// Accept either a valid URL or an empty string
const urlOrEmpty = z.string().url("Must be a valid URL").or(z.literal(""));

export const portfolioProjectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    tools: z.array(z.string()).default([]),
    description: z.string().min(1, "Description is required"),
    sourceLink: urlOrEmpty.default(""),
    liveLink: urlOrEmpty.default(""),
});

export type PortfolioProjectFormValues = z.infer<typeof portfolioProjectSchema>;
