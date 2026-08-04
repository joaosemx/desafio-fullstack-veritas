package controllers

import (
	"bankan_back/config"
	"bankan_back/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST

func CreateTask(c *gin.Context) {
	var card models.Card
	if err := c.ShouldBindBodyWithJSON(&card); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Create(&card)
	c.JSON(http.StatusCreated, card)
}

// GET

func GetTask(c *gin.Context) {
	var cards []models.Card
	config.DB.Find(&cards)
	c.JSON(http.StatusOK, cards)
}

// PUT

func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	var card models.Card

	if err := config.DB.First(&card, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}

	if err := c.ShouldBindJSON(&card); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&card)
	c.JSON(http.StatusOK, card)

}

// DELETE

func DeleteTask(c *gin.Context) {
	id := c.Param("id")
	var card models.Card

	if err := config.DB.First(&card, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}

	config.DB.Delete(&card)
	c.JSON(http.StatusOK, gin.H{"message": "Tarefa deletada com sucesso!"})
}
