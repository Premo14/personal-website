import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll affect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Projects', to: 'projects' },
        { name: 'Experience', to: 'experience' },
        { name: 'Education', to: 'education' },
        { name: 'About', to: 'about' }
    ];

    // Variants for animation
    const menuVariants: any = {
        hidden: {
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.4, ease: "easeOut" }
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <nav className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
            <div className="w-full px-6 md:px-12 flex justify-between items-center text-white relative z-50">
                <div
                    onClick={() => {
                        const hero = document.getElementById('hero');
                        if (hero) hero.scrollIntoView({ behavior: 'smooth' });
                        setIsOpen(false);
                    }}
                    className="text-lg font-bold tracking-tight cursor-pointer hover:opacity-70 transition-opacity font-display flex items-center gap-2"
                >
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    AP<span className="text-gray-500">.</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex space-x-10 items-center">
                    {navLinks.map((link) => (
                        <ScrollLink
                            key={link.to}
                            to={link.to}
                            smooth={true}
                            duration={800}
                            spy={true}
                            offset={-80}
                            activeClass="text-white opacity-100 font-medium"
                            className="cursor-pointer text-sm font-mono text-gray-500 hover:text-white transition-all duration-300 relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-2 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </ScrollLink>
                    ))}
                    <ScrollLink
                        to="contact"
                        smooth={true}
                        duration={800}
                        className="cursor-pointer px-5 py-2.5 bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors duration-300"
                    >
                        Contact
                    </ScrollLink>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-white hover:opacity-70 transition-opacity focus:outline-none z-50"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants}
                        className="md:hidden fixed inset-0 bg-black z-40 flex flex-col justify-center items-center h-screen"
                    >
                        <div className="flex flex-col items-center space-y-8 w-full px-6">
                            {navLinks.map((link, i) => (
                                <motion.div 
                                    key={link.to}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 + 0.2 }}
                                    className="w-full text-center border-b border-white/10 pb-6"
                                >
                                    <ScrollLink
                                        to={link.to}
                                        smooth={true}
                                        duration={500}
                                        offset={-60}
                                        onClick={() => setIsOpen(false)}
                                        className="text-white text-3xl font-display font-light cursor-pointer hover:text-gray-400 transition-colors"
                                    >
                                        {link.name}
                                    </ScrollLink>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="pt-4"
                            >
                                <ScrollLink
                                    to="contact"
                                    smooth={true}
                                    duration={800}
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-4 bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors duration-300 inline-block"
                                >
                                    Get In Touch
                                </ScrollLink>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
