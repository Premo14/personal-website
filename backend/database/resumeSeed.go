package database

import (
	"errors"
	"log"

	"github.com/premo14/personal-website/backend/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func SeedResume() error {
	var resume models.Resume
	result := DB.First(&resume)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			log.Println("🌱 Seeding initial Resume...")

			initial := models.Resume{
				TechnicalSkills: datatypes.JSON(`{
  "languages": "Go, TypeScript, Dart",
  "frameworks_libraries": "React, Flutter, React Native, Node.js",
  "databases": "PostgreSQL, MongoDB, MySQL, MariaDB",
  "cloud": "AWS EC2, AWS ECR, AWS Route 53, AWS S3, AWS RDS",
  "devops": "Docker, Terraform, NGINX, GitHub Actions",
  "utilities": "Postman, Linux, Shell Scripting, GitHub"
}`),

ProfessionalExperience: datatypes.JSON(`[
  {
    "title": "Full Stack Engineer",
    "company": "Limitless Hoops (Startup)",
    "location": "Remote",
    "dateRange": "May 2025 - Present",
    "bullets": [
      "Sole engineer responsible for backend and infrastructure of an early-stage sports event platform",
      "Architected Go + Fiber microservices with PostgreSQL to support scalable user growth",
      "Implemented CI/CD pipelines with Docker, Terraform, and GitHub Actions preparing for AWS deployment",
      "Integrated Stripe and Twilio APIs for payment processing and automated communications"
    ]
  },
  {
    "title": "Mobile Developer",
    "company": "UpNCoding (Contract)",
    "location": "Remote",
    "dateRange": "June 2025 - Present",
    "bullets": [
      "Built a tourism-focused mobile app with Flutter and Dart for the ADK Rail Trail",
      "Integrated third-party mapping APIs to deliver location-based features"
    ]
  },
  {
    "title": "Software Engineer",
    "company": "UpNCoding (Contract)",
    "location": "Remote",
    "dateRange": "Dec 2023 - Jun 2024",
    "bullets": [
      "Collaborated as one of three core developers at a startup, delivering web and mobile applications",
      "Built a Laravel + MariaDB tourism platform with React-based admin panel",
      "Developed Android/iOS clients using Kotlin and Swift in Android Studio/Xcode",
      "Containerized development with Docker for consistent team workflows"
    ]
  },
  {
    "title": "Full Stack Engineer",
    "company": "Immpression LLC (Volunteer Project)",
    "location": "Remote",
    "dateRange": "May 2024 - May 2025",
    "bullets": [
      "Served as lead engineer and DevOps mentor for a volunteer team building an art marketplace app",
      "Developed cross-platform mobile client in React Native with Node.js/Express backend",
      "Implemented MongoDB data layer and created admin tools with React + Vite",
      "Introduced Docker and Terraform workflows, mentoring teammates on modern DevOps practices"
    ]
  },
  {
    "title": "IT Technician",
    "company": "Adirondack Techs LLC",
    "location": "On-site",
    "dateRange": "Jul 2022 - Sep 2022",
    "bullets": [
      "Installed and maintained POS systems, servers, and networking equipment for small businesses",
      "Troubleshot PCs, mobile devices, and security hardware onsite",
      "Configured Windows Server, macOS, and VoIP phone systems"
    ]
  }
]`),

Projects: datatypes.JSON(`[
  {
    "name": "Limitless Hoops",
    "description": "Go + Fiber backend with PostgreSQL, Stripe/Twilio integration, AWS-ready CI/CD"
  },
  {
    "name": "ADK Rail Trail",
    "description": "Flutter + Dart tourism app with interactive third-party map integration"
  },
  {
    "name": "Immpression Art App",
    "description": "Cross-platform React Native marketplace with Node.js/MongoDB backend and admin tools"
  },
  {
    "name": "UpNCoding Tourism App",
    "description": "Laravel + MariaDB web platform with React admin panel and native mobile clients"
  },
  {
    "name": "Personal Site",
    "description": "Portfolio site built with Golang (GORM, Fiber), React frontend, Terraform and AWS"
  }
]`),

Education: datatypes.JSON(`[
  {
    "institution": "Southern New Hampshire University",
    "degree": "B.S. in Computer Science (Software Engineering Concentration)"
  },
  {
    "institution": "UpNCoding",
    "degree": "Golang Bootcamp Certification"
  }
]`),
			}

			if err := DB.Create(&initial).Error; err != nil {
				return err
			}

			log.Println("✅ Resume seeded successfully!")
			return nil
		}
		return result.Error
	}

	log.Println("⚡ Resume already exists, skipping seeding.")
	return nil
}
