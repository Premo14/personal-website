package config

import (
	"os"
)

type Config struct {
	// Backend config
	Port   string
	AppEnv string

	// Frontend Vite config
	ViteBuildStage       string
	VitePort             string
	ViteBackendPort      string
	ViteHost             string
	ViteResumeUploadPass string

	// Database config
	DBDriver   string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
}

func LoadConfig() *Config {
	return &Config{

		// Frontend (Vite)
		ViteBuildStage:       getEnv("VITE_BUILD_STAGE", "development"),
		VitePort:             getEnv("VITE_PORT", "5173"),
		ViteBackendPort:      getEnv("VITE_BACKEND_PORT", "8080"),
		ViteHost:             getEnv("VITE_HOST", "0.0.0.0"),
		ViteResumeUploadPass: getEnv("VITE_RESUME_UPLOAD_PASSCODE", ""),

		// Database
		DBDriver:   getEnv("DB_DRIVER", "postgres"),
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", ""),
	}
}

func getEnv(key, defaultValue string) string {
	val := os.Getenv(key)
	if val == "" {
		return defaultValue
	}
	return val
}
