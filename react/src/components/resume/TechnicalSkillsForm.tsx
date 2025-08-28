import ResumeData from '@/models/ResumeData';
import * as React from "react";

interface TechnicalSkillsFormProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
}

export default function TechnicalSkillsForm({ resumeData, setResumeData }: TechnicalSkillsFormProps) {
    const value = resumeData.technicalSkills.join(', ');

    const handleChange = (text: string) => {
        const skills = text
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        setResumeData(prev => (prev ? { ...prev, technicalSkills: skills } : prev));
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Technical Skills</h3>
            <textarea
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Comma-separated skills (e.g., Go, TypeScript, React, Docker)"
                className="w-full h-24 p-2 rounded bg-background border border-border"
            />
        </div>
    );
}
