import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/api/client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { ExternalLink, Building2 } from 'lucide-react';

type Experience = {
    ID: number;
    company: string;
    role: string;
    start_date: string;
    end_date: string;
    description: string;
    overview: string;
    location: string;
    company_link: string;
};

const ExperienceSection = () => {
    const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
    const { data: experiences } = useQuery({
        queryKey: ['experience'],
        queryFn: async () => {
            const res = await api.get('/public/experience');
            return res.data;
        }
    });

    const defaultExperience: Experience = {
        ID: 0,
        company: "Default Company",
        role: "Software Engineer",
        start_date: new Date().toISOString(),
        end_date: "",
        description: "This is a default experience entry. It appears when no experience is listed.",
        overview: "This is a short overview of the experience.",
        location: "Remote",
        company_link: ""
    };

    const displayExperience = experiences && experiences.length > 0 ? experiences : [defaultExperience];

    return (
        <section id="experience" className="min-h-screen flex flex-col justify-center py-32 px-6 relative">
            <div className="absolute left-0 w-125 h-125 bg-white/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2"></div>
            
            <div className="max-w-5xl mx-auto w-full z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-20"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter font-display mb-2">
                        Experience<span className="text-gray-600">.</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Professional Journey</p>
                </motion.div>

                <div className="relative border-l border-white/10 pl-8 ml-4 md:ml-0 md:pl-12 space-y-16">
                    {displayExperience?.map((exp: Experience, index: number) => (
                        <motion.div
                            key={exp.ID}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            onClick={() => setSelectedExp(exp)}
                            className="relative group cursor-pointer"
                        >
                            {/* Timeline Node */}
                            <div className="absolute -left-9.25 md:-left-13.25 top-1 w-4 h-4 rounded-full bg-black border-2 border-white/30 group-hover:border-white group-hover:scale-125 transition-all duration-300 z-10" />

                            <div className="bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 p-6 -m-6 rounded-lg transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2 gap-2">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors tracking-tight">
                                        {exp.role}
                                    </h3>
                                    <span className="text-xs text-gray-500 font-mono uppercase tracking-widest shrink-0">
                                        {new Date(exp.start_date).getFullYear()} — {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                                    </span>
                                </div>
                                <h4 className="text-lg text-gray-400 font-medium mb-4 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 opacity-50" />
                                    {exp.company}
                                </h4>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                                    {exp.overview || exp.description}
                                </p>
                                
                                <div className="mt-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">
                                    <span>Read more</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2.5 group-hover:translate-x-0 duration-300">→</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={!!selectedExp}
                onClose={() => setSelectedExp(null)}
                title={selectedExp?.role}
            >
                <div className="space-y-6 text-gray-300 p-2">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{selectedExp?.company}</h3>
                        <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest text-gray-500 border-b border-white/10 pb-4">
                            <span>{selectedExp?.location}</span>
                            <span>•</span>
                            <span>
                                {selectedExp && new Date(selectedExp.start_date).toLocaleDateString()} — 
                                {selectedExp?.end_date ? new Date(selectedExp.end_date).toLocaleDateString() : ' Present'}
                            </span>
                        </div>
                    </div>

                    <p className="whitespace-pre-line leading-relaxed text-sm">
                        {selectedExp?.description}
                    </p>

                    {selectedExp?.company_link && (
                        <div className="pt-6 mt-6 border-t border-white/10">
                            <a
                                href={selectedExp.company_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white hover:text-gray-400 transition-colors"
                            >
                                <ExternalLink size={14} />
                                Visit Company
                            </a>
                        </div>
                    )}
                </div>
            </Modal>
        </section>
    );
};

export default ExperienceSection;
