// server/api/src/internal/service/product/product_service.go

package product

import (
	"api/src/internal/service/product/dto"
	"api/src/internal/service/product/repo"
	"api/src/pkg/util"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

// productRepo is the repository for product service
var productRepo *repo.ProductRepo

// bucketName is the working bucket's tag on S3
var bucketName string

// InitProductService function initializes the product service
//   - Parameters: client *mongo.Client: instance of mongo.Client
func InitProductService(client *mongo.Client) {
	productRepo = repo.NewProductRepo(client)

	//
}

// GetProduct fetches products from MongoDB, then fetches their images from S3
func GetProducts(c *fiber.Ctx) error {
	// 1. Fetch products from MongoDB
	products, err := productRepo.GetProducts(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("failed to fetch products from MongoDB: " + err.Error())
	}

	last := products[len(products)-1]
	jsonizedLast, _ := json.MarshalIndent(last, " ", " ")
	util.LogDebug(string(jsonizedLast))
	util.LogDebug("last element's ID: " + last.ID.Hex())

	// 2. Fetch images from S3
	var productResponses []dto.Product
	var imageData string
	for _, product := range products {
		if product.ImageUrl == "" {
			util.LogError("product.ImageUrl is empty")
		} else {
			util.LogWarn("fetching from: " + product.ImageUrl + " ...")

			if err != nil {
				return c.Status(fiber.StatusInternalServerError).SendString("failed to fetch image " + product.ID.Hex() + " from S3: " + err.Error())
			}
		}

		// 3. Prepare the product response with base64 image data
		productResponse := dto.Product{
			ID:          product.ID.Hex(),
			CategoryId:  product.CategoryId,
			Title:       product.Title,
			ProductCode: product.ProductCode,
			Description: product.Description,
			SizeToPrice: product.SizeToPrice,
			Image:       imageData,
		}

		productResponses = append(productResponses, productResponse)
	}

	// 4. Return the response
	return c.Status(fiber.StatusOK).JSON(dto.GetProductsResponse{
		Products: productResponses,
	})
}
