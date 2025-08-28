package controllers

import (
	"encoding/json"
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/premo14/personal-website/backend/database"
	"github.com/premo14/personal-website/backend/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type ProjectInput struct {
	Title       string   `json:"title"`
	Tools       []string `json:"tools"`
	Description string   `json:"description"`
	SourceLink  string   `json:"sourceLink"`
	LiveLink    string   `json:"liveLink"`
	PublishedAt string   `json:"publishedAt"`
	Featured    *bool    `json:"featured"`
	Thumbnail   string   `json:"thumbnail"`
}

func parsePublishedAtPtr(s string) *time.Time {
	s = strings.TrimSpace(s)
	if s == "" {
		return nil
	}
	layouts := []string{time.RFC3339, "2006-01-02", "2006-01"}
	for _, l := range layouts {
		if t, err := time.Parse(l, s); err == nil {
			return &t
		}
	}
	return nil
}

func buildOrderParam(sort string) string {
	if sort == "" {
		return "published_at DESC NULLS LAST, created_at DESC"
	}
	parts := strings.Split(sort, ":")
	field := strings.ToLower(strings.TrimSpace(parts[0]))
	dir := "DESC"
	if len(parts) > 1 {
		d := strings.ToUpper(strings.TrimSpace(parts[1]))
		if d == "ASC" || d == "DESC" {
			dir = d
		}
	}
	switch field {
	case "publishedat", "published_at":
		return "published_at " + dir + " NULLS LAST, created_at DESC"
	case "createdat", "created_at":
		return "created_at " + dir
	default:
		return "published_at DESC NULLS LAST, created_at DESC"
	}
}

func GetProjects(c *fiber.Ctx) error {
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")
	sort := c.Query("sort")

	var limit, offset int
	if limitStr != "" {
		if v, err := strconv.Atoi(limitStr); err == nil && v > 0 {
			limit = v
		}
	}
	if offsetStr != "" {
		if v, err := strconv.Atoi(offsetStr); err == nil && v >= 0 {
			offset = v
		}
	}

	order := buildOrderParam(sort)

	query := database.DB.Model(&models.PortfolioProject{}).Order(order)
	if limit > 0 {
		query = query.Limit(limit)
	}
	if offset > 0 {
		query = query.Offset(offset)
	}

	var projects []models.PortfolioProject
	if err := query.Find(&projects).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve projects"})
	}
	return c.JSON(projects)
}

func GetProject(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid project ID"})
	}

	var project models.PortfolioProject
	if err := database.DB.First(&project, uint(id)).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Project not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve project"})
	}

	return c.JSON(project)
}

func CreateProject(c *fiber.Ctx) error {
	var input ProjectInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid JSON input"})
	}
	if strings.TrimSpace(input.Title) == "" || strings.TrimSpace(input.Description) == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Title and Description are required"})
	}

	toolsJSON, _ := json.Marshal(input.Tools)
	project := models.PortfolioProject{
		Title:       input.Title,
		Tools:       datatypes.JSON(toolsJSON),
		Description: input.Description,
		SourceLink:  input.SourceLink,
		LiveLink:    input.LiveLink,
		PublishedAt: parsePublishedAtPtr(input.PublishedAt),
		Featured:    false,
		Thumbnail:   input.Thumbnail,
	}
	if input.Featured != nil {
		project.Featured = *input.Featured
	}

	if err := database.DB.Create(&project).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create project"})
	}

	return c.Status(fiber.StatusCreated).JSON(project)
}

func UpdateProjects(c *fiber.Ctx) error {
	var incoming []ProjectInput
	if err := c.BodyParser(&incoming); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid JSON input"})
	}
	if len(incoming) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No projects provided"})
	}

	if err := database.DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.PortfolioProject{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to clear old projects"})
	}

	toCreate := make([]models.PortfolioProject, 0, len(incoming))
	for _, p := range incoming {
		toolsJSON, _ := json.Marshal(p.Tools)
		item := models.PortfolioProject{
			Title:       p.Title,
			Tools:       datatypes.JSON(toolsJSON),
			Description: p.Description,
			SourceLink:  p.SourceLink,
			LiveLink:    p.LiveLink,
			PublishedAt: parsePublishedAtPtr(p.PublishedAt),
			Featured:    false,
			Thumbnail:   p.Thumbnail,
		}
		if p.Featured != nil {
			item.Featured = *p.Featured
		}
		toCreate = append(toCreate, item)
	}

	if err := database.DB.Create(&toCreate).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create new projects"})
	}

	return c.JSON(fiber.Map{"message": "Projects updated successfully"})
}

func DeleteProject(c *fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid project ID"})
	}

	if err := database.DB.Delete(&models.PortfolioProject{}, uint(id)).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete project"})
	}

	return c.JSON(fiber.Map{"message": "Project deleted successfully"})
}

func BulkCreateProjects(c *fiber.Ctx) error {
	var inputs []ProjectInput
	if err := c.BodyParser(&inputs); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid JSON input"})
	}
	if len(inputs) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No projects provided"})
	}

	toCreate := make([]models.PortfolioProject, 0, len(inputs))
	for _, p := range inputs {
		if strings.TrimSpace(p.Title) == "" || strings.TrimSpace(p.Description) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Each project must have a Title and Description"})
		}
		toolsJSON, _ := json.Marshal(p.Tools)
		item := models.PortfolioProject{
			Title:       p.Title,
			Tools:       datatypes.JSON(toolsJSON),
			Description: p.Description,
			SourceLink:  p.SourceLink,
			LiveLink:    p.LiveLink,
			PublishedAt: parsePublishedAtPtr(p.PublishedAt),
			Featured:    false,
			Thumbnail:   p.Thumbnail,
		}
		if p.Featured != nil {
			item.Featured = *p.Featured
		}
		toCreate = append(toCreate, item)
	}

	if err := database.DB.Create(&toCreate).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create projects"})
	}

	return c.Status(fiber.StatusCreated).JSON(toCreate)
}
