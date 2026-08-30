import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import { Link } from 'react-scroll';
import { ArrowRight, FileText } from 'lucide-react';

const HeroSection = () => {
    const { data: hero, isLoading } = useQuery({
        queryKey: ['hero'],
        queryFn: async () => {
            const res = await api.get('/public/hero');
            return res.data;
        }
    });

    const resumeUrl = `${api.defaults.baseURL?.replace('/api', '')}/uploads/resume_apremo.pdf`;

    if (isLoading) {
        return (
            <section id="hero" className="min-h-screen flex items-center justify-center relative px-6 w-full overflow-hidden">
                <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-20" />
                <div className="flex flex-col items-center gap-6 z-10">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white/50 font-mono uppercase tracking-widest text-xs animate-pulse">Loading Interface...</span>
                </div>
            </section>
        );
    }

    if (!hero) return null;

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center relative px-6 w-full overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-40" />

            {/* Radial Gradient Glow (Replacing heavy blur filter) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/10 via-white/5 to-transparent rounded-full pointer-events-none z-0" />

            {/* Animated content */}
            <motion.div
                className="z-10 w-full max-w-5xl flex flex-col items-start"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex items-center gap-3 mb-6"
                >
                    <span className="h-px w-12 bg-white/50"></span>
                    <span className="text-sm font-mono tracking-widest text-textMuted uppercase">
                        {hero.subtitle || "Platform Engineer"}
                    </span>
                </motion.div>

                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black tracking-tighter text-white leading-[1.1] mb-8 font-display">
                    {hero.title?.split(' ').map((word: string, i: number) => (
                        <span key={i} className="block hover:text-gray-300 transition-colors duration-300 cursor-default">
                            {word}
                        </span>
                    )) || (
                        <>
                            <span className="block hover:text-gray-300 transition-colors duration-300 cursor-default">Building</span>
                            <span className="block hover:text-gray-300 transition-colors duration-300 cursor-default">Digital</span>
                            <span className="block hover:text-gray-300 transition-colors duration-300 cursor-default text-gray-500">Systems.</span>
                        </>
                    )}
                </h1>

                <motion.div 
                    className="flex flex-wrap gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <Link
                        to="projects"
                        smooth={true}
                        duration={800}
                        offset={-80}
                        className="group flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-none text-sm tracking-wide uppercase hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                    >
                        {hero.cta_text || "View Work"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-none text-sm tracking-wide uppercase hover:bg-white/10 transition-all duration-300"
                    >
                        <FileText className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        Resume
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-6 text-white/40 flex items-center gap-4"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
                <span className="text-xs font-mono uppercase tracking-[0.2em] origin-left -rotate-90 -translate-y-10">Scroll</span>
                <div className="w-px h-16 bg-linear-to-b from-white/0 via-white/50 to-white/0" />
            </motion.div>
        </section>
    );
};

export default HeroSection;
