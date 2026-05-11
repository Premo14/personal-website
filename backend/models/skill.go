package models

import "gorm.io/gorm"

type Skill struct {
	gorm.Model
	Name            string `gorm:"not null" json:"name"`
	IconURL         string `json:"icon_url"`
	SkillCategoryID uint   `json:"skill_category_id"`
}
