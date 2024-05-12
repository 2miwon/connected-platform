package main

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
    ID       string `bson:"_id,omitempty"`
    Username string `bson:"username"`
    Password string `bson:"password"`
	Playlist []string `bson:"playlist"`
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

// func createUser(collection *mongo.Collection, ctx context.Context) (*mongo.InsertOneResult, error) {
	
// }