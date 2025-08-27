import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import WelcomeForm from '@/components/welcome/WelcomeForm';
import {API_URL} from "@/API_URL.ts";

export default function Welcome() {
    const [message, setMessage] = useState('');
    const [adminOpen, setAdminOpen] = useState(false);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await fetch(`${API_URL}/welcome-message`);
                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                console.error('Failed to fetch welcome message:', error);
            }
        };

        fetchMessage();
    }, []);

    return (
        <section className="snap-start h-full relative z-10 flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/videos/welcome-dark.mp4" type="video/mp4"/>
                </video>
            </div>


            {/* Admin Button */}
            <div className="absolute top-4 left-4 z-20">
                <button
                    onClick={() => setAdminOpen(true)}
                    className="px-4 py-2 min-w-[80px] rounded-full border-accent text-accent rounded-md hover:bg-accent hover:text-black transition invert-0"
                >
                    Admin
                </button>
            </div>

            {/* Welcome Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                <motion.h1
                    className="md:text-4xl font-signature text-white"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Hi, I’m Anthony Premo
                </motion.h1>

                <motion.p
                    className="text-lg md:text-xl max-w-2xl text-textMuted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    {message}
                </motion.p>

                <motion.ul
                    className="text-md md:text-lg text-textMuted space-y-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <li>• View my Resume</li>
                    <li>• Explore my Projects</li>
                    <li>• See my Tech Stacks & Tools</li>
                    <li>• Contact me Directly</li>
                </motion.ul>
            </div>

            <div className="absolute bottom-6 right-10 transform -translate-x-1/2 z-10 animate-bounce text-textMuted">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-sm mt-1 block">Scroll</span>
            </div>


            {/* Welcome Admin Modal */}
            <WelcomeForm isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
        </section>
    );
}
