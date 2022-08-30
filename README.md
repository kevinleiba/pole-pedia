# Pole Pedia

![Pole Pedia](./app/components/icons/logo.svg)

A cheap wikipedia rip off that uses [Remix](http://remix.run) under the hood.

## Development

Initial setup:

```sh
npm run setup
```

Start dev server:

```sh
npm run dev
```

## Deployment

```sh
npm run build
npm start
```

## Connecting to your database

This project uses `postgresql`. Configure your `.env` file with corresponding informations.

You can then use `npx prisma db push` to create the db for you, but it won't create the schemas for you (because project uses some specific postgresql extension that is specified in migration files).

So use `npx prisma migrate dev`.

You can seed it `npx prisma db seed`.

## Testing

### Cypress

```bash
npm run test:e2e:dev # run end to end tests. Setup your .env.teste2e file.
```

### Vitest

```bash
npm run test # runs unit tests and components tests
npm run test:db # runs database tests. You might want to setup your .env.test file for that
```

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
