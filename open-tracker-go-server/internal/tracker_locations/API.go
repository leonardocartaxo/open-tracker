package tracker_locations

import (
	"github.com/gin-gonic/gin"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/shared"
	"log/slog"
	"net/http"
	"strconv"
)

type API struct {
	service *Service
	l       *slog.Logger
}

func NewApi(service *Service, l *slog.Logger) *API {
	return &API{service: service, l: l}
}

// SaveTrackerLocation godoc
// @Summary      Save TrackerLocation
// @Description  Save a trackerLocation by giver form
// @Tags         trackerLocations
// @Accept       json
// @Produce      json
// @Param		 trackerLocation	body	CreateDTO	true	"Add TrackerLocation"
// @Success      201  {object}  DTO
// @Failure      500
// @Security     BearerAuth
// @Router       /tracker_locations [post]
func (a *API) Create(c *gin.Context) {
	createDTO := &CreateDTO{}
	err := c.ShouldBindJSON(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	newTrackerLocation, err := a.service.Create(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}

	c.JSON(http.StatusCreated, newTrackerLocation)
}

// FindOneTrackerLocation godoc
// @Summary      Find one an TrackerLocation
// @Description  Find one TrackerLocation by ID
// @Tags         trackerLocations
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "TrackerLocation ID"
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      404
// @Failure      500
// @Security     BearerAuth
// @Router       /tracker_locations/{id} [get]
func (a *API) FindById(c *gin.Context) {
	id := c.Param("id")
	trackerLocation, err := a.service.GetById(id)
	if err != nil {
		c.Status(http.StatusNotFound)
	}

	c.JSON(http.StatusOK, trackerLocation)
}

// UpdateOneTrackerLocation godoc
// @Summary      Update one an TrackerLocation
// @Description  Update one TrackerLocation by ID
// @Tags         trackerLocations
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "TrackerLocation ID"
// @Param        trackerLocation   body	UpdateDTO  true  "Update TrackerLocation"
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      404
// @Failure      500
// @Security     BearerAuth
// @Router       /tracker_locations/{id} [post]
func (a *API) UpdateById(c *gin.Context) {
	id := c.Param("id")
	updateDTO := &UpdateDTO{}
	err := c.ShouldBindJSON(updateDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	trackerLocation, err := a.service.Update(id, updateDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	c.JSON(http.StatusOK, trackerLocation)
}

// FilterTrackerLocations godoc
// @Summary      Filter TrackerLocations
// @Description  Filter TrackerLocations by query paramenters
// @Tags         trackerLocations
// @Accept       json
// @Produce      json
// @Param        start   query      string  true  "TrackerLocation createdAt start date"
// @Param        end   query      string  true  "TrackerLocation createdAt end date"
// @Param        trackerId   query      number  true  "TrackerLocation trackerId"
// @Param        limit   query      int  false  "TrackerLocation pagination limit"
// @Param        offset   query      int  false  "TrackerLocation pagination limit"
// @Success      200  {object}  []DTO
// @Failure      400
// @Failure      500
// @Security     BearerAuth
// @Router       /tracker_locations [get]
func (a *API) Find(c *gin.Context) {
	start := c.Query("start")
	end := c.Query("end")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")
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
