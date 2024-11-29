package service

import (
	"api/pkg/log"

	"api/pkg/aws/service"

	"github.com/gofiber/fiber/v2"
)

type PDFService struct {
	dirPath   *string
	s3Service *service.S3Service
}

func NewPDFService(pdfPath *string, s3 *service.S3Service) *PDFService {
	return &PDFService{
		dirPath:   pdfPath,
		s3Service: s3,
	}
}

func (p *PDFService) GetPdfFile(c *fiber.Ctx) error {
	id := c.Params("id")

	// S3 file path and name
	fileName := id + ".pdf"

	log.LogWarn("get requesting on S3 with filename: " + fileName + " and key: " + *p.dirPath)

	// fetch the PDF from S3
	fileData, err := p.s3Service.GetFile(p.dirPath, &fileName)
	if err != nil {
		log.LogError("failed to fetch file: " + err.Error())
		return c.Status(fiber.StatusInternalServerError).SendString("Error fetching PDF")
	}

	// set content-type for PDF
	c.Set("Content-Type", "application/pdf")
	return c.Send(fileData)
}

func (p *PDFService) IsFileExist(c *fiber.Ctx) error {
	id := c.Params("id")

	// S3 file path and name
	fileName := id + ".pdf"

	res, err := p.s3Service.IsFileExist(*p.dirPath, fileName)

	if err != nil {
		log.LogError("failed to check existence of the pdf: " + err.Error())
		return c.Status(fiber.StatusInternalServerError).SendString("Error checking existence of the PDF")
	}

	return c.JSON(fiber.Map{
		"isPDFExist": res,
	})
}
