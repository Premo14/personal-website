import { useEffect, useState } from 'react';
import ResumeForm from '@/components/resume/ResumeForm';
import { ResumePDF } from '@/components/resume/ResumePDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumeData from '@/models/ResumeData';
import {API_URL} from "@/API_URL.ts";

export default function Resume() {
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [adminOpen, setAdminOpen] = useState(false);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await fetch(`${API_URL}/resume`);
                const data = await response.json();

                const parseDate = (range: string) => {
                    const [startStr, endStr] = range.split(' - ');
                    const parse = (str: string) =>
                        str === 'Present' ? new Date() : new Date(Date.parse(`1 ${str}`));
                    return { start: parse(startStr), end: parse(endStr) };
                };

                data.professionalExperience.sort((a: any, b: any) => {
                    const aDates = parseDate(a.dateRange);
                    const bDates = parseDate(b.dateRange);

                    return bDates.end.getTime() - aDates.end.getTime(); // descending by END date
                });


                setResumeData(data);

            } catch (error) {
                console.error('Failed to fetch resume:', error);
            }
        };

        fetchResume();
    }, []);

    return (
        <div className="h-full overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-white scrollbar-track-[#121212]">
            <section className="container mx-auto px-4 py-10 min-h-screen flex flex-col">

                {/* Buttons */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-4">
                        {resumeData && (
                            <PDFDownloadLink
                                document={<ResumePDF data={resumeData} />}
                                fileName="Anthony_Premo_Resume.pdf"
                                className="px-3 py-1 text-sm border border-brand text-brand rounded-md hover:bg-brand hover:text-white transition"
                            >
                                {({ loading }) => (loading ? 'Preparing...' : 'Print to PDF')}
                            </PDFDownloadLink>
                        )}

                        <button
                            onClick={() => setAdminOpen(true)}
                            className="px-3 py-1 text-sm border border-accent text-accent rounded-md hover:bg-accent hover:text-black transition invert dark:invert-0"
                        >
                            Admin
                        </button>
                    </div>
                </div>

                {/* Resume Content */}
                {resumeData ? (
                    <div className="mt-8 space-y-8 text-sm sm:text-base">

                        {/* Technical Skills */}
                        <section>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-brand uppercase">
                                Technical Skills
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(resumeData.technicalSkills).map(([category, skills]) => (
                                    <div key={category}>
                                        <h3 className="font-semibold text-brand text-base sm:text-lg">
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </h3>
                                        <p>{skills}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Professional Experience */}
                        <section>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-brand uppercase">
                                Professional Experience
                            </h2>
                            {resumeData.professionalExperience.map((exp, idx) => (
                                <div key={idx} className="mb-6">
                                    <h3 className="font-semibold text-brand text-base sm:text-lg">
                                        {exp.title} @ {exp.company} ({exp.location})
                                    </h3>
                                    <p className="italic text-xs sm:text-sm">{exp.dateRange}</p>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {exp.bullets.map((bullet, bulletIdx) => (
                                            <li key={bulletIdx}>{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        {/* Projects */}
                        <section>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-brand uppercase">
                                Projects
                            </h2>
                            {resumeData.projects.map((proj, idx) => (
                                <div key={idx} className="mb-4">
                                    <h3 className="font-semibold text-brand text-base sm:text-lg">
                                        {proj.name}
                                    </h3>
                                    <p>{proj.description}</p>
                                </div>
                            ))}
                        </section>

                        {/* Education */}
                        <section>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-brand uppercase">
                                Education
                            </h2>
                            {resumeData.education.map((edu, idx) => (
                                <div key={idx} className="mb-4">
                                    <h3 className="font-semibold text-brand text-base sm:text-lg">
                                        {edu.institution}
                                    </h3>
                                    <p>{edu.degree}</p>
                                </div>
                            ))}
                        </section>
                    </div>
                ) : (
                    <div className="text-center text-textMuted italic mt-10 text-sm sm:text-base">
                        Loading resume...
                    </div>
                )}

                <ResumeForm isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
            </section>
        </div>
    );
}
