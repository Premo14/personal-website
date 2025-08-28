import { useState } from "react";

const UPLOAD_PASSWORD = import.meta.env.VITE_UPLOAD_PASSCODE;

interface ProjectsAdminPanelProps {
    onAuthenticated: () => void;
    onError: (error: string) => void;
}

export function ProjectsAdminPanel({ onAuthenticated, onError }: ProjectsAdminPanelProps) {
    const [inputPassword, setInputPassword] = useState("");

    const handlePasswordSubmit = () => {
        if (inputPassword === UPLOAD_PASSWORD) {
            onAuthenticated();
        } else {
            onError("Incorrect password.");
        }
    };

    return (
        <div className="mt-3 p-4 bg-surface shadow-lg rounded-lg text-sm text-textPrimary w-full max-w-4xl mx-auto">
            <label className="block mb-2 font-bold">Admin Access</label>
            <input
                type="password"
                placeholder="Enter password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full p-2 mb-2 rounded bg-background border border-border"
            />
            <button
                type="button"
                onClick={handlePasswordSubmit}
                className="w-full py-1 rounded bg-accent text-black hover:opacity-90 font-bold"
            >
                Submit
            </button>
        </div>
    );
}
