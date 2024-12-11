package organization

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
	organizationsRepo := Repository{
		BaseRepository: shared.BaseRepository[Model]{DB: r.db, Logger: r.l},
	}
	organizationService := Service{
		BaseService: shared.BaseService[Model, DTO, CreateDTO, UpdateDTO]{
			Repo:        &organizationsRepo,
			EntityToDto: Model.ToDTO,
			Logger:      r.l,
			DtoFactory: func() DTO {
				return DTO{}
			},
		},
	}
	api := NewApi(&organizationService, r.l)

	r.rg.POST("/", api.Create)
	r.rg.GET("/:id", api.FindById)
	r.rg.POST("/:id", api.UpdateById)
	r.rg.GET("/", api.Find)
}
