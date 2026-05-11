import { useQuery, useMutation } from '@tanstack/react-query';
import { PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import ResumePDF from '../../components/ResumePDF';
import api from '@/api/client';
import { Upload, AlertTriangle, Download } from 'lucide-react';
import { useState } from 'react';

const ResumeAdmin = () => {
    const [isReplacing, setIsReplacing] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Fetch all necessary data
    const { data: skills } = useQuery({ queryKey: ['skills'], queryFn: async () => (await api.get('/public/skills')).data || [] });
    const { data: experience } = useQuery({ queryKey: ['experience'], queryFn: async () => (await api.get('/public/experience')).data || [] });
    const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: async () => (await api.get('/public/projects')).data || [] });
    const { data: education } = useQuery({ queryKey: ['education'], queryFn: async () => (await api.get('/public/education')).data || [] });

    // Define the component instance once to reuse
    const MyDoc = (
        <ResumePDF
            skills={skills || []}
            experience={experience || []}
            projects={projects || []}
            education={education || []}
        />
    );

    const replaceResumeMutation = useMutation({
        mutationFn: async (blob: Blob) => {
            const formData = new FormData();
            formData.append('resume', blob, 'resume_apremo.pdf');
            return api.post('/admin/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            setFeedbackMsg({ type: 'success', text: 'Live resume replaced successfully!' });
            setIsReplacing(false);
            setTimeout(() => setFeedbackMsg(null), 5000);
        },
        onError: (err: any) => {
            console.error('Upload error:', err);
            setFeedbackMsg({ type: 'error', text: 'Failed to replace resume: ' + (err.response?.data?.error || err.message) });
            setIsReplacing(false);
        }
    });

    const handleReplace = async (blob: Blob | null) => {
        if (!blob) {
            setFeedbackMsg({ type: 'error', text: 'PDF not generated yet.' });
            return;
        }
        if (!confirm('Are you sure you want to replace the live resume on the server with this generated version?')) return;

        setIsReplacing(true);
        setFeedbackMsg(null);
        console.log('Starting resume upload...');
        try {
            console.log('PDF Blob ready, size:', blob.size);
            replaceResumeMutation.mutate(blob);
        } catch (e) {
            console.error('Upload initiation failed:', e);
            setFeedbackMsg({ type: 'error', text: 'Upload failed. Check console.' });
            setIsReplacing(false);
        }
    };

    if (!skills || !experience || !projects || !education) return <div className="text-white">Loading data...</div>;

    return (
        <div className="h-full flex flex-col text-white">
            <BlobProvider document={MyDoc}>
                {({ blob, url, loading }) => (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Resume Generator</h1>
                            <div className="flex gap-4 items-center">
                                {feedbackMsg && (
                                    <span className={`text-sm font-bold ${feedbackMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                        {feedbackMsg.text}
                                    </span>
                                )}

                                <PDFDownloadLink document={MyDoc} fileName="resume_apremo.pdf" className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 font-bold transition">
                                    {loading ? 'Loading...' : <><Download size={20} /> Download PDF</>}
                                </PDFDownloadLink>

                                <button
                                    onClick={() => handleReplace(blob)}
                                    disabled={isReplacing || loading}
                                    className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-500 font-bold transition disabled:opacity-50"
                                >
                                    {isReplacing ? 'Uploading...' : <><Upload size={20} /> Replace Live Resume</>}
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg flex-1 min-h-[600px] border border-gray-700 flex flex-col">
                            <div className="flex items-center gap-2 mb-4 text-yellow-400 bg-yellow-400/10 p-3 rounded">
                                <AlertTriangle size={20} />
                                <p className="text-sm">This is a live preview based on your current website data.</p>
                            </div>

                            <div className="flex-1 w-full h-full relative">
                                {loading && <div className="absolute inset-0 flex items-center justify-center text-white">Generating PDF...</div>}
                                {url && (
                                    <iframe
                                        src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
                                        width="100%"
                                        height="100%"
                                        className="rounded border-none w-full h-full"
                                        title="Resume Preview"
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </BlobProvider>
        </div>
    );
};

export default ResumeAdmin;
