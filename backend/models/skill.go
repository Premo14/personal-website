package models

import "gorm.io/gorm"

type Skill struct {
	gorm.Model
	Name            string `gorm:"not null" json:"name"`
	IconURL         string `json:"icon_url"`
	Proficiency     int    `json:"proficiency"` // 0-100 or 1-5
	SkillCategoryID uint   `json:"skill_category_id"`
}
