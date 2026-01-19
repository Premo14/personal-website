package database

import (
	"log"

	"github.com/premo14/personal-website/backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedAdmin(db *gorm.DB) {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count == 0 {
		password, _ := bcrypt.GenerateFromPassword([]byte("admin123"), 14)
		admin := models.User{
			Username:     "admin",
			PasswordHash: string(password),
		}
		db.Create(&admin)
		log.Println("Admin user seeded!")
	}
}

func SeedHero(db *gorm.DB) {
	var hero models.HeroSection
	result := db.First(&hero)

	if result.Error != nil {
		// Create if not exists
		newHero := models.HeroSection{
			Title:    "Hello, I'm Anthony",
			Subtitle: "Full Stack Engineer",
			CTAText:  "View My Work",
			CTALink:  "projects",
		}
		db.Create(&newHero)
		log.Println("Hero section created!")
	} else {
		// Update if exists and name is wrong
		if hero.Title != "Hello, I'm Anthony" {
			hero.Title = "Hello, I'm Anthony"
			db.Save(&hero)
			log.Println("Hero section updated to 'Anthony'!")
		}
	}
}

func SeedContent(db *gorm.DB) {
	// Content seeding disabled per user request to keep Admin Panel empty by default.
	// Only manual data entry via Admin Panel will populate these tables.
}
