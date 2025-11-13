import mongoose from "mongoose";
import connectDB from "../config/db";
import Movie from "../modules/movie/movie.schema";
import TVShow from "../modules/tvshow/tvshow.schema";
import User from "../modules/user/user.schema";
import MyList from "../modules/myList/mylist.schema";
import { ENUM_CONTENT_TYPE, ENUM_GENRES } from "../libs/enums/common.enum";

type MovieSeed = {
    key: string;
    title: string;
    description: string;
    genres: string[];
    releaseDate: Date;
    director: string;
    actors: string[];
};

type TVShowSeed = {
    key: string;
    title: string;
    description: string;
    genres: string[];
    episodes: {
        episodeNumber: number;
        seasonNumber: number;
        releaseDate: Date;
        director: string;
        actors: string[];
    }[];
};

type UserSeed = {
    key: string;
    username: string;
    preferences: {
        favoriteGenres: string[];
        dislikedGenres: string[];
    };
    watchHistory: {
        contentKey: string;
        contentType: "movie" | "tvshow";
        watchedOn: Date;
        rating: number;
    }[];
};

type MyListSeed = {
    userKey: string;
    contentKey: string;
    contentType: "movie" | "tvshow";
};

const moviesSeed: MovieSeed[] = [
    {
        key: "movie1",
        title: "Inception",
        description:
            "A skilled thief who steals secrets through dreams takes on his most dangerous mission yet.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.ACTION],
        releaseDate: new Date("2010-07-16"

        ),
        director: "Christopher Nolan",
        actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    },
    {
        key: "movie2",
        title: "The Dark Knight",
        description:
            "Batman faces his greatest psychological and physical tests as the Joker wreaks havoc in Gotham.",
        genres: [ENUM_GENRES.ACTION, ENUM_GENRES.DRAMA],
        releaseDate: new Date("2008-07-18"),
        director: "Christopher Nolan",
        actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    },
    {
        key: "movie3",
        title: "Interstellar",
        description:
            "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.DRAMA],
        releaseDate: new Date("2014-11-07"),
        director: "Christopher Nolan",
        actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    },
    {
        key: "movie4",
        title: "Parasite",
        description:
            "A poor family schemes to become employed by a wealthy family and infiltrate their household.",
        genres: [ENUM_GENRES.DRAMA, ENUM_GENRES.COMEDY],
        releaseDate: new Date("2019-05-30"),
        director: "Bong Joon-ho",
        actors: ["Song Kang-ho", "Cho Yeo-jeong", "Park So-dam"],
    },
    {
        key: "movie5",
        title: "The Shawshank Redemption",
        description:
            "Two imprisoned men bond over years, finding solace and eventual redemption.",
        genres: [ENUM_GENRES.DRAMA],
        releaseDate: new Date("1994-09-23"),
        director: "Frank Darabont",
        actors: ["Tim Robbins", "Morgan Freeman"],
    },
    {
        key: "movie6",
        title: "Pulp Fiction",
        description:
            "The lives of criminals intertwine in tales of violence, redemption, and dark humor.",
        genres: [ENUM_GENRES.DRAMA, ENUM_GENRES.ACTION],
        releaseDate: new Date("1994-10-14"),
        director: "Quentin Tarantino",
        actors: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
    },
    {
        key: "movie7",
        title: "The Matrix",
        description:
            "A hacker discovers the truth about his reality and his role in the war against its controllers.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.ACTION],
        releaseDate: new Date("1999-03-31"),
        director: "Lana Wachowski, Lilly Wachowski",
        actors: ["Keanu Reeves", "Carrie-Anne Moss", "Laurence Fishburne"],
    },
    {
        key: "movie8",
        title: "Avengers: Endgame",
        description:
            "The Avengers assemble for a final stand against Thanos to restore balance to the universe.",
        genres: [ENUM_GENRES.ACTION, ENUM_GENRES.SCI_FI],
        releaseDate: new Date("2019-04-26"),
        director: "Anthony Russo, Joe Russo",
        actors: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    },
    {
        key: "movie9",
        title: "Gladiator",
        description:
            "A Roman general seeks vengeance against the corrupt emperor who murdered his family.",
        genres: [ENUM_GENRES.ACTION, ENUM_GENRES.DRAMA],
        releaseDate: new Date("2000-05-05"),
        director: "Ridley Scott",
        actors: ["Russell Crowe", "Joaquin Phoenix"],
    },
    {
        key: "movie10",
        title: "Titanic",
        description: "A romance unfolds aboard the doomed RMS Titanic.",
        genres: [ENUM_GENRES.DRAMA, ENUM_GENRES.ROMANCE],
        releaseDate: new Date("1997-12-19"),
        director: "James Cameron",
        actors: ["Leonardo DiCaprio", "Kate Winslet"],
    },
    {
        key: "movie11",
        title: "Joker",
        description:
            "A failed comedian’s descent into madness leads to the rise of an infamous villain.",
        genres: [ENUM_GENRES.DRAMA],
        releaseDate: new Date("2019-10-04"),
        director: "Todd Phillips",
        actors: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
    },
    {
        key: "movie12",
        title: "Avatar",
        description:
            "A paraplegic Marine dispatched to Pandora becomes torn between following orders and protecting his new home.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.ACTION],
        releaseDate: new Date("2009-12-18"),
        director: "James Cameron",
        actors: ["Sam Worthington", "Zoe Saldaña"],
    },
    {
        key: "movie13",
        title: "The Godfather",
        description:
            "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
        genres: [ENUM_GENRES.DRAMA],
        releaseDate: new Date("1972-03-24"),
        director: "Francis Ford Coppola",
        actors: ["Marlon Brando", "Al Pacino"],
    },
    {
        key: "movie14",
        title: "Forrest Gump",
        description:
            "The story of an unlikely hero who witnesses and influences key moments in American history.",
        genres: [ENUM_GENRES.DRAMA, ENUM_GENRES.ROMANCE],
        releaseDate: new Date("1994-07-06"),
        director: "Robert Zemeckis",
        actors: ["Tom Hanks", "Robin Wright"],
    },
    {
        key: "movie15",
        title: "Spider-Man: No Way Home",
        description:
            "Peter Parker seeks help from Doctor Strange after his identity is revealed to the world.",
        genres: [ENUM_GENRES.ACTION, ENUM_GENRES.SCI_FI],
        releaseDate: new Date("2021-12-17"),
        director: "Jon Watts",
        actors: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"],
    },
    {
        key: "movie16",
        title: "La La Land",
        description:
            "An aspiring actress and a jazz musician fall in love but struggle to balance love and ambition.",
        genres: [ENUM_GENRES.ROMANCE, ENUM_GENRES.DRAMA],
        releaseDate: new Date("2016-12-09"),
        director: "Damien Chazelle",
        actors: ["Ryan Gosling", "Emma Stone"],
    },
    {
        key: "movie17",
        title: "Black Panther",
        description:
            "T'Challa returns to Wakanda to take his rightful place as king after his father's death.",
        genres: [ENUM_GENRES.ACTION, ENUM_GENRES.SCI_FI],
        releaseDate: new Date("2018-02-16"),
        director: "Ryan Coogler",
        actors: ["Chadwick Boseman", "Lupita Nyong’o", "Michael B. Jordan"],
    },
    {
        key: "movie18",
        title: "The Lion King",
        description:
            "A lion cub’s journey to reclaim his throne after tragedy strikes his family.",
        genres: [ENUM_GENRES.DRAMA, ENUM_GENRES.FANTASY],
        releaseDate: new Date("1994-06-24"),
        director: "Roger Allers, Rob Minkoff",
        actors: ["Matthew Broderick", "Jeremy Irons"],
    },
    {
        key: "movie19",
        title: "The Social Network",
        description:
            "The founding and rise of Facebook leads to conflict among its creators.",
        genres: [ENUM_GENRES.DRAMA],
        releaseDate: new Date("2010-10-01"),
        director: "David Fincher",
        actors: ["Jesse Eisenberg", "Andrew Garfield", "Justin Timberlake"],
    },
    {
        key: "movie20",
        title: "Dune",
        description:
            "A noble family becomes entangled in a battle for control of a desert planet.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.ACTION],
        releaseDate: new Date("2021-10-22"),
        director: "Denis Villeneuve",
        actors: ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
    },
];

const tvShowsSeed: TVShowSeed[] = [
    {
        key: "tvshow1",
        title: "Breaking Bad",
        description:
            "A chemistry teacher turns to manufacturing drugs after a terminal diagnosis.",
        genres: [ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2008-01-20"),
                director: "Vince Gilligan",
                actors: ["Bryan Cranston", "Aaron Paul"],
            },
            {
                episodeNumber: 2,
                seasonNumber: 1,
                releaseDate: new Date("2008-01-27"),
                director: "Vince Gilligan",
                actors: ["Bryan Cranston", "Aaron Paul"],
            },
        ],
    },
    {
        key: "tvshow2",
        title: "Stranger Things",
        description:
            "A group of kids uncover supernatural mysteries in their small town.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2016-07-15"),
                director: "The Duffer Brothers",
                actors: ["Millie Bobby Brown", "Finn Wolfhard"],
            },
        ],
    },
    {
        key: "tvshow3",
        title: "Game of Thrones",
        description:
            "Noble families vie for control of the Iron Throne in the Seven Kingdoms.",
        genres: [ENUM_GENRES.FANTASY, ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2011-04-17"),
                director: "Tim Van Patten",
                actors: ["Emilia Clarke", "Kit Harington"],
            },
        ],
    },
    {
        key: "tvshow4",
        title: "The Office",
        description:
            "A mockumentary on the everyday lives of office employees.",
        genres: [ENUM_GENRES.COMEDY],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2005-03-24"),
                director: "Ken Kwapis",
                actors: ["Steve Carell", "Rainn Wilson"],
            },
        ],
    },
    {
        key: "tvshow5",
        title: "Friends",
        description:
            "Six friends navigate life and love in New York City.",
        genres: [ENUM_GENRES.COMEDY, ENUM_GENRES.ROMANCE],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("1994-09-22"),
                director: "James Burrows",
                actors: ["Jennifer Aniston", "Courteney Cox"],
            },
        ],
    },
    {
        key: "tvshow6",
        title: "The Mandalorian",
        description:
            "A lone bounty hunter in the outer reaches of the galaxy takes on new missions.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.ACTION],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2019-11-12"),
                director: "Dave Filoni",
                actors: ["Pedro Pascal", "Carl Weathers"],
            },
        ],
    },
    {
        key: "tvshow7",
        title: "The Witcher",
        description:
            "A monster hunter struggles to find his place in a world of magic and politics.",
        genres: [ENUM_GENRES.FANTASY, ENUM_GENRES.ACTION],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2019-12-20"),
                director: "Alik Sakharov",
                actors: ["Henry Cavill", "Anya Chalotra"],
            },
        ],
    },
    {
        key: "tvshow8",
        title: "Peaky Blinders",
        description:
            "A British gangster family epic set in 1919 Birmingham.",
        genres: [ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2013-09-12"),
                director: "Otto Bathurst",
                actors: ["Cillian Murphy", "Paul Anderson"],
            },
        ],
    },
    {
        key: "tvshow9",
        title: "The Boys",
        description:
            "A group of vigilantes set out to take down corrupt superheroes.",
        genres: [ENUM_GENRES.ACTION, ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2019-07-26"),
                director: "Dan Trachtenberg",
                actors: ["Karl Urban", "Jack Quaid"],
            },
        ],
    },
    {
        key: "tvshow10",
        title: "Sherlock",
        description:
            "A modern update finds Sherlock Holmes solving crimes in contemporary London.",
        genres: [ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2010-07-25"),
                director: "Paul McGuigan",
                actors: ["Benedict Cumberbatch", "Martin Freeman"],
            },
        ],
    },
    {
        key: "tvshow11",
        title: "Dark",
        description:
            "A German town’s secrets unravel when children start disappearing mysteriously.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2017-12-01"),
                director: "Baran bo Odar",
                actors: ["Louis Hofmann", "Lisa Vicari"],
            },
        ],
    },
    {
        key: "tvshow12",
        title: "Better Call Saul",
        description:
            "The evolution of small-time lawyer Jimmy McGill into criminal lawyer Saul Goodman.",
        genres: [ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2015-02-08"),
                director: "Vince Gilligan",
                actors: ["Bob Odenkirk", "Jonathan Banks"],
            },
        ],
    },
    {
        key: "tvshow13",
        title: "House of the Dragon",
        description:
            "A prequel to Game of Thrones about House Targaryen’s rise to power.",
        genres: [ENUM_GENRES.FANTASY, ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2022-08-21"),
                director: "Miguel Sapochnik",
                actors: ["Matt Smith", "Emma D’Arcy"],
            },
        ],
    },
    {
        key: "tvshow14",
        title: "The Crown",
        description:
            "A dramatized history of the reign of Queen Elizabeth II.",
        genres: [ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2016-11-04"),
                director: "Stephen Daldry",
                actors: ["Claire Foy", "Matt Smith"],
            },
        ],
    },
    {
        key: "tvshow15",
        title: "Money Heist",
        description:
            "A criminal mastermind leads a group to carry out ambitious heists in Spain.",
        genres: [ENUM_GENRES.ACTION, ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2017-05-02"),
                director: "Álex Pina",
                actors: ["Úrsula Corberó", "Álvaro Morte"],
            },
        ],
    },
    {
        key: "tvshow16",
        title: "The Last of Us",
        description:
            "A smuggler and a young girl travel across a post-apocalyptic United States.",
        genres: [ENUM_GENRES.DRAMA, ENUM_GENRES.SCI_FI],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2023-01-15"),
                director: "Craig Mazin",
                actors: ["Pedro Pascal", "Bella Ramsey"],
            },
        ],
    },
    {
        key: "tvshow17",
        title: "Loki",
        description:
            "The God of Mischief steps out of his brother’s shadow in a new timeline.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.ACTION],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2021-06-09"),
                director: "Kate Herron",
                actors: ["Tom Hiddleston", "Owen Wilson"],
            },
        ],
    },
    {
        key: "tvshow18",
        title: "The Expanse",
        description:
            "A detective and a ship’s crew unravel a conspiracy that threatens humanity.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2015-12-14"),
                director: "Terry McDonough",
                actors: ["Steven Strait", "Dominique Tipper"],
            },
        ],
    },
    {
        key: "tvshow19",
        title: "Succession",
        description:
            "A dysfunctional media family battles for control of their father’s empire.",
        genres: [ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2018-06-03"),
                director: "Adam McKay",
                actors: ["Brian Cox", "Jeremy Strong"],
            },
        ],
    },
    {
        key: "tvshow20",
        title: "Severance",
        description:
            "Office workers undergo a procedure that separates work memories from their personal lives.",
        genres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.DRAMA],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date("2022-02-18"),
                director: "Ben Stiller",
                actors: ["Adam Scott", "Patricia Arquette"],
            },
        ],
    },
];

const usersSeed: UserSeed[] = [
    {
        key: "user1",
        username: "vaibhav",
        preferences: {
            favoriteGenres: [ENUM_GENRES.ACTION, ENUM_GENRES.SCI_FI],
            dislikedGenres: [ENUM_GENRES.ROMANCE],
        },
        watchHistory: [
            {
                contentKey: "movie1",
                contentType: "movie",
                watchedOn: new Date("2024-09-10"),
                rating: 5,
            },
            {
                contentKey: "tvshow1",
                contentType: "tvshow",
                watchedOn: new Date("2024-09-11"),
                rating: 4,
            },
        ],
    },
    {
        key: "user2",
        username: "sara",
        preferences: {
            favoriteGenres: [ENUM_GENRES.DRAMA, ENUM_GENRES.ROMANCE],
            dislikedGenres: [ENUM_GENRES.HORROR],
        },
        watchHistory: [
            {
                contentKey: "movie10",
                contentType: "movie",
                watchedOn: new Date("2024-08-25"),
                rating: 5,
            },
            {
                contentKey: "tvshow5",
                contentType: "tvshow",
                watchedOn: new Date("2024-09-03"),
                rating: 4,
            },
        ],
    },
    {
        key: "user3",
        username: "rahul",
        preferences: {
            favoriteGenres: [ENUM_GENRES.COMEDY, ENUM_GENRES.FANTASY],
            dislikedGenres: [ENUM_GENRES.DRAMA],
        },
        watchHistory: [
            {
                contentKey: "movie6",
                contentType: "movie",
                watchedOn: new Date("2024-09-15"),
                rating: 3,
            },
            {
                contentKey: "tvshow4",
                contentType: "tvshow",
                watchedOn: new Date("2024-09-17"),
                rating: 5,
            },
        ],
    },
    {
        key: "user4",
        username: "emily",
        preferences: {
            favoriteGenres: [ENUM_GENRES.SCI_FI, ENUM_GENRES.HORROR],
            dislikedGenres: [ENUM_GENRES.ROMANCE],
        },
        watchHistory: [
            {
                contentKey: "movie7",
                contentType: "movie",
                watchedOn: new Date("2024-09-19"),
                rating: 4,
            },
            {
                contentKey: "tvshow11",
                contentType: "tvshow",
                watchedOn: new Date("2024-09-21"),
                rating: 5,
            },
        ],
    },
];

const myListSeed: MyListSeed[] = [
    {
        userKey: "user1",
        contentKey: "movie2",
        contentType: "movie",
    },
    {
        userKey: "user1",
        contentKey: "tvshow2",
        contentType: "tvshow",
    },
    {
        userKey: "user2",
        contentKey: "movie10",
        contentType: "movie",
    },
    {
        userKey: "user3",
        contentKey: "tvshow7",
        contentType: "tvshow",
    },
    {
        userKey: "user4",
        contentKey: "movie17",
        contentType: "movie",
    },
];

export const runSeed = async (): Promise<void> => {
    await connectDB();

    try {
        console.log("✨ Starting seed...");
        await Promise.all([
            Movie.deleteMany({}),
            TVShow.deleteMany({}),
            User.deleteMany({}),
            MyList.deleteMany({}),
        ]);

        console.log("📦 Inserting movies...");
        const insertedMovies = await Movie.insertMany(
            moviesSeed.map(({ key, ...doc }) => doc)
        );
        const movieKeyToId = new Map(
            moviesSeed.map((seed, index) => [seed.key, insertedMovies[index]._id])
        );

        console.log("📺 Inserting TV shows...");
        const insertedTVShows = await TVShow.insertMany(
            tvShowsSeed.map(({ key, ...doc }) => doc)
        );
        const tvShowKeyToId = new Map(
            tvShowsSeed.map((seed, index) => [seed.key, insertedTVShows[index]._id])
        );

        console.log("👥 Inserting users...");
        const preparedUsers = usersSeed.map(({ key, watchHistory, ...rest }) => ({
            ...rest,
            watchHistory: watchHistory.map((entry) => {
                const map =
                    entry.contentType === "movie" ? movieKeyToId : tvShowKeyToId;
                const contentId = map.get(entry.contentKey);
                if (!contentId) {
                    throw new Error(
                        `Missing ${entry.contentType} for watch history key ${entry.contentKey}`
                    );
                }
                return {
                    contentId: contentId.toHexString(),
                    watchedOn: entry.watchedOn,
                    rating: entry.rating,
                };
            }),
        }));

        const insertedUsers = await User.insertMany(preparedUsers);
        const userKeyToId = new Map(
            usersSeed.map((seed, index) => [seed.key, insertedUsers[index]._id])
        );

        console.log("📝 Inserting MyList entries...");
        const preparedMyList = myListSeed.map(({ userKey, contentKey, contentType }) => {
            const userId = userKeyToId.get(userKey);
            if (!userId) {
                throw new Error(`Missing user for key ${userKey}`);
            }

            const map = contentType === "movie" ? movieKeyToId : tvShowKeyToId;
            const contentId = map.get(contentKey);
            if (!contentId) {
                throw new Error(`Missing ${contentType} for key ${contentKey}`);
            }

            return {
                user: userId,
                contentId,
                contentType: contentType === "movie"
                    ? ENUM_CONTENT_TYPE.MOVIE
                    : ENUM_CONTENT_TYPE.TVSHOW,
            };
        });

        await MyList.insertMany(preparedMyList);

        console.log("✅ Seed data loaded successfully.");
    } catch (error) {
        console.error("❌ Failed to seed data:", error);
        throw error;
    } finally {
        await mongoose.connection.close();
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    runSeed().catch((error) => {
        console.error("❌ Unhandled seed error:", error);
        process.exit(1);
    });
}

