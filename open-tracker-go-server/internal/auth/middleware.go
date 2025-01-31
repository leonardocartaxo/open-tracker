package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strings"
	"time"
)

// TODO change this to your secret key
var jwtSecret = []byte("your_secret_key") // Replace with your secret key

// AuthMiddleware checks for the Bearer token in the Authorization header
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		const BearerSchema = "Bearer "
		authHeader := c.GetHeader("Authorization")

		// Check if the Authorization header contains the Bearer token
		if authHeader == "" || !strings.HasPrefix(authHeader, BearerSchema) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
			c.Abort()
			return
		}

		// Extract the token from the header
		token := strings.TrimPrefix(authHeader, BearerSchema)

		// (Optional) Validate the token here - e.g., decode JWT or verify against database
		if !isTokenValid(token) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Proceed to the next handler if the token is valid
		c.Next()
	}
}

// Dummy token validation function
func isTokenValid(token string) bool {
	// In a real application, you would validate the token here
	// For example, check if it's a valid JWT or exists in a database
	return token == "valid-token" // Replace with actual token validation logic
}

// GenerateJWT generates a new JWT token
func generateJWT(username string) (string, error) {
	// Set token expiration time
	expirationTime := time.Now().Add(1 * time.Hour)

	// Create the claims
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	// Create the token using the HS256 algorithm and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(jwtSecret)
}
