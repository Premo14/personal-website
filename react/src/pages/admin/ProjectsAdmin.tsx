import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '@/api/client';
import { useState } from 'react';
import { Plus, Trash, X } from 'lucide-react';

type Project = {
    ID: number;
    title: string;
    short_description: string;
    description: string;
    technologies: string[];
    demo_link: string;
    github_link: string;
    image_url?: string;
    featured: boolean;
    start_date: string;
    end_date: string | null;
};

// Form data structure might need handling for arrays
type ProjectFormData = {
    title: string;
    short_description: string;
    description: string;
    technologies: { value: string }[];
    demo_link: string;
    github_link: string;
    image_url?: string;
    featured: boolean;
    start_date: string;
    end_date: string;
    is_current: boolean;
};

// ... (Rest of imports)

const ProjectsAdmin = () => {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<number | null>(null);
    const { register, control, handleSubmit, reset, setValue, watch } = useForm<ProjectFormData>({
        defaultValues: {
            technologies: [{ value: '' }],
            is_current: false
        }
    });

    // Watch is_current to disable end_date
    const isCurrent = watch('is_current');

    const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
        control,
        name: "technologies"
    });

    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const res = await api.get('/public/projects');
            return res.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: ProjectFormData) => {
            const payload = {
                ...data,
                technologies: data.technologies.map(t => t.value).filter(Boolean),
                start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
                end_date: data.is_current ? null : (data.end_date ? new Date(data.end_date).toISOString() : null)
            };
            return api.post('/admin/projects', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            resetForm();
            alert('Project added!');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: ProjectFormData) => {
            const payload = {
                ...data,
                technologies: data.technologies.map(t => t.value).filter(Boolean),
                start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
                end_date: data.is_current ? null : (data.end_date ? new Date(data.end_date).toISOString() : null)
            };
            return api.put(`/admin/projects/${editingId}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setEditingId(null);
            resetForm();
            alert('Project updated!');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => api.delete(`/admin/projects/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    const resetForm = () => {
        reset({
            title: '',
            short_description: '',
            description: '',
            demo_link: '',
            github_link: '',
            image_url: '',
            featured: false,
            technologies: [{ value: '' }],
            start_date: '',
            end_date: '',
            is_current: false
        });
        setEditingId(null);
    };

    const onSubmit = (data: ProjectFormData) => {
        if (editingId) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (proj: Project) => {
        setEditingId(proj.ID);
        setValue('title', proj.title);
        setValue('short_description', proj.short_description);
        setValue('description', proj.description);
        setValue('demo_link', proj.demo_link);
        setValue('github_link', proj.github_link);
        setValue('image_url', proj.image_url);
        setValue('featured', proj.featured);

        // Dates
        setValue('start_date', proj.start_date ? proj.start_date.split('T')[0] : '');
        setValue('end_date', proj.end_date ? proj.end_date.split('T')[0] : '');
        setValue('is_current', !proj.end_date);

        // Handle arrays
        const techs = proj.technologies?.map(t => ({ value: t })) || [{ value: '' }];
        setValue('technologies', techs);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

            {/* List */}
            <div className="mb-8 space-y-4">
                {projects?.map((proj: Project) => (
                    <div key={proj.ID} className="bg-gray-800 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-700">
                        <div className="flex-1 w-full min-w-0">
                            <h3 className="font-bold text-xl text-brand truncate">{proj.title}</h3>
                            <p className="text-sm text-gray-400 truncate md:max-w-2xl">{proj.short_description}</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto shrink-0">
                            <button onClick={() => handleEdit(proj)} className="flex-1 md:flex-none bg-blue-600/20 text-blue-400 border border-blue-600/50 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition">Edit</button>
                            <button onClick={() => deleteMutation.mutate(proj.ID)} className="flex-1 md:flex-none bg-red-600/20 text-red-400 border border-red-600/50 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
                    {editingId && <button onClick={resetForm}><X className="text-gray-400 hover:text-white" /></button>}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Title</label>
                            <input {...register('title')} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Short Description (Summary)</label>
                            <input {...register('short_description')} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Full Description (Markdown supported)</label>
                        <textarea {...register('description')} rows={5} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none custom-scrollbar" />
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Start Date (Optional)</label>
                            <input type="date" {...register('start_date')} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none" />
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-sm text-gray-400 mb-1">End Date</label>
                            <div className="flex gap-2 items-center flex-wrap">
                                <input type="date" {...register('end_date')} disabled={isCurrent} className={`flex-1 p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none min-w-[140px] ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`} />
                                <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                                    <input type="checkbox" {...register('is_current')} id="is_current" className="w-5 h-5 rounded bg-gray-900 border-gray-700 text-brand focus:ring-brand cursor-pointer" />
                                    <label htmlFor="is_current" className="text-white select-none cursor-pointer">Present</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Demo Link</label>
                            <input {...register('demo_link')} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">GitHub Link</label>
                            <input {...register('github_link')} className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Image URL (Optional)</label>
                        <input {...register('image_url')} placeholder="https://..." className="w-full p-2 bg-gray-900 rounded border border-gray-700 focus:border-brand outline-none" />
                    </div>

                    {/* Dynamic Arrays */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Technologies */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Technologies</label>
                            <div className="space-y-2">
                                {techFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <input {...register(`technologies.${index}.value`)} className="flex-1 p-2 bg-gray-900 rounded border border-gray-700" placeholder="e.g. React" />
                                        <button type="button" onClick={() => removeTech(index)} className="p-2 text-red-500 hover:bg-gray-700 rounded"><Trash size={16} /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => appendTech({ value: '' })} className="flex items-center gap-1 text-sm text-brand hover:underline">
                                    <Plus size={14} /> Add Technology
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" {...register('featured')} id="featured" className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-brand focus:ring-brand" />
                        <label htmlFor="featured" className="text-white select-none">Featured Project</label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        {editingId && (
                            <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition">
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="px-6 py-3 bg-brand text-black font-bold rounded-lg hover:bg-yellow-500 transition shadow-lg shadow-brand/20">
                            {editingId ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectsAdmin;
