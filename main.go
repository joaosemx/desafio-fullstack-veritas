package main

import (
	"bankan_back/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDB()

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Servidor rodando com sucesso!",
		})
	})

	r.Run(":8080")
}
