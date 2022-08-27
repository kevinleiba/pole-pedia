// @ts-ignore
import { title, content, firstSubSection, firstSection } from '../../../mocks/section'
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
    cy.findAllByText(title).should('have.length', 2)
    cy.get("#intro-content").invoke('html').should('eq', content)

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
    cy.get("#section-0-subsection-0").invoke('html').should('eq', firstSubSection.content)
  })

  const newTitle = "Cypress"
  const newIntro = "I am the new intro"

  it('Edits article', () => {
    cy.visit(`/article/${dbObject.uuid}/edit`)

    cy.findByDisplayValue(title).focus().type("{selectAll}").type(newTitle).blur()
    cy.findByDisplayValue(newTitle)

    cy.get(".ProseMirror").first().invoke('html').should('eq', content)
    cy.get(".ProseMirror").first().type("{ctrl}a").type("{backspace}").type(newIntro).blur()
    cy.get(".ProseMirror").first().invoke('text').should('eq', newIntro)

    cy.visit(`/article/${dbObject.uuid}`)
    cy.findAllByText(newTitle).should('have.length', 2)
    cy.get("#intro-content").invoke('text').should('eq', newIntro)
  })
})