// @ts-ignore
import { title } from '../../mocks/section'

describe("Index page", () => {
  before(() => {
    cy.clearDb()
    cy.seedDb()
  })

  it('Displays index page with all articles and correct links', () => {
    cy.visit('/')
    cy.findByText(title).closest('a').should("have.attr", "href").and('match', /\/article\/.{8}-.{4}-.{4}-.{4}-.{12}/)
  })
})