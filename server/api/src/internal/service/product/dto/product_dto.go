// server/api/src/internal/service/product/dto/product_dto.go

package dto

type Product struct {
	ID          string              `json:"_id"`
	CategoryId  int                 `json:"categoryId"`
	Title       string              `json:"title"`
	ProductCode string              `json:"productCode"`
	Description string              `json:"description"`
	SizeToPrice []map[string]string `json:"sizeToPrice"`
	Image       string              `json:"image"`
}

type GetProductsResponse struct {
	Products []Product `json:"products"`
}
