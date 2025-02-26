package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/shared"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user"
	"net/http"
	"strings"
	"time"
)

type Middleware struct {
	JwtSecret string
}

// Auth checks for the Bearer token in the Authorization header
func (m *Middleware) Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		const bearerPrefix = "Bearer "

		// Retrieve the Authorization header.
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, bearerPrefix) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
			c.Abort()
			return
		}

		// Extract the token.
		tokenString := strings.TrimPrefix(authHeader, bearerPrefix)

		// Parse and validate the token.
		token, err := jwt.ParseWithClaims(tokenString, &shared.Claims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(m.JwtSecret), nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Cast token claims to our Claims type.
		claims, ok := token.Claims.(*shared.Claims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Inject the user information into the context.
		// Here, we're simply using the username from the token claims.
		// You could inject a full user struct if available.
		c.Set(shared.ClaimsKey, claims)

		// Proceed to subsequent handlers.
		c.Next()
	}
}

// GenerateJWT generates a new JWT token
func (m *Middleware) generateJWT(userDto user.DTO) (string, error) {
	// Set token expiration time
	expirationTime := time.Now().Add(1 * time.Hour)

	// Create the claims
	claims := &shared.Claims{
		ID:        userDto.ID,
		CreatedAt: userDto.CreatedAt,
		UpdatedAt: userDto.UpdatedAt,
		Name:      userDto.Name,
		Email:     userDto.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	// Create the token using the HS256 algorithm and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(m.JwtSecret))
}
