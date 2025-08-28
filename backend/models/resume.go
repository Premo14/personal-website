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
