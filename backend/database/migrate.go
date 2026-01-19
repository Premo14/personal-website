package database

import (
	"log"

	"github.com/premo14/personal-website/backend/models"
)

func MigrateDB() {
	log.Println("Starting database migrations...")

	modelsToMigrate := []interface{}{
		&models.User{},
		&models.AboutMe{},
		&models.SkillCategory{},
		&models.Skill{},
		&models.Experience{},
		&models.Education{},
		&models.Project{},
		&models.HeroSection{},
	}

	if err := DB.AutoMigrate(modelsToMigrate...); err != nil {
		log.Fatalf("Failed to migrate database models: %v", err)
	}

	log.Println("Database models migrated successfully!")
}
