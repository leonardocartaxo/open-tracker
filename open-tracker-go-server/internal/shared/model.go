package shared

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type UserRefModel struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Name      string
	Email     string `gorm:"uniqueIndex"`
}

func (UserRefModel) TableName() string {
	return "users"
}

type OrganizationRefModel struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Name      string
	Email     string `gorm:"uniqueIndex"`
}

func (OrganizationRefModel) TableName() string { return "organizations" }
