import * as React from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import ResumeData from "@/models/ResumeData";
import { ResumeAdminPanel } from "./ResumeAdminPanel";
import TechnicalSkillsForm from "./TechnicalSkillsForm";
import ExperienceListForm from "./ExperienceListForm";
import ProjectListForm from "./ProjectListForm";
import EducationListForm from "./EducationListForm";
import { API_URL } from "@/API_URL";

export interface ResumeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: (updated: ResumeData) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ isOpen, onClose, onSaved }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchResume = async () => {
        try {
            const response = await fetch(`${API_URL}/resume?ts=${Date.now()}`, {
                cache: "no-store",
            });
            const data = await response.json();
            setResumeData(data);
        } catch (err) {
            console.error("Error fetching resume:", err);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_URL}/resume`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resumeData),
            });
            if (!response.ok) throw new Error("Failed to update resume");

            // Re-fetch a fresh copy and bubble up to the page
            const refreshed = await (
                await fetch(`${API_URL}/resume?ts=${Date.now()}`, { cache: "no-store" })
            ).json();

            onSaved?.(refreshed);

            alert("Resume updated successfully!");
            onClose();
            setIsAuthenticated(false);
        } catch (err) {
            console.error("Save failed:", err);
            alert("Save failed");
        }
    };

    const handleCancel = () => {
        onClose();
        setIsAuthenticated(false);
        setResumeData(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCancel}>
            {!isAuthenticated ? (
                <>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <ResumeAdminPanel
                        onAuthenticated={() => {
                            setIsAuthenticated(true);
                            fetchResume();
                        }}
                        onError={(err) => setError(err)}
                    />
                </>
            ) : resumeData ? (
                <div className="overflow-y-auto max-h-[70vh]">
                    <h2 className="text-2xl font-bold mb-4">Edit Resume</h2>

                    <TechnicalSkillsForm resumeData={resumeData} setResumeData={setResumeData} />
                    <ExperienceListForm resumeData={resumeData} setResumeData={setResumeData} />
                    <ProjectListForm resumeData={resumeData} setResumeData={setResumeData} />
                    <EducationListForm resumeData={resumeData} setResumeData={setResumeData} />

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-dark font-bold"
                        >
                            Save Resume
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-textMuted">Loading...</div>
            )}
        </Modal>
    );
};

export default ResumeForm;
