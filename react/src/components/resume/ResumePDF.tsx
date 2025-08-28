import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import ResumeData from "../../models/ResumeData";

interface ResumePDFProps {
    data: ResumeData;
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: "Helvetica",
        lineHeight: 1.5,
    },
    section: {
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subheader: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 6,
        marginTop: 10,
    },
    bullet: {
        marginLeft: 10,
    },
});

function renderSkillsLine(ts: any): string {
    if (Array.isArray(ts)) {
        return ts.join(", ");
    }
    if (ts && typeof ts === "object") {
        try {
            return Object.entries(ts)
                .map(([k, v]) => `${k}: ${String(v)}`)
                .join(" | ");
        } catch {
            return "";
        }
    }
    return "";
}

export function ResumePDF({ data }: ResumePDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.header}>Anthony Premo</Text>
                    <Text>
                        ajaipremo@gmail.com | premsanity.com | linkedin.com/in/anthony-premo
                        | github.com/premo14
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.header}>Technical Skills</Text>
                    <Text>{renderSkillsLine((data as any).technicalSkills)}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.header}>Professional Experience</Text>
                    {data.professionalExperience.map((exp, idx) => (
                        <View key={idx} style={styles.section}>
                            <Text style={styles.subheader}>
                                {exp.title} | {exp.company} ({exp.location})
                            </Text>
                            <Text style={{ fontSize: 10 }}>{exp.dateRange}</Text>
                            {exp.bullets.map((bullet, bulletIdx) => (
                                <Text key={bulletIdx} style={styles.bullet}>
                                    • {bullet}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.header}>Projects</Text>
                    {data.projects.map((proj, idx) => (
                        <View key={idx}>
                            <Text style={styles.subheader}>{proj.name}</Text>
                            <Text>{proj.description}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.header}>Education</Text>
                    {data.education.map((edu, idx) => (
                        <Text key={idx}>
                            {edu.degree} | {edu.institution}
                        </Text>
                    ))}
                </View>
            </Page>
        </Document>
    );
}
