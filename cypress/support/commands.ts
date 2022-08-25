import { faker } from "@faker-js/faker";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with a random user. Yields the user and adds an alias to the user
       *
       * @returns {typeof login}
       * @memberof Chainable
       * @example
       *    cy.login()
       * @example
       *    cy.login({ email: 'whatever@example.com' })
       */
      login: typeof login;

      /**
       * Deletes the current @user
       *
       * @returns {typeof cleanupUser}
       * @memberof Chainable
       * @example
       *    cy.cleanupUser()
       * @example
       *    cy.cleanupUser({ email: 'whatever@example.com' })
       */
      cleanupUser: typeof cleanupUser;

      /**
       * Clear all entries in the db
       *
       * @returns {typeof clearDb}
       * @memberof Chainable
       */
      clearDb: typeof clearDb;

      /**
       * Launches prisma seed
       *
       * @returns {typeof seedDb}
       * @memberof Chainable
       */
      seedDb: typeof seedDb;

      /**
       * forces uuid of article for easier navigation
       *
       * @returns {typeof setArticleUuid}
       * @memberof Chainable
       */
      setArticleUuid: typeof setArticleUuid;
    }
  }
}

function login({
  email = faker.internet.email(undefined, undefined, "example.com"),
}: {
  email?: string;
} = {}) {
  cy.then(() => ({ email })).as("user");
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts "${email}"`
  ).then(({ stdout }) => {
    const cookieValue = stdout
      .replace(/.*<cookie>(?<cookieValue>.*)<\/cookie>.*/s, "$<cookieValue>")
      .trim();
    cy.setCookie("__session", cookieValue);
  });
  return cy.get("@user");
}

function cleanupUser({ email }: { email?: string } = {}) {
  if (email) {
    deleteUserByEmail(email);
  } else {
    cy.get("@user").then((user) => {
      const email = (user as { email?: string }).email;
      if (email) {
        deleteUserByEmail(email);
      }
    });
  }
  cy.clearCookie("__session");
}

function deleteUserByEmail(email: string) {
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts "${email}"`
  );
  cy.clearCookie("__session");
}

function clearDb() {
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./prisma/autoUnseed`
  );
}

function seedDb() {
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./prisma/autoSeed`
  );
}

function setArticleUuid() {
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/set-article-uuid.ts`
  );
}

Cypress.Commands.add("login", login);
Cypress.Commands.add("cleanupUser", cleanupUser);
Cypress.Commands.add("clearDb", clearDb)
Cypress.Commands.add("seedDb", seedDb)
Cypress.Commands.add("setArticleUuid", setArticleUuid)

/*
eslint
  @typescript-eslint/no-namespace: "off",
*/
