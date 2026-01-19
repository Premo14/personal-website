import { ReactNode } from 'react';
import Navbar from '@/components/static/Navbar.tsx';
import Footer from '@/components/static/Footer.tsx';

export default function Layout({ children }: { children: ReactNode }) {
    // const location = useLocation(); // Unused now

    return (
        <div className="bg-background text-textPrimary transition-colors duration-300 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 relative flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
}
