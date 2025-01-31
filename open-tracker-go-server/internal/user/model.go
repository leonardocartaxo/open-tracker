package user

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Model struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Name      string         `gorm:"not null"`
	Email     string         `gorm:"uniqueIndex;not null"`
	Password  string
}

type DTO struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
}

type CreateDTO struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UpdateDTO struct {
	CreateDTO
}

type FindOptions struct {
	Start string
	End   string
	Name  string
	Email string
}

type Models []*Model

func (Model) TableName() string {
	return "users"
}

func (m Model) ToDTO() DTO {
	return DTO{
		ID:        m.ID.String(),
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
		Name:      m.Name,
		Email:     m.Email,
		Password:  m.Password,
	}
}

func (m *DTO) ToModel() Model {
	return Model{
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
		Name:      m.Name,
		Email:     m.Email,
		Password:  m.Password,
	}
}

func (m *Models) ToDTO() []DTO {
	dtos := []DTO{}
	for _, model := range *m {
		dtos = append(dtos, model.ToDTO())
	}

	return dtos
}
