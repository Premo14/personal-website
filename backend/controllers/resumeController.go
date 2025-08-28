package controllers

import (
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/premo14/personal-website/backend/database"
	"github.com/premo14/personal-website/backend/models"
	"gorm.io/gorm"
)

// GetResume GET /resume
// Always return the most recently updated resume and disable caching
func GetResume(c *fiber.Ctx) error {
	var resume models.Resume
	if err := database.DB.Order("updated_at DESC, id DESC").First(&resume).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Resume not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}
	c.Set("Cache-Control", "no-store")
	return c.JSON(resume)
}

// UpdateResume PUT /resume
// Updates the latest resume (or creates one) and returns the fresh record; disable caching.
func UpdateResume(c *fiber.Ctx) error {
	var input models.Resume
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid JSON input"})
	}

	var resume models.Resume
	tx := database.DB.Order("updated_at DESC, id DESC").First(&resume)

	if tx.Error != nil {
		if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
			if err := database.DB.Create(&input).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create resume"})
			}
			// Return the created resume
			c.Set("Cache-Control", "no-store")
			return c.Status(fiber.StatusCreated).JSON(input)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve resume"})
	}

	resume.TechnicalSkills = input.TechnicalSkills
	resume.ProfessionalExperience = input.ProfessionalExperience
	resume.Projects = input.Projects
	resume.Education = input.Education

	if err := database.DB.Save(&resume).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update resume"})
	}

	c.Set("Cache-Control", "no-store")
	return c.JSON(resume)
}

// GetResumeProjects GET /resume/projects?limit=5
func GetResumeProjects(c *fiber.Ctx) error {
	limit := 5
	if q := c.Query("limit"); q != "" {
		if v, err := strconv.Atoi(q); err == nil && v > 0 {
			limit = v
		}
	}

	order := "published_at DESC NULLS LAST, created_at DESC"
	var projects []models.PortfolioProject
	if err := database.DB.Order(order).Limit(limit).Find(&projects).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to load projects"})
	}

	c.Set("Cache-Control", "no-store")
	return c.JSON(projects)
}
