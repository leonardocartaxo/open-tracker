package user

import (
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/shared"
)

type Service struct {
	shared.BaseService[Model, DTO, CreateDTO, UpdateDTO]
}
