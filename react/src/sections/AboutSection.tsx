import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { Terminal } from 'lucide-react';

const AboutSection = () => {
    const { data: aboutContent, isLoading: isAboutLoading } = useQuery({
        queryKey: ['about'],
        queryFn: async () => {
            try {
                const res = await api.get('/public/about');
                return res.data;
            } catch (e) {
                return null;
            }
        }
    });

    const { data: skills, isLoading: isSkillsLoading } = useQuery({
        queryKey: ['skills'],
        queryFn: async () => {
            const res = await api.get('/public/skills');
            return res.data;
        }
    });

    const isLoading = isAboutLoading || isSkillsLoading;

    const defaultAbout = {
        title: "Who I Am",
        content: "This is a default bio that appears when no 'About Me' content has been set."
    };

    // Check if aboutContent exists AND has actual content string
    const hasValidBio = aboutContent && aboutContent.content && aboutContent.content.trim().length > 0;
    const displayAbout = !isLoading && hasValidBio ? aboutContent : (isLoading ? {} : defaultAbout);

    const defaultSkills = [
        {
            ID: 1,
            name: "Default Tech",
            skills: [
                { ID: 1, name: "React" },
                { ID: 2, name: "TypeScript" },
                { ID: 3, name: "Tailwind CSS" }
            ]
        },
        {
            ID: 2,
            name: "Backend Default",
            skills: [
                { ID: 4, name: "Go" },
                { ID: 5, name: "PostgreSQL" },
                { ID: 6, name: "Docker" }
            ]
        }
    ];

    const displaySkills = !isLoading && skills && skills.length > 0 ? skills : (isLoading ? [] : defaultSkills);

    if (isLoading) {
        return (
            <section id="about" className="min-h-screen flex flex-col justify-center py-32 px-6 bg-black relative">
                <div className="flex flex-col items-center justify-center gap-4 z-10">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white/50 font-mono uppercase tracking-widest text-xs animate-pulse">Loading About...</span>
                </div>
            </section>
        );
    }

    return (
        <section id="about" className="min-h-screen flex flex-col justify-center py-32 px-6 bg-black relative">
            <div className="absolute top-0 right-0 w-full h-125 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-20 text-center"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter font-display mb-2">
                        About<span className="text-gray-600">.</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Background & Skills</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Text Content */}
                    <motion.div
                        className="flex-1 bg-[#050505] p-8 md:p-12 border border-white/10 relative"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-white/30" />
                        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-white/30" />

                        {displayAbout.title && (
                            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
                                <Terminal className="w-5 h-5 text-gray-500" />
                                {displayAbout.title}
                            </h3>
                        )}
                        <div className="prose prose-invert prose-p:text-gray-400 prose-p:leading-relaxed max-w-none">
                            <p className="whitespace-pre-line text-[15px]">{displayAbout.content}</p>
                        </div>
                    </motion.div>

                    {/* Skills Visual */}
                    <motion.div
                        className="flex-1 w-full"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h3 className="text-lg font-mono uppercase tracking-widest text-white mb-8 pb-4 border-b border-white/10">Technical Arsenal</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                            {displaySkills?.map((category: any) => (
                                <div key={category.ID} className="relative pl-4 border-l border-white/5 hover:border-white/20 transition-colors duration-300">
                                    <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">{category.name}</h4>
                                    <ul className="flex flex-wrap gap-2">
                                        {category.skills?.map((skill: any) => (
                                            <li key={skill.ID} className="text-gray-300 text-xs font-mono bg-white/5 border border-white/10 px-2 py-1 hover:bg-white/10 hover:text-white transition-all cursor-default">
                                                {skill.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
