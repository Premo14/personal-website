package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/premo14/personal-website/backend/config"

	"github.com/gofiber/fiber/v2"
	"github.com/premo14/personal-website/backend/database"
	"github.com/premo14/personal-website/backend/routes"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Details: .env file not found or error loading it")
	}
	conf := config.LoadConfig()
	app := fiber.New()

	// Check for seed flag
	seedOnly := false
	if len(os.Args) > 1 && (os.Args[1] == "--seed" || os.Args[1] == "-seed") {
		seedOnly = true
	}

	allowedOrigins := []string{"https://anthonypremo.com", "https://www.anthonypremo.com"}

	if conf.ViteBuildStage == "development" {
		log.Println("Running in development mode, enabling localhost CORS")
		allowedOrigins = append(allowedOrigins, "http://localhost:5173")
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     strings.Join(allowedOrigins, ","),
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
	}))

	database.ConnectDB()
	log.Println("Connected to database successfully")

	database.MigrateDB()
	log.Println("Migrations applied successfully")

	database.SeedDB(database.DB)
	log.Println("Seeding complete")

	if seedOnly {
		log.Println("Seed only mode: exiting application.")
		os.Exit(0)
	}

	app.Static("/uploads", "./uploads")
	log.Println("Static uploads directory served")

	routes.SetupRoutes(app)
	log.Println("Routes set up successfully")

	port := conf.ViteBackendPort
	if port == "" {
		log.Println("VITE_BACKEND_PORT not set, defaulting to 8080")
		port = "8080"
	}

	go func() {
		if err := app.Listen(":" + port); err != nil {
			log.Panicf("Failed to start server: %v", err)
		}
	}()
	log.Println("Server is running on port", port)

	app.Options("/*", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusNoContent)
	})

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := app.Shutdown(); err != nil {
		log.Panicf("Server shutdown failed: %v", err)
	}

	log.Println("Server gracefully stopped")
}
