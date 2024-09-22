package auth

import (
	"center/internal/service/auth/dto"
	"center/internal/service/auth/repo"
	"center/pkg/tool"
	"log"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

var userRepo *repo.UserRepo

func InitAuthService(client *mongo.Client) {
	userRepo = repo.NewUserRepo(client)
}

func Login(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid input")
	}

	user, err := userRepo.FindByUserName(c.Context(), req.UserName)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).SendString("Invalid credentials")
	}

	err = tool.CompareHashAndPassword([]byte(user.HashedPassword), []byte(req.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).SendString("Invalid credentials")
	}

	// Generate token
	token, err := tool.GenerateToken(user.UserName)
	if err != nil {
		log.Printf("Error in generating token: %v", err)
	}

	return c.JSON(dto.LoginResponse{Token: token})
}