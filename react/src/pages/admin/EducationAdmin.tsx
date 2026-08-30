import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '@/api/client';
import { useState } from 'react';

type Education = {
    ID: number;
    type: string;
    institution: string;
    title: string;
    start_date: string;
    end_date: string | null;
    description: string;
};

// Form helper type
type EducationFormData = Education & {
    is_current: boolean;
};

const EducationAdmin = () => {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<number | null>(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm<EducationFormData>();

    const isCurrent = watch('is_current');

    const { data: education, isLoading } = useQuery({
        queryKey: ['education'],
        queryFn: async () => {
            const res = await api.get('/public/education');
            return res.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: EducationFormData) => {
            const payload = {
                ...data,
                start_date: new Date(data.start_date).toISOString(),
                end_date: data.is_current ? null : (data.end_date ? new Date(data.end_date).toISOString() : null)
            };
            return api.post('/admin/education', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['education'] });
            reset();
            alert('Education added!');
        },
        onError: (err: any) => alert('Failed to add: ' + err.message)
    });

    const updateMutation = useMutation({
        mutationFn: async (data: EducationFormData) => {
            const payload = {
                ...data,
                start_date: new Date(data.start_date).toISOString(),
                end_date: data.is_current ? null : (data.end_date ? new Date(data.end_date).toISOString() : null)
            };
            return api.put(`/admin/education/${editingId}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['education'] });
            setEditingId(null);
            reset();
            alert('Education updated!');
        },
        onError: (err: any) => alert('Failed to update: ' + err.message)
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => api.delete(`/admin/education/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['education'] });
        },
        onError: (err: any) => alert('Failed to delete: ' + err.message)
    });

    const onSubmit = (data: EducationFormData) => {
        if (editingId) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (item: Education) => {
        setEditingId(item.ID);
        setValue('type', item.type);
        setValue('institution', item.institution);
        setValue('title', item.title);
        setValue('start_date', item.start_date ? item.start_date.split('T')[0] : '');
        setValue('end_date', item.end_date ? item.end_date.split('T')[0] : '');
        setValue('description', item.description);
        setValue('is_current', !item.end_date);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Manage Education</h1>

            {/* List */}
            <div className="mb-8 space-y-4">
                {education?.map((item: Education) => (
                    <div key={item.ID} className="bg-[#050505] border border-white/10 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-xl text-white">{item.institution}</h3>
                            <p className="text-white font-medium">{item.title} <span className="text-sm text-gray-400">({item.type})</span></p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => handleEdit(item)} className="flex-1 md:flex-none bg-blue-600/20 text-blue-400 border border-blue-600/50 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition">Edit</button>
                            <button onClick={() => deleteMutation.mutate(item.ID)} className="flex-1 md:flex-none bg-red-600/20 text-red-400 border border-red-600/50 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className="bg-[#050505] border border-white/10 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Education' : 'Add New Education'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select {...register('type')} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none">
                                <option value="Degree">Degree</option>
                                <option value="Certification">Certification</option>
                                <option value="Training">Training</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Institution / Provider</label>
                            <input {...register('institution')} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none" placeholder="University of X" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title (Degree / Cert Name)</label>
                        <input {...register('title')} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none" placeholder="B.S. Computer Science" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                            <input type="date" {...register('start_date')} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">End Date</label>
                            <div className="flex gap-2 items-center flex-wrap">
                                <input type="date" {...register('end_date')} disabled={isCurrent} className={`flex-1 w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none min-w-35 ${isCurrent ? 'opacity-50' : ''}`} />
                                <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                                    <input type="checkbox" {...register('is_current')} id="is_current_edu" className="w-5 h-5 rounded bg-gray-900 border-gray-700 text-white focus:ring-brand cursor-pointer" />
                                    <label htmlFor="is_current_edu" className="text-sm cursor-pointer select-none">Current</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea {...register('description')} rows={4} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none custom-scrollbar" />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }} className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Cancel</button>}
                        <button type="submit" className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 shadow-lg shadow-brand/20">
                            {editingId ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationAdmin;
