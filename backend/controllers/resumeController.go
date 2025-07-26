package controllers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/premo14/personal-website/backend/database"
	"github.com/premo14/personal-website/backend/models"
	"gorm.io/gorm"
)

// GetResume GET /resume
func GetResume(c *fiber.Ctx) error {
	var resume models.Resume
	result := database.DB.First(&resume)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(404).JSON(fiber.Map{"error": "Resume not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Internal server error"})
	}

	return c.JSON(resume)
}

// UpdateResume PUT /resume
func UpdateResume(c *fiber.Ctx) error {
	var input models.Resume
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid JSON input",
		})
	}

	var resume models.Resume
	db := database.DB

	if err := db.First(&resume, 1).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&input).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to create resume",
				})
			}
			return c.Status(fiber.StatusCreated).JSON(fiber.Map{
				"message": "Resume created successfully",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve resume",
		})
	}

	resume.TechnicalSkills = input.TechnicalSkills
	resume.ProfessionalExperience = input.ProfessionalExperience
	resume.Projects = input.Projects
	resume.Education = input.Education

	if err := db.Save(&resume).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update resume",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Resume updated successfully",
	})
}
