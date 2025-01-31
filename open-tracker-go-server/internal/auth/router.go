package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/shared"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user"
	"gorm.io/gorm"
	"log/slog"
)

type Router struct {
	db *gorm.DB
	rg *gin.RouterGroup
	l  *slog.Logger
}

func NewRouter(db *gorm.DB, rg *gin.RouterGroup, l *slog.Logger) *Router {
	return &Router{db: db, rg: rg, l: l}
}

func (r *Router) Route() {
	usersRepo := user.Repository{
		BaseRepository: shared.BaseRepository[user.Model]{DB: r.db, Logger: r.l},
	}
	userService := user.Service{
		BaseService: shared.BaseService[user.Model, user.DTO, user.CreateDTO, user.UpdateDTO]{
			Repo:        &usersRepo,
			EntityToDto: user.Model.ToDTO,
			Logger:      r.l,
			DtoFactory: func() user.DTO {
				return user.DTO{}
			},
		},
	}
	authService := Service{UserService: userService}
	api := NewApi(&authService, r.l)

	r.rg.POST("/signup", api.Signup)
	r.rg.POST("/signing", api.Signing)
}
