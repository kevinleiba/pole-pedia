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

  it('Redirects to result page when searching', () => {
    const truncatedTitle = title.substring(0, 3)

    cy.visit('/')
    cy.get('.article-search').type(`${truncatedTitle}`).type('{enter}')
    cy.url().should("match", new RegExp(`/?search=${truncatedTitle}`))
    cy.findByText(title)


    const notFound = "noarticleshouldmatchthisstring"
    cy.get('.article-search').type('{selectAll}').type(notFound).type('{enter}')
    cy.url().should("match", new RegExp(`/?search=${notFound}`))
    cy.findByText(title).should('be.undefined')
  })
})