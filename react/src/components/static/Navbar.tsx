import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import useTheme from "@/hooks/useTheme.ts";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-surface text-textPrimary px-4 sm:px-6 py-3 sm:py-4 shadow-md">
            <div className="mx-auto w-full max-w-screen-xl flex justify-between items-center">
                <Link
                    to="/"
                    className="text-lg sm:text-xl font-semibold hover:text-brand"
                >
                    Anthony Premo
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link to="/" className="text-base sm:text-lg hover:text-brand transition">
                        Home
                    </Link>
                    <Link to="/resume" className="text-base sm:text-lg hover:text-brand transition">
                        Resume
                    </Link>
                    <Link to="/projects" className="text-base sm:text-lg hover:text-brand transition">
                        Projects
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md border border-border hover:text-brand transition"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden flex flex-col items-start px-4 pt-4 space-y-3">
                    <Link to="/" className="text-base sm:text-lg hover:text-brand" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/resume" className="text-base sm:text-lg hover:text-brand" onClick={() => setIsOpen(false)}>Resume</Link>
                    <Link to="/projects" className="text-base sm:text-lg hover:text-brand" onClick={() => setIsOpen(false)}>Projects</Link>
                    <button
                        onClick={() => {
                            toggleTheme();
                            setIsOpen(false);
                        }}
                        className="p-2 rounded-md border border-border hover:text-brand transition"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            )}
        </nav>
    );
}
