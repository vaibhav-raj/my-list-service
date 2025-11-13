import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Model, Types } from 'mongoose';
import { MyListService } from '../../mylist.service';
import { MyListError } from '../../../../errors/mylist.error';
import { MyListDictionary } from '../../mylist.dictionary';
import {
    createMockUser,
    createMockMovie,
    createMockTVShow,
    createMockMyListItem,
} from '../../../../__tests__/helpers/mock-factory';
import { IMyList } from '../../mylist.interface';
import { IUser } from '../../../user/user.interface';
import { IMovie } from '../../../movie/movie.interface';
import { ITVShow } from '../../../tvshow/tvshow.interface';

describe('MyListService', () => {
    let myListService: MyListService;
    let mockMyListModel: jest.Mocked<Model<IMyList>>;
    let mockUserModel: jest.Mocked<Model<IUser>>;
    let mockMovieModel: jest.Mocked<Model<IMovie>>;
    let mockTVModel: jest.Mocked<Model<ITVShow>>;

    beforeEach(() => {
        // Create mock models
        mockMyListModel = {
            findOne: jest.fn(),
            find: jest.fn(),
            findByIdAndDelete: jest.fn(),
            findOneAndDelete: jest.fn(),
            countDocuments: jest.fn(),
        } as any;

        mockUserModel = {
            findById: jest.fn(),
            updateOne: jest.fn(),
        } as any;

        mockMovieModel = {
            findById: jest.fn(),
        } as any;

        mockTVModel = {
            findById: jest.fn(),
        } as any;

        myListService = new MyListService(
            mockMyListModel,
            mockUserModel,
            mockMovieModel,
            mockTVModel
        );
    });

    describe('addToMyList', () => {
        const userId = new Types.ObjectId();
        const contentId = new Types.ObjectId();
        const dto = {
            userId,
            contentId,
            contentType: 'movie',
        };

        it('should successfully add a movie to the list', async () => {
            const mockUser = createMockUser({ _id: userId });
            const mockMovie = createMockMovie({ _id: contentId });
            const mockSavedItem = createMockMyListItem({
                user: userId,
                contentId,
                contentType: 'movie',
            });

            (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (mockMovieModel.findById as jest.Mock).mockResolvedValue(mockMovie);
            (mockMyListModel.findOne as jest.Mock).mockResolvedValue(null);

            // Mock the Model constructor to return an object with save method
            const saveMock = jest.fn().mockResolvedValue(mockSavedItem);
            (mockMyListModel as any).mockImplementation(function (this: any) {
                return {
                    save: saveMock,
                };
            });

            const result = await myListService.addToMyList(dto);

            expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
            expect(mockMovieModel.findById).toHaveBeenCalledWith(contentId);
            expect(mockMyListModel.findOne).toHaveBeenCalledWith({
                user: userId,
                contentId,
            });
            expect(result).toBeDefined();
        });

        it('should throw error if user not found', async () => {
            (mockUserModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(myListService.addToMyList(dto)).rejects.toThrow(MyListError);
            await expect(myListService.addToMyList(dto)).rejects.toThrow(
                MyListDictionary.USER_NOT_FOUND
            );
        });

        it('should throw error if content not found', async () => {
            const mockUser = createMockUser({ _id: userId });
            (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (mockMovieModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(myListService.addToMyList(dto)).rejects.toThrow(MyListError);
            await expect(myListService.addToMyList(dto)).rejects.toThrow(
                MyListDictionary.CONTENT_NOT_FOUND
            );
        });

        it('should throw error if item already exists', async () => {
            const mockUser = createMockUser({ _id: userId });
            const mockMovie = createMockMovie({ _id: contentId });
            const existingItem = createMockMyListItem({
                user: userId,
                contentId,
            });

            (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (mockMovieModel.findById as jest.Mock).mockResolvedValue(mockMovie);
            (mockMyListModel.findOne as jest.Mock).mockResolvedValue(existingItem);

            await expect(myListService.addToMyList(dto)).rejects.toThrow(MyListError);
            await expect(myListService.addToMyList(dto)).rejects.toThrow(
                MyListDictionary.ITEM_ALREADY_EXISTS
            );
        });

        it('should throw error for invalid content type', async () => {
            const mockUser = createMockUser({ _id: userId });
            (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);

            const invalidDto = { ...dto, contentType: 'invalid' };

            await expect(myListService.addToMyList(invalidDto)).rejects.toThrow(MyListError);
            await expect(myListService.addToMyList(invalidDto)).rejects.toThrow(
                MyListDictionary.INVALID_CONTENT_TYPE
            );
        });

        it('should successfully add a TV show to the list', async () => {
            const mockUser = createMockUser({ _id: userId });
            const mockTVShow = createMockTVShow({ _id: contentId });
            const mockSavedItem = createMockMyListItem({
                user: userId,
                contentId,
                contentType: 'tvshow',
            });

            const tvShowDto = { ...dto, contentType: 'tvshow' };

            (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (mockTVModel.findById as jest.Mock).mockResolvedValue(mockTVShow);
            (mockMyListModel.findOne as jest.Mock).mockResolvedValue(null);

            const saveMock = jest.fn().mockResolvedValue(mockSavedItem);
            const mockConstructor = jest.fn().mockImplementation(function (this: any) {
                this.save = saveMock;
                return this;
            });
            (mockMyListModel as any) = mockConstructor as any;

            const result = await myListService.addToMyList(tvShowDto);

            expect(mockTVModel.findById).toHaveBeenCalledWith(contentId);
            expect(result).toBeDefined();
        });
    });

    describe('removeFromMyList', () => {
        const userId = new Types.ObjectId();
        const contentId = new Types.ObjectId();
        const dto = {
            userId,
            contentId,
        };

        it('should successfully remove an item from the list', async () => {
            const mockUser = createMockUser({ _id: userId });
            const mockDeletedItem = createMockMyListItem({
                user: userId,
                contentId,
            });

            (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (mockMyListModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockDeletedItem);

            const result = await myListService.removeFromMyList(dto);

            expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
            expect(mockMyListModel.findOneAndDelete).toHaveBeenCalledWith({
                user: userId,
                contentId,
            });
            expect(result).toEqual(mockDeletedItem);
        });

        it('should throw error if user not found', async () => {
            (mockUserModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(myListService.removeFromMyList(dto)).rejects.toThrow(MyListError);
            await expect(myListService.removeFromMyList(dto)).rejects.toThrow(
                MyListDictionary.USER_NOT_FOUND
            );
        });

        it('should throw error if item not found in list', async () => {
            const mockUser = createMockUser({ _id: userId });
            (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (mockMyListModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

            await expect(myListService.removeFromMyList(dto)).rejects.toThrow(MyListError);
            await expect(myListService.removeFromMyList(dto)).rejects.toThrow(
                MyListDictionary.ITEM_NOT_FOUND
            );
        });
    });

    describe('getMyList', () => {
        const userId = new Types.ObjectId();
        const dto = {
            userId,
            page: 1,
            limit: 10,
        };

        it('should successfully retrieve paginated list', async () => {
            const mockItems = [
                createMockMyListItem({ user: userId }),
                createMockMyListItem({ user: userId }),
            ];
            const totalCount = 2;

            (mockMyListModel.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue(mockItems),
                        }),
                    }),
                }),
            });
            (mockMyListModel.countDocuments as jest.Mock).mockReturnValue({
                exec: jest.fn().mockResolvedValue(totalCount),
            });

            const result = await myListService.getMyList(dto);

            expect(result.results).toHaveLength(2);
            expect(result.totalCount).toBe(2);
        });

        it('should handle empty list', async () => {
            (mockMyListModel.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([]),
                        }),
                    }),
                }),
            });
            (mockMyListModel.countDocuments as jest.Mock).mockReturnValue({
                exec: jest.fn().mockResolvedValue(0),
            });

            const result = await myListService.getMyList(dto);

            expect(result.results).toHaveLength(0);
            expect(result.totalCount).toBe(0);
        });

        it('should respect pagination parameters', async () => {
            const paginatedDto = {
                userId,
                page: 2,
                limit: 5,
            };

            (mockMyListModel.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([]),
                        }),
                    }),
                }),
            });
            (mockMyListModel.countDocuments as jest.Mock).mockReturnValue({
                exec: jest.fn().mockResolvedValue(10),
            });

            await myListService.getMyList(paginatedDto);

            const findCall = (mockMyListModel.find as jest.Mock).mock.results[0].value;
            expect(findCall.skip).toHaveBeenCalledWith(5); // (page 2 - 1) * limit 5
        });
    });
});

