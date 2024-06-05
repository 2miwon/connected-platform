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
	"golang.org/x/crypto/bcrypt"
)

type User struct {
    ID       string `bson:"_id,omitempty"`
	Email	 string `bson:"email"`
    Username string `bson:"username"`
    Password string `bson:"password"`
	Created primitive.Timestamp `bson:"created"`
}

type Video struct {
	ID       string `bson:"_id,omitempty"`
	Title	 string `bson:"title"`
	Content  string `bson:"content"`
	URL 	 string `bson:"url"`
	ThumbnailURL string `bson:"thumbnail_url"`
	AuthorID string `bson:"author_id"`
	Created primitive.Timestamp `bson:"created"`
	Deleted *primitive.Timestamp `bson:"deleted"`
}

type Feedback struct {
	ID       string `bson:"_id,omitempty"`
	PostID	 string `bson:"post_id"`
	UserID string `bson:"author_id"`
	Content  *string `bson:"content"`
	Bookmarked *primitive.Timestamp `bson:"bookmark"`
	Like *bool `bson:"like"`
	Created primitive.Timestamp `bson:"created"`
	Updated primitive.Timestamp `bson:"updated"`
	Deleted *primitive.Timestamp `bson:"deleted"`
}

type History struct {
	ID       string `bson:"_id,omitempty"`
	PostID	 string `bson:"post_id"`
	UserID string `bson:"user_id"`
	Progress *float64 `bson:"progress"`
	Updated primitive.Timestamp `bson:"updated"`
	Deleted *primitive.Timestamp `bson:"deleted"`
}

type Session struct {
	ID       string `bson:"_id,omitempty"`
	UserID string `bson:"user_id"`
	Token string
	Expired primitive.Timestamp `bson:"expired"`
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
		// log.Println(err)
	}
}

func checkDocumentExists(collection *mongo.Collection, ctx context.Context, filter bson.M, message string) error {
	num, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return err
	}

	if num == 0 {
		return fmt.Errorf(message)
	}

	return nil
}

// func createSession(collection *mongo.Collection, ctx context.Context) (*mongo.InsertOneResult, error) {
	
	
// 	rst, err := collection.InsertOne(ctx, json)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return rst, nil

// }

func main() {
	err := godotenv.Load()
	checkErr(err)
	db_uri := os.Getenv("DB_URI")
	
	client, ctx, err := connectDB(db_uri)
	checkErr(err)

	db := client.Database("mooc")

	defer client.Disconnect(ctx)

	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(db)
	})

	app.Get("/debug/:colName", func(c *fiber.Ctx) error {
		colName := c.Params("colName")
		collection := db.Collection(colName)
		rst, err := collection.Find(ctx, bson.M{})
		checkErr(err)
		return c.SendString(fmt.Sprintf("%v", rst))
	})

	app.Get("/all", func(c *fiber.Ctx) error {
		collections, err := db.ListCollectionNames(ctx, bson.M{})
		checkErr(err)
		return c.JSON(collections)
	})

	app.Get("/user/all", func(c *fiber.Ctx) error {
		collection := db.Collection("users")
		rst, err := collection.Find(ctx, bson.M{})
		checkErr(err)
		return c.SendString(fmt.Sprintf("%v", rst))
	})
	
	app.Post("/user/create", func(c *fiber.Ctx) error {
		// 필터 값 정의
		filter := bson.M{"email": c.FormValue("email") , "username": c.FormValue("username")}
		
		collection := db.Collection("users")
		
		err = checkDocumentExists(collection, ctx, filter, "User already exists")
		checkErr(err)

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(c.FormValue("password")), bcrypt.DefaultCost)
		checkErr(err)

		user := User{
			Email: c.FormValue("email"),
			Username: c.FormValue("username"),
			Password: string(hashedPassword),
			Created: primitive.Timestamp{T: uint32(time.Now().Unix())},
		}

		rst, err := createUser(collection, ctx, user)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Get("/user/info/:id", func(c *fiber.Ctx) error {
		collection := db.Collection("users")
		rst, err := collection.Find(ctx, bson.M{"_id": c.Params("id")})
		checkErr(err)
		return c.SendString(fmt.Sprintf("%v", rst))
	})	
	
	app.Post("/video/create", func(c *fiber.Ctx) error {
		collection := db.Collection("videos")
		video := Video{
			Title: c.FormValue("title"),
			Content: c.FormValue("content"),
			URL: c.FormValue("url"),
			ThumbnailURL: c.FormValue("thumbnail_url"),
			AuthorID: c.FormValue("author_id"),
			Created: primitive.Timestamp{T: uint32(time.Now().Unix())},
		}
		rst, err := collection.InsertOne(ctx, video)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Post("/video/update", func(c *fiber.Ctx) error {
		collection := db.Collection("videos")
		
		filter := bson.M{
			"_id": c.FormValue("video_id"),
			"author_id": c.FormValue("author_id"),
		}
		err := checkDocumentExists(collection, ctx, filter, "Video not found")
		checkErr(err)

		update := bson.M{
			"$set": bson.M{
				"title": c.FormValue("title"), 
				"content": c.FormValue("content"), 
				"url": c.FormValue("url"), 
				"thumbnail_url": c.FormValue("thumbnail_url"), 
				"updated": primitive.Timestamp{T: uint32(time.Now().Unix())},
			},
		}
		rst, err := collection.UpdateOne(ctx, filter, update)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Post("/video/delete", func(c *fiber.Ctx) error {
		collection := db.Collection("videos")

		filter := bson.M{
			"_id": c.FormValue("video_id"),
			"author_id": c.FormValue("my_id"),
		}

		err := checkDocumentExists(collection, ctx, filter, "Video not found")
		checkErr(err)

		update := bson.M{
			"$set": bson.M{
				"deleted": primitive.Timestamp{T: uint32(time.Now().Unix())},
			},
		}
		rst, err := collection.UpdateOne(ctx, filter, update)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Get("/video/info/:video_id", func(c *fiber.Ctx) error {
		collection := db.Collection("videos")
		rst, err := collection.Find(ctx, bson.M{"_id": c.Params("video_id")})
		checkErr(err)
		return c.SendString(fmt.Sprintf("%v", rst))
	})

	app.Post("/feedback/create", func(c *fiber.Ctx) error {
		collection := db.Collection("feedbacks")
		feedback := Feedback{
			PostID: c.FormValue("post_id"),
			UserID: c.FormValue("author_id"),
			Created: primitive.Timestamp{T: uint32(time.Now().Unix())},
			Updated: primitive.Timestamp{T: uint32(time.Now().Unix())},
		}
		rst, err := collection.InsertOne(ctx, feedback)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Post("/feedback/update", func(c *fiber.Ctx) error {
		collection := db.Collection("feedbacks")

		filter := bson.M{
			"post_id": c.FormValue("post_id"),
			"author_id": c.FormValue("my_id"),
			"deleted": nil,
		}

		err := checkDocumentExists(collection, ctx, filter, "Feedback info not found")
		checkErr(err)

		update := bson.M{
			"$set": bson.M{},
		}

		if c.FormValue("content") != "" {
			update["$set"].(bson.M)["content"] = c.FormValue("content")
		}

		if c.FormValue("like") != ""{
			update["$set"].(bson.M)["like"] = c.FormValue("like")
		}

		if c.FormValue("bookmark") != "" {
			update["$set"].(bson.M)["bookmark"] = c.FormValue("bookmark")
		}

		update["$set"].(bson.M)["updated"] = primitive.Timestamp{T: uint32(time.Now().Unix())}

		rst, err := collection.UpdateOne(ctx, filter, update)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Post("/feedback/delete", func(c *fiber.Ctx) error {
		collection := db.Collection("feedbacks")
		
		filter := bson.M{
			"_id": c.FormValue("feedback_id"), 
			"post_id": c.FormValue("post_id"), 
			"author_id": c.FormValue("my_id"), 
			"deleted": nil,
		}

		err := checkDocumentExists(collection, ctx, filter, "Feedback info not found")
		checkErr(err)

		update := bson.M{
			"$set": bson.M{
				"deleted": primitive.Timestamp{T: uint32(time.Now().Unix())},
			},
		}
		rst, err := collection.UpdateOne(ctx, filter, update)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Get("/feedback/info/:post_id", func(c *fiber.Ctx) error {
		collection := db.Collection("feedbacks")

		filter := bson.M{
			"post_id": c.Params("post_id"),
			"deleted": nil,
		}

		rst, err := collection.Find(ctx, filter)
		checkErr(err)
		return c.SendString(fmt.Sprintf("%v", rst))
	})

	app.Post("/history/create", func(c *fiber.Ctx) error {
		collection := db.Collection("histories")
		history := History{
			PostID: c.FormValue("post_id"),
			UserID: c.FormValue("user_id"),
			Updated: primitive.Timestamp{T: uint32(time.Now().Unix())},
		}
		rst, err := collection.InsertOne(ctx, history)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Post("/history/update", func(c *fiber.Ctx) error {
		collection := db.Collection("histories")

		filter := bson.M{
			"post_id": c.FormValue("post_id"),
			"user_id": c.FormValue("user_id"),
		}

		err := checkDocumentExists(collection, ctx, filter, "History not found")
		checkErr(err)

		update := bson.M{
			"$set": bson.M{},
		}

		update["$set"].(bson.M)["updated"] = primitive.Timestamp{T: uint32(time.Now().Unix())}

		if c.FormValue("progress") != "" {
			update["$set"].(bson.M)["progress"] = c.FormValue("progress")
		}


		rst, err := collection.UpdateOne(ctx, filter, update)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Post("/history/delete", func(c *fiber.Ctx) error {
		collection := db.Collection("histories")

		filter := bson.M{
			"post_id": c.FormValue("post_id"),
			"user_id": c.FormValue("user_id"),
		}

		err := checkDocumentExists(collection, ctx, filter, "History not found")
		checkErr(err)

		update := bson.M{
			"$set": bson.M{
				"deleted": primitive.Timestamp{T: uint32(time.Now().Unix())},
			},
		}
		rst, err := collection.UpdateOne(ctx, filter, update)
		checkErr(err)
		return c.JSON(rst)
	})

	app.Get("/history/user/:id", func(c *fiber.Ctx) error {
		collection := db.Collection("histories")

		filter := bson.M{
			"_id": c.Params("id"),
			"deleted": nil,
		}

		rst, err := collection.Find(ctx, filter)
		checkErr(err)
		return c.SendString(fmt.Sprintf("%v", rst))
	})

	app.Post("/login", func(c *fiber.Ctx) error {
		collection := db.Collection("users")
		filter := bson.M{"_id": c.FormValue("user_id")}
		err := checkDocumentExists(collection, ctx, filter, "User not found")
		checkErr(err)

		user := User{}
		
		err = collection.FindOne(ctx, filter).Decode(&user)
		checkErr(err)

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(c.FormValue("password")))
		checkErr(err)

		// createSession(
	

		// token :=
		// `{
		// 	"token":
		// 	{
		// 		"access
		// 	}
		// }`
			
		// return c.JSON(token)
		return nil
	})

	app.Listen(":3000")
}