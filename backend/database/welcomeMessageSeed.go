package database

import (
	"errors"
	"log"

	"github.com/premo14/personal-website/backend/models"
	"gorm.io/gorm"
)

func SeedWelcomeMessage() error {
	var welcomeMessage models.WelcomeMessage
	result := DB.First(&welcomeMessage)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			log.Println("Seeding initial Welcome Message...")

			initial := models.WelcomeMessage{
				Message: "I’m a software craftsman specializing in full stack systems—bringing clarity to code, structure to architecture, and stability from development to deployment.",
			}

			if err := DB.Create(&initial).Error; err != nil {
				return err
			}

			log.Println("Welcome Message seeded successfully!")
			return nil
		}
		return result.Error
	}

	log.Println("⚡ Welcome Message already exists, skipping seeding.")
	return nil
}
