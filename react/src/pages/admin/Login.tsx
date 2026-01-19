import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/client';
import { useMutation } from '@tanstack/react-query';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/auth/login', { username, password });
            return res.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            navigate('/admin/dashboard');
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
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-3xl font-bold mb-6 text-brand text-center">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-gray-300">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-brand outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-brand outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full py-2 bg-brand text-black font-bold rounded hover:bg-yellow-600 transition disabled:opacity-50"
                    >
                        {loginMutation.isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
