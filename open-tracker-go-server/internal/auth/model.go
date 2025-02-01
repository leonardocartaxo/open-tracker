package auth

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user"
)

type Signup struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type Signing struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// Claims struct - this defines the structure of the JWT payload
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type SignedUser struct {
	user.DTO
	Token string
}
