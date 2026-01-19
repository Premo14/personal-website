package database

import (
	"log"

	"gorm.io/gorm"
)

func SeedDB(db *gorm.DB) {
	log.Println("Starting database seeding...")

	SeedAdmin(db)
	SeedHero(db)
	SeedContent(db)

	log.Println("Seeding process completed!")
}
