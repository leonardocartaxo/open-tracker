package user

import (
	"github.com/gin-gonic/gin"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/shared"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
)

type API struct {
	service *Service
	l       *slog.Logger
}

func NewApi(service *Service, l *slog.Logger) *API {
	return &API{service: service, l: l}
}

// SaveUser godoc
// @Summary      Save User
// @Description  Save a user by giver form
// @Tags         users
// @Accept       json
// @Produce      json
// @Param		 user	body	CreateDTO	true	"Add User"
// @Success      201  {object}  DTO
// @Failure      500
// @Security     BearerAuth
// @Router       /users [post]
func (a *API) Create(c *gin.Context) {
	createDTO := &CreateDTO{}
	err := c.ShouldBindJSON(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	newUser, err := a.service.Create(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}

	c.JSON(http.StatusCreated, newUser)
}

// GetMe godoc
// @Summary      Get the user by the provided token
// @Description  Returns the user by the provided token.
// @Tags         users
// @Accept       json
// @Produce      json
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      500
// @Security     BearerAuth
// @Router       /users/me [get]
func (a *API) GetMe(c *gin.Context) {
	user, err := shared.GetUserFromGinContext(c)
	if err != nil {
		a.l.Error(err.Error())
		c.Status(http.StatusInternalServerError)
	}

	c.JSON(http.StatusOK, user)
}

// FindOneUser godoc
// @Summary      Find one an User
// @Description  Find one User by ID
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "User ID"
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      404
// @Failure      500
// @Security     BearerAuth
// @Router       /users/{id} [get]
func (a *API) FindById(c *gin.Context) {
	id := c.Param("id")
	user, err := a.service.GetById(id)
	if err != nil {
		c.Status(http.StatusNotFound)
	}

	c.JSON(http.StatusOK, user)
}

// UpdateOneUser godoc
// @Summary      Update one an User
// @Description  Update one User by ID
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "User ID"
// @Param        user   body	UpdateDTO  true  "Update User"
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      404
// @Failure      500
// @Security     BearerAuth
// @Router       /users/{id} [post]
func (a *API) UpdateById(c *gin.Context) {
	id := c.Param("id")
	updateDTO := &UpdateDTO{}
	err := c.ShouldBindJSON(updateDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	user, err := a.service.Update(id, updateDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	c.JSON(http.StatusOK, user)
}

// FilterUsers godoc
// @Summary      Filter Users
// @Description  Filter Users by query paramenters
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        start   query      string  false  "User createdAt start date"
// @Param        end   query      string  false  "User createdAt end date"
// @Param        populate   query      string  false  "User populate properties"
// @Param        limit   query      int  false  "User pagination limit"
// @Param        offset   query      int  false  "User pagination limit"
// @Param        name   query      string  false  "User name"
// @Param        email   query      string  false  "User email"
// @Success      200  {object}  []DTO
// @Failure      400
// @Failure      500
// @Security     BearerAuth
// @Router       /users [get]
func (a *API) Find(c *gin.Context) {
	start := c.Query("start")
	end := c.Query("end")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")
	populateFieldsStr := c.Query("populateFields")
	name := c.Query("name")
	email := c.Query("email")

	// Query options
	var conditions []shared.BaseFindCondition
	if start != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "created_at", Comparator: ">=", Value: start})
	}
	if end != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "created_at", Comparator: "<=", Value: end})
	}
	if name != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "name", Comparator: "=", Value: name})
	}
	if email != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "email", Comparator: "=", Value: email})
	}

	var populateFields []string
	if populateFieldsStr != "" {
		populateFields = strings.Split(populateFieldsStr, ",")
	}

	limit := 10
	if limitStr != "" {
		limit, _ = strconv.Atoi(limitStr)
	}
	offset := 0
	if limitStr != "" {
		offset, _ = strconv.Atoi(offsetStr)
	}

	orderBy := "created_at desc"

	dtos, err := a.service.Find(conditions, populateFields, orderBy, limit, offset)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}

	c.JSON(http.StatusOK, dtos)
}
