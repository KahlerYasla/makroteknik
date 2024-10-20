package main

import (
	"api/internal/service/auth"
	"api/internal/service/category"
	"api/internal/service/health"
	"api/internal/service/product"
	"api/pkg/mid"
	"api/pkg/util"
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// func init() {
// 	// Load .env file
// 	if err := godotenv.Load("../../../.env"); err != nil {
// 		log.Printf("Error loading .env file: %v", err)
// 	}
// }

const imagePath = "/opt/render/project/go/src/github.com/KahlerYasla/makroteknik/server/assets/images/products"

func init() {
	// Check if the program can reach the working directory
	dir, err := os.Getwd()
	if err != nil {
		util.LogError("failed to get working directory: " + err.Error())
	} else {
		util.LogSuccess("Working directory can be reached: " + dir)
	}

	// Check if the program can reach ../root/assets/images/products
	_, err = os.Stat(imagePath)
	if err != nil {
		util.LogError("failed to reach directory: " + err.Error())
	} else {
		util.LogSuccess("successfully reached directory:" + imagePath)
	}
}

func main() {
	// Initialize the Fiber app
	app := fiber.New(fiber.Config{
		AppName: "api", // Set the app name
	})

	mongoClient := setupDbConnection()
	initServices(mongoClient)
	setupMiddlewares(app)
	setupRoutes(app)

	// Start serving
	// port := os.Getenv("PORT")
	port := ":8855"
	log.Printf("Starting server on %s", port)
	if err := app.Listen(port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}

func initServices(c *mongo.Client) {
	health.InitHealthService(c)
	auth.InitAuthService(c)
	product.InitProductService(c)
	category.InitCategoryService(c)
}

// Set the database connection
func setupDbConnection() *mongo.Client {
	mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("DB")))
	if err != nil {
		panic(err)
	}
	return mongoClient
}

// Set the routes
func setupRoutes(app *fiber.App) {
	// Ping check
	app.Get("/ping", health.GetHealth)

	// Auth routes
	authGroup := app.Group("/auth")
	authGroup.Post("/login", auth.Login)

	// Product routes
	productGroup := app.Group("/product")
	productGroup.Get("/", product.GetProducts)
	productGroup.Post("/post", product.PostProduct, mid.AuthMiddleware)
	productGroup.Patch("/patch/:id", product.PatchProduct, mid.AuthMiddleware)
	productGroup.Delete("/delete/:id", product.DeleteProduct, mid.AuthMiddleware)

	// Category routes
	categoryGroup := app.Group("/category")
	categoryGroup.Get("/", category.GetCategories)
}

// Set the middlewares
func setupMiddlewares(app *fiber.App) {
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, https://makroteknik-4yemjdfdu-vafaill.vercel.app, https://makroteknik.vercel.app, https://test.makroteknik.co.uk",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

}
