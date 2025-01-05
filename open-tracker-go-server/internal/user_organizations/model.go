package user_organizations

import (
	"github.com/google/uuid"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/organization"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user"
	"gorm.io/gorm"
	"time"
)

type Model struct {
	gorm.Model
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
	UserID         uuid.UUID          `gorm:"type:uuid;not null;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	User           user.Model         `gorm:"foreignKey:OrganizationID;references:ID"`
	OrganizationID uuid.UUID          `gorm:"type:uuid;not null;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Organization   organization.Model `gorm:"foreignKey:OrganizationID;references:ID"`
}

type DTO struct {
	ID             string           `json:"id"`
	CreatedAt      time.Time        `json:"createdAt"`
	UpdatedAt      time.Time        `json:"updatedAt"`
	UserId         string           `json:"userId"`
	User           user.DTO         `json:"user"`
	OrganizationID string           `json:"organizationId"`
	Organization   organization.DTO `json:"organization"`
}

type CreateDTO struct {
	UserId         string `json:"userId"`
	OrganizationId string `json:"organizationId"`
}

type UpdateDTO struct {
	CreateDTO
}

type FindOptions struct {
	UserId         string
	OrganizationId string
}

type Models []*Model

func (Model) TableName() string {
	return "user_organizations"
}

func (m Model) ToDTO() DTO {
	return DTO{
		ID:        m.ID.String(),
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}

func (m *DTO) ToModel() Model {
	return Model{
		UserID:         uuid.MustParse(m.UserId),
		OrganizationID: uuid.MustParse(m.OrganizationID),
		CreatedAt:      m.CreatedAt,
		UpdatedAt:      m.UpdatedAt,
	}
}

func (m *Models) ToDTO() []DTO {
	dtos := []DTO{}
	for _, model := range *m {
		dtos = append(dtos, model.ToDTO())
	}

	return dtos
}
