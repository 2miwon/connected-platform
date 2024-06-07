package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"golang.org/x/crypto/bcrypt"

	// replace with your own docs folder, usually "github.com/username/reponame/docs"
	// _ "github.com/2miwon/connected-platform/backend/docs"
	"github.com/gofiber/swagger"
)

type User struct {
    ID       string `bson:"_id,omitempty"`
	Email	 string `bson:"email"`
    Username string `bson:"username"`
    Password string `bson:"password"`
	Created primitive.Timestamp `bson:"created"`
	Token string `bson:"token"`
}

type Video struct {
	ID       string `bson:"_id,omitempty"`
	Title	 string `bson:"title"`
	Content  string `bson:"content"`
	URL 	 string `bson:"url"`
	// ThumbnailURL *string `bson:"thumbnail_url"`
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

func checkDocumentNotExists(collection *mongo.Collection, ctx context.Context, filter bson.M, message string) error {
	num, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return err
	}

	if num != 0 {
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
func jsonParser(c *fiber.Ctx) map[string]interface{} {
	var body map[string]interface{}
	err := c.BodyParser(&body)
	if err != nil {
		return nil
	}
	return body
}

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

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // "http://localhost:3000"
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendStatus(200)
	})

	app.Get("/docs/*", swagger.HandlerDefault)

	app.Get("/debug/:colName", func(c *fiber.Ctx) error {
		colName := c.Params("colName")
		collection := db.Collection(colName)
		rst, err := collection.Find(ctx, bson.M{})
		checkErr(err)
		return c.JSON(rst)
	})
	
	app.Post("/user/create", func(c *fiber.Ctx) error {
		collection := db.Collection("users")
		body := jsonParser(c)

		filter := bson.M{"email": body["email"].(string)}
		
		err = checkDocumentNotExists(collection, ctx, filter, "User already exists")
		if err != nil {
			return c.SendStatus(400)
		}
	
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body["password"].(string)), bcrypt.DefaultCost)
		if err != nil {
			return c.SendStatus(500)
		}

		token, err := bcrypt.GenerateFromPassword([]byte(body["email"].(string)), bcrypt.DefaultCost)
		if err != nil {
			return c.SendStatus(500)
		}

		user := User{
			Email: body["email"].(string),
			Username: body["email"].(string),
			Password: string(hashedPassword),
			Created: primitive.Timestamp{T: uint32(time.Now().Unix())},
			Token: string(token),
		}

		rst, err := createUser(collection, ctx, user)
		if err != nil {
			return c.SendStatus(500)
		}

		return c.JSON(rst)
	})

	app.Post("/user/my_info", func(c *fiber.Ctx) error {
		collection := db.Collection("users")

		body := jsonParser(c)
		var rst bson.M
		err := collection.FindOne(ctx, bson.M{"token": body["token"].(string)}).Decode(&rst)
		if err != nil {
			return c.SendStatus(403)
		}

		return c.JSON(rst)
	})
	
	app.Post("/video/create", func(c *fiber.Ctx) error {
		collection := db.Collection("videos")
		body := jsonParser(c)

		video := Video{
			Title: body["title"].(string),
			Content: body["content"].(string),
			URL: body["url"].(string),
			AuthorID: body["author_id"].(string),
			Created: primitive.Timestamp{T: uint32(time.Now().Unix())},
		}

		// if body["thumbnail_url"] != nil {
		// 	video.(bson.M)["thumbnail_url"] = body["thumbnail_url"]
		// }

		rst, err := collection.InsertOne(ctx, video)
		if err != nil {
			return c.SendStatus(500)
		}

		return c.JSON(rst)
	})

	app.Get("/video/all", func(c *fiber.Ctx) error {
		collection := db.Collection("videos")
		cursor, err := collection.Find(ctx, bson.M{})
		checkErr(err)

		var videos []Video
		if err = cursor.All(ctx, &videos); err != nil {
			return c.SendStatus(500)
		}

		return c.JSON(videos)
	})

	app.Post("/video/update", func(c *fiber.Ctx) error {
		collection := db.Collection("videos")
		body := jsonParser(c)

		filter := bson.M{
			"_id": body["video_id"],
			"author_id": body["my_id"],
		}
		err := checkDocumentExists(collection, ctx, filter, "Video not found")
		if err != nil {
			return c.SendStatus(400)
		}

		update := bson.M{
			"$set": bson.M{
				"title": body["title"],
				"content": body["content"],
				"url": body["url"],
				
				"updated": primitive.Timestamp{T: uint32(time.Now().Unix())},
			},
		}

		// if body["thumbnail_url"] != nil {
		// 	update["$set"].(bson.M)["thumbnail_url"] = body["thumbnail_url"]
		// }

		rst, err := collection.UpdateOne(ctx, filter, update)
		if err != nil {
			return c.SendStatus(500)
		}

		return c.JSON(rst)
	})

	app.Post("/video/delete", func(c *fiber.Ctx) error {
		collection := db.Collection("videos")
		body := jsonParser(c)

		filter := bson.M{
			"_id": body["video_id"],
			"author_id": body["my_id"],
		}

		err := checkDocumentExists(collection, ctx, filter, "Video not found")
		if err != nil {
			return c.SendStatus(400)
		}

		update := bson.M{
			"$set": bson.M{
				"deleted": primitive.Timestamp{T: uint32(time.Now().Unix())},
			},
		}
		rst, err := collection.UpdateOne(ctx, filter, update)
		if err != nil {
			return c.SendStatus(500)
		}
		return c.JSON(rst)
	})

	app.Get("/video/info/:video_id", func(c *fiber.Ctx) error {
		collection := db.Collection("videos")
		rst, err := collection.Find(ctx, bson.M{"_id": c.Params("video_id")})
		if err != nil {
			return c.SendStatus(400)
		}

		return c.JSON(rst)
	})

	app.Post("/feedback/create", func(c *fiber.Ctx) error {
		collection := db.Collection("feedbacks")
		body := jsonParser(c)

		feedback := Feedback{
			PostID: body["post_id"].(string),
			UserID: body["author_id"].(string),
			Created: primitive.Timestamp{T: uint32(time.Now().Unix())},
			Updated: primitive.Timestamp{T: uint32(time.Now().Unix())},
		}
		rst, err := collection.InsertOne(ctx, feedback)
		if err != nil {
			return c.SendStatus(500)
		}
		return c.JSON(rst)
	})

	app.Post("/feedback/update", func(c *fiber.Ctx) error {
		collection := db.Collection("feedbacks")
		body := jsonParser(c)

		filter := bson.M{
			"post_id": body["post_id"],
			"author_id": body["my_id"],
			"deleted": nil,
		}

		err := checkDocumentExists(collection, ctx, filter, "Feedback info not found")
		checkErr(err)

		update := bson.M{
			"$set": bson.M{},
		}

		if body["content"] != nil {
			update["$set"].(bson.M)["content"] = body["content"]
		}

		if body["like"] != nil {
			update["$set"].(bson.M)["like"] = body["like"]
		}

		if body["bookmark"] != nil {
			update["$set"].(bson.M)["bookmark"] = body["bookmark"]
		}

		update["$set"].(bson.M)["updated"] = primitive.Timestamp{T: uint32(time.Now().Unix())}

		rst, err := collection.UpdateOne(ctx, filter, update)
		if err != nil {
			return c.SendStatus(500)
		}

		return c.JSON(rst)
	})

	app.Post("/feedback/delete", func(c *fiber.Ctx) error {
		collection := db.Collection("feedbacks")
		body := jsonParser(c)
		
		filter := bson.M{
			"_id": body["feedback_id"],
			"post_id": body["post_id"],
			"author_id": body["my_id"],
			"deleted": nil,
		}

		err := checkDocumentExists(collection, ctx, filter, "Feedback info not found")
		if err != nil {
			return c.SendStatus(403)
		}

		update := bson.M{
			"$set": bson.M{
				"deleted": primitive.Timestamp{T: uint32(time.Now().Unix())},
			},
		}
		rst, err := collection.UpdateOne(ctx, filter, update)
		if err != nil {
			return c.SendStatus(500)
		}
		return c.JSON(rst)
	})

	app.Get("/feedback/info/:post_id", func(c *fiber.Ctx) error {
		collection := db.Collection("feedbacks")
		body := jsonParser(c)

		filter := bson.M{
			"post_id": body["post_id"],
			"deleted": nil,
		}

		rst, err := collection.Find(ctx, filter)
		if err != nil {
			return c.SendStatus(400)
		}
		return c.JSON(rst)
	})

	app.Post("/history/create", func(c *fiber.Ctx) error {
		collection := db.Collection("histories")
		body := jsonParser(c)

		history := History{
			PostID: body["post_id"].(string),
			UserID: body["user_id"].(string),
			Updated: primitive.Timestamp{T: uint32(time.Now().Unix())},
		}
		rst, err := collection.InsertOne(ctx, history)
		if err != nil {
			return c.SendStatus(500)
		}

		return c.JSON(rst)
	})

	app.Post("/history/update", func(c *fiber.Ctx) error {
		collection := db.Collection("histories")
		body := jsonParser(c)

		filter := bson.M{
			"post_id": body["post_id"],
			"user_id": body["user_id"],
		}

		err := checkDocumentExists(collection, ctx, filter, "History not found")
		if err != nil {
			return c.SendStatus(400)
		}

		update := bson.M{
			"$set": bson.M{},
		}

		update["$set"].(bson.M)["updated"] = primitive.Timestamp{T: uint32(time.Now().Unix())}

		if body["progress"] != nil {
			update["$set"].(bson.M)["progress"] = body["progress"]
		}


		rst, err := collection.UpdateOne(ctx, filter, update)
		if err != nil {
			return c.SendStatus(500)
		}

		return c.JSON(rst)
	})

	app.Post("/history/delete", func(c *fiber.Ctx) error {
		collection := db.Collection("histories")
		body := jsonParser(c)

		filter := bson.M{
			"post_id": body["post_id"],
			"user_id": body["user_id"],
		}

		err := checkDocumentExists(collection, ctx, filter, "History not found")
		if err != nil {
			return c.SendStatus(400)
		}

		update := bson.M{
			"$set": bson.M{
				"deleted": primitive.Timestamp{T: uint32(time.Now().Unix())},
			},
		}
		rst, err := collection.UpdateOne(ctx, filter, update)
		if err != nil {
			return c.SendStatus(500)
		}

		return c.JSON(rst)
	})

	app.Get("/history/user/:id", func(c *fiber.Ctx) error {
		collection := db.Collection("histories")

		filter := bson.M{
			"_id": c.Params("id"),
			"deleted": nil,
		}

		rst, err := collection.Find(ctx, filter)
		if err != nil {
			return c.SendStatus(400)
		}

		return c.JSON(rst)
	})

	app.Post("/login", func(c *fiber.Ctx) error {
		collection := db.Collection("users")
		body := jsonParser(c)

		filter := bson.M{"email": body["email"].(string)}
		err := checkDocumentExists(collection, ctx, filter, "User not found")
		if err != nil {
			return c.SendStatus(400)
		}

		user := User{}
		
		err = collection.FindOne(ctx, filter).Decode(&user)
		if err != nil {
			return c.SendStatus(500)
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body["password"].(string)))
		if err != nil {
			return c.SendStatus(403)
		}
		
		return c.JSON(user.Token)
	})

	app.Listen(":3000")
}