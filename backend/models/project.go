package models

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type PortfolioProject struct {
	gorm.Model
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Tools       datatypes.JSON `gorm:"type:jsonb;not null" json:"tools"`
	Description string         `gorm:"type:text;not null" json:"description"`
	SourceLink  string         `gorm:"type:text" json:"sourceLink"`
	LiveLink    string         `gorm:"type:text" json:"liveLink"`
	PublishedAt *time.Time     `gorm:"column:published_at" json:"publishedAt,omitempty"`
	Featured    bool           `gorm:"default:false" json:"featured"`
	Thumbnail   string         `gorm:"type:text" json:"thumbnail"`
}
