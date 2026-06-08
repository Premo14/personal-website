import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Using standard PDF fonts (Helvetica) for consistent rendering across environments.

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 14.4, // 0.2in
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.2,
        paddingBottom: 14.4,
    },
    header: {
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textTransform: 'uppercase',
        color: '#000000',
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        fontSize: 9,
        marginBottom: 1,
        color: '#000000',
    },
    link: {
        color: '#0000FF',
        textDecoration: 'underline',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        marginBottom: 4,
        paddingBottom: 2,
        textTransform: 'uppercase',
        color: '#000000',
    },
    // Skills
    skillCategory: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    skillCategoryName: {
        fontWeight: 'bold',
        width: 160,
        fontSize: 10,
        color: '#000000',
    },
    skillList: {
        flex: 1,
        fontSize: 10,
        color: '#000000',
    },
    // Experience & Projects
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#000000',
    },
    entrySubtitle: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 10,
        color: '#000000',
    },
    entryDate: {
        fontSize: 10,
        textAlign: 'right',
        color: '#000000',
    },
    description: {
        fontSize: 10,
        color: '#000000',
        marginBottom: 2,
    },
    overview: {
        fontSize: 10,
        fontStyle: 'italic',
        marginBottom: 2,
        color: '#000000',
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 2,
        marginLeft: 10,
    },
    bullet: {
        width: 8,
        fontSize: 10,
        color: '#000000',
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        color: '#000000',
    },
    projectTech: {
        fontSize: 10,
        color: '#000000',
        marginBottom: 2,
    }
});

type ResumeProps = {
    skills: any[];
    experience: any[];
    projects: any[];
    education: any[];
};

const ResumePDF = ({ skills, experience, projects, education }: ResumeProps) => {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const getSkillString = (skills: any[]) => (skills || []).map(s => s.name).join(', ');

    const renderDescription = (desc: string) => {
        if (!desc) return null;
        return desc.split('\n').filter((l: string) => l.trim().length > 0).map((line: string, i: number) => {
            const isBullet = line.trim().startsWith('*') || line.trim().startsWith('-');
            const text = isBullet ? line.trim().substring(1).trim() : line.trim();
            return isBullet ? (
                <View key={i} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{text}</Text>
                </View>
            ) : (
                <Text key={i} style={styles.description}>{text}</Text>
            );
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>Anthony Premo</Text>
                    <View style={styles.contactRow}>
                        <Link style={styles.link} src="mailto:ajaipremo@gmail.com">ajaipremo@gmail.com</Link>
                        <Text>|</Text>
                        <Link style={styles.link} src="https://linkedin.com/in/anthony-premo">LinkedIn</Link>
                        <Text>|</Text>
                        <Link style={styles.link} src="https://github.com/premo14">GitHub</Link>
                        <Text>|</Text>
                        <Link style={styles.link} src="https://anthonypremo.com">Personal Website</Link>
                    </View>
                </View>

                {/* Skills */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    {skills.map((cat: any) => (
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
                        <View key={exp.ID} style={{ marginBottom: 10 }}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{exp.company}</Text>
                                <Text style={styles.entryDate}>
                                    {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                                </Text>
                            </View>
                            <View style={{ ...styles.entryHeader, marginBottom: 2 }}>
                                <Text style={styles.entrySubtitle}>{exp.role} ({exp.location})</Text>
                            </View>
                            {renderDescription(exp.description)}
                        </View>
                    ))}
                </View>

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {projects.map((proj) => (
                            <View key={proj.ID} style={{ marginBottom: 10 }}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>{proj.title}</Text>
                                    <Text style={styles.entryDate}>
                                        {formatDate(proj.start_date)} - {proj.end_date ? formatDate(proj.end_date) : 'Present'}
                                    </Text>
                                </View>
                                {proj.overview && <Text style={styles.overview}>{proj.overview}</Text>}
                                {renderDescription(proj.description)}
                                {proj.technologies && proj.technologies.length > 0 && (
                                    <Text style={styles.projectTech}><Text style={{ fontWeight: 'bold' }}>Tools:</Text> {proj.technologies.join(', ')}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {education.map((edu) => (
                        <View key={edu.ID} style={{ marginBottom: 8 }}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{edu.institution}</Text>
                            </View>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entrySubtitle}>{edu.title}</Text>
                                <Text style={styles.entryDate}>
                                    {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};


export default ResumePDF;
