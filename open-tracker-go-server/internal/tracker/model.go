package tracker

import (
	"github.com/google/uuid"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/organization"
	"gorm.io/gorm"
	"time"
)

type Model struct {
	gorm.Model
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      gorm.DeletedAt     `gorm:"index"`
	Name           string             `gorm:"not null"`
	OrganizationID uuid.UUID          `gorm:"type:uuid;not null;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Organization   organization.Model `gorm:"foreignKey:OrganizationID;references:ID"`
}

type DTO struct {
	ID             string           `json:"id"`
	CreatedAt      time.Time        `json:"createdAt"`
	UpdatedAt      time.Time        `json:"updatedAt"`
	Name           string           `json:"name"`
	OrganizationID string           `json:"organizationId"`
	Organization   organization.DTO `json:"organization"`
}

type CreateDTO struct {
	Name           string `json:"name"`
	OrganizationID string `json:"organizationId"`
}

type UpdateDTO struct {
	CreateDTO
}

type FindOptions struct {
	Start string
	End   string
	Name  string
}

type Models []*Model

func (Model) TableName() string {
	return "trackers"
}

func (m Model) ToDTO() DTO {
	return DTO{
		ID:             m.ID.String(),
		Name:           m.Name,
		CreatedAt:      m.CreatedAt,
		UpdatedAt:      m.UpdatedAt,
		OrganizationID: m.OrganizationID.String(),
	}
}

func (m *DTO) ToModel() Model {
	return Model{
		CreatedAt:      m.CreatedAt,
		UpdatedAt:      m.UpdatedAt,
		Name:           m.Name,
		OrganizationID: uuid.MustParse(m.OrganizationID),
	}
}

func (m *Models) ToDTO() []DTO {
	dtos := []DTO{}
	for _, model := range *m {
		dtos = append(dtos, model.ToDTO())
	}

	return dtos
}
