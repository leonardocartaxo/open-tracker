package tracker

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

// SaveTracker godoc
// @Summary      Save Tracker
// @Description  Save a tracker by giver form
// @Tags         trackers
// @Accept       json
// @Produce      json
// @Param		 tracker	body	CreateDTO	true	"Add Tracker"
// @Success      201  {object}  DTO
// @Failure      500
// @Security     BearerAuth
// @Router       /trackers [post]
func (a *API) Create(c *gin.Context) {
	createDTO := &CreateDTO{}
	err := c.ShouldBindJSON(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	newTracker, err := a.service.Create(createDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}

	c.JSON(http.StatusCreated, newTracker)
}

// FindOneTracker godoc
// @Summary      Find one an Tracker
// @Description  Find one Tracker by ID
// @Tags         trackers
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Tracker ID"
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      404
// @Failure      500
// @Security     BearerAuth
// @Router       /trackers/{id} [get]
func (a *API) FindById(c *gin.Context) {
	id := c.Param("id")
	tracker, err := a.service.GetById(id)
	if err != nil {
		c.Status(http.StatusNotFound)
	}

	c.JSON(http.StatusOK, tracker)
}

// UpdateOneTracker godoc
// @Summary      Update one an Tracker
// @Description  Update one Tracker by ID
// @Tags         trackers
// @Accept       json
// @Produce      json
// @Param        id   path      string  true  "Tracker ID"
// @Param        tracker   body	UpdateDTO  true  "Update Tracker"
// @Success      200  {object}  DTO
// @Failure      400
// @Failure      404
// @Failure      500
// @Security     BearerAuth
// @Router       /trackers/{id} [post]
func (a *API) UpdateById(c *gin.Context) {
	id := c.Param("id")
	updateDTO := &UpdateDTO{}
	err := c.ShouldBindJSON(updateDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	tracker, err := a.service.Update(id, updateDTO)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	c.JSON(http.StatusOK, tracker)
}

// FilterTrackers godoc
// @Summary      Filter Trackers
// @Description  Filter Trackers by query paramenters
// @Tags         trackers
// @Accept       json
// @Produce      json
// @Param        start   query      string  false  "Tracker createdAt start date"
// @Param        end   query      string  false  "Tracker createdAt end date"
// @Param        populate   query      string  false  "Tracker populate properties"
// @Param        limit   query      int  false  "Tracker pagination limit"
// @Param        offset   query      int  false  "Tracker pagination limit"
// @Param        name   query      string  false  "Tracker name"
// @Success      200  {object}  []DTO
// @Failure      400
// @Failure      500
// @Security     BearerAuth
// @Router       /trackers [get]
func (a *API) Find(c *gin.Context) {
	start := c.Query("start")
	end := c.Query("end")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")
	populateFieldsStr := c.Query("populateFields")
	name := c.Query("name")

	// Query options
	var conditions []shared.BaseFindCondition
	if name != "" {
		conditions = append(conditions, shared.BaseFindCondition{Field: "name", Comparator: "=", Value: name})
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
