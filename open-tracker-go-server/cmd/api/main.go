package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/leonardocartaxo/open-tracker/open-tracker-go-server/docs"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/auth"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/organization"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/tracker"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/tracker_locations"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user_organizations"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/utils/logger"
	swaggerFiles "github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

// @title           Open Tracker GO Server
// @version         0.1
// @description     Open source track server
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  GNU 3.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /

// @externalDocs.description  OpenAPI
func main() {
	c := internal.NewConfig()
	l := logger.NewLogger(c.LogLevel)
	addr := fmt.Sprintf(":%d", c.Server.Port)
	const fmtDBString = "host=%s user=%s password=%s dbname=%s port=%d sslmode=disable"
	dbString := fmt.Sprintf(fmtDBString, c.DB.Host, c.DB.User, c.DB.Pass, c.DB.Name, c.DB.Port)
	var logLevel gormlogger.LogLevel
	if c.DB.Debug {
		logLevel = gormlogger.Info
	} else {
		logLevel = gormlogger.Error
	}
	db, err := gorm.Open(postgres.Open(dbString), &gorm.Config{Logger: gormlogger.Default.LogMode(logLevel)})
	if err != nil {
		panic("failed to connect database")
	}
	// Auto migrate the schema
	if c.DB.AutoMigrate {
		err = db.AutoMigrate(&user.Model{})
		if err != nil {
			panic(err)
		}
		err = db.AutoMigrate(&organization.Model{})
		if err != nil {
			panic(err)
		}
		err = db.AutoMigrate(&user_organizations.Model{})
		if err != nil {
			panic(err)
		}
		err = db.AutoMigrate(&tracker.Model{})
		if err != nil {
			panic(err)
		}
		err = db.AutoMigrate(&tracker_locations.Model{})
		if err != nil {
			panic(err)
		}
	}

	var ginMode string
	if c.Server.Debug {
		ginMode = gin.DebugMode
	} else {
		ginMode = gin.ReleaseMode
	}
	gin.SetMode(ginMode)
	r := gin.Default()
	// Use the custom middleware and pass the logger
	r.Use(logger.SetRequestIDMiddleware())
	r.Use(logger.LogRequestMiddleware(l))
	r.Use(logger.LogResponseMiddleware(l))

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	users := r.Group("/users")
	user.NewRouter(db, users, l).Route()
	auths := r.Group("/auth")
	auth.NewRouter(db, auths, l).Route()
	organizations := r.Group("/organizations")
	organization.NewRouter(db, organizations, l).Route()
	userOrganizations := r.Group("/user_organizations")
	user_organizations.NewRouter(db, userOrganizations, l).Route()
	trackers := r.Group("/trackers")
	tracker.NewRouter(db, trackers, l).Route()
	trackerLocations := r.Group("/tracker_locations")
	tracker_locations.NewRouter(db, trackerLocations, l).Route()

	err = r.Run(addr)
	if err != nil {
		panic(err)
	}
}
