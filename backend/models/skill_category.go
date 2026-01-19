package models

import "gorm.io/gorm"

type SkillCategory struct {
	gorm.Model
	Name       string  `gorm:"not null" json:"name"`
	OrderIndex int     `json:"order_index"`
	Skills     []Skill `gorm:"foreignKey:SkillCategoryID" json:"skills"`
}
