// @ts-ignore
import { title, rawContent, firstSubSection, firstSection } from '../../../mocks/section'
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
    /**
     * skip because needs parsing...
     * cy.findByText(rawContent.blocks[0].data.text)
     * cy.findByText(rawContent.blocks[1].data.text)
     */

    // image
    cy.findByRole("img").should('have.attr', 'src').and('contain', url)
    cy.findByText(description)
    // informations
    cy.findByText(infoDescription)
    cy.findByText(infoTitle)


    // table of content
    cy.findAllByText(firstSection.title).should('have.length', 2)
    cy.findAllByText(firstSubSection.title).should('have.length', 2)

    // sections & sub sections
    // cy.findByText(firstSubSection.rawContent.blocks[0].data.text)
  })
})