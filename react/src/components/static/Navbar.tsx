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
        { name: 'Home', to: 'hero' },
        { name: 'Projects', to: 'projects' },
        { name: 'Experience', to: 'experience' },
        { name: 'Education', to: 'education' },
        { name: 'About', to: 'about' },
        { name: 'Contact', to: 'contact' },
    ];

    // Variants for animation
    const menuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const
            }
        },
        visible: {
            opacity: 1,
            height: "100vh",
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const linkVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled || isOpen ? 'bg-black/80 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white relative z-50">
                <div
                    onClick={() => {
                        const hero = document.getElementById('hero');
                        if (hero) hero.scrollIntoView({ behavior: 'smooth' });
                        setIsOpen(false);
                    }}
                    className="text-xl font-bold tracking-tighter cursor-pointer hover:text-brand transition-colors font-mono"
                >
                    Anthony Premo <span className="text-brand">.</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex space-x-8">
                    {navLinks.map((link) => (
                        <ScrollLink
                            key={link.to}
                            to={link.to}
                            smooth={true}
                            duration={500}
                            spy={true}
                            offset={0}
                            activeClass="text-brand font-bold"
                            className="cursor-pointer text-gray-300 hover:text-white transition-colors text-sm uppercase tracking-widest relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
                        </ScrollLink>
                    ))}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-white hover:text-brand transition-colors focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
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
                        className="md:hidden fixed top-0 left-0 w-full bg-gray-900/95 backdrop-blur-xl flex flex-col justify-center items-center z-40 overflow-hidden"
                        style={{ top: '60px' }} // Offset for navbar header
                    >
                        <motion.div className="flex flex-col items-center space-y-8">
                            {navLinks.map((link) => (
                                <motion.div key={link.to} variants={linkVariants}>
                                    <ScrollLink
                                        to={link.to}
                                        smooth={true}
                                        duration={500}
                                        offset={-60}
                                        onClick={() => setIsOpen(false)}
                                        className="text-white text-3xl font-bold cursor-pointer hover:text-brand transition-colors tracking-wide"
                                    >
                                        {link.name}
                                    </ScrollLink>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
