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
        <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold text-brand">Admin Panel</h2>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 p-6 flex flex-col transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 border-r border-gray-700
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <h2 className="text-2xl font-bold mb-8 text-brand hidden md:block">Admin Panel</h2>

                <nav className="flex-1 space-y-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${location.pathname === link.path ? 'bg-gray-700 text-brand font-bold' : 'text-gray-300'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className="mt-auto flex items-center gap-2 text-left text-red-400 hover:text-red-300 p-2 rounded hover:bg-gray-700/50 transition">
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full min-w-0">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
