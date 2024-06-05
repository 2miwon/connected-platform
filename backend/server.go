package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
    ID       string `bson:"_id,omitempty"`
	Email	 string `bson:"email"`
    Username string `bson:"username"`
    Password string `bson:"password"`
	Created primitive.Timestamp `bson:"timestamp"`
}

type Post struct {
	ID       string `bson:"_id,omitempty"`
	Title	 string `bson:"title"`
	Content  string `bson:"content"`
	URL 	 string `bson:"url"`
	ThumbnailURL string `bson:"thumbnail_url"`
	AuthorID string `bson:"author_id"`
	Created  string `bson:"created"`
	Deleted bool `bson:"deleted"`
}

type Feedback struct {
	ID       string `bson:"_id,omitempty"`
	PostID	 string `bson:"post_id"`
	UserID string `bson:"author_id"`
	Content  string `bson:"content"`
	Bookmark bool `bson:"bookmark"`
	Like bool `bson:"like"`
	Created  string `bson:"created"`
	Updated string `bson:"updated"`
	Deleted bool `bson:"deleted"`
}

type History struct {
	ID       string `bson:"_id,omitempty"`
	PostID	 string `bson:"post_id"`
	UserID string `bson:"author_id"`
	Progress float64 `bson:"progress"`
	Updated primitive.Timestamp `bson:"timestamp"`
	Deleted bool `bson:"deleted"`
}

type Session struct {
	ID       string `bson:"_id,omitempty"`
	UserID string `bson:"user_id"`
	Token string
	Expired primitive.Timestamp `bson:"timestamp"`
}

func connectDB(uri string) (*mongo.Client, context.Context, error) {
	// context는 일정 시간이 지나면 자동으로 취소
	// 단발성 연결 시에
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()
	ctx := context.Background()
	
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)
	// client, err := mongo.Connect(context.TODO(), opts)
	client, err := mongo.Connect(ctx, opts)
	if err != nil {
		return nil, ctx, err
	}
	return client, ctx, nil
}

func createUser(collection *mongo.Collection, ctx context.Context, json User) (*mongo.InsertOneResult, error) {
	rst, err := collection.InsertOne(ctx, json)
	if err != nil {
		return nil, err
	}
	return rst, nil
}

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
		rst, err := collection.FindOne(ctx, bson.M).DecodeBytes()
		checkErr(err)
		return c.SendString(fmt.Sprintf("%v", rst))
	})

	app.Get("/all", func(c *fiber.Ctx) error {
		db := client.Database("sample_mflix")
		collections, err := db.ListCollectionNames(ctx, bson.M{})
		checkErr(err)
		return c.JSON(collections)
	})

	app.Post("/user/create", func(c *fiber.Ctx) error {
		collection := client.Database("mooc").Collection("users")
		user := User{
			Email: c.FormValue("email"),
			Username: c.FormValue("username"),
			Password: c.FormValue("password"),
			Created: time.Now(),
		}
		rst, err := createUser(collection, ctx, user)
		checkErr(err)
		return c.JSON(rst)
	})
	
	app.Listen(":3000")
}