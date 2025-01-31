package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user"
	"log/slog"
	"net/http"
)

type API struct {
	service *Service
	l       *slog.Logger
}

func NewApi(service *Service, l *slog.Logger) *API {
	return &API{service: service, l: l}
}

// Signing godoc
// @Summary      Signing
// @Description  Signing a user by giver form
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param		 signing	body	Signing	true	"Signing User"
// @Success      200  {object}  SignedUser
// @Failure      400
// @Failure      500
// @Router       /auth/signing [post]
func (a *API) Signing(c *gin.Context) {
	signing := &Signing{}
	err := c.ShouldBindJSON(signing)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	newUser, err := a.service.Signing(signing.Email, signing.Password)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusCreated, newUser)
}

// Signup godoc
// @Summary      Signup User
// @Description  Signup a user by giver form
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param		 user	body	user.CreateDTO	true	"Add User"
// @Success      201  {object}  user.DTO
// @Failure      500
// @Router       /auth/signup [post]
func (a *API) Signup(c *gin.Context) {
	createDTO := &user.CreateDTO{}
	err := c.ShouldBindJSON(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	newUser, err := a.service.Signup(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusCreated, newUser)
}
