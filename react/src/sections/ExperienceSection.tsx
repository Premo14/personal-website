import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/api/client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { ExternalLink } from 'lucide-react';

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
        <section id="experience" className="min-h-screen flex flex-col justify-center py-20 px-4 bg-gray-900/50">
            <div className="max-w-6xl mx-auto w-full">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Experience
                </motion.h2>

                <div className="space-y-6">
                    {displayExperience?.map((exp: Experience, index: number) => (
                        <motion.div
                            key={exp.ID}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedExp(exp)}
                            className="bg-gray-800/40 border border-gray-700 p-8 rounded-xl cursor-pointer hover:bg-gray-800 hover:border-brand/50 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-brand transition-colors">{exp.role}</h3>
                                    <h4 className="text-xl text-gray-400">{exp.company}</h4>
                                </div>
                                <span className="text-sm text-gray-500 bg-gray-900 px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">
                                    {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                                </span>
                            </div>
                            <p className="text-gray-400 line-clamp-2">{exp.overview || exp.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={!!selectedExp}
                onClose={() => setSelectedExp(null)}
                title={`${selectedExp?.role} @ ${selectedExp?.company}`}
            >
                <div className="space-y-4 text-gray-300">
                    <div className="flex justify-between text-sm text-gray-500 border-b border-gray-700 pb-2">
                        <span>{selectedExp?.location}</span>
                        <span>
                            {selectedExp && new Date(selectedExp.start_date).toLocaleDateString()} -
                            {selectedExp?.end_date ? new Date(selectedExp.end_date).toLocaleDateString() : ' Present'}
                        </span>
                    </div>

                    {selectedExp?.company_link && (
                        <a
                            href={selectedExp.company_link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-brand hover:text-white transition-colors w-fit"
                        >
                            <ExternalLink size={16} />
                            Visit Company Website
                        </a>
                    )}

                    <p className="whitespace-pre-line leading-relaxed">
                        {selectedExp?.description}
                    </p>
                </div>
            </Modal>
        </section>
    );
};

export default ExperienceSection;
