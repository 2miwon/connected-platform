package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
)

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	err := godotenv.Load()
	checkErr(err)
	db_uri := os.Getenv("DB_URI")
	
	client, ctx, err := connectDB(db_uri)
	checkErr(err)

	defer client.Disconnect(ctx)

	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		collection := client.Database("mooc").Collection("users")
		collections, err := client.Database("mooc").ListCollectionNames(ctx, bson.M{})
		// rst, err := collection.Find(ctx, bson.M{})
		// checkErr(err)
		return c.JSON(collections)
	})

	app.Get("/debug/:colName", func(c *fiber.Ctx) error {
		colName := c.Params("colName")
		collection := client.Database("sample_mflix").Collection(colName)
		rst, err := collection.FindOne(ctx, bson.M
		checkErr(err)
		return c.SendString(fmt.Sprintf("%v", rst))
	})

	app.Get("/all", func(c *fiber.Ctx) error {
		db := client.Database("sample_mflix")
		collections, err := db.ListCollectionNames(ctx, bson.M{})
		checkErr(err)
		return c.JSON(collections)
	})

	app.Listen(":3000")
}