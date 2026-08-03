package config

import (
	"bankan_back/models"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "host=localhost user=postgres password=postgrespassword dbname=kanbandb port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Falha ao conectar no banco de dados: ", err)
	}

	fmt.Println("Conexão com o PostgreSQL estabelecido com sucesso!")

	err = db.AutoMigrate(&models.Card{})
	if err != nil {
		log.Fatal("Falha ao rodar AutoMigrate: ", err)
	}

	DB = db
}
