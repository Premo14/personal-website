// import { useEffect, useState } from 'react';
// import ProjectsForm from '@/components/projects/ProjectsForm';
// import {PortfolioProject} from "@/models/PortfolioProject.ts";

export default function Projects() {
    // const [projects, setProjects] = useState<PortfolioProject[]>([]);
    // const [adminOpen, setAdminOpen] = useState(false);
    //
    // useEffect(() => {
    //     const fetchProjects = async () => {
    //         try {
    //             const response = await fetch('${API_URL}/projects');
    //             const data = await response.json();
    //             setProjects(data);
    //         } catch (err) {
    //             console.error('Error fetching projects:', err);
    //         }
    //     };
    //
    //     fetchProjects();
    // }, []);

    return (
        <section
            className="min-h-[60vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-semibold">
                The Projects Page will host live projects (eventually).
            </h1>
            <p className="text-base sm:text-lg">
                To see projects visit my Resume and GitHub for the time being.
            </p>

            {/*<div className="absolute top-4 left-4 z-20">*/}
            {/*    <button*/}
            {/*        onClick={() => setAdminOpen(true)}*/}
            {/*        className="px-3 py-1 text-sm border border-accent text-accent rounded-md hover:bg-accent hover:text-black transition invert dark:invert-0"*/}
            {/*    >*/}
            {/*        Admin*/}
            {/*    </button>*/}
            {/*</div>*/}

            {/*<h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Projects</h2>*/}

            {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">*/}
            {/*    {projects.map((project, idx) => (*/}
            {/*        <div key={idx} className="p-4 bg-background rounded-lg shadow-lg text-left hover:border-brand border-2 border-solid transition-all duration-300 ease-in-out">*/}
            {/*            <h3 className="text-2xl font-bold text-brand mb-2">{project.title}</h3>*/}
            {/*            <p className="text-textPrimary mb-2">{project.description}</p>*/}
            {/*            {project.liveLink && (*/}
            {/*                <a href={project.liveLink} target="_blank" className="text-accent underline">*/}
            {/*                    View Live*/}
            {/*                </a>*/}
            {/*            )}*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/*<ProjectsForm isOpen={adminOpen} onClose={() => setAdminOpen(false)} />*/}
        </section>
    );
}
