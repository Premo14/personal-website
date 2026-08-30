package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/premo14/personal-website/backend/controllers"
	"github.com/premo14/personal-website/backend/middleware"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Auth
	api.Post("/auth/login", controllers.Login)

	// Public Routes
	public := api.Group("/public")
	public.Get("/hero", controllers.GetHero)
	public.Get("/about", controllers.GetAboutMe)
	public.Get("/skills", controllers.GetSkills)
	public.Get("/experience", controllers.GetExperience)
	public.Get("/education", controllers.GetEducation)
	public.Get("/projects", controllers.GetProjects)

	// Admin Routes (Protected)
	admin := api.Group("/admin", middleware.Protected())

	// Hero
	admin.Post("/hero", controllers.UpdateHero)

	// About
	admin.Post("/about", controllers.UpdateAboutMe)

	// Skills
	admin.Post("/skills", controllers.CreateSkill)
	admin.Put("/skills/:id", controllers.UpdateSkill)
	admin.Delete("/skills/:id", controllers.DeleteSkill)

	// Skill Categories
	admin.Post("/skill-categories", controllers.CreateSkillCategory)
	admin.Put("/skill-categories/:id", controllers.UpdateSkillCategory)
	admin.Delete("/skill-categories/:id", controllers.DeleteSkillCategory)

	// Experience
	admin.Post("/experience", controllers.CreateExperience)
	admin.Put("/experience/:id", controllers.UpdateExperience)
	admin.Delete("/experience/:id", controllers.DeleteExperience)

	// Education
	admin.Post("/education", controllers.CreateEducation)
	admin.Put("/education/:id", controllers.UpdateEducation)
	admin.Delete("/education/:id", controllers.DeleteEducation)

	// Projects
	admin.Post("/projects", controllers.CreateProject)
	admin.Put("/projects/:id", controllers.UpdateProject)
	admin.Delete("/projects/:id", controllers.DeleteProject)

	// Resume
	admin.Post("/resume", controllers.UploadResume)

	// Generic Image Upload
}
