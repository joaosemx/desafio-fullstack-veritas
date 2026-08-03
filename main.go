package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// Inicializa o roteador do Gin
	r := gin.Default()

	// Cria a rota GET /health
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Servidor rodando com sucesso!",
		})
	})

	// Sobe o servidor na porta 8080
	r.Run(":8080")
}