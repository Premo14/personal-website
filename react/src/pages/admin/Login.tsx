import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/client';
import { useMutation } from '@tanstack/react-query';

const Login = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/auth/login', { password });
            return res.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            navigate('/portal/dashboard');
        },
        onError: (error: any) => {
            alert('Login failed: ' + (error.response?.data?.error || error.message));
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
            <div className="bg-[#050505] p-10 border border-white/10 w-full max-w-md shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                
                <div className="text-xl font-bold tracking-tighter cursor-default font-display flex items-center justify-center gap-2 mb-8">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    AP<span className="text-gray-500">.</span> <span className="font-mono font-normal text-sm ml-2 text-gray-500 uppercase tracking-widest border-l border-gray-800 pl-3">Portal</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-xs font-mono uppercase tracking-widest text-gray-400">Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-black border border-white/10 focus:border-white/40 focus:bg-white/5 outline-none transition-all text-white font-mono"
                            placeholder="••••••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full py-4 bg-white text-black font-semibold text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loginMutation.isPending ? 'Authenticating...' : 'Access System'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
