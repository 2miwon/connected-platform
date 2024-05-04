package main

import (
	"context"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {

	client, err := connectDB()
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Listen(":3000")
}