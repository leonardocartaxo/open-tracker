package tracker_locations

import (
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/shared"
)

type Repository struct {
	shared.BaseRepository[Model]
}
