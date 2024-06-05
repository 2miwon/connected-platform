// package main

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
    ID       string `bson:"_id,omitempty"`
	Email	 string `bson:"email"`
    Username string `bson:"username"`
    Password string `bson:"password"`
	Created string `bson:"created"`
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
	Updated string `bson:"updated"`
	Deleted bool `bson:"deleted"`
}

type Session struct {
	ID       string `bson:"_id,omitempty"`
	UserID string `bson:"user_id"`
	Token string
	Expired string `bson:"expired"`
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

func createUser(collection *mongo.Collection, ctx context.Context, user User) (*mongo.InsertOneResult, error) {
	return collection.InsertOne(ctx, user)
}