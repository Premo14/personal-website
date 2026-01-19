package database

import (
	"log"
	"os"

	"github.com/premo14/personal-website/backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedAdmin initializes the first admin user if the users table is empty.
// It relies on environment variables ADMIN_USERNAME and ADMIN_PASSWORD.
func SeedAdmin(db *gorm.DB) {
	var count int64
	db.Model(&models.User{}).Count(&count)

	if count > 0 {
		return // Database already seeded
	}

	username := os.Getenv("ADMIN_USERNAME")
	passwordEnv := os.Getenv("ADMIN_PASSWORD")

	if username == "" || passwordEnv == "" {
		log.Println("Warning: ADMIN_USERNAME or ADMIN_PASSWORD not set. Skipping admin seeding.")
		return
	}

	// Hash password with default cost (10).
	// This provides a reasonable balance between security and performance for this use case.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordEnv), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return
	}

	admin := models.User{
		Username:     username,
		PasswordHash: string(hashedPassword),
	}

	if err := db.Create(&admin).Error; err != nil {
		log.Printf("Failed to seed admin user: %v", err)
		return
	}

	log.Println("Admin user seeded successfully from environment configuration.")
}

// SeedHero ensures the Hero section has default content if empty.
func SeedHero(db *gorm.DB) {
	var hero models.HeroSection
	result := db.First(&hero)

	if result.Error != nil {
		// Initialize default content
		newHero := models.HeroSection{
			Title:    "Hello, I'm Anthony",
			Subtitle: "Full Stack Engineer",
			CTAText:  "View My Work",
			CTALink:  "projects",
		}
		db.Create(&newHero)
		log.Println("Hero section initialized.")
	}
}

// SeedContent is a placeholder for future content seeding.
// Currently left empty as content is managed dynamically via the Admin Panel.
func SeedContent(db *gorm.DB) {
}
