// @ts-ignore
import { title, firstSubSection, firstSection } from '../../../mocks/section'
// @ts-ignore
import { description, url } from '../../../mocks/image'
// @ts-ignore
import { description as infoDescription, title as infoTitle } from '../../../mocks/information'
// @ts-ignore
import { dbObject } from '../../../mocks/article'

describe("Article detail page", () => {
  before(() => {
    cy.clearDb()
    cy.seedDb()
    cy.setArticleUuid()
  })

  it('Displays article page with its details', () => {
    cy.visit(`/article/${dbObject.uuid}`)

    // intro
    cy.findByText(title)
    // image
    cy.findByRole("img").should('have.attr', 'src').and('contain', url)
    cy.findByText(description)
    // informations
    cy.findByText(infoDescription)
    cy.findByText(infoTitle)


    // table of content
    cy.findAllByText(firstSection.title).should('have.length', 2)
    cy.findAllByText(firstSubSection.title).should('have.length', 2)
  })
})