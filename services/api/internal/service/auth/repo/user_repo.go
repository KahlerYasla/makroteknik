package repo

import (
	"api/internal/service/auth/model"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepo struct {
	collection *mongo.Collection
}

func NewUserRepo(client *mongo.Client) *UserRepo {
	return &UserRepo{
		collection: client.Database("makroteknik").Collection("users"),
	}
}

// functions: --------------------------------------------------------------------

func (r *UserRepo) FindByUserName(ctx context.Context, username string) (*model.User, error) {
	var user model.User

	err := r.collection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepo) CreateUser(ctx context.Context, user *model.User) error {
	_, err := r.collection.InsertOne(ctx, user)
	return err
}
