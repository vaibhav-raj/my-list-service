export const MYLIST_TOKENS = {
    // Using symbols to avoid accidental collisions in the global container
    MyListModel: Symbol.for("MyListModel"),
    UserModel: Symbol.for("UserModel"),
    MovieModel: Symbol.for("MovieModel"),
    TVShowModel: Symbol.for("TVShowModel"),
} as const;
