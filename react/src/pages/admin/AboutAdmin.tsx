import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '@/api/client';
import { useState, useEffect } from 'react';

type AboutData = {
    title: string;
    content: string;
};

const AboutAdmin = () => {
    const queryClient = useQueryClient();
    const [message, setMessage] = useState('');

    const { data: about, isLoading } = useQuery({
        queryKey: ['about'],
        queryFn: async () => {
            const res = await api.get('/public/about');
            return res.data;
        }
    });

    const { register, handleSubmit, setValue } = useForm<AboutData>();

    useEffect(() => {
        if (about) {
            setValue('title', about.title);
            setValue('content', about.content);
        }
    }, [about, setValue]);

    const mutation = useMutation({
        mutationFn: async (data: AboutData) => {
            return api.post('/admin/about', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['about'] });
            setMessage('About section updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        },
        onError: () => {
            setMessage('Failed to update section.');
        }
    });

    const onSubmit = (data: AboutData) => {
        mutation.mutate(data);
    };

    if (isLoading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Edit About Section</h1>

            {message && (
                <div className={`p-4 rounded mb-6 ${message.includes('Failed') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                <div className="bg-[#050505] border border-white/10 p-6 rounded-lg space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Professional Title / Tagline</label>
                        <input
                            {...register('title')}
                            type="text"
                            placeholder="e.g. Full Stack Architect"
                            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-brand mb-4"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Biography Content</label>
                        <textarea
                            {...register('content')}
                            rows={10}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-brand"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="bg-white text-black text-black font-bold px-6 py-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        {mutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AboutAdmin;
