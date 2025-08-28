package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/premo14/personal-website/backend/controllers"
)

func TechStackRoutes(router fiber.Router) {
	router.Get("/tech-stack", controllers.GetTechStack)
	router.Post("/tech-stack", controllers.CreateTool)
	router.Put("/tech-stack", controllers.UpdateTechStack)
	router.Delete("/tech-stack/:name", controllers.DeleteTool)
	router.Post("/tech-stack/bulk", controllers.BulkCreateTools)
}
