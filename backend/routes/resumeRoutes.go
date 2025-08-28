package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/premo14/personal-website/backend/controllers"
)

func ResumeRoutes(router fiber.Router) {
	router.Get("/resume", controllers.GetResume)
	router.Put("/resume", controllers.UpdateResume)
	router.Get("/resume/projects", controllers.GetResumeProjects)
}
