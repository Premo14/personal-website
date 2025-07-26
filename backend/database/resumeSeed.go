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
					"frameworks_libraries": "React, Flutter, Node.js",
					"databases": "PostgreSQL, MongoDB, MySQL, MariaDB",
					"cloud": "AWS EC2, AWS ECR, AWS Route 53, AWS S3, AWS RDS",
					"devops": "Docker, Terraform. NGINX, GitHub Actions",
					"utilities": "Postman, Linux, JetBrains, Shell Scripting, GitHub"
				}`),
				ProfessionalExperience: datatypes.JSON(`[
				  {
                    "title": "Mobile Developer",
                    "company": "UpNCoding (Contract)",
                    "location": "Remote",
                    "dateRange": "June 2025 - Present",
                    "bullets": [
                      "Built a tourism app using Flutter and Dart for the ADK Rail Trail",
                      "Third party map integration"
                    ]
                  },
				  {
					"title": "Full Stack Engineer",
					"company": "Immpression LLC",
					"location": "Remote",
					"dateRange": "May 2024 - May 2025",
					"bullets": [
					  "Developed cross-platform mobile app with React Native, Node.js, and Express.js",
					  "Built and maintained backend API with MongoDB integration",
					  "Created internal admin panel and landing page using React, Vite, and Node.js",
					  "Led DevOps setup using Docker, GitHub, Linux, and Terraform",
					  "Integrated cloud services like Cloudinary and Vercel for mock deployment"
					]
				  },
				  {
					"title": "Software Engineer",
					"company": "UpNCoding (Contract)",
					"location": "Remote",
					"dateRange": "Dec 2023 - Jun 2024",
					"bullets": [
					  "Built a tourism app using Laravel, PHP, and MariaDB for the Adirondack region",
					  "Developed Android/iOS apps using Kotlin and Swift using Android Studio and XCode",
					  "Created internal admin panel with React and TypeScript",
					  "Used Docker for containerized development"
					]
				  },
				  {
					"title": "Associate Java Developer",
					"company": "Revature  (Pre-Training)",
					"location": "Remote",
					"dateRange": "Dec 2024 - Feb 2025",
					"bullets": [
					  "Completed Revature's pre-training program in Java, Spring Boot, Javalin, REST APIs, and SQL",
					  "Built backend services and APIs using Java frameworks and SQL databases",
					  "Collaborated in agile project teams simulating real-world development",
					  "Awaiting placement into full-time client engagement"
					]
				  },
				  {
					"title": "IT Technician",
					"company": "Adirondack Techs LLC",
					"location": "On-site",
					"dateRange": "Jul 2022 - Sep 2022",
					"bullets": [
					  "Installed and maintained POS systems, servers, and network equipment",
					  "Troubleshot PCs, mobile devices, and security hardware onsite",
					  "Configured Windows Server, macOS, and IP phone systems"
					]
				  },
                  {
                    "title": "CTO & Lead Developer",
                    "company": "Limitless Hoops (Startup)",
                    "location": "Remote",
                    "dateRange": "May 2025 - Present",
                    "bullets": [
                        "Installed and maintained POS systems, servers, and network equipment",
                        "Troubleshot PCs, mobile devices, and security hardware onsite",
                        "Configured Windows Server, macOS, and IP phone systems"
                    ]
                  }
				]`),

				Projects: datatypes.JSON(`[
				  {
					"name": "Immpression Art App",
					"description": "React Native, MongoDB, Express, with admin panel and landing site"
				  },
				  {
					"name": "UpNCoding Tourism App",
					"description": "Laravel, MariaDB, React-based admin panel for Android/iOS"
				  },
				  {
					"name": "Personal Site",
					"description": "Built with Golang (GORM, Fiber), React, Terraform, and AWS"
				  },
				  {
					"name": "Revature Projects",
					"description": "Java + Spring Boot APIs and backend systems from training"
				  },
                  {
                    "name": "ADK Rail Trail",
                    "description": "Flutter + Dart mobile application w/ third party map integration"
                  }
				]`),

				Education: datatypes.JSON(`[
				  {
					"institution": "Southern New Hampshire University",
					"degree": "B.S. in Software Engineering"
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
