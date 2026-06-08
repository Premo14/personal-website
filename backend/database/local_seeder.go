package database

import (
	"log"
	"time"

	"github.com/premo14/personal-website/backend/models"
	"gorm.io/gorm"
)

func SeedLocalContent(db *gorm.DB) {
	var count int64
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
		about = models.AboutMe{
			Title: "Principal Software Engineer & Systems Architect",
			Content: `I’m a software engineer who balances a pragmatic, highly collaborative personality with a relentless drive to ship high-quality, impactful code.

With a deep background in end-to-end technical architecture, I specialize in building scalable systems from the ground up. Whether I’m architecting high-concurrency microservices in Go, crafting cross-platform mobile apps in Flutter, or diving into offensive security with my CPTS certification, my focus is always on engineering tools that solve real-world problems. I currently oversee development for regional B2G (Business-to-Government) contracts and serve as the Principal Engineer for a high-growth sports-tech startup, so I’m just as comfortable translating requirements in a stakeholder meeting as I am deep in the codebase.

I approach software engineering with a straightforward philosophy: prioritize security from day one, eliminate unnecessary complexity, and build systems meant to last.`,
		}
		db.Create(&about)
	} else {
		about.Title = "Principal Software Engineer & Systems Architect"
		about.Content = `I’m a software engineer who balances a pragmatic, highly collaborative personality with a relentless drive to ship high-quality, impactful code.

With a deep background in end-to-end technical architecture, I specialize in building scalable systems from the ground up. Whether I’m architecting high-concurrency microservices in Go, crafting cross-platform mobile apps in Flutter, or diving into offensive security with my CPTS certification, my focus is always on engineering tools that solve real-world problems. I currently oversee development for regional B2G (Business-to-Government) contracts and serve as the Principal Engineer for a high-growth sports-tech startup, so I’m just as comfortable translating requirements in a stakeholder meeting as I am deep in the codebase.

I approach software engineering with a straightforward philosophy: prioritize security from day one, eliminate unnecessary complexity, and build systems meant to last.`
		db.Save(&about)
	}

	// 2. Skills
	db.Model(&models.SkillCategory{}).Count(&count)
	if count == 0 {
		log.Println("Seeding Skills...")

		languages := models.SkillCategory{
			Name:       "Languages",
			OrderIndex: 1,
			Skills: []models.Skill{
				{Name: "Go (Golang)"}, {Name: "TypeScript/JavaScript"},
				{Name: "Dart"}, {Name: "SQL"}, {Name: "Bash"},
			},
		}
		db.Create(&languages)

		backend := models.SkillCategory{
			Name:       "Backend",
			OrderIndex: 2,
			Skills: []models.Skill{
				{Name: "Fiber (Go)"}, {Name: "GORM"}, {Name: "Node.js"}, {Name: "Express.js"},
			},
		}
		db.Create(&backend)

		frontendMobile := models.SkillCategory{
			Name:       "Frontend & Mobile",
			OrderIndex: 3,
			Skills: []models.Skill{
				{Name: "React"}, {Name: "Flutter"}, {Name: "Tailwind CSS"},
			},
		}
		db.Create(&frontendMobile)

		databases := models.SkillCategory{
			Name:       "Databases",
			OrderIndex: 4,
			Skills: []models.Skill{
				{Name: "PostgreSQL"}, {Name: "MariaDB"}, {Name: "SQLite"},
			},
		}
		db.Create(&databases)

		cloudDevOps := models.SkillCategory{
			Name:       "Cloud & DevOps",
			OrderIndex: 5,
			Skills: []models.Skill{
				{Name: "AWS"}, {Name: "Docker"}, {Name: "Terraform"},
				{Name: "GitHub Actions"}, {Name: "Linux"},
			},
		}
		db.Create(&cloudDevOps)

		securityArch := models.SkillCategory{
			Name:       "Security & Architecture",
			OrderIndex: 6,
			Skills: []models.Skill{
				{Name: "RBAC (Role-Based Access Control)"}, {Name: "Penetration Testing"},
				{Name: "COPPA Compliance"}, {Name: "System Architecture"},
			},
		}
		db.Create(&securityArch)
	}

	// 3. Experience
	log.Println("Syncing Experience...")
	var exp1 models.Experience
	if err := db.Where("company = ?", "UpNCoding").First(&exp1).Error; err != nil {
		exp1 = models.Experience{
			Company:     "UpNCoding",
			Role:        "Lead Software Engineer",
			StartDate:   mustParse("2024-05-01"),
			EndDate:     nil,
			Location:    "Remote",
			CompanyLink: "https://upncoding.com",
			Overview:    "Led end-to-end technical architecture and development for regional B2G (Business-to-Government) and municipal contracts, acting as the sole technical authority for a fast-paced development agency.",
			Description: `* Collaborated directly with external stakeholders and government officials to translate complex business requirements into scalable product roadmaps and technical specifications.
* Architected and delivered multiple production-ready platforms utilizing React, TypeScript, and Flutter, modernizing legacy infrastructure and launching greenfield digital initiatives.`,
		}
		db.Create(&exp1)
	} else {
		exp1.Role = "Lead Software Engineer"
		exp1.Overview = "Led end-to-end technical architecture and development for regional B2G (Business-to-Government) and municipal contracts, acting as the sole technical authority for a fast-paced development agency."
		exp1.Description = `* Collaborated directly with external stakeholders and government officials to translate complex business requirements into scalable product roadmaps and technical specifications.
* Architected and delivered multiple production-ready platforms utilizing React, TypeScript, and Flutter, modernizing legacy infrastructure and launching greenfield digital initiatives.`
		db.Save(&exp1)
	}

	var exp2 models.Experience
	if err := db.Where("company = ?", "Limitless Hoops").First(&exp2).Error; err != nil {
		exp2 = models.Experience{
			Company:     "Limitless Hoops",
			Role:        "Principal Software Engineer",
			StartDate:   mustParse("2025-04-01"),
			EndDate:     nil,
			Location:    "Remote",
			CompanyLink: "https://limitlesshoops.com",
			Overview:    "Spearheading the technical architecture of a comprehensive, multi-tenant software ecosystem for a high-growth youth basketball startup, focusing on security, compliance, and scalable cross-platform delivery.",
			Description: `* Architected a comprehensive, cross-platform administrative ecosystem using Flutter and Dart, centralizing database management, dynamic web content, and critical system state controls.
* Engineered backend infrastructure with a strict mandate on cybersecurity and federal COPPA compliance, implementing advanced Role-Based Access Control (RBAC) and emergency system switches.
* Developed and integrated a scalable, multi-channel notification engine (In-App, Email, SMS) and an internal employee mail client to streamline corporate communications.
* Built and deployed a high-performance, SEO-optimized consumer landing page utilizing React and JavaScript to drive initial user acquisition and brand visibility.`,
		}
		db.Create(&exp2)
	} else {
		exp2.Role = "Principal Software Engineer"
		exp2.Overview = "Spearheading the technical architecture of a comprehensive, multi-tenant software ecosystem for a high-growth youth basketball startup, focusing on security, compliance, and scalable cross-platform delivery."
		exp2.Description = `* Architected a comprehensive, cross-platform administrative ecosystem using Flutter and Dart, centralizing database management, dynamic web content, and critical system state controls.
* Engineered backend infrastructure with a strict mandate on cybersecurity and federal COPPA compliance, implementing advanced Role-Based Access Control (RBAC) and emergency system switches.
* Developed and integrated a scalable, multi-channel notification engine (In-App, Email, SMS) and an internal employee mail client to streamline corporate communications.
* Built and deployed a high-performance, SEO-optimized consumer landing page utilizing React and JavaScript to drive initial user acquisition and brand visibility.`
		db.Save(&exp2)
	}

	// 4. Projects (Linked to Experience)
	log.Println("Syncing Projects...")
	var upnExp models.Experience
	db.Where("company = ?", "UpNCoding").First(&upnExp)
	var p1 models.Project
	if err := db.Where("title = ?", "Roost ADK Rail Trail App").First(&p1).Error; err != nil {
		p1 = models.Project{
			Title:            "Roost ADK Rail Trail App",
			ShortDescription: "Cross-platform mobile application for Northern Adirondack tourism.",
			Overview:         "A cross-platform mobile application delivering real-time navigation, dynamic event data, and offline trail maps for the 34-mile Adirondack Rail Trail.",
			Description: `* Developed in partnership with the Regional Office of Sustainable Tourism (ROOST) as the official digital guide for the 34-mile Adirondack Rail Trail.
* Integrated custom Google Maps and OpenStreetMap APIs to deliver robust offline caching and real-time GPS tracking in remote areas.
* Implemented a dynamic data ingestion pipeline via client-managed JSON endpoints to seamlessly update live events and directories without app store updates.
* Successfully supported nearly 1,000 concurrent users within weeks of launch while maintaining a perfect 5.0 rating on the iOS App Store.`,
			Technologies: models.JSONStringArray{"Flutter", "Dart", "Go", "AWS", "iOS & Android"},
			StartDate:    mustParse("2025-04-01"),
			EndDate:      getDate("2026-05-01"),
			ExperienceID: &upnExp.ID,
			DemoLink:     "https://apps.apple.com/us/app/adk-rail-trail/id6753904870",
			Featured:     true,
		}
		db.Create(&p1)
	} else {
		p1.ShortDescription = "Cross-platform mobile application for Northern Adirondack tourism."
		p1.Overview = "A cross-platform mobile application delivering real-time navigation, dynamic event data, and offline trail maps for the 34-mile Adirondack Rail Trail."
		p1.Description = `* Developed in partnership with the Regional Office of Sustainable Tourism (ROOST) as the official digital guide for the 34-mile Adirondack Rail Trail.
* Integrated custom Google Maps and OpenStreetMap APIs to deliver robust offline caching and real-time GPS tracking in remote areas.
* Implemented a dynamic data ingestion pipeline via client-managed JSON endpoints to seamlessly update live events and directories without app store updates.
* Successfully supported nearly 1,000 concurrent users within weeks of launch while maintaining a perfect 5.0 rating on the iOS App Store.`
		p1.Technologies = models.JSONStringArray{"Flutter", "Dart", "Go", "AWS", "iOS & Android"}
		p1.Featured = true
		p1.ExperienceID = &upnExp.ID
		db.Save(&p1)
	}

	var p2 models.Project
	if err := db.Where("title = ?", "Franklin County Community Services").First(&p2).Error; err != nil {
		p2 = models.Project{
			Title:            "Franklin County Community Services",
			ShortDescription: "ADA-compliant government digital infrastructure.",
			Overview:         "A comprehensive modernization of a critical county government web portal, engineered for high performance and universal accessibility.",
			Description: `* Spearheaded the complete architectural redesign and modernization of the critical county government web portal using React and TypeScript.
* Replaced outdated municipal infrastructure with a highly responsive, modern web experience.
* Placed major technical focus on strict ADA and WCAG web accessibility compliance, ensuring public health resources and services are navigable for all residents.`,
			Technologies: models.JSONStringArray{"React", "TypeScript", "HTML", "Tailwind CSS"},
			StartDate:    mustParse("2025-11-01"),
			EndDate:      getDate("2026-07-01"),
			ExperienceID: &upnExp.ID,
		}
		db.Create(&p2)
	} else {
		p2.ShortDescription = "ADA-compliant government digital infrastructure."
		p2.Overview = "A comprehensive modernization of a critical county government web portal, engineered for high performance and universal accessibility."
		p2.Description = `* Spearheaded the complete architectural redesign and modernization of the critical county government web portal using React and TypeScript.
* Replaced outdated municipal infrastructure with a highly responsive, modern web experience.
* Placed major technical focus on strict ADA and WCAG web accessibility compliance, ensuring public health resources and services are navigable for all residents.`
		p2.Technologies = models.JSONStringArray{"React", "TypeScript", "HTML", "Tailwind CSS"}
		p2.ExperienceID = &upnExp.ID
		db.Save(&p2)
	}

	var p3 models.Project
	if err := db.Where("title = ?", "Sustainability Toolkit").First(&p3).Error; err != nil {
		p3 = models.Project{
			Title:            "Sustainability Toolkit",
			ShortDescription: "Interactive educational guide for environmental initiatives.",
			Overview:         "A high-performance Single Page Application (SPA) built to educate regional residents on municipal sustainability and environmental initiatives.",
			Description: `* Engineered a high-performance Single Page Application (SPA) educating regional residents on municipal sustainability practices.
* Architected the frontend from the ground up using React and TypeScript, prioritizing load times and strict ADA / Section 508 accessibility compliance.
* Translated complex municipal requirements from the B2G contract into a clean, modern, and engaging user interface.`,
			Technologies: models.JSONStringArray{"React", "TypeScript", "Tailwind CSS"},
			StartDate:    mustParse("2025-11-01"),
			EndDate:      getDate("2026-07-01"),
			ExperienceID: &upnExp.ID,
		}
		db.Create(&p3)
	} else {
		p3.ShortDescription = "Interactive educational guide for environmental initiatives."
		p3.Overview = "A high-performance Single Page Application (SPA) built to educate regional residents on municipal sustainability and environmental initiatives."
		p3.Description = `* Engineered a high-performance Single Page Application (SPA) educating regional residents on municipal sustainability practices.
* Architected the frontend from the ground up using React and TypeScript, prioritizing load times and strict ADA / Section 508 accessibility compliance.
* Translated complex municipal requirements from the B2G contract into a clean, modern, and engaging user interface.`
		p3.Technologies = models.JSONStringArray{"React", "TypeScript", "Tailwind CSS"}
		p3.ExperienceID = &upnExp.ID
		db.Save(&p3)
	}

	// 5. Education
	log.Println("Syncing Education...")
	var edu1 models.Education
	if err := db.Where("institution = ? AND title = ?", "Southern New Hampshire University", "B.S. in Computer Science (Software Engineering Focus)").First(&edu1).Error; err != nil {
		edu1 = models.Education{
			Institution: "Southern New Hampshire University",
			Title:       "B.S. in Computer Science (Software Engineering Focus)",
			StartDate:   mustParse("2020-08-01"),
			EndDate:     getDate("2024-05-01"),
			Type:        "Degree",
			Description: "Concentrated on advanced software engineering principles, including algorithmic complexity, design patterns, and full-stack systems architecture. Developed a deep theoretical understanding of computing that informs my practical application in professional environments.",
		}
		db.Create(&edu1)
	} else {
		edu1.Description = "Concentrated on advanced software engineering principles, including algorithmic complexity, design patterns, and full-stack systems architecture. Developed a deep theoretical understanding of computing that informs my practical application in professional environments."
		db.Save(&edu1)
	}

	var edu2 models.Education
	if err := db.Where("institution = ? AND title = ?", "UpNCoding | North Country Community College", "Full Stack Development & Cloud Architecture").First(&edu2).Error; err != nil {
		edu2 = models.Education{
			Institution: "UpNCoding | North Country Community College",
			Title:       "Full Stack Development & Cloud Architecture",
			StartDate:   mustParse("2023-05-01"),
			EndDate:     getDate("2023-08-01"),
			Type:        "Certification",
			Description: "Completed an intensive professional program focused on the Go ecosystem, containerization with Docker, and cloud infrastructure on AWS. Gained certified proficiency in Test-Driven Development (TDD) and the Agile SDLC.",
		}
		db.Create(&edu2)
	} else {
		edu2.Description = "Completed an intensive professional program focused on the Go ecosystem, containerization with Docker, and cloud infrastructure on AWS. Gained certified proficiency in Test-Driven Development (TDD) and the Agile SDLC."
		db.Save(&edu2)
	}

	var edu3 models.Education
	if err := db.Where("institution = ? AND title = ?", "UpNCoding | Hack The Box", "CPTS (Certified Penetration Testing Specialist)").First(&edu3).Error; err != nil {
		edu3 = models.Education{
			Institution: "UpNCoding | Hack The Box",
			Title:       "CPTS (Certified Penetration Testing Specialist)",
			StartDate:   mustParse("2026-03-01"),
			EndDate:     getDate("2026-06-01"),
			Type:        "Certification",
			Description: "Advanced certification in penetration testing and cybersecurity, focusing on technical exploitation, vulnerability assessment, and offensive security operations.",
		}
		db.Create(&edu3)
	} else {
		edu3.Description = "Advanced certification in penetration testing and cybersecurity, focusing on technical exploitation, vulnerability assessment, and offensive security operations."
		db.Save(&edu3)
	}

	// 6. Hero Section
	log.Println("Syncing Hero Section...")
	var hero models.HeroSection
	if err := db.First(&hero).Error; err != nil {
		hero = models.HeroSection{
			Title:    "Anthony Premo",
			Subtitle: "Principal Software Engineer & Systems Architect",
			CTAText:  "View My Work",
			CTALink:  "projects",
		}
		db.Create(&hero)
	} else {
		hero.Title = "Anthony Premo"
		hero.Subtitle = "Principal Software Engineer & Systems Architect"
		hero.CTAText = "View My Work"
		hero.CTALink = "projects"
		db.Save(&hero)
	}

	log.Println("Local content seeding complete.")
}
