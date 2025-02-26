package user_organizations

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

// SaveUserOrganization godoc
// @Summary      Save UserOrganization
// @Description  Save a UserOrganization by giver form
// @Tags         userOrganizations
// @Accept       json
// @Produce      json
// @Param		 user	body	CreateDTO	true	"Add User"
// @Success      201  {object}  DTO
// @Failure      500
// @Security     BearerAuth
// @Router       /userOrganizations [post]
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

// TODO
//func (a *API) FindByMe(c *gin.Context) {
//	id := c.Param("id")
//	user, err := a.service.GetById(id)
//	if err != nil {
//		c.Status(http.StatusNotFound)
//	}
//
//	c.JSON(http.StatusOK, user)
//}

// DeleteUserOrganizations godoc
// @Summary      Delete one an UserOrganization
// @Description  Delete one UserOrganization by ID
// @Tags         userOrganizations
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "UserOrganizatio ID"
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      404
// @Failure      500
// @Security     BearerAuth
// @Router       /userOrganizations/{id} [get]
func (a *API) DeleteById(c *gin.Context) {
	id := c.Param("id")
	user, err := a.service.Delete(id)
	if err != nil {
		c.Status(http.StatusNotFound)
	}

	c.JSON(http.StatusOK, user)
}

// FilterUserOrganizations godoc
// @Summary      Filter UserOrganizations
// @Description  Filter UserOrganizations by query paramenters
// @Tags         userOrganizations
// @Accept       json
// @Produce      json
// @Param        start   query      string  false  "User createdAt start date"
// @Param        end   query      string  false  "User createdAt end date"
// @Param        populate   query      string  false  "User populate properties"
// @Param        limit   query      int  false  "User pagination limit"
// @Param        offset   query      int  false  "User pagination limit"
// @Param        userId   query      string  false  "UserOrganization userId"
// @Param        organizationId   query      string  false  "UserOrganization organizationId"
// @Success      200  {object}  []DTO
// @Failure      400
// @Failure      500
// @Security     BearerAuth
// @Router       /userOrganizations [get]
func (a *API) Find(c *gin.Context) {
	start := c.Query("start")
	end := c.Query("end")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")
	populateFieldsStr := c.Query("populateFields")
	userId := c.Query("userId")
	organizationId := c.Query("organizationId")

	// Query options
	var conditions []shared.BaseFindCondition
	if start != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "created_at", Comparator: ">=", Value: start})
	}
	if end != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "created_at", Comparator: "<=", Value: end})
	}
	if userId != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "userId", Comparator: "=", Value: userId})
	}
	if organizationId != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "organizationId", Comparator: "=", Value: organizationId})
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
