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
			Title: "Full Stack Developer",
			Content: `I’m a software engineer who balances a laid-back, collaborative personality with a relentless drive to ship high-quality, impactful code.

With a background in both product management and technical architecture, I specialize in building scalable systems from the ground up. Whether I’m architecting microservices in Go, crafting cross-platform mobile apps in Flutter, or diving into offensive security with my CPTS certification, I focus on building tools that actually solve problems for real people. I currently oversee development for regional government contracts and serve as the primary technical resource for a youth basketball organization, so I’m just as comfortable in a stakeholder meeting as I am deep in the development process.

Outside of the IDE, you can usually find me keeping up with sports, exploring the outdoors, or learning something new in the world of cybersecurity. My goal is always the same: keep it simple, make it fast, and build it for the long haul.`,
		}
		db.Create(&about)
	} else {
		about.Title = "Full Stack Developer"
		about.Content = `I’m a software engineer who balances a laid-back, collaborative personality with a relentless drive to ship high-quality, impactful code.

With a background in both product management and technical architecture, I specialize in building scalable systems from the ground up. Whether I’m architecting microservices in Go, crafting cross-platform mobile apps in Flutter, or diving into offensive security with my CPTS certification, I focus on building tools that actually solve problems for real people. I currently oversee development for regional government contracts and serve as the primary technical resource for a youth basketball organization, so I’m just as comfortable in a stakeholder meeting as I am deep in the development process.

Outside of the IDE, you can usually find me keeping up with sports, exploring the outdoors, or learning something new in the world of cybersecurity. My goal is always the same: keep it simple, make it fast, and build it for the long haul.`
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
				{Name: "Dart"}, {Name: "SQL"}, {Name: "HTML"}, {Name: "CSS"}, {Name: "Bash"},
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
	}

	// 3. Experience
	db.Model(&models.Experience{}).Count(&count)
	if count == 0 {
		log.Println("Seeding Experience...")

		exp1 := models.Experience{
			Company:     "UpNCoding",
			Role:        "Lead Engineer & Product Manager",
			StartDate:   mustParse("2024-05-01"),
			EndDate:     nil,
			Location:    "Remote",
			CompanyLink: "https://upncoding.com",
			Overview:    "Leading end-to-end development of custom software solutions for regional organizations and local government departments, modernizing their digital presence and improving community service delivery.",
			Description: `* Lead end-to-end development of custom software solutions, from requirements gathering and system architecture to deployment and maintenance.
* Collaborate directly with clients through discovery meetings to translate business needs into technical specifications and product roadmaps.
* Define application architecture, select development tools and technologies, and oversee implementation to ensure scalable, maintainable solutions.`,
		}
		db.Create(&exp1)

		exp2 := models.Experience{
			Company:     "Limitless Hoops",
			Role:        "Technical Founder",
			StartDate:   mustParse("2025-04-01"),
			EndDate:     nil,
			Location:    "Remote",
			CompanyLink: "https://limitlesshoops.com",
			Overview:    "Spearheading the design and development of a comprehensive, multi-tenant software ecosystem for a high-growth youth basketball startup, handling everything from player apps to core business management.",
			Description: `* Spearheading design and development of a comprehensive suite of products for a high-growth youth basketball company.
* Architecting scalable custom systems: booking management, live game tracking, and secure payment processing using Go, Fiber, and third-party APIs.
* Developing cross-platform solutions, including custom browser and mobile applications, implementing complex membership and RBAC systems.`,
		}
		db.Create(&exp2)
	}

	// 4. Projects (Linked to Experience)
	db.Model(&models.Project{}).Count(&count)
	if count == 0 {
		log.Println("Seeding Projects...")

		var upnExp models.Experience
		db.Where("company = ?", "UpNCoding").First(&upnExp)
		var limitExp models.Experience
		db.Where("company = ?", "Limitless Hoops").First(&limitExp)

		p1 := models.Project{
			Title:            "Roost ADK Rail Trail App",
			ShortDescription: "Cross-platform mobile application for Northern Adirondack tourism.",
			Overview:         "A mobile app that helps users navigate the Tupper Lake–Lake Placid rail trail with map views, offline access, and curated points of interest.",
			Description:      "* Developed a custom mobile solution using Flutter and Dart to support regional tourism. I served as the lead engineer and product manager, implementing complex Google Maps API integrations to display dynamic markers and trail geofencing. I handled the entire development process, including requirement gathering, UI design, and production deployment for a specific regional corridor.",
			Technologies:     models.JSONStringArray{"Flutter", "Dart", "Go", "AWS", "iOS & Android"},
			StartDate:        mustParse("2025-04-01"),
			EndDate:          getDate("2026-05-01"),
			ExperienceID:     &upnExp.ID,
			DemoLink:         "https://apps.apple.com/us/app/adk-rail-trail/id6753904870",
			Featured:         true,
		}
		db.Create(&p1)

		p2 := models.Project{
			Title:            "Franklin County Community Services",
			ShortDescription: "ADA-compliant government digital infrastructure.",
			Overview:         "A complete redesign of a county government website to improve public access to resources and ensure the site is accessible to everyone.",
			Description:      "* Developed modern, accessibility-focused web platforms for Franklin County organizations, focusing on semantic HTML and ARIA standards to achieve full ADA compliance. My role encompassed product management, stakeholder reporting, and full-stack implementation using React and TypeScript.",
			Technologies:     models.JSONStringArray{"React", "TypeScript", "HTML", "Tailwind CSS"},
			StartDate:        mustParse("2025-11-01"),
			EndDate:          getDate("2026-07-01"),
			ExperienceID:     &upnExp.ID,
		}
		db.Create(&p2)

		p3 := models.Project{
			Title:            "Sustainability Toolkit",
			ShortDescription: "Interactive educational guide for environmental initiatives.",
			Overview:         "A brand new digital platform built to teach residents about sustainability and environmental practices in their local community.",
			Description:      "* Engineered a standalone educational Single Page Application (SPA) as part of a larger government contract. Utilizing React and TypeScript to build a modern, user-friendly web application. I was responsible for the technical architecture and frontend development of this community-focused toolkit.",
			Technologies:     models.JSONStringArray{"React", "TypeScript", "Tailwind CSS"},
			StartDate:        mustParse("2025-11-01"),
			EndDate:          getDate("2026-07-01"),
			ExperienceID:     &upnExp.ID,
		}
		db.Create(&p3)

		p4 := models.Project{
			Title:            "Limitless Hoops Suite",
			ShortDescription: "Full-scale sports management and analytics ecosystem.",
			Overview:         "A massive software suite including player apps, admin dashboards, and a backend system that tracks live game stats and handles memberships.",
			Description:      "* Architecting a high-concurrency RESTful API using Go and Fiber to support a diverse ecosystem of sports management tools. I am implementing a real-time statistics engine for live game tracking and a complex billing system via Stripe integration. The project utilizes Docker for containerization and AWS for cloud hosting, ensuring high availability and scalability for the growing startup.",
			Technologies:     models.JSONStringArray{"Go", "Fiber", "Flutter", "PostgreSQL", "AWS", "Terraform", "Docker"},
			StartDate:        mustParse("2025-04-01"),
			EndDate:          nil,
			ExperienceID:     &limitExp.ID,
			Featured:         true,
		}
		db.Create(&p4)
	}

	// 5. Education
	db.Model(&models.Education{}).Count(&count)
	if count == 0 {
		log.Println("Seeding Education...")

		edu1 := models.Education{
			Institution: "Southern New Hampshire University",
			Title:       "B.S. in Computer Science (Software Engineering Focus)",
			StartDate:   mustParse("2020-08-01"),
			EndDate:     getDate("2024-05-01"),
			Type:        "Degree",
			Description: "Concentrated on advanced software engineering principles, including algorithmic complexity, design patterns, and full-stack systems architecture. Developed a deep theoretical understanding of computing that informs my practical application in professional environments.",
		}
		db.Create(&edu1)

		edu2 := models.Education{
			Institution: "UpNCoding | North Country Community College",
			Title:       "Full Stack Development & Cloud Architecture",
			StartDate:   mustParse("2023-05-01"),
			EndDate:     getDate("2023-08-01"),
			Type:        "Certification",
			Description: "Completed an intensive professional program focused on the Go ecosystem, containerization with Docker, and cloud infrastructure on AWS. Gained certified proficiency in Test-Driven Development (TDD) and the Agile SDLC.",
		}
		db.Create(&edu2)

		edu3 := models.Education{
			Institution: "UpNCoding | Hack The Box",
			Title:       "CPTS (Certified Penetration Testing Specialist)",
			StartDate:   mustParse("2026-03-01"),
			EndDate:     getDate("2026-06-01"),
			Type:        "Certification",
			Description: "Advanced certification in penetration testing and cybersecurity, focusing on technical exploitation, vulnerability assessment, and offensive security operations.",
		}
		db.Create(&edu3)
	}

	// 6. Hero Section
	log.Println("Syncing Hero Section...")
	var hero models.HeroSection
	if err := db.First(&hero).Error; err != nil {
		hero = models.HeroSection{
			Title:    "Hello, I'm Anthony",
			Subtitle: "Full Stack Engineer | Cybersecurity Professional",
			CTAText:  "View My Work",
			CTALink:  "projects",
		}
		db.Create(&hero)
	} else {
		hero.Title = "Hello, I'm Anthony"
		hero.Subtitle = "Full Stack Engineer | Cybersecurity Professional"
		hero.CTAText = "View My Work"
		hero.CTALink = "projects"
		db.Save(&hero)
	}

	log.Println("Local content seeding complete.")
}
