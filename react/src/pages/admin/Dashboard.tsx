import { useState } from 'react';
import api from '@/api/client';

const Dashboard = () => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('resume', e.target.files[0]);

        setUploading(true);
        try {
            await api.post('/admin/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Resume uploaded successfully!');
        } catch (err) {
            alert('Failed to upload resume.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-6">Dashboard</h1>
            <p className="text-gray-400 mb-8">Welcome to the content management system.</p>

            <div className="bg-gray-800 p-6 rounded-lg max-w-md">
                <h2 className="text-xl font-bold text-white mb-4">Update Resume (PDF)</h2>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-brand file:text-black
                      hover:file:bg-yellow-500
                    "
                />
                {uploading && <p className="text-sm text-yellow-500 mt-2">Uploading...</p>}
            </div>
        </div>
    );
};

export default Dashboard;
