package models

import "gorm.io/gorm"

type AboutMe struct {
	gorm.Model
	Title   string `json:"title"`
	Content string `gorm:"type:text" json:"content"`
}
