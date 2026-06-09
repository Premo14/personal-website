package controllers

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/premo14/personal-website/backend/middleware"
)

func Login(c *fiber.Ctx) error {
	var input struct {
		Password string `json:"password"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	passphrase := os.Getenv("ADMIN_PASSPHRASE")
	if passphrase == "" {
		// Ensure ADMIN_PASSPHRASE is configured
		log.Println("WARNING: ADMIN_PASSPHRASE not set")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Server misconfiguration"})
	}

	if input.Password != passphrase {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": 1,
		"role":    "admin",
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	t, err := token.SignedString(middleware.SecretKey)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not generate token"})
	}

	return c.JSON(fiber.Map{"token": t})
}
