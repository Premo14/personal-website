import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { motion } from 'framer-motion';

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
        <section id="education" className="min-h-screen flex flex-col justify-center py-20 px-4">
            <div className="max-w-4xl mx-auto w-full">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center text-white mb-16"
                >
                    Education & <span className="text-brand">Training</span>
                </motion.h2>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
                    {displayEducation?.map((item: Education, index: number) => (
                        <motion.div
                            key={item.ID}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                            {/* Icon/Dot */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-gray-900 group-[.is-active]:bg-brand text-brand group-[.is-active]:text-gray-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <div className="w-3 h-3 bg-current rounded-full"></div>
                            </div>

                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl hover:border-brand transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                    <h3 className="text-xl font-bold text-white">{item.institution}</h3>
                                    <span className="text-sm font-mono text-brand bg-brand/10 px-2 py-0.5 rounded w-fit mt-1 md:mt-0 whitespace-nowrap">
                                        {new Date(item.start_date).getFullYear()} - {item.end_date ? new Date(item.end_date).getFullYear() : 'Present'}
                                    </span>
                                </div>
                                <div className="text-lg font-semibold text-gray-300 mb-2">{item.title}</div>
                                <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">{item.type}</p>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EducationSection;
