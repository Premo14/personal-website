import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { Link } from 'react-scroll';

const HeroSection = () => {
    const { data: hero } = useQuery({
        queryKey: ['hero'],
        queryFn: async () => {
            const res = await api.get('/public/hero');
            return res.data;
        }
    });

    const resumeUrl = `${api.defaults.baseURL?.replace('/api', '')}/uploads/Resume_Anthony_Premo.pdf`;

    if (!hero) return null;

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Background enhancement */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0" />

            {/* Animated content */}
            <motion.div
                className="z-10 text-center max-w-4xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-5xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6 tracking-tight">
                    {hero.title || "Hello, I'm Anthony"}
                </h1>
                <h2 className="text-2xl md:text-4xl text-brand font-light mb-8">
                    {hero.subtitle || "Full Stack Engineer"}
                </h2>

                <div className="flex justify-center gap-6">
                    <Link
                        to="projects"
                        smooth={true}
                        duration={800}
                        offset={-80}
                        className="cursor-pointer px-8 py-4 bg-brand text-black font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transform hover:-translate-y-1 transition-all"
                    >
                        {hero.cta_text || "View My Work"}
                    </Link>
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer px-8 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/10 hover:border-white/40 transition-all"
                    >
                        Resume
                    </a>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
                    <div className="w-1 h-3 bg-current rounded-full" />
                </div>
            </motion.div>


        </section>
    );
};

export default HeroSection;
