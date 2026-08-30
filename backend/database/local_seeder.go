package database

import (
	"log"
	"time"

	"github.com/premo14/personal-website/backend/models"
	"gorm.io/gorm"
)

func SeedLocalContent(db *gorm.DB) {
	log.Println("Checking for existing content...")

	getDate := func(dateStr string) *time.Time {
		t, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			return nil
		}
		return &t
	}
	mustParse := func(dateStr string) time.Time {
		t, _ := time.Parse("2006-01-02", dateStr)
		return t
	}

	// 1. About Me
	log.Println("Syncing About Me...")
	var about models.AboutMe
	if err := db.First(&about).Error; err != nil {
		about = models.AboutMe{}
		db.Create(&about)
	}
	about.Title = "Software Engineer & Systems Architect"
	about.Content = `I am a Software Engineer and Systems Architect based in New York, specializing in building robust, scalable applications from the ground up. My approach to software development is deeply rooted in logic and systems thinking—I don't just write code to get the job done; I architect solutions that represent the absolute best approach to complex problems.

I am naturally laid-back and collaborative, bringing a calm, analytical perspective to fast-paced engineering environments. I pride myself on my ability to step into another person's shoes, viewing challenges from all angles to design systems that are as user-centric as they are technically sound.

Currently, I operate as a lead developer across multiple contracts, architecting everything from robust Go microservices to dynamic cross-platform applications. Whether I'm designing complex data ingestion pipelines, integrating local LLMs, or modernizing municipal infrastructure, my focus remains constant: delivering exceptionally engineered, high-performance software.`
	db.Save(&about)

	// 2. Skills
	log.Println("Syncing Skills...")
	db.Exec("DELETE FROM skills")
	db.Exec("DELETE FROM skill_categories")

	languagesBackend := models.SkillCategory{
		Name:       "Languages & Backend",
		OrderIndex: 1,
		Skills: []models.Skill{
			{Name: "Go (Golang)"},
			{Name: "TypeScript"},
			{Name: "Dart"},
			{Name: "Node.js"},
			{Name: "Fiber"},
			{Name: "GORM"},
			{Name: "REST APIs"},
			{Name: "SQL"},
		},
	}
	db.Create(&languagesBackend)

	frontendMobile := models.SkillCategory{
		Name:       "Frontend & Mobile",
		OrderIndex: 2,
		Skills: []models.Skill{
			{Name: "React"},
			{Name: "Flutter"},
			{Name: "Tailwind CSS"},
			{Name: "Vite"},
		},
	}
	db.Create(&frontendMobile)

	cloudDevopsDatabases := models.SkillCategory{
		Name:       "Cloud & DevOps",
		OrderIndex: 3,
		Skills: []models.Skill{
			{Name: "AWS"},
			{Name: "GCP"},
			{Name: "Docker"},
			{Name: "Terraform"},
			{Name: "Linux / Bash"},
			{Name: "PostgreSQL"},
			{Name: "SQLite"},
		},
	}
	db.Create(&cloudDevopsDatabases)

	architectureSecurity := models.SkillCategory{
		Name:       "Architecture & AI",
		OrderIndex: 4,
		Skills: []models.Skill{
			{Name: "System Architecture"},
			{Name: "Local AI (Ollama)"},
			{Name: "Offensive Security (CPTS)"},
		},
	}
	db.Create(&architectureSecurity)

	// 3. Experience
	log.Println("Syncing Experience...")
	db.Exec("DELETE FROM experiences")

	exp1 := models.Experience{
		Company:     "UpNCoding",
		Role:        "Lead Software Engineer (Contract)",
		StartDate:   mustParse("2024-05-01"),
		EndDate:     nil,
		Location:    "Remote",
		CompanyLink: "https://upncoding.com",
		Overview:    "Leading end-to-end technical architecture and development for regional B2G (Business-to-Government) and municipal contracts.",
		Description: `* Acted as the primary technical authority, managing client relations, requirement gathering, and infrastructure design for high-stakes municipal projects.
* Architected scalable data pipelines and secure web services on Google Cloud Platform and AWS to consistently support thousands of daily active users.
* Established comprehensive CI/CD workflows and Docker containerization to streamline zero-downtime deployments and clean client handoffs.
* Championed strict adherence to ADA compliance and federal accessibility standards across all public-facing deliverables.`,
	}
	db.Create(&exp1)

	exp2 := models.Experience{
		Company:     "Limitless Hoops",
		Role:        "Principal Software Engineer",
		StartDate:   mustParse("2024-01-01"),
		EndDate:     nil,
		Location:    "Remote",
		CompanyLink: "https://limitlesshoops.com",
		Overview:    "Spearheading the technical architecture of a specialized booking and management ecosystem for a high-growth youth basketball organization.",
		Description: `* Driving the overarching technical vision and product roadmap, focusing on replacing fragmented legacy tools with a centralized, proprietary ecosystem.
* Enforcing strict cybersecurity mandates and federal COPPA compliance through advanced Role-Based Access Control (RBAC) and secure architecture.
* Designing scalable multi-tenant infrastructure to reliably support dynamic web content, critical system state controls, and high-volume transaction processing.
* Collaborating closely with organizational leadership to prioritize technical debt reduction and immediate-value feature delivery.`,
	}
	db.Create(&exp2)

	exp3 := models.Experience{
		Company:     "Reflex Technologies LLC",
		Role:        "Software Engineer (Contract)",
		StartDate:   mustParse("2026-01-01"),
		EndDate:     nil,
		Location:    "Remote",
		CompanyLink: "https://reflexny.com/",
		Overview:    "Developing a cutting-edge Single Entry Booking System enhanced by local Artificial Intelligence and OCR.",
		Description: `* Leading the research and implementation of offline Large Language Models (LLMs) to heavily automate and optimize traditional financial workflows.
* Architecting a highly secure, privacy-first software environment ensuring sensitive financial data is processed entirely on the local network.
* Bridging the gap between complex machine learning pipelines and intuitive, user-friendly frontend interfaces.
* Defining core data schemas and microservice boundaries to ensure the application remains robust and extensible for future AI integrations.`,
	}
	db.Create(&exp3)

	// 4. Projects (Linked to Experience)
	log.Println("Syncing Projects...")
	db.Exec("DELETE FROM projects")

	p1 := models.Project{
		Title:            "ADK Rail Trail App",
		ShortDescription: "Cross-platform mobile guide for the 34-mile Adirondack Rail Trail.",
		Overview:         "A robust mobile application delivering offline navigation and dynamic event data for regional tourism.",
		Description: `* Engineered a custom JSON transformer service in Go to process complex relational data into highly optimized, flattened JSON structures.
* Implemented a reliable twice-daily synchronization system via GCP Buckets, enabling fully offline capabilities with OpenStreetMap (OSM) data.
* Integrated Google Maps APIs for real-time tracking and dynamic map drawing.`,
		Technologies: models.JSONStringArray{"Flutter", "Dart", "Go", "GCP", "OSM", "Google Maps API"},
		StartDate:    mustParse("2025-04-01"),
		EndDate:      nil,
		ExperienceID: &exp1.ID,
		DemoLink:     "https://apps.apple.com/ca/app/adk-rail-trail/id6753904870",
		Featured:     true,
		ShowOnResume: true,
		OrderIndex:   1,
	}
	db.Create(&p1)

	p2 := models.Project{
		Title:            "Reflex AI Bookkeeping",
		ShortDescription: "AI-powered single entry booking system.",
		Overview:         "An intelligent bookkeeping application leveraging local LLMs and OCR for automated financial data processing.",
		Description: `* Built a high-performance backend using Go and Fiber to handle complex data ingestion.
* Integrated Tesseract OCR to accurately extract text from raw financial documents.
* Orchestrated local Llama 3.1 (8B) models via Ollama to intelligently parse, categorize, and format extracted financial data automatically.`,
		Technologies: models.JSONStringArray{"Go", "Fiber", "React", "Ollama", "Llama 3.1", "Tesseract OCR"},
		StartDate:    mustParse("2026-01-01"),
		EndDate:      nil,
		ExperienceID: &exp3.ID,
		Featured:     true,
		ShowOnResume: true,
		OrderIndex:   2,
	}
	db.Create(&p2)

	p3 := models.Project{
		Title:            "Limitless Hoops Engine",
		ShortDescription: "Custom scheduling and booking platform for youth sports.",
		Overview:         "A streamlined scheduling ecosystem designed to replace costly third-party booking services.",
		Description: `* Architected a highly responsive Single Page Application (SPA) utilizing React, Vite, and TailwindCSS.
* Engineered a secure, scalable backend using Go, Fiber, and GORM to manage complex scheduling logic and multi-tenant data.
* Focused heavily on user experience and system reliability to support a rapidly growing client base.`,
		Technologies: models.JSONStringArray{"React", "TypeScript", "TailwindCSS", "Go", "Fiber", "GORM"},
		StartDate:    mustParse("2024-01-01"),
		EndDate:      nil,
		ExperienceID: &exp2.ID,
		Featured:     true,
		ShowOnResume: true,
		OrderIndex:   3,
	}
	db.Create(&p3)

	p4 := models.Project{
		Title:            "Franklin County Community Services",
		ShortDescription: "ADA-compliant government digital infrastructure.",
		Overview:         "A comprehensive modernization of a critical county government web portal, engineered for high performance and universal accessibility.",
		Description: `* Spearheaded the complete architectural redesign and modernization of the critical county government web portal using React and TypeScript.
* Replaced outdated municipal infrastructure with a highly responsive, modern web experience.
* Placed major technical focus on strict ADA and WCAG web accessibility compliance, ensuring public health resources and services are navigable for all residents.`,
		Technologies: models.JSONStringArray{"React", "TypeScript", "HTML", "Tailwind CSS"},
		StartDate:    mustParse("2025-11-01"),
		EndDate:      getDate("2026-09-01"),
		ExperienceID: &exp1.ID,
		DemoLink:     "https://verdant-piroshki-a0f229.netlify.app/",
		Featured:     true,
		ShowOnResume: false,
		OrderIndex:   4,
	}
	db.Create(&p4)

	p5 := models.Project{
		Title:            "Sustainability Toolkit",
		ShortDescription: "Interactive educational guide for environmental initiatives.",
		Overview:         "A high-performance Single Page Application (SPA) built to educate regional residents on municipal sustainability and environmental initiatives.",
		Description: `* Engineered a high-performance Single Page Application (SPA) educating regional residents on municipal sustainability practices.
* Architected the frontend from the ground up using React and TypeScript, prioritizing load times and strict ADA / Section 508 accessibility compliance.
* Translated complex municipal requirements from the B2G contract into a clean, modern, and engaging user interface.`,
		Technologies: models.JSONStringArray{"React", "TypeScript", "Tailwind CSS"},
		StartDate:    mustParse("2025-11-01"),
		EndDate:      getDate("2026-09-01"),
		ExperienceID: &exp1.ID,
		DemoLink:     "https://franklin-sustainability-toolkit.netlify.app/",
		Featured:     true,
		ShowOnResume: false,
		OrderIndex:   5,
	}
	db.Create(&p5)

	// 5. Education
	log.Println("Syncing Education...")
	db.Exec("DELETE FROM educations")

	edu1 := models.Education{
		Institution: "Southern New Hampshire University",
		Title:       "B.S. in Computer Science (Software Engineering Focus)",
		StartDate:   mustParse("2021-08-01"),
		EndDate:     getDate("2024-08-01"),
		Type:        "Degree",
		Description: "Graduated with a focus on advanced software engineering principles, algorithms, and full-stack systems architecture. Completed the degree entirely online, demonstrating strong self-discipline and time management.",
	}
	db.Create(&edu1)

	edu2 := models.Education{
		Institution: "UpNCoding",
		Title:       "Software Development Bootcamp",
		StartDate:   mustParse("2023-05-01"),
		EndDate:     getDate("2023-08-01"),
		Type:        "Certificate",
		Description: "Completed a comprehensive 12-week intensive program focusing on the Go ecosystem, Docker, Linux, TDD, Agile methodologies, SQL, and AWS cloud infrastructure.",
	}
	db.Create(&edu2)

	edu3 := models.Education{
		Institution: "Hack The Box",
		Title:       "CPTS Coursework (Penetration Testing)",
		StartDate:   mustParse("2026-01-01"),
		EndDate:     getDate("2026-06-01"),
		Type:        "Training",
		Description: "Completed rigorous coursework for the Certified Penetration Testing Specialist (CPTS) track, gaining deep practical knowledge of offensive security, vulnerability assessment, and secure systems architecture.",
	}
	db.Create(&edu3)

	// 6. Hero Section
	log.Println("Syncing Hero Section...")
	var hero models.HeroSection
	if err := db.First(&hero).Error; err != nil {
		hero = models.HeroSection{}
		db.Create(&hero)
	}
	hero.Title = "Anthony Premo"
	hero.Subtitle = "Software Engineer & Systems Architect"
	hero.CTAText = "View My Work"
	hero.CTALink = "projects"
	db.Save(&hero)

	log.Println("Local content seeding complete.")
}
