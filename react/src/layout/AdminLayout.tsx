import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/portal/login');
        }
    }, [navigate]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/portal/login');
    };

    const navLinks = [
        { path: '/portal/dashboard', label: 'Dashboard' },
        { path: '/portal/hero', label: 'Hero' },
        { path: '/portal/projects', label: 'Projects' },
        { path: '/portal/experience', label: 'Experience' },
        { path: '/portal/education', label: 'Education' },
        { path: '/portal/skills', label: 'Skills' },
        { path: '/portal/about', label: 'About' },
        { path: '/portal/resume', label: 'Resume' },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <div className="md:hidden bg-[#050505] p-4 flex justify-between items-center border-b border-white/10 z-50 relative">
                <div className="text-lg font-bold tracking-tighter cursor-default font-display flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    AP<span className="text-gray-500">.</span> <span className="font-mono font-normal text-xs ml-1 text-gray-500 uppercase tracking-widest">Portal</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#050505] p-6 flex flex-col transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 border-r border-white/10
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="text-xl font-bold tracking-tighter cursor-default font-display flex items-center gap-2 mb-10 md:flex">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    AP<span className="text-gray-500">.</span> <span className="font-mono font-normal text-sm ml-2 text-gray-500 uppercase tracking-widest border-l border-gray-800 pl-3">Portal</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block py-3 px-4 rounded-sm transition duration-200 text-sm font-mono uppercase tracking-widest ${location.pathname === link.path ? 'bg-white text-black font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className="mt-auto flex items-center gap-3 text-left text-gray-500 hover:text-white p-3 rounded-sm hover:bg-white/5 transition-colors font-mono uppercase text-xs tracking-widest">
                    <LogOut size={16} /> Disconnect
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full min-w-0 bg-black">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
