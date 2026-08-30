import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '@/api/client';
import { useState } from 'react';

type Experience = {
    ID: number;
    company: string;
    role: string;
    start_date: string;
    end_date: string | null;
    description: string;
    overview: string;
    location: string;
    company_link: string;
};

// Form helper type
type ExperienceFormData = Experience & {
    is_current: boolean;
};

const ExperienceAdmin = () => {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<number | null>(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm<ExperienceFormData>();

    const isCurrent = watch('is_current');

    const { data: experiences, isLoading } = useQuery({
        queryKey: ['experience'],
        queryFn: async () => {
            const res = await api.get('/public/experience');
            return res.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: ExperienceFormData) => {
            const payload = {
                ...data,
                start_date: new Date(data.start_date).toISOString(),
                end_date: data.is_current ? null : (data.end_date ? new Date(data.end_date).toISOString() : null)
            };
            return api.post('/admin/experience', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experience'] });
            reset();
            alert('Experience added!');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: ExperienceFormData) => {
            const payload = {
                ...data,
                start_date: new Date(data.start_date).toISOString(),
                end_date: data.is_current ? null : (data.end_date ? new Date(data.end_date).toISOString() : null)
            };
            return api.put(`/admin/experience/${editingId}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experience'] });
            setEditingId(null);
            reset();
            alert('Experience updated!');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => api.delete(`/admin/experience/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experience'] });
        }
    });

    const onSubmit = (data: ExperienceFormData) => {
        if (editingId) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (exp: Experience) => {
        setEditingId(exp.ID);
        setValue('company', exp.company);
        setValue('role', exp.role);
        setValue('start_date', exp.start_date ? exp.start_date.split('T')[0] : '');
        setValue('end_date', exp.end_date ? exp.end_date.split('T')[0] : '');
        setValue('description', exp.description);
        setValue('overview', exp.overview);
        setValue('location', exp.location);
        setValue('company_link', exp.company_link);
        setValue('is_current', !exp.end_date);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Manage Experience</h1>

            {/* List */}
            <div className="mb-8 space-y-4">
                {experiences?.map((exp: Experience) => (
                    <div key={exp.ID} className="bg-[#050505] border border-white/10 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-xl">{exp.company}</h3>
                            <p className="text-gray-400">{exp.role}</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => handleEdit(exp)} className="flex-1 md:flex-none bg-blue-600 px-3 py-1 rounded hover:bg-blue-500">Edit</button>
                            <button onClick={() => deleteMutation.mutate(exp.ID)} className="flex-1 md:flex-none bg-red-600 px-3 py-1 rounded hover:bg-red-500">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className="bg-[#050505] border border-white/10 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Experience' : 'Add New Experience'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input {...register('company')} placeholder="Company" className="p-2 bg-gray-700 rounded border border-gray-600 w-full" />
                        <input {...register('role')} placeholder="Role" className="p-2 bg-gray-700 rounded border border-gray-600 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                            <input type="date" {...register('start_date')} className="p-2 bg-gray-700 rounded border border-gray-600 w-full" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">End Date</label>
                            <div className="flex gap-2 items-center flex-wrap">
                                <input type="date" {...register('end_date')} disabled={isCurrent} className={`flex-1 p-2 bg-gray-700 rounded border border-gray-600 min-w-35 ${isCurrent ? 'opacity-50' : ''}`} />
                                <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                                    <input type="checkbox" {...register('is_current')} id="is_current_role" className="w-5 h-5 rounded border-gray-600 bg-gray-700 cursor-pointer" />
                                    <label htmlFor="is_current_role" className="cursor-pointer">Current</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <textarea {...register('overview')} placeholder="Brief Overview (for resume/cards)" rows={2} className="p-2 bg-gray-700 rounded border border-gray-600 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input {...register('location')} placeholder="Location" className="p-2 bg-gray-700 rounded border border-gray-600 w-full" />
                        <input {...register('company_link')} placeholder="Company Website URL" className="p-2 bg-gray-700 rounded border border-gray-600 w-full" />
                    </div>
                    <textarea {...register('description')} placeholder="Description" rows={4} className="p-2 bg-gray-700 rounded border border-gray-600 w-full" />
                    <div className="flex justify-end gap-2">
                        {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>}
                        <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200">
                            {editingId ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExperienceAdmin;
