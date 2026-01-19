package models

import "gorm.io/gorm"

type AboutMe struct {
	gorm.Model
	Title           string `json:"title"`
	Content         string `gorm:"type:text" json:"content"`
	ProfileImageURL string `json:"profile_image_url"`
	// Could link to Resume model or just have ResumeURL here
}
