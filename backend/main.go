package main

import (
	"backend/config"
	"backend/controllers"
	"log"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {

	config.ConnectDB()

	r := gin.Default()

	r.Use(CORSMiddleware())

	tasks := r.Group("/tasks")
	{
		tasks.GET("", controllers.GetTask)
		tasks.POST("", controllers.CreateTask)
		tasks.PUT("/:id", controllers.UpdateTask)
		tasks.DELETE("/:id", controllers.DeleteTask)
	}

	log.Println("Servidor rodando na porta 8080...")
	err := r.Run(":8080")
	if err != nil {
		log.Fatal("Erro ao iniciar servidor:", err)
	}
}
