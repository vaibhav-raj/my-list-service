import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../../app';
import { connectTestDB, closeTestDB, clearTestDB } from '../../../../__tests__/helpers/test-db';
import MyList from '../../mylist.schema';
import User from '../../../user/user.schema';
import Movie from '../../../movie/movie.schema';
import TVShow from '../../../tvshow/tvshow.schema';
import { Types } from 'mongoose';

describe('MyList Integration Tests', () => {
    let testUserId: Types.ObjectId;
    let testMovieId: Types.ObjectId;
    let testTVShowId: Types.ObjectId;

    beforeAll(async () => {
        await connectTestDB();
    });

    afterAll(async () => {
        await closeTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();

        // Create test user
        const user = new User({
            username: 'testuser',
            preferences: {
                favoriteGenres: [],
                dislikedGenres: [],
            },
            watchHistory: [],
        });
        const savedUser = await user.save();
        testUserId = savedUser._id!;

        // Create test movie
        const movie = new Movie({
            title: 'Test Movie',
            description: 'Test Description',
            genres: ['Action', 'Drama'],
            releaseDate: new Date(),
            director: 'Test Director',
            actors: ['Actor 1'],
        });
        const savedMovie = await movie.save();
        testMovieId = savedMovie._id!;

        // Create test TV show
        const tvShow = new TVShow({
            title: 'Test TV Show',
            description: 'Test Description',
            genres: ['Comedy'],
            episodes: [],
        });
        const savedTVShow = await tvShow.save();
        testTVShowId = savedTVShow._id!;
    });

    describe('POST /api/v1/mylist/addToMyList', () => {
        it('should add a movie to the list successfully', async () => {
            const response = await request(app)
                .post('/api/v1/mylist/addToMyList')
                .send({
                    user: testUserId.toString(),
                    contentId: testMovieId.toString(),
                    contentType: 'movie',
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.user).toBe(testUserId.toString());
            expect(response.body.data.contentId).toBe(testMovieId.toString());
            expect(response.body.data.contentType).toBe('movie');
        });

        it('should add a TV show to the list successfully', async () => {
            const response = await request(app)
                .post('/api/v1/mylist/addToMyList')
                .send({
                    user: testUserId.toString(),
                    contentId: testTVShowId.toString(),
                    contentType: 'tvshow',
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.contentType).toBe('tvshow');
        });

        it('should return 400 if user not found', async () => {
            const fakeUserId = new Types.ObjectId();
            const response = await request(app)
                .post('/api/v1/mylist/addToMyList')
                .send({
                    user: fakeUserId.toString(),
                    contentId: testMovieId.toString(),
                    contentType: 'movie',
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should return 400 if content not found', async () => {
            const fakeContentId = new Types.ObjectId();
            const response = await request(app)
                .post('/api/v1/mylist/addToMyList')
                .send({
                    user: testUserId.toString(),
                    contentId: fakeContentId.toString(),
                    contentType: 'movie',
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should return 400 if item already exists', async () => {
            // Add item first time
            await request(app)
                .post('/api/v1/mylist/addToMyList')
                .send({
                    user: testUserId.toString(),
                    contentId: testMovieId.toString(),
                    contentType: 'movie',
                })
                .expect(201);

            // Try to add same item again
            const response = await request(app)
                .post('/api/v1/mylist/addToMyList')
                .send({
                    user: testUserId.toString(),
                    contentId: testMovieId.toString(),
                    contentType: 'movie',
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should return 400 for invalid content type', async () => {
            const response = await request(app)
                .post('/api/v1/mylist/addToMyList')
                .send({
                    user: testUserId.toString(),
                    contentId: testMovieId.toString(),
                    contentType: 'invalid',
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/mylist/', () => {
        beforeEach(async () => {
            // Add some items to the list
            await new MyList({
                user: testUserId,
                contentId: testMovieId,
                contentType: 'movie',
            }).save();

            await new MyList({
                user: testUserId,
                contentId: testTVShowId,
                contentType: 'tvshow',
            }).save();
        });

        it('should retrieve user list successfully', async () => {
            const response = await request(app)
                .get('/api/v1/mylist/')
                .query({ user: testUserId.toString() })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.results).toBeInstanceOf(Array);
            expect(response.body.data.totalCount).toBe(2);
        });

        it('should support pagination', async () => {
            const response = await request(app)
                .get('/api/v1/mylist/')
                .query({
                    user: testUserId.toString(),
                    page: 1,
                    limit: 1,
                })
                .expect(200);

            expect(response.body.data.results).toHaveLength(1);
            expect(response.body.data.totalCount).toBe(2);
        });

        it('should support sorting', async () => {
            const response = await request(app)
                .get('/api/v1/mylist/')
                .query({
                    user: testUserId.toString(),
                    sortBy: 'contentType',
                    sortOrder: 'asc',
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.results.length).toBeGreaterThan(0);
        });

        it('should return empty list for user with no items', async () => {
            const newUserId = new Types.ObjectId();
            const newUser = new User({
                _id: newUserId,
                username: 'newuser',
                preferences: {
                    favoriteGenres: [],
                    dislikedGenres: [],
                },
                watchHistory: [],
            });
            await newUser.save();

            const response = await request(app)
                .get('/api/v1/mylist/')
                .query({ user: newUserId.toString() })
                .expect(200);

            expect(response.body.data.results).toHaveLength(0);
            expect(response.body.data.totalCount).toBe(0);
        });
    });

    describe('DELETE /api/v1/mylist/', () => {
        let listItemId: Types.ObjectId;

        beforeEach(async () => {
            const item = await new MyList({
                user: testUserId,
                contentId: testMovieId,
                contentType: 'movie',
            }).save();
            listItemId = item._id!;
        });

        it('should remove item from list successfully', async () => {
            const response = await request(app)
                .delete('/api/v1/mylist/')
                .send({
                    user: testUserId.toString(),
                    contentId: testMovieId.toString(),
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.message).toBeDefined();
        });

        it('should return 404 if item not found', async () => {
            const fakeContentId = new Types.ObjectId();
            const response = await request(app)
                .delete('/api/v1/mylist/')
                .send({
                    user: testUserId.toString(),
                    contentId: fakeContentId.toString(),
                })
                .expect(404);

            expect(response.body.success).toBe(false);
        });

        it('should return 400 if user not found', async () => {
            const fakeUserId = new Types.ObjectId();
            const response = await request(app)
                .delete('/api/v1/mylist/')
                .send({
                    user: fakeUserId.toString(),
                    contentId: testMovieId.toString(),
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('Health Check', () => {
        it('should return health check status', async () => {
            const response = await request(app)
                .get('/api/v1/health')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBeDefined();
        });
    });
});

