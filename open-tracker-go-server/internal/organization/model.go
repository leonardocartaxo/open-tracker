package organization

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
	Name      string
	Email     string `gorm:"uniqueIndex"`
	//Users     []shared.UserRefModel `gorm:"foreignKey:OrganizationID;references:ID"`
}

type DTO struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
}

type CreateDTO struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type UpdateDTO struct {
	CreateDTO
}

type FindOptions struct {
	Name  string
	Email string
	Start string
	End   string
}

type Models []*Model

func (Model) TableName() string {
	return "organizations"
}

func (m Model) ToDTO() DTO {
	return DTO{
		ID:        m.ID.String(),
		Name:      m.Name,
		Email:     m.Email,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}

func (m *DTO) ToModel() Model {
	return Model{Name: m.Name, Email: m.Email, CreatedAt: m.CreatedAt, UpdatedAt: m.UpdatedAt}
}

func (m *Models) ToDTO() []DTO {
	dtos := []DTO{}
	for _, model := range *m {
		dtos = append(dtos, model.ToDTO())
	}

	return dtos
}
