# Dependency Injection Notes

## Why DI?

- Routes no longer new-up services or models.
- Swapping implementations or writing tests becomes simpler.
- Keeps the module wiring in one place instead of scattered across files.

## Library Choice

- Using [`tsyringe`](https://github.com/microsoft/tsyringe) for lightweight constructor injection.
- `reflect-metadata` is loaded in `src/app.ts` so decorators work at runtime.

## Wiring

```ts
// src/modules/myList/index.ts
import { container } from "tsyringe";
import { MYLIST_TOKENS } from "./mylist.tokens";

export const initializeMyListModule = () => {
  container.registerInstance(MYLIST_TOKENS.MyListModel, MyList);
  container.registerInstance(MYLIST_TOKENS.UserModel, User);
  container.registerInstance(MYLIST_TOKENS.MovieModel, Movie);
  container.registerInstance(MYLIST_TOKENS.TVShowModel, TVShow);

  container.registerSingleton(MyListService);
  container.registerSingleton(MyListController);
};
```

```ts
// src/modules/myList/mylist.service.ts
@injectable()
export class MyListService {
  constructor(
    @inject(MYLIST_TOKENS.MyListModel)
    private readonly myListModel: Model<IMyList>,
    @inject(MYLIST_TOKENS.UserModel) private readonly userModel: Model<IUser>,
    @inject(MYLIST_TOKENS.MovieModel)
    private readonly movieModel: Model<IMovie>,
    @inject(MYLIST_TOKENS.TVShowModel) private readonly tvModel: Model<ITVShow>
  ) {}
  // ...
}
```

```ts
// src/modules/myList/mylist.route.ts
initializeMyListModule();
const controller = container.resolve(MyListController);
```

## Testing Impact

- Unit tests keep instantiating `MyListService` with manual mocks (no DI required).
- Integration tests import `app`, which initializes modules once.

## Follow‑ups (if there was more time)

- Register validators / middleware through the container as well.
- Extract common registration helpers for other modules.
- Consider scoping rules (per-request containers) when authentication lands.
