package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/premo14/personal-website/backend/database"
	"github.com/premo14/personal-website/backend/models"
)

func GetHero(c *fiber.Ctx) error {
	var hero models.HeroSection
	database.DB.First(&hero) // Get the first (and only) one
	return c.JSON(hero)
}

func GetAboutMe(c *fiber.Ctx) error {
	var about models.AboutMe
	database.DB.First(&about)
	return c.JSON(about)
}

func GetSkills(c *fiber.Ctx) error {
	var categories []models.SkillCategory
	// Preload Skills and order by OrderIndex
	database.DB.Preload("Skills").Order("order_index asc").Find(&categories)
	return c.JSON(categories)
}

func GetExperience(c *fiber.Ctx) error {
	var exp []models.Experience
	// Preload Projects associated with experience
	database.DB.Preload("Projects").Order("start_date desc").Find(&exp)
	return c.JSON(exp)
}

func GetEducation(c *fiber.Ctx) error {
	var edu []models.Education
	database.DB.Order("start_date desc").Find(&edu)
	return c.JSON(edu)
}

func GetProjects(c *fiber.Ctx) error {
	var projects []models.Project
	database.DB.Order("featured desc, created_at desc").Find(&projects)
	return c.JSON(projects)
}
