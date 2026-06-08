import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';

const AboutSection = () => {
    const { data: aboutContent } = useQuery({
        queryKey: ['about'],
        queryFn: async () => {
            // Fallback if no specific "About" endpoint exists yet, reusing PublicController logic or adding new endpoint. 
            // Assuming /public/about exists or we use hero data for now.
            // Actually, I recalled creating an AboutMe model but need to check if there is a public endpoint. 
            // Checking public_controller.go earlier... yes, public/about exists.
            try {
                const res = await api.get('/public/about');
                return res.data;
            } catch (e) {
                return null;
            }
        }
    });

    const { data: skills } = useQuery({
        queryKey: ['skills'],
        queryFn: async () => {
            const res = await api.get('/public/skills');
            return res.data;
        }
    });



    const defaultAbout = {
        content: "This is a default bio that appears when no 'About Me' content has been set."
    };

    // Check if aboutContent exists AND has actual content string
    const hasValidBio = aboutContent && aboutContent.content && aboutContent.content.trim().length > 0;
    const displayAbout = hasValidBio ? aboutContent : defaultAbout;

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

    const displaySkills = skills && skills.length > 0 ? skills : defaultSkills;

    return (
        <section id="about" className="min-h-screen flex flex-col justify-center py-20 px-4 bg-gray-900/20">
            <div className="max-w-4xl mx-auto w-full">
                {/* Decorative circle */}
                <div className="absolute -left-20 top-20 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-2">About Me</h2>
                        {displayAbout.title && (
                            <h3 className="text-xl text-brand font-semibold mb-6">{displayAbout.title}</h3>
                        )}
                        <div className="prose prose-lg text-gray-400">
                            <p className="whitespace-pre-line">{displayAbout.content}</p>
                        </div>
                    </motion.div>

                    {/* Skills Visual */}
                    <motion.div
                        className="flex-1 w-full"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">Technical Arsenal</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {displaySkills?.map((category: any) => (
                                <div key={category.ID} className="mb-4">
                                    <h4 className="text-brand font-bold mb-3 text-sm uppercase tracking-wider leading-tight">{category.name}</h4>
                                    <ul className="space-y-2">
                                        {category.skills?.map((skill: any) => (
                                            <li key={skill.ID} className="text-gray-400 text-sm flex items-start">
                                                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2 mt-1.5 shrink-0" />
                                                <span className="wrap-break-word">{skill.name}</span>
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
