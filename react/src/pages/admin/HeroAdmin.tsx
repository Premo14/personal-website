import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '@/api/client';
import { useEffect } from 'react';

type HeroData = {
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    background_image_url: string;
};

const HeroAdmin = () => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, setValue } = useForm<HeroData>();

    const { data: hero, isLoading } = useQuery({
        queryKey: ['hero'],
        queryFn: async () => {
            const res = await api.get('/public/hero');
            return res.data;
        }
    });

    useEffect(() => {
        if (hero) {
            setValue('title', hero.title);
            setValue('subtitle', hero.subtitle);
            setValue('cta_text', hero.cta_text);
            setValue('cta_link', hero.cta_link);
            setValue('background_image_url', hero.background_image_url);
        }
    }, [hero, setValue]);

    const mutation = useMutation({
        mutationFn: async (data: HeroData) => {
            return api.post('/admin/hero', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hero'] });
            alert('Hero section updated!');
        },
        onError: (err: any) => {
            alert('Failed to update: ' + err.message);
        }
    });

    const onSubmit = (data: HeroData) => {
        mutation.mutate(data);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Edit Hero Section</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-800 p-6 rounded-lg text-white">
                <div>
                    <label className="block mb-1">Title</label>
                    <input {...register('title')} className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                </div>
                <div>
                    <label className="block mb-1">Subtitle</label>
                    <input {...register('subtitle')} className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block mb-1">CTA Text</label>
                        <input {...register('cta_text')} className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                    </div>
                </div>

                <button type="submit" className="px-4 py-2 bg-brand text-black font-bold rounded hover:bg-yellow-600">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default HeroAdmin;
