import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

type Education = {
    ID: number;
    type: string;
    institution: string;
    title: string;
    start_date: string;
    end_date: string | null;
    description: string;
};

const EducationSection = () => {
    const { data: education, isLoading } = useQuery({
        queryKey: ['education-public'],
        queryFn: async () => {
            const res = await api.get('/public/education');
            return res.data;
        }
    });

    const defaultEducation: Education = {
        ID: 0,
        type: "Degree",
        institution: "Default University",
        title: "B.S. Default Science",
        start_date: new Date().toISOString(),
        end_date: null,
        description: "This is a default education entry. It appears when no education is listed."
    };

    const displayEducation = education && education.length > 0 ? education : [defaultEducation];

    if (isLoading) return null;

    return (
        <section id="education" className="min-h-screen flex flex-col justify-center py-32 px-6 bg-[#050505]">
            <div className="max-w-5xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter font-display mb-2">
                            Education<span className="text-gray-600">.</span>
                        </h2>
                        <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Academic & Training</p>
                    </div>
                    <div className="h-[1px] flex-1 bg-white/10 hidden md:block mb-4 ml-8"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayEducation?.map((item: Education, index: number) => (
                        <motion.div
                            key={item.ID}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-black border border-white/10 p-8 hover:border-white/30 transition-all duration-300 group flex flex-col h-full"
                        >
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full">
                                        <GraduationCap className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm">
                                        {item.type}
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-white bg-white/10 px-3 py-1.5 rounded-sm">
                                    {new Date(item.start_date).getFullYear()} — {item.end_date ? new Date(item.end_date).getFullYear() : 'Present'}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-gray-300 transition-colors">
                                    {item.institution}
                                </h3>
                                <div className="text-lg text-gray-400 mb-6 font-medium">
                                    {item.title}
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EducationSection;
