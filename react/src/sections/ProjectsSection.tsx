import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/api/client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { ExternalLink, Star } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

type Project = {
    ID: number;
    title: string;
    short_description: string;
    description: string;
    overview: string;
    technologies: string[];
    github_link: string;
    demo_link: string;
    featured: boolean;
    start_date?: string;
    end_date?: string;
    experience?: { company: string } | null;
};

// Deterministic monochromatic pattern based on string
const getPatternClass = (str: string) => {
    const patterns = [
        'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black',
        'bg-linear-to-br from-gray-900 to-black',
        'bg-linear-to-tl from-gray-800 to-black',
        'bg-linear-to-t from-gray-900 via-black to-black',
        'bg-linear-to-r from-black via-gray-900 to-black',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % patterns.length;
    return patterns[index];
};

const ProjectsSection = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const res = await api.get('/public/projects');
            return res.data;
        }
    });

    const defaultProject: Project = {
        ID: 0,
        title: "Project Placeholder",
        short_description: "This is a default project card.",
        description: "This is a detailed description of the default project. It exists to show what the layout looks like.",
        overview: "This is a short overview of the project.",
        technologies: ["React", "Go", "Tailwind"],
        github_link: "#",
        demo_link: "#",
        featured: false,
        start_date: new Date().toISOString(),
        end_date: ""
    };

    const displayProjects = !isLoading && Array.isArray(projects) && projects.length > 0 ? projects : (isLoading ? [] : [defaultProject]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <section id="projects" className="min-h-screen flex flex-col justify-center py-32 px-6">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white/50 font-mono uppercase tracking-widest text-xs animate-pulse">Loading Projects...</span>
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="min-h-screen flex flex-col justify-center py-32 px-6">
            <div className="max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
                >
                    <div>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter font-display mb-2">
                            Projects<span className="text-gray-600">.</span>
                        </h2>
                        <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Selected Works</p>
                    </div>
                    <div className="h-px flex-1 bg-white/10 hidden md:block mb-4 ml-8"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayProjects?.map((project: Project, index: number) => (
                        <motion.div
                            key={project.ID}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            onClick={() => setSelectedProject(project)}
                            className="bg-black border border-white/10 overflow-hidden cursor-pointer group flex flex-col h-full hover:border-white/30 transition-all duration-300 relative"
                        >
                            {/* Star for Featured */}
                            {project.featured && (
                                <div className="absolute top-4 right-4 z-20 text-white bg-black/80 p-2 rounded-full border border-white/20 backdrop-blur-md">
                                    <Star className="w-4 h-4 fill-white" />
                                </div>
                            )}

                            <div className="h-48 overflow-hidden relative shrink-0 border-b border-white/5">
                                <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-105 ${getPatternClass(project.title)}`}></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                    <h4 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">{project.title}</h4>
                                </div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-sm">
                                    <span className="text-white font-mono text-xs uppercase tracking-widest border-b border-white pb-1">View Details</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col grow bg-[#050505]">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors tracking-tight">{project.title}</h3>
                                    {project.start_date && (
                                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider ml-2 shrink-0 pt-1">
                                            {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'Present'}
                                        </span>
                                    )}
                                </div>
                                {project.experience && (
                                    <div className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-widest border-l-2 border-gray-800 pl-2">
                                        <span className="opacity-60">via </span>
                                        <span className="text-gray-300">{project.experience.company}</span>
                                    </div>
                                )}
                                <p className="text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed">{project.overview || project.short_description}</p>
                                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                                    {project.technologies?.slice(0, 4).map((tech) => (
                                        <span key={tech} className="text-[10px] uppercase tracking-wider bg-white/5 text-gray-300 px-2 py-1 rounded-sm border border-white/5">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies?.length > 4 && (
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500 px-2 py-1">+{project.technologies.length - 4}</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div >

            <Modal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                title={selectedProject?.title}
            >
                <div className="space-y-8 p-2">
                    {/* Full Description */}
                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{selectedProject?.description}</p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h4 className="text-white font-mono text-xs uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedProject?.technologies?.map((tech) => (
                                <span key={tech} className="text-xs font-mono bg-white/5 text-gray-300 px-3 py-1.5 rounded-sm border border-white/10">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-4 pt-4">
                        {selectedProject?.github_link && (
                            <a
                                href={selectedProject.github_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white transition-all text-sm font-semibold tracking-wide uppercase"
                            >
                                <FaGithub size={18} /> Source
                            </a>
                        )}
                        {selectedProject?.demo_link && (
                            <a
                                href={selectedProject.demo_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 transition-all text-sm font-semibold tracking-wide uppercase"
                            >
                                <ExternalLink size={18} /> Live Demo
                            </a>
                        )}
                    </div>
                </div>
            </Modal>
        </section >
    );
};

export default ProjectsSection;
