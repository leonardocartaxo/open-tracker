package organization

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

// Create SaveOrganization godoc
// @Summary Save Organization
// @Description Save an organization by giver form
// @Tags         organizations
// @Accept       json
// @Produce      json
// @Param		 organization	body	CreateDTO	true	"Add Organization"
// @Success      201  {object}  DTO
// @Failure      500
// @Security     BearerAuth
// @Router       /organizations [post]
func (a *API) Create(c *gin.Context) {
	createDTO := &CreateDTO{}
	err := c.ShouldBindJSON(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	newOrganization, err := a.service.Create(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}

	c.JSON(http.StatusCreated, newOrganization)
}

// FindById FindOneOrganization godoc
// @Summary      Find one an Organization
// @Description  Find one Organization by ID
// @Tags         organizations
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Organization ID"
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      404
// @Failure      500
// @Security     BearerAuth
// @Router       /organizations/{id} [get]
func (a *API) FindById(c *gin.Context) {
	id := c.Param("id")
	organization, err := a.service.GetById(id)
	if err != nil {
		c.Status(http.StatusNotFound)
	}

	c.JSON(http.StatusOK, organization)
}

// UpdateById UpdateOneOrganization godoc
// @Summary Update one an Organization
// @Description  Update one Organization by ID
// @Tags         organizations
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Organization ID"
// @Param        organization   body	UpdateDTO  true  "Update Organization"
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      404
// @Failure      500
// @Security     BearerAuth
// @Router       /organizations/{id} [post]
func (a *API) UpdateById(c *gin.Context) {
	id := c.Param("id")
	updateDTO := &UpdateDTO{}
	err := c.ShouldBindJSON(updateDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	organization, err := a.service.Update(id, updateDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	c.JSON(http.StatusOK, organization)
}

// Find FilterOrganizations godoc
// @Summary      Filter Organizations
// @Description  Filter Organizations by query paramenters
// @Tags         organizations
// @Accept       json
// @Produce      json
// @Param        name   query      string  false  "Organization name"
// @Param        email   query      string  false  "Organization email"
// @Param        start   query      string  false  "Organization createdAt start date"
// @Param        end   query      string  false  "Organization createdAt end date"
// @Param        populate   query      string  false  "Organization populate properties"
// @Param        limit   query      int  false  "Organization pagination limit"
// @Param        offset   query      int  false  "Organization pagination limit"
// @Success      200  {object}  []DTO
// @Failure      400
// @Failure      500
// @Security     BearerAuth
// @Router       /organizations [get]
func (a *API) Find(c *gin.Context) {
	name := c.Query("name")
	email := c.Query("email")
	start := c.Query("start")
	end := c.Query("end")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")
	populateFieldsStr := c.Query("populateFields")

	// Query options
	var conditions []shared.BaseFindCondition
	if name != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "name", Comparator: "=", Value: name})
	}
	if email != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "email", Comparator: "=", Value: email})
	}
	if start != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "created_at", Comparator: ">=", Value: start})
	}
	if end != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "created_at", Comparator: "<=", Value: end})
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
