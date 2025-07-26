import { useEffect, useState } from 'react';
import TechStackForm from '../components/techStack/TechStackForm';
import { API_URL } from "@/API_URL.ts";

type Tool = {
    name: string;
    link: string;
    icon: string;
    categories: string[];
};

type CategoryMap = {
    [category: string]: {
        tools: Tool[];
    };
};

export default function TechStack() {
    const [activeCategory, setActiveCategory] = useState('Frontend');
    const [categories, setCategories] = useState<string[]>([]);
    const [toolsByCategory, setToolsByCategory] = useState<CategoryMap>({});
    const [adminOpen, setAdminOpen] = useState(false);

    useEffect(() => {
        const fetchTechStack = async () => {
            try {
                const response = await fetch(`${API_URL}/tech-stack`);
                const rawData = await response.json();

                const toolsArray: Tool[] = Array.isArray(rawData.tools) ? rawData.tools : [rawData.tools];

                const categorizedTools: CategoryMap = {};

                toolsArray.forEach((tool) => {
                    tool.categories.forEach((category) => {
                        if (!categorizedTools[category]) {
                            categorizedTools[category] = { tools: [] };
                        }
                        categorizedTools[category].tools.push(tool);
                    });
                });

                setToolsByCategory(categorizedTools);
                setCategories(Object.keys(categorizedTools));
            } catch (error) {
                console.error('Failed to fetch tech stack:', error);
            }
        };

        fetchTechStack();
    }, []);

    return (
        <section className="snap-start min-h-full flex flex-col justify-center items-center px-4 py-8 sm:py-10 relative z-10 overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/videos/tech-stack-dark.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Admin Button */}
            <div className="absolute top-4 left-4 z-20">
                <button
                    onClick={() => setAdminOpen(true)}
                    className="px-4 py-2 border-accent text-accent rounded-md hover:bg-accent hover:text-black transition invert-0"
                >
                    Admin
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">My Tech Stack</h2>

                {/* Category Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-10 relative z-10 overflow-visible">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-2 rounded-full text-xs sm:text-sm md:text-base transition font-medium
                            ${activeCategory === cat
                                ? 'text-brand border-brand shadow-sm'
                                : 'text-textMuted hover:text-brand hover:border-brand'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Tools Grid */}
                <div className="w-full max-w-6xl px-4 pb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                        {toolsByCategory[activeCategory]?.tools.map((tool) => (
                            <div
                                key={tool.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl bg-transparent flex flex-col items-center justify-center text-center hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_15px_2px_rgba(212,175,55,0.4)] transition-all duration-300 ease-in-out"
                            >
                                <a href={tool.link} target="_blank" rel="noopener noreferrer"
                                   className="flex flex-col items-center justify-center">
                                    <img src={tool.icon} alt={tool.name}
                                         className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 filter invert transition" />
                                    <span className="text-xs sm:text-sm text-white">{tool.name}</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute top-6 right-10 transform -translate-x-1/2 z-10 animate-bounce text-textMuted">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-sm mt-1 block">Scroll</span>
            </div>

            {/* Admin Modal */}
            <TechStackForm isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
        </section>
    );
}
