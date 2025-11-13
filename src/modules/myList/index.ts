import { container } from "tsyringe";
import { Model } from "mongoose";
import { MyListService } from "./mylist.service";
import { MyListController } from "./mylist.controller";
import MyList from "./mylist.schema";
import User from "../user/user.schema";
import Movie from "../movie/movie.schema";
import TVShow from "../tvshow/tvshow.schema";
import { IMyList } from "./mylist.interface";
import { IUser } from "../user/user.interface";
import { IMovie } from "../movie/movie.interface";
import { ITVShow } from "../tvshow/tvshow.interface";
import { MYLIST_TOKENS } from "./mylist.tokens";

// Register dependencies for the myList module
export const initializeMyListModule = (): void => {
    if (!container.isRegistered(MYLIST_TOKENS.MyListModel)) {
        container.registerInstance<Model<IMyList>>(MYLIST_TOKENS.MyListModel, MyList as Model<IMyList>);
    }

    if (!container.isRegistered(MYLIST_TOKENS.UserModel)) {
        container.registerInstance<Model<IUser>>(MYLIST_TOKENS.UserModel, User as Model<IUser>);
    }

    if (!container.isRegistered(MYLIST_TOKENS.MovieModel)) {
        container.registerInstance<Model<IMovie>>(MYLIST_TOKENS.MovieModel, Movie as Model<IMovie>);
    }

    if (!container.isRegistered(MYLIST_TOKENS.TVShowModel)) {
        container.registerInstance<Model<ITVShow>>(MYLIST_TOKENS.TVShowModel, TVShow as Model<ITVShow>);
    }

    if (!container.isRegistered(MyListService)) {
        container.registerSingleton(MyListService);
    }

    if (!container.isRegistered(MyListController)) {
        container.registerSingleton(MyListController);
    }
};

