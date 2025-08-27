package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Resume struct {
	gorm.Model
	TechnicalSkills        datatypes.JSON `gorm:"type:jsonb" json:"technicalSkills"`
	ProfessionalExperience datatypes.JSON `gorm:"type:jsonb" json:"professionalExperience"`
	Projects               datatypes.JSON `gorm:"type:jsonb" json:"projects"`
	Education              datatypes.JSON `gorm:"type:jsonb" json:"education"`
}

type TechnicalSkills struct {
	Languages              string `json:"languages"`
	FrameworksAndLibraries string `json:"frameworks_libraries"`
	Databases              string `json:"databases"`
	Cloud                  string `json:"cloud"`
	DevOps                 string `json:"devops"`
	Utilities              string `json:"utilities"`
}

type Experience struct {
	Title     string   `json:"title"`
	Company   string   `json:"company"`
	Location  string   `json:"location"`
	DateRange string   `json:"dateRange"`
	Bullets   []string `json:"bullets"`
}

type Project struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Education struct {
	Institution string `json:"institution"`
	Degree      string `json:"degree"`
}
