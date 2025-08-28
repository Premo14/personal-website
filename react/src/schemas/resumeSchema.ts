import * as z from "zod";

export const experienceSchema = z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    dateRange: z.string(),
    bullets: z.array(z.string()).optional(),
});

export const projectSchema = z.object({
    name: z.string(),
    description: z.string(),
});

export const educationSchema = z.object({
    institution: z.string(),
    degree: z.string(),
});

export const resumeSchema = z.object({
    technicalSkills: z.array(z.string()).optional(),
    professionalExperience: z.array(experienceSchema).optional(),
    projects: z.array(projectSchema).optional(),
    education: z.array(educationSchema).optional(),
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;
