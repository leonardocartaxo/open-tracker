package auth

import (
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user"
)

type Signup struct {
	Name     string `json:"name" binding:"required" example:"Test"`
	Email    string `json:"email" binding:"required,email" example:"test@test.com"`
	Password string `json:"password" binding:"required,min=6" example:"123456"`
}

type Signing struct {
	Email    string `json:"email" binding:"required,email" example:"test@test.com"`
	Password string `json:"password" binding:"required,min=6" example:"123456"`
}

type SignedUser struct {
	user.DTO
	Token string
}
