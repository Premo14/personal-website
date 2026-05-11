package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"gorm.io/gorm"
)

// Helper for JSONB or simple JSON storage
type JSONStringArray []string

func (a *JSONStringArray) Scan(value interface{}) error {
	if value == nil {
		*a = make([]string, 0)
		return nil
	}
	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("type assertion failed: value is neither []byte nor string")
	}
	return json.Unmarshal(bytes, a)
}

func (a JSONStringArray) Value() (driver.Value, error) {
	return json.Marshal(a)
}

type Project struct {
	gorm.Model
	Title            string          `gorm:"not null" json:"title"`
	ShortDescription string          `gorm:"type:text" json:"short_description"`
	Description      string          `gorm:"type:text" json:"description"`
	Technologies     JSONStringArray `gorm:"type:text" json:"technologies"`
	DemoLink         string          `json:"demo_link"`
	GithubLink       string          `json:"github_link"`
	StartDate        time.Time       `json:"start_date"`
	EndDate          *time.Time      `json:"end_date"`
	Featured         bool            `json:"featured"`
	IsPersonal       bool            `json:"is_personal" gorm:"default:false"`
	Overview         string          `json:"overview" gorm:"type:text"`
	// Belongs To Relationship
	ExperienceID *uint      `json:"experience_id"`
	Experience   Experience `json:"experience"`
}
