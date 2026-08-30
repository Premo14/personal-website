package models

import (
	"time"

	"gorm.io/gorm"
)

type Education struct {
	gorm.Model
	Type        string     `gorm:"not null" json:"type"`
	Institution string     `gorm:"not null" json:"institution"`
	Title       string     `gorm:"not null" json:"title"`
	StartDate   time.Time  `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	Description string     `json:"description" gorm:"type:text"`
}
