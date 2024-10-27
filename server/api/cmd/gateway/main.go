package main

import (
	// services:
	"api/internal/service/auth"
	"api/internal/service/category"
	"api/internal/service/health"
	"api/internal/service/product"

	// pkg services:
	"api/pkg/service/aws"

	// repos:
	authPackage "api/internal/service/auth/repo"
	categoryPackage "api/internal/service/category/repo"
	productPackage "api/internal/service/product/repo"

	// utils & middlewares:
	"api/pkg/mid"
	"api/pkg/util"

	// built-in utils:
	"context"
	"log"
	"os"

	// fiber:
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"

	// mongodb:
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// vars: --------------------------------------------------------------------

// clients:
var (
	s3Client    *aws.S3Service
	mongoClient *mongo.Client
)

// services:
var (
	healthService   *health.HealthService
	authService     *auth.AuthService
	productService  *product.ProductService
	categoryService *category.CategoryService
)

// repositories:
var (
	userRepo     *authPackage.UserRepo
	productRepo  *productPackage.ProductRepo
	categoryRepo *categoryPackage.CategoryRepo
	// postRepo *postPackage.PostRepo
)

var imagePath = new(string)

// main: --------------------------------------------------------------------

func init() {
	envType := os.Getenv("ENV")
	if envType != "prod" {
		err := godotenv.Load("../../.env")
		if err != nil {
			log.Fatalf("error loading .env, %v", err)
		}
	} else {
		util.LogSuccess(
			"environment variables:" + "\n" +
				os.Getenv("DB") + "\n" +
				os.Getenv("PORT") + "\n" +
				os.Getenv("S3_BUCKET_NAME") + "\n" +
				os.Getenv("JWT_SECRET"),
		)
	}

	*imagePath = "images/products/"

	// init clients
	s3Client = aws.NewS3Service()
	mongoClient = setupDbConnection()

	// Check if the program can reach the working directory
	dir, err := os.Getwd()
	if err != nil {
		util.LogError("failed to get working directory: " + err.Error())
	} else {
		util.LogSuccess("Working directory can be reached: " + dir)
	}

	// check if all clients initialized successfully
}

func main() {
	// Initialize the Fiber app
	app := fiber.New(fiber.Config{
		AppName: "api", // Set the app name
	})

	initServices()
	setupMiddlewares(app)
	setupRoutes(app)

	// Start serving
	port := os.Getenv("PORT")
	log.Printf("Starting server on %s", port)
	if err := app.Listen(port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}

// functions: --------------------------------------------------------------------

func initServices() {
	healthService = health.NewHealthService(mongoClient)
	authService = auth.NewAuthService(mongoClient, userRepo)
	productService = product.NewProductService(mongoClient, productRepo, s3Client, imagePath)
	categoryService = category.NewCategoryService(mongoClient, categoryRepo)
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
	app.Get("/ping", healthService.GetHealth)

	// Auth routes
	authGroup := app.Group("/auth")
	authGroup.Post("/login", authService.Login)

	// Product routes
	productGroup := app.Group("/product")
	productGroup.Get("/", productService.GetProducts)
	productGroup.Post("/post", productService.PostProduct, mid.AuthMiddleware)
	productGroup.Patch("/patch/:id", productService.PatchProduct, mid.AuthMiddleware)
	productGroup.Delete("/delete/:id", productService.DeleteProduct, mid.AuthMiddleware)

	// Category routes
	categoryGroup := app.Group("/category")
	categoryGroup.Get("/", categoryService.GetCategories)
}

// Set the middlewares
func setupMiddlewares(app *fiber.App) {
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, https://makroteknik-4yemjdfdu-vafaill.vercel.app, https://makroteknik.vercel.app, https://test.makroteknik.co.uk",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

}
