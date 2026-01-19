package models

import (
	"time"

	"gorm.io/gorm"
)

type Experience struct {
	gorm.Model
	Company     string    `gorm:"not null" json:"company"`
	Role        string    `gorm:"not null" json:"role"`
	StartDate   time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"` // Pointer to allow null (present)
	Description string    `gorm:"type:text" json:"description"`
	Location    string    `json:"location"`
	CompanyLink string    `json:"company_link"`
	Projects    []Project `gorm:"many2many:experience_projects;" json:"projects"`
}
