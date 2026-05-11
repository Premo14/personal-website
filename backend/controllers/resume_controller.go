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

	// Clean up old resume files to ensure consistency (case-insensitive check)
	entries, err := os.ReadDir("./uploads")
	if err == nil {
		for _, entry := range entries {
			if !entry.IsDir() {
				name := entry.Name()
				lowerName := filepath.Base(name) // It's just the name
				if (len(lowerName) >= 7 && lowerName[:7] == "resume_" || len(lowerName) >= 7 && lowerName[:7] == "Resume_") && filepath.Ext(name) == ".pdf" {
					if name != "resume_apremo.pdf" { // Keep the current one if it exists, though we'll overwrite it anyway
						os.Remove(filepath.Join("./uploads", name))
					}
				}
			}
		}
	}

	// Save file as resume_apremo.pdf in uploads folder
	if err := c.SaveFile(file, "./uploads/resume_apremo.pdf"); err != nil {
		log.Println("Error saving resume:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save file"})
	}

	return c.JSON(fiber.Map{"message": "Resume uploaded successfully", "url": "/uploads/resume_apremo.pdf"})
}
