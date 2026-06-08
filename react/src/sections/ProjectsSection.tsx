import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/api/client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { ExternalLink } from 'lucide-react';
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

// Deterministic gradient based on string
const getGradient = (str: string) => {
    const gradients = [
        'from-blue-600 to-indigo-900',
        'from-emerald-500 to-teal-900',
        'from-orange-500 to-red-900',
        'from-purple-500 to-pink-900',
        'from-cyan-500 to-blue-900',
        'from-pink-500 to-rose-900',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
};

const ProjectsSection = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { data: projects } = useQuery({
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

    const displayProjects = Array.isArray(projects) && projects.length > 0 ? projects : [defaultProject];

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="projects" className="min-h-screen flex flex-col justify-center py-20 px-4">
            <div className="max-w-7xl mx-auto w-full">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Featured Projects
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProjects?.map((project: Project, index: number) => (
                        <motion.div
                            key={project.ID}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedProject(project)}
                            className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-brand/10 border border-gray-700/50 hover:border-brand/40 group relative flex flex-col h-full"
                        >
                            {/* Star for Featured */}
                            {project.featured && (
                                <div className="absolute top-4 right-4 z-20 text-yellow-500 bg-gray-900/80 p-1.5 rounded-full shadow-lg border border-yellow-500/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}

                            <div className="h-48 bg-gray-700 overflow-hidden relative group shrink-0">
                                <div className={`h-48 flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 bg-linear-to-br ${getGradient(project.title)}`}>
                                    <div className="bg-black/20 p-3 rounded-full mb-3 backdrop-blur-sm">
                                        <ExternalLink size={24} className="text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white drop-shadow-md">{project.title}</h4>
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold px-4 py-2 border border-white rounded-full">View Details</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-brand transition-colors">{project.title}</h3>
                                    {project.start_date && (
                                        <span className="text-xs text-brand font-mono border border-brand/30 bg-brand/10 px-2 py-1 rounded whitespace-nowrap ml-2">
                                            {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'Present'}
                                        </span>
                                    )}
                                </div>
                                {project.experience && (
                                    <div className="text-xs text-gray-400 mb-2">
                                        <span className="opacity-70">via </span>
                                        <span className="text-gray-200 font-semibold">{project.experience.company}</span>
                                    </div>
                                )}
                                <p className="text-gray-400 mb-4 line-clamp-3 text-sm">{project.overview || project.short_description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies?.slice(0, 3).map((tech) => (
                                        <span key={tech} className="text-xs bg-gray-900 text-gray-300 px-2 py-1 rounded">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies?.length > 3 && (
                                        <span className="text-xs text-gray-500 px-2 py-1">+{project.technologies.length - 3}</span>
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
                <div className="space-y-6">
                    {/* Links */}
                    <div className="flex gap-4">
                        {selectedProject?.github_link && (
                            <a
                                href={selectedProject.github_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-white transition"
                            >
                                <FaGithub size={20} /> GitHub
                            </a>
                        )}
                        {selectedProject?.demo_link && (
                            <a
                                href={selectedProject.demo_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-brand text-black font-bold rounded hover:bg-yellow-600 transition"
                            >
                                <ExternalLink size={20} /> Live Demo
                            </a>
                        )}
                    </div>

                    {/* Full Description */}
                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-line">{selectedProject?.description}</p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h4 className="text-white font-bold mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedProject?.technologies?.map((tech) => (
                                <span key={tech} className="text-sm bg-gray-800 text-brand px-3 py-1 rounded-full border border-gray-700">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </section >
    );
};

export default ProjectsSection;
