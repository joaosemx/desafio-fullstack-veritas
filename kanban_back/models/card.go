package models

import (
	"time"

	"gorm.io/gorm"
)

type Card struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Title       string         `json:"title" gorm:"not null"`
	Description string         `json:"description"`
	Status      string         `json:"status" gorm:"default:'todo'"`
	Author      string         `json:"author"`
	StartDate   *time.Time     `json:"start_date"`
	DueDate     *time.Time     `json:"due_date"`
	Progress    int            `json:"progress" gorm:"default:0"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}
