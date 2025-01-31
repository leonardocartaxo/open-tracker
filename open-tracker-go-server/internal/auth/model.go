package auth

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user"
)

type Signing struct {
	Email    string `json:"email"`
	Password string `json:"password"`
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
