package main

import (
	"kanban_back/config"
	"kanban_back/controllers"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDB()

	r := gin.Default()

	r.GET("/tasks/:id", controllers.GetTask)
	r.POST("/tasks", controllers.CreateTask)
	r.DELETE("/tasks/:id", controllers.DeleteTask)
	r.PUT("/tasks/:id", controllers.UpdateTask)

	port := os.Getenv("PORT")
	if port == " " {
		port = "8080"
	}

	r.Run(":" + port)
}
