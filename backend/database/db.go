package database

import (
	"fmt"
	"log"
	"time"

	"github.com/premo14/personal-website/backend/config"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	conf := config.LoadConfig()

	var db *gorm.DB
	var err error

	if conf.DBDriver == "sqlite" {
		db, err = gorm.Open(sqlite.Open(conf.DBName), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	} else {
		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
			conf.DBHost,
			conf.DBUser,
			conf.DBPassword,
			conf.DBName,
			conf.DBPort,
		)
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	}

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get database instance: %v", err)
	}

	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(1 * time.Hour)

	DB = db
}
