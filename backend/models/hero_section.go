package models

import "gorm.io/gorm"

type HeroSection struct {
	gorm.Model
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	CTAText  string `json:"cta_text"`
	CTALink  string `json:"cta_link"`
}
