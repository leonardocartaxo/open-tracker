package tracker_locations

import (
	"github.com/google/uuid"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/tracker"
	"gorm.io/gorm"
	"time"
)

type Model struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Latitude  float32        `gorm:"not null"`
	Longitude float32        `gorm:"not null"`
	TrackerID uuid.UUID      `gorm:"type:uuid;not null;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Tracker   tracker.Model  `gorm:"foreignKey:TrackerID;references:ID"`
}

type DTO struct {
	ID        string      `json:"id"`
	CreatedAt time.Time   `json:"createdAt"`
	UpdatedAt time.Time   `json:"updatedAt"`
	Latitude  float32     `json:"latitude"`
	Longitude float32     `json:"longitude"`
	TrackerID string      `json:"trackerId"`
	Tracker   tracker.DTO `json:"tracker"`
}

type CreateDTO struct {
	Latitude  float32 `json:"latitude"`
	Longitude float32 `json:"longitude"`
	TrackerId string  `json:"trackerId"`
}

type UpdateDTO struct {
	CreateDTO
}

type FindOptions struct {
	Start     string
	End       string
	TrackerId string
}

type Models []*Model

func (Model) TableName() string {
	return "tracker_locations"
}

func (m Model) ToDTO() DTO {
	return DTO{
		ID:        m.ID.String(),
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
		Latitude:  m.Latitude,
		Longitude: m.Longitude,
	}
}

func (m *DTO) ToModel() Model {
	return Model{
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
		Latitude:  m.Latitude,
		Longitude: m.Longitude,
		TrackerID: uuid.MustParse(m.TrackerID),
	}
}

func (m *Models) ToDTO() []DTO {
	dtos := []DTO{}
	for _, model := range *m {
		dtos = append(dtos, model.ToDTO())
	}

	return dtos
}
