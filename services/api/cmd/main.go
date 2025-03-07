package main

import (
	// services:
	auth "api/internal/service/auth/service"
	category "api/internal/service/category/service"
	health "api/internal/service/health/service"
	pdf "api/internal/service/pdf/service"
	product "api/internal/service/product/service"

	// repos:
	authPackage "api/internal/service/auth/repo"
	categoryPackage "api/internal/service/category/repo"
	productPackage "api/internal/service/product/repo"

	// aws pkg:
	aws "api/pkg/aws/service"

	// auth pkg:
	authPkgMiddleware "api/pkg/auth/middleware"

	// log pkg:
	logMid "api/pkg/log/middleware"
	logPkg "api/pkg/log/util"

	// built-in utils:
	"context"
	"fmt"
	"log"
	"os"

	// fiber:
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

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
	pdfService      *pdf.PDFService
)

// repos:
var (
	userRepo     *authPackage.UserRepo
	productRepo  *productPackage.ProductRepo
	categoryRepo *categoryPackage.CategoryRepo
	// postRepo *postPackage.PostRepo
)

var imagePath = new(string)
var pdfPath = new(string)

// main: --------------------------------------------------------------------

func init() {
	envType := os.Getenv("ENV")
	if envType != "prod" {
		if err := godotenv.Load("../.env"); err != nil {
			log.Fatalf("error loading .env, %v", err)
		}
	} else {
		logPkg.LogSuccess(
			"environment variables:"+"\n"+
				os.Getenv("DB")+"\n"+
				os.Getenv("PORT")+"\n"+
				os.Getenv("S3_BUCKET_NAME"),
			"main.init()", "",
		)
	}

	*imagePath = "images/products/"
	*pdfPath = "pdfs/"

	initClients()
	initRepos()
	initServices()

	// check if the program can reach the working directory
	dir, err := os.Getwd()
	if err != nil {
		logPkg.LogError("failed to get working directory: "+err.Error(), "main.init()", "")
	} else {
		logPkg.LogSuccess("working directory can be reached:", "main.init()", "")
		fmt.Println(dir)
	}

	// check if all clients initialized successfully
	if s3Client == nil || mongoClient == nil {
		logPkg.LogError("failed to initialize clients", "main.init()", "")
	}
}

func main() {
	app := fiber.New(fiber.Config{
		AppName: "api",
	})

	setupMiddlewares(app)
	setupRoutes(app)

	port := os.Getenv("PORT")
	log.Printf("Starting server on %s", port)
	if err := app.Listen(port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}

// inits: --------------------------------------------------------------------

func initClients() {
	s3Client = aws.NewS3Service()
	mongoClient = setupDbConnection()
}

func initRepos() {
	userRepo = authPackage.NewUserRepo(mongoClient)
	productRepo = productPackage.NewProductRepo(mongoClient)
	categoryRepo = categoryPackage.NewCategoryRepo(mongoClient)
	// postRepo = postPackage.NewPostRepo(mongoClient)
}

func initServices() {
	healthService = health.NewHealthService(mongoClient)
	authService = auth.NewAuthService(userRepo)
	productService = product.NewProductService(productRepo, s3Client, imagePath)
	categoryService = category.NewCategoryService(categoryRepo)
	pdfService = pdf.NewPDFService(pdfPath, s3Client)
}

// setups: --------------------------------------------------------------------

func setupDbConnection() *mongo.Client {
	mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("DB")))
	if err != nil {
		panic(err)
	}
	return mongoClient
}

func setupRoutes(app *fiber.App) {
	// Ping check
	app.Get("/ping", healthService.GetHealth)

	// Auth routes
	authGroup := app.Group("/auth")
	authGroup.Post("/login", authService.Login)

	// Product routes
	productGroup := app.Group("/product")
	productGroup.Get("/", productService.GetProducts)
	productGroup.Post("/post", productService.PostProduct, authPkgMiddleware.AuthMiddleware)
	productGroup.Patch("/patch/:id", productService.PatchProduct, authPkgMiddleware.AuthMiddleware)
	productGroup.Delete("/delete/:id", productService.DeleteProduct, authPkgMiddleware.AuthMiddleware)

	// Category routes
	categoryGroup := app.Group("/category")
	categoryGroup.Get("/", categoryService.GetCategories, authPkgMiddleware.AuthMiddleware)
	categoryGroup.Post("/post", categoryService.PostCategory, authPkgMiddleware.AuthMiddleware)
	categoryGroup.Patch("/patch/:id", categoryService.PatchCategory, authPkgMiddleware.AuthMiddleware)
	categoryGroup.Delete("/delete/:id", categoryService.DeleteCategory, authPkgMiddleware.AuthMiddleware)

	// Static routes
	staticGroup := app.Group("/static")
	// pdf:
	staticGroup.Get("pdf/is-exist/:id", pdfService.GetFileMeta)
	staticGroup.Get("/pdf/:id", pdfService.GetPDFFile)
	staticGroup.Post("/pdf/upload/:id/:title", pdfService.PostPDFFile)
	staticGroup.Get("/pdf/meta/:id", pdfService.GetFileMeta)
	staticGroup.Delete("/pdf/delete/:id", pdfService.DeletePDFFile)
}

func setupMiddlewares(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, https://makroteknik-4yemjdfdu-vafaill.vercel.app, https://makroteknik.vercel.app, https://test.makroteknik.co.uk, https://makroteknik.co.uk",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Adding custom marker for every process in request-response cycle
	app.Use(logMid.MarkProcess())

	// Adding custom logger middleware to log requests as well
	app.Use(logMid.LogRequests())
	app.Use(logMid.LogResponses())

	// Adding fiber standart logger middleware to log responses
	// app.Use(logger.New(logger.Config{
	// 	Format:     "\n\033[35m[RESPONSE]\033[0m | ${locals:processID} | ${time} | ${ip} | ${method} | ${status} | ${latency} | ${path}\n",
	// 	TimeFormat: "02-01-2006 03:04:05 PM",
	// 	TimeZone:   "UTC",
	// }))

}
