package database

import (
	"encoding/json"
	"errors"
	"log"
	"time"

	"github.com/premo14/personal-website/backend/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func SeedResume() error {
	var resume models.Resume
	result := DB.First(&resume)
	if result.Error == nil {
		log.Println("⚡ Resume already exists, skipping seeding.")
		return nil
	}
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return result.Error
	}

	log.Println("🌱 Seeding initial Resume...")

	skills := []string{
		"Go (Golang)", "TypeScript", "React", "Node.js", "React Native", "Flutter",
		"PostgreSQL", "MongoDB",
		"Docker", "Terraform", "GitHub Actions CI/CD",
		"Linux", "NGINX", "Git", "Postman",
		"Fiber", "GORM",
		"AWS VPC", "AWS EC2", "AWS RDS", "AWS ECR", "AWS Route 53", "AWS S3",
	}

	experience := []map[string]any{
		{
			"title":     "Full Stack Engineer",
			"company":   "Limitless Hoops",
			"location":  "Remote",
			"dateRange": "May 2025 – Present",
			"bullets": []string{
				"Designed REST APIs in Go (Fiber) with PostgreSQL (GORM) for auth, teams, and bookings.",
				"Built CI/CD with GitHub Actions + Docker (versioned images, Compose dev envs).",
				"Wrote Terraform (IaC) for AWS-ready VPC/EC2/RDS/ECR/Route 53; scoped Stripe/Twilio.",
			},
		},
		{
			"title":     "Mobile Developer (Contract)",
			"company":   "UpNCoding",
			"location":  "Remote",
			"dateRange": "Jun 2025 – Present",
			"bullets": []string{
				"Built Flutter features: map overlays, location filters, and item detail views.",
				"Integrated JSON data services with local caching for responsive UI.",
			},
		},
		{
			"title":     "Full Stack Engineer (Volunteer)",
			"company":   "Immpression LLC",
			"location":  "Remote",
			"dateRange": "May 2024 – May 2025",
			"bullets": []string{
				"Developed React Native client and Node.js/Express API (MongoDB).",
				"Introduced Docker + Terraform; added preview deployments to speed reviews.",
			},
		},
	}

	type resumeProj struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	ensurePublishedAtForSeed()

	var pp []models.PortfolioProject
	if err := DB.Order("published_at DESC NULLS LAST, created_at DESC").Limit(5).Find(&pp).Error; err != nil {
		return err
	}
	derived := make([]resumeProj, 0, len(pp))
	for _, p := range pp {
		derived = append(derived, resumeProj{
			Name:        p.Title,
			Description: p.Description,
		})
	}

	education := []map[string]string{
		{"institution": "Southern New Hampshire University", "degree": "B.S., Computer Science (Software Engineering), Sep 2024"},
		{"institution": "UpNCoding", "degree": "Golang Bootcamp Certification"},
	}

	skillsJSON, err := json.Marshal(skills)
	if err != nil {
		return err
	}
	expJSON, err := json.Marshal(experience)
	if err != nil {
		return err
	}
	projJSON, err := json.Marshal(derived)
	if err != nil {
		return err
	}
	eduJSON, err := json.Marshal(education)
	if err != nil {
		return err
	}

	initial := models.Resume{
		TechnicalSkills:        datatypes.JSON(skillsJSON),
		ProfessionalExperience: datatypes.JSON(expJSON),
		Projects:               datatypes.JSON(projJSON),
		Education:              datatypes.JSON(eduJSON),
	}

	if err := DB.Create(&initial).Error; err != nil {
		return err
	}

	log.Println("Resume seeded successfully!")
	return nil
}

func ensurePublishedAtForSeed() {
	var count int64
	DB.Model(&models.PortfolioProject{}).Where("published_at IS NOT NULL").Count(&count)
	if count > 0 {
		return
	}
	now := time.Now().UTC()
	DB.Model(&models.PortfolioProject{}).Where("published_at IS NULL").Update("published_at", now)
}
