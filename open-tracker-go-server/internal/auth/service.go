package auth

import (
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/shared"
	"github.com/leonardocartaxo/open-tracker/open-tracker-go-server/internal/user"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	UserService user.Service
	JwtSecret   string
}

func (s *Service) Signup(dto *user.CreateDTO) (user.DTO, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return user.DTO{}, err
	}
	dto.Password = string(hashedPassword)

	return s.UserService.Create(dto)
}

func (s *Service) Signing(email string, password string) (SignedUser, error) {
	conditions := []shared.BaseFindCondition{{Field: "email", Comparator: "=", Value: email}}
	users, err := s.UserService.Find(conditions, nil, "", 1, 0)
	if err != nil {
		return SignedUser{}, err
	}
	userDto := users[0]

	err = bcrypt.CompareHashAndPassword([]byte(userDto.Password), []byte(password))
	if err != nil {
		return SignedUser{}, err
	}
	middleware := Middleware{JwtSecret: s.JwtSecret}
	token, err := middleware.generateJWT(userDto)
	if err != nil {
		return SignedUser{}, err
	}

	m := map[string]interface{}{"token": token}
	err = s.UserService.Repo.UpdateById(userDto.ID, m)
	if err != nil {
		return SignedUser{}, err
	}
	signedUser := SignedUser{userDto, token}

	return signedUser, nil
}
