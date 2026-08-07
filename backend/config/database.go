package config

import (
	"backend/models"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// Carrega o arquivo .env se existir
	err := godotenv.Load()
	if err != nil {
		log.Println("Aviso: Arquivo .env não encontrado, utilizando variáveis de sistema.")
	}

	// Busca as variáveis de ambiente
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// Validação de segurança: verifica se as variáveis essenciais foram carregadas
	if dbHost == "" || dbPort == "" || dbUser == "" || dbPassword == "" || dbName == "" {
		log.Fatal("ERRO: Variáveis de ambiente do banco de dados não foram configuradas corretamente. Verifique seu arquivo .env!")
	}

	// Monta a string de conexão (DSN)
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort)

	// Conecta com o GORM
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Falha ao conectar no banco de dados: ", err)
	}

	fmt.Println("Conexão com o PostgreSQL estabelecida com sucesso!")

	// Executa a migração automática das tabelas
	err = db.AutoMigrate(&models.Card{})
	if err != nil {
		log.Fatal("Falha ao rodar AutoMigrate: ", err)
	}

	DB = db
}
