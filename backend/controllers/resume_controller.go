package controllers

import (
	"log"
	"os"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
)

func UploadResume(c *fiber.Ctx) error {
	file, err := c.FormFile("resume")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to upload file"})
	}

	// Validate PDF
	if filepath.Ext(file.Filename) != ".pdf" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Only PDF files are allowed"})
	}

	// Ensure uploads directory exists
	if err := os.MkdirAll("./uploads", 0755); err != nil {
		log.Println("Error creating uploads directory:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create directory"})
	}

	// Clean up old resume files to ensure only one exists
	files, err := filepath.Glob("./uploads/Resume_*.pdf")
	if err == nil {
		for _, f := range files {
			if err := os.Remove(f); err != nil {
				log.Println("Error deleting old resume:", f, err)
			} else {
				log.Println("Deleted old resume:", f)
			}
		}
	}

	// Save file as Resume_Anthony-Premo.pdf in uploads folder
	if err := c.SaveFile(file, "./uploads/Resume_Anthony-Premo.pdf"); err != nil {
		log.Println("Error saving resume:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save file"})
	}

	return c.JSON(fiber.Map{"message": "Resume uploaded successfully", "url": "/uploads/Resume_Anthony-Premo.pdf"})
}
