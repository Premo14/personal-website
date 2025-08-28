package database

import "log"

func SeedDB() {
	log.Println("Starting database seeding...")

	if err := SeedPortfolioProjects(); err != nil {
		log.Fatalf("❌ Failed to seed Portfolio Projects: %v", err)
	}
	log.Println("Portfolio Projects seeded successfully!")

	if err := SeedResume(); err != nil {
		log.Fatalf("❌ Failed to seed Resume: %v", err)
	}
	log.Println("Resume seeded successfully!")

	if err := SeedWelcomeMessage(); err != nil {
		log.Fatalf("❌ Failed to seed Welcome Message: %v", err)
	}
	log.Println("Welcome Message seeded successfully!")

	if err := SeedTechStack(); err != nil {
		log.Fatalf("Failed to seed Tech Stack: %v", err)
	}

	log.Println("All seeders completed!")
}
