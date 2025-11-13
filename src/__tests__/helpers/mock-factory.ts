import { Types } from 'mongoose';
import { IMyList } from '../../modules/myList/mylist.interface';
import { IUser } from '../../modules/user/user.interface';
import { IMovie } from '../../modules/movie/movie.interface';
import { ITVShow } from '../../modules/tvshow/tvshow.interface';

export const createMockUser = (overrides?: Partial<IUser>): IUser => ({
    _id: new Types.ObjectId(),
    username: 'testuser',
    preferences: {
        favoriteGenres: [],
        dislikedGenres: [],
    },
    watchHistory: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});

export const createMockMovie = (overrides?: Partial<IMovie>): IMovie => ({
    _id: new Types.ObjectId(),
    title: 'Test Movie',
    description: 'Test Description',
    genres: ['Action', 'Drama'],
    releaseDate: new Date(),
    director: 'Test Director',
    actors: ['Actor 1', 'Actor 2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});

export const createMockTVShow = (overrides?: Partial<ITVShow>): ITVShow => ({
    _id: new Types.ObjectId(),
    title: 'Test TV Show',
    description: 'Test Description',
    genres: ['Comedy', 'Drama'],
    episodes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});

export const createMockMyListItem = (overrides?: Partial<IMyList>): IMyList => ({
    _id: new Types.ObjectId(),
    user: new Types.ObjectId(),
    contentId: new Types.ObjectId(),
    contentType: 'movie',
    ...overrides,
});

