import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Using standard PDF fonts (Helvetica) for consistent rendering across environments.

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.4,
        paddingBottom: 20,
    },
    header: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 5,
        alignItems: 'center',
    },
    name: {
        fontSize: 22, // Reduced from 24 to be safe
        fontWeight: 'bold',
        marginBottom: 10, // Increased from 4 to fix overlap
        textTransform: 'uppercase',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        fontSize: 9,
        marginBottom: 2,
    },
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        marginBottom: 4,
        paddingBottom: 2,
        textTransform: 'uppercase',
        color: '#222',
        letterSpacing: 1,
    },
    // Skills
    skillCategory: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    skillCategoryName: {
        fontWeight: 'bold',
        width: 100,
        fontSize: 10,
    },
    skillList: {
        flex: 1,
        fontSize: 10,
    },
    // Experience & Projects
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: 11,
    },
    entrySubtitle: {
        fontStyle: 'italic',
        fontSize: 10,
    },
    entryDate: {
        fontSize: 10,
        textAlign: 'right',
    },
    description: {
        marginLeft: 0,
        fontSize: 10,
        color: '#333',
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 1,
        marginLeft: 8,
    },
    bullet: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
    }
});

type ResumeProps = {
    skills: any[]; // SkillCategory[]
    experience: any[]; // Experience[]
    projects: any[]; // Project[]
    education: any[]; // Education[]
};

const ResumePDF = ({ skills, experience, projects, education }: ResumeProps) => {
    // Helper for formatting dates
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Helper for formatting skill lists
    const getSkillString = (skills: any[]) => (skills || []).map(s => s.name).join(', ');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>Anthony Premo</Text>
                    <View style={styles.contactRow}>
                        <Link src="mailto:ajaipremo@gmail.com">ajaipremo@gmail.com</Link>
                        <Text>|</Text>
                        <Text>(518) 481-4204</Text>
                        <Text>|</Text>
                        <Link src="https://linkedin.com/in/anthony-premo">linkedin.com/in/anthony-premo</Link>
                        <Text>|</Text>
                        <Link src="https://github.com/premo14">github.com/premo14</Link>
                        <Text>|</Text>
                        <Link src="https://anthonypremo.com">anthonypremo.com</Link>
                    </View>
                </View>

                {/* Technical Skills */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technical Skills</Text>
                    {skills.map((cat) => (
                        <View key={cat.ID} style={styles.skillCategory}>
                            <Text style={styles.skillCategoryName}>{cat.name}:</Text>
                            <Text style={styles.skillList}>{getSkillString(cat.skills)}</Text>
                        </View>
                    ))}
                </View>

                {/* Professional Experience */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Professional Experience</Text>
                    {experience.map((exp) => (
                        <View key={exp.ID} style={{ marginBottom: 4 }}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{exp.company}</Text>
                                <Text style={styles.entryDate}>
                                    {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                                </Text>
                            </View>
                            <View style={{ ...styles.entryHeader, marginBottom: 2 }}>
                                <Text style={styles.entrySubtitle}>{exp.role}</Text>
                                <Text style={styles.entrySubtitle}>{exp.location}</Text>
                            </View>
                            {/* Naive markdown-like parsing: split by newlines for bullet points if they exist, otherwise text */}
                            {exp.description.split('\n').filter((l: string) => l.trim().length > 0).map((line: string, i: number) => {
                                const isBullet = line.trim().startsWith('*') || line.trim().startsWith('-');
                                const text = isBullet ? line.trim().substring(1).trim() : line.trim();
                                return isBullet ? (
                                    <View key={i} style={styles.bulletPoint}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{text}</Text>
                                    </View>
                                ) : (
                                    <Text key={i} style={{ ...styles.description, marginBottom: 2 }}>{text}</Text>
                                );
                            })}
                        </View>
                    ))}
                </View>

                {/* Projects */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>
                    {projects.filter(p => p.featured).map((proj) => (
                        <View key={proj.ID} style={{ marginBottom: 4 }}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{proj.title}</Text>
                            </View>
                            <Text style={{ ...styles.description, marginBottom: 1 }}>{proj.short_description}</Text>
                            <Text style={{ ...styles.description, color: '#555', fontSize: 7 }}>
                                <Text style={{ fontWeight: 'bold' }}>Tech Stack: </Text>
                                {proj.technologies ? proj.technologies.join(', ') : ''}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Education */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {education.map((edu) => (
                        <View key={edu.ID} style={{ marginBottom: 6 }}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{edu.institution}</Text>
                                <Text style={styles.entryDate}>
                                    {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                                </Text>
                            </View>
                            <Text style={styles.entrySubtitle}>{edu.title} {edu.type !== 'Degree' ? `(${edu.type})` : ''}</Text>
                        </View>
                    ))}
                </View>

            </Page>
        </Document>
    );
};

export default ResumePDF;
