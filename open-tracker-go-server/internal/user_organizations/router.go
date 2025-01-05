package user_organizations

import (
	"github.com/gin-gonic/gin"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/shared"
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
	usersRepo := Repository{
		BaseRepository: shared.BaseRepository[Model]{DB: r.db, Logger: r.l},
	}
	userService := Service{
		BaseService: shared.BaseService[Model, DTO, CreateDTO, UpdateDTO]{
			Repo:        &usersRepo,
			EntityToDto: Model.ToDTO,
			Logger:      r.l,
			DtoFactory: func() DTO {
				return DTO{}
			},
		},
	}
	api := NewApi(&userService, r.l)

	r.rg.POST("/", api.Create)
	r.rg.DELETE("/:id", api.DeleteById)
	r.rg.GET("/", api.Find)
}
