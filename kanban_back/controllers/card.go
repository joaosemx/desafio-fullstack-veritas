package controllers

import (
	"kanban_back/config"
	"kanban_back/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST /tasks
func CreateTask(c *gin.Context) {
	var card models.Card

	if err := c.ShouldBindJSON(&card); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&card).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar tarefa"})
		return
	}

	c.JSON(http.StatusCreated, card)
}

// GET /tasks
func GetTask(c *gin.Context) {
	var cards []models.Card
	config.DB.Find(&cards)
	c.JSON(http.StatusOK, cards)
}

// PUT /tasks/:id
func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	var card models.Card

	if err := config.DB.First(&card, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}

	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Status      string `json:"status"`
		Author      string `json:"author"`
		Progress    int    `json:"progress"`
	}

	card.Progress = input.Progress

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	card.Title = input.Title
	card.Description = input.Description
	card.Status = input.Status
	if input.Author != "" {
		card.Author = input.Author
	}

	if err := config.DB.Save(&card).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar tarefa"})
		return
	}

	c.JSON(http.StatusOK, card)
}

// DELETE /tasks/:id
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
