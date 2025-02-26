package shared

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// BaseFindCondition defines a flexible condition with a comparator
type BaseFindCondition struct {
	Field      string
	Comparator string
	Value      interface{}
}

type Tabler interface {
	TableName() string
}

func GetUserFromGinContext(c *gin.Context) (*UserRefDTO, error) {
	claimsRaw, exists := c.Get(ClaimsKey)
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User data not found in context"})
		return &UserRefDTO{}, nil
	}

	claims, ok := claimsRaw.(*Claims)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User data has unexpected type"})
		return &UserRefDTO{}, nil
	}

	return &UserRefDTO{
		ID:        claims.ID,
		CreatedAt: claims.CreatedAt,
		UpdatedAt: claims.UpdatedAt,
		Name:      claims.Name,
		Email:     claims.Email,
	}, nil
}
