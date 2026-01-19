import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '@/api/client';
import { useState } from 'react';
import { Trash, Plus } from 'lucide-react';

type Skill = {
    ID: number;
    name: string;
    proficiency: number;
    skill_category_id: number;
};

type SkillCategory = {
    ID: number;
    name: string;
    skills: Skill[];
};

const SkillsAdmin = () => {
    const queryClient = useQueryClient();
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingSkill, setIsAddingSkill] = useState<{ catId: number } | null>(null);

    const { data: categories } = useQuery({
        queryKey: ['skills'],
        queryFn: async () => {
            const res = await api.get('/public/skills');
            return res.data || [];
        }
    });

    const createCategory = useMutation({
        mutationFn: async (name: string) => api.post('/admin/skill-categories', { name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            setIsAddingCategory(false);
        },
        onError: (err: any) => alert('Failed to create category: ' + err.message)
    });

    const deleteCategory = useMutation({
        mutationFn: async (id: number) => api.delete(`/admin/skill-categories/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
        onError: (err: any) => alert('Failed to delete category: ' + err.message)
    });

    const createSkill = useMutation({
        mutationFn: async (data: { name: string; category_id: number }) =>
            api.post('/admin/skills', { name: data.name, proficiency: 5, skill_category_id: data.category_id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            setIsAddingSkill(null);
        },
        onError: (err: any) => alert('Failed to create skill: ' + err.message)
    });

    const deleteSkill = useMutation({
        mutationFn: async (id: number) => api.delete(`/admin/skills/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
        onError: (err: any) => alert('Failed to delete skill: ' + err.message)
    });

    // Simple inline forms for adding
    const AddCategoryForm = () => {
        const { register, handleSubmit } = useForm<{ name: string }>();
        return (
            <form onSubmit={handleSubmit((d) => createCategory.mutate(d.name))} className="flex gap-2">
                <input {...register('name')} placeholder="Category Name" className="bg-gray-700 text-white px-2 py-1 rounded" autoFocus />
                <button type="submit" className="text-brand">Save</button>
                <button type="button" onClick={() => setIsAddingCategory(false)} className="text-gray-400">Cancel</button>
            </form>
        );
    };

    const AddSkillForm = ({ catId }: { catId: number }) => {
        const { register, handleSubmit } = useForm<{ name: string }>();
        return (
            <form onSubmit={handleSubmit((d) => createSkill.mutate({ name: d.name, category_id: catId }))} className="flex flex-col gap-3 mt-4 w-full">
                <input
                    {...register('name')}
                    placeholder="Skill Name"
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-brand placeholder-gray-500"
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAddingSkill(null)} className="px-3 py-1 text-gray-400 text-sm hover:text-white transition">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-brand text-black rounded text-sm font-bold hover:bg-yellow-500 transition">Save</button>
                </div>
            </form>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Manage Skills</h1>
                <button
                    onClick={() => setIsAddingCategory(true)}
                    className="flex items-center gap-2 bg-brand text-black px-4 py-2 rounded hover:bg-yellow-500 font-bold"
                >
                    <Plus size={20} /> New Category
                </button>
            </div>

            {isAddingCategory && (
                <div className="bg-gray-800 p-4 rounded mb-6">
                    <AddCategoryForm />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories?.map((cat: SkillCategory) => (
                    <div key={cat.ID} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                            <h2 className="text-xl font-bold text-brand">{cat.name}</h2>
                            <button onClick={() => deleteCategory.mutate(cat.ID)} className="text-gray-500 hover:text-red-400">
                                <Trash size={18} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {cat.skills?.map((skill) => (
                                <div key={skill.ID} className="flex justify-between items-center bg-gray-900/50 px-3 py-2 rounded">
                                    <span className="text-gray-300">{skill.name}</span>
                                    <button onClick={() => deleteSkill.mutate(skill.ID)} className="text-gray-600 hover:text-red-400">
                                        <Trash size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {isAddingSkill?.catId === cat.ID ? (
                            <AddSkillForm catId={cat.ID} />
                        ) : (
                            <button
                                onClick={() => setIsAddingSkill({ catId: cat.ID })}
                                className="mt-4 flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
                            >
                                <Plus size={16} /> Add Skill
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsAdmin;
