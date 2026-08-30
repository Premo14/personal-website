package database

import (
	"log"

	"gorm.io/gorm"
)

func SeedDB(db *gorm.DB) {
	log.Println("Starting database seeding...")

	SeedLocalContent(db) // Seed from local template
	SeedAdmin(db)        // Ensure admin user exists

	log.Println("Seeding process completed!")
}
