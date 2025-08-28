package database

import (
	"errors"
	"log"
	"time"

	"github.com/premo14/personal-website/backend/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func SeedPortfolioProjects() error {
	var project models.PortfolioProject
	result := DB.First(&project)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			log.Println("Seeding initial PortfolioProject...")
			now := time.Now().UTC()
			personalWebsite := models.PortfolioProject{
				Title: "Personal Website",
				Tools: datatypes.JSON(`[
					"Go", "Fiber", "GORM", "React", "TypeScript", "Docker",
					"AWS", "Terraform"
				]`),
				Description: "Personal Website using Go, Fiber, React, and TypeScript. Deployed on AWS using Terraform",
				SourceLink:  "https://github.com/premo14/personal-website",
				LiveLink:    "https://premsanity.com",
				PublishedAt: &now,
				Featured:    true,
				Thumbnail:   "",
			}
			if err := DB.Create(&personalWebsite).Error; err != nil {
				return err
			}

			adkRailTrail := models.PortfolioProject{
				Title: "ADK Rail Trail",
				Tools: datatypes.JSON(`[
					"Flutter", "Dart"
				]`),
				Description: "Mobile application with third-party map integration built using Flutter and Dart",
				SourceLink:  "",
				LiveLink:    "",
				PublishedAt: &now,
				Featured:    true,
				Thumbnail:   "",
			}
			if err := DB.Create(&adkRailTrail).Error; err != nil {
				return err
			}

			limitlessHoops := models.PortfolioProject{
				Title: "Limitless Hoops",
				Tools: datatypes.JSON(`[
					"Go", "Fiber", "GORM", "React", "TypeScript", "Docker",
					"AWS", "Terraform", "Stripe"
				]`),
				Description: "Suite of services for youth basketball league",
				SourceLink:  "",
				LiveLink:    "https://limitlesshoops.com",
				PublishedAt: &now,
				Featured:    true,
				Thumbnail:   "",
			}
			if err := DB.Create(&limitlessHoops).Error; err != nil {
				return err
			}
			log.Println("PortfolioProject seeded successfully!")
			return nil
		}
		return result.Error
	}
	log.Println("⚡ PortfolioProject already exists, skipping seeding.")
	return nil
}
