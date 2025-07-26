import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/static/Navbar.tsx';
import Footer from '@/components/static/Footer.tsx';

export default function Layout({ children }: { children: ReactNode }) {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="bg-background text-textPrimary transition-colors duration-300 h-screen flex flex-col">
            <Navbar />
            {isHome ? (
                <div className="flex-1 relative overflow-hidden">
                    {children}
                </div>
            ) : (
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-[#121212]">
                    {children}
                </main>
            )}
            <Footer />
        </div>
    );
}
