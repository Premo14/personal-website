interface ResumeData {
    technicalSkills: {
        languages: string;
        frameworksAndLibraries: string;
        databases: string;
        cloud: string;
        devops: string;
        utilities: string;
    };
    professionalExperience: {
        title: string;
        company: string;
        location: string;
        dateRange: string;
        bullets: string[];
    }[];
    projects: {
        name: string;
        description: string;
    }[];
    education: {
        institution: string;
        degree: string;
    }[];
}

export default ResumeData;
