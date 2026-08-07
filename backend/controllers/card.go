package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// parseDatePtr converte uma string "YYYY-MM-DD" em *time.Time.
// Retorna nil se a string vier vazia (evita panic e mantém o campo nulo no banco).
func parseDatePtr(value string) (*time.Time, error) {
	if value == "" {
		return nil, nil
	}
	parsed, err := time.Parse("2006-01-02", value)
	if err != nil {
		return nil, err
	}
	return &parsed, nil
}

// normalizeCardDates força as datas para UTC antes de serializar a resposta.
// Isso evita que o fuso horário local do servidor/driver do banco (ex: -03:00)
// desloque a data em um dia quando o front faz slice(0,10) no JSON retornado.
func normalizeCardDates(card *models.Card) {
	if card.StartDate != nil {
		utc := card.StartDate.UTC()
		card.StartDate = &utc
	}
	if card.DueDate != nil {
		utc := card.DueDate.UTC()
		card.DueDate = &utc
	}
}

// POST /tasks
func CreateTask(c *gin.Context) {
	var input struct {
		Title       string `json:"Title"`
		Description string `json:"Description"`
		Status      string `json:"Status"`
		Author      string `json:"Author"`
		Progress    int    `json:"Progress"`
		StartDate   string `json:"StartDate"`
		DueDate     string `json:"DueDate"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "O título da tarefa é obrigatório"})
		return
	}

	startDate, err := parseDatePtr(input.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data inicial inválida"})
		return
	}

	dueDate, err := parseDatePtr(input.DueDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data limite inválida"})
		return
	}

	status := input.Status
	if status == "" {
		status = "todo"
	}

	card := models.Card{
		Title:       input.Title,
		Description: input.Description,
		Status:      status,
		Author:      input.Author,
		Progress:    input.Progress,
		StartDate:   startDate,
		DueDate:     dueDate,
	}

	if err := config.DB.Create(&card).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar tarefa"})
		return
	}

	normalizeCardDates(&card)
	c.JSON(http.StatusCreated, card)
}

// GET /tasks
func GetTask(c *gin.Context) {
	var cards []models.Card
	config.DB.Find(&cards)

	for i := range cards {
		normalizeCardDates(&cards[i])
	}

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
		Title       string `json:"Title"`
		Description string `json:"Description"`
		Status      string `json:"Status"`
		Author      string `json:"Author"`
		Progress    int    `json:"Progress"`
		StartDate   string `json:"StartDate"`
		DueDate     string `json:"DueDate"`
	}

	// PRIMEIRO fazemos o bind do JSON recebido
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Converte as datas recebidas (string) para *time.Time
	startDate, err := parseDatePtr(input.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data inicial inválida"})
		return
	}

	dueDate, err := parseDatePtr(input.DueDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data limite inválida"})
		return
	}

	// DEPOIS atribuímos aos campos da struct
	card.Title = input.Title
	card.Description = input.Description
	card.Status = input.Status
	card.Progress = input.Progress
	card.StartDate = startDate
	card.DueDate = dueDate

	if input.Author != "" {
		card.Author = input.Author
	}

	if err := config.DB.Save(&card).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar tarefa"})
		return
	}

	normalizeCardDates(&card)
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
