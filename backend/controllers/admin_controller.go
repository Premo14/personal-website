package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/premo14/personal-website/backend/database"
	"github.com/premo14/personal-website/backend/models"
)

// Generic function to create handler for creating any model
func CreateEntity(model interface{}) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if err := c.BodyParser(model); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		if err := database.DB.Create(model).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(model)
	}
}


func UpdateHero(c *fiber.Ctx) error {
	var hero models.HeroSection
	if err := c.BodyParser(&hero); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	var count int64
	database.DB.Model(&models.HeroSection{}).Count(&count)
	if count == 0 {
		database.DB.Create(&hero)
	} else {
		// Assuming ID 1 or just update first
		var first models.HeroSection
		database.DB.First(&first)
		hero.ID = first.ID // Keep same ID
		database.DB.Save(&hero)
	}
	return c.JSON(hero)
}

// --- Skills ---
func CreateSkill(c *fiber.Ctx) error {
	skill := new(models.Skill)
	if err := c.BodyParser(skill); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Create(&skill)
	return c.JSON(skill)
}

func UpdateSkill(c *fiber.Ctx) error {
	id := c.Params("id")
	var skill models.Skill
	if err := database.DB.First(&skill, id).Error; err != nil {
		return c.Status(404).SendString("Not found")
	}
	if err := c.BodyParser(&skill); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Save(&skill)
	return c.JSON(skill)
}

func DeleteSkill(c *fiber.Ctx) error {
	id := c.Params("id")
	database.DB.Delete(&models.Skill{}, id)
	return c.SendStatus(200)
}

// --- Experience ---
func CreateExperience(c *fiber.Ctx) error {
	exp := new(models.Experience)
	if err := c.BodyParser(exp); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Create(&exp)
	return c.JSON(exp)
}
func UpdateExperience(c *fiber.Ctx) error {
	id := c.Params("id")
	var exp models.Experience
	if err := database.DB.First(&exp, id).Error; err != nil {
		return c.Status(404).SendString("Not found")
	}
	if err := c.BodyParser(&exp); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Save(&exp)
	return c.JSON(exp)
}
func DeleteExperience(c *fiber.Ctx) error {
	id := c.Params("id")
	database.DB.Delete(&models.Experience{}, id)
	return c.SendStatus(200)
}

// --- Education ---
func CreateEducation(c *fiber.Ctx) error {
	edu := new(models.Education)
	if err := c.BodyParser(edu); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Create(&edu)
	return c.JSON(edu)
}
func UpdateEducation(c *fiber.Ctx) error {
	id := c.Params("id")
	var edu models.Education
	if err := database.DB.First(&edu, id).Error; err != nil {
		return c.Status(404).SendString("Not found")
	}
	if err := c.BodyParser(&edu); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Save(&edu)
	return c.JSON(edu)
}
func DeleteEducation(c *fiber.Ctx) error {
	id := c.Params("id")
	database.DB.Delete(&models.Education{}, id)
	return c.SendStatus(200)
}

// --- Projects ---
func CreateProject(c *fiber.Ctx) error {
	proj := new(models.Project)
	if err := c.BodyParser(proj); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Create(&proj)
	return c.JSON(proj)
}
func UpdateProject(c *fiber.Ctx) error {
	id := c.Params("id")

	var proj models.Project
	if err := database.DB.Where("id = ?", id).First(&proj).Error; err != nil {
		return c.Status(404).SendString("Not found")
	}
	if err := c.BodyParser(&proj); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Save(&proj)
	return c.JSON(proj)
}
func DeleteProject(c *fiber.Ctx) error {
	id := c.Params("id")
	database.DB.Delete(&models.Project{}, id)
	return c.SendStatus(200)
}

// --- SkillCategories ---
func CreateSkillCategory(c *fiber.Ctx) error {
	cat := new(models.SkillCategory)
	if err := c.BodyParser(cat); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Create(&cat)
	return c.JSON(cat)
}
func UpdateSkillCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	var cat models.SkillCategory
	if err := database.DB.First(&cat, id).Error; err != nil {
		return c.Status(404).SendString("Not found")
	}
	if err := c.BodyParser(&cat); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	database.DB.Save(&cat)
	return c.JSON(cat)
}
func DeleteSkillCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	database.DB.Delete(&models.SkillCategory{}, id)
	return c.SendStatus(200)
}

// --- AboutMe ---
func UpdateAboutMe(c *fiber.Ctx) error {
	var about models.AboutMe
	if err := c.BodyParser(&about); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	var count int64
	database.DB.Model(&models.AboutMe{}).Count(&count)
	if count == 0 {
		database.DB.Create(&about)
	} else {
		var first models.AboutMe
		database.DB.First(&first)
		about.ID = first.ID
		database.DB.Save(&about)
	}
	return c.JSON(about)
}
