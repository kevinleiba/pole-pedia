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

  const newSubSectionTitle = 'NEW SubSection Title'
  const newSubSectionContent = 'I am the new sub section content'

  it('Edits article', () => {
    cy.visit(`/article/${dbObject.uuid}/edit`)

    // update intro title
    cy.findByDisplayValue(title).focus().type("{selectAll}").type(newTitle).blur()
    cy.findByDisplayValue(newTitle)

    // update intro content
    cy.get(".ProseMirror").first().invoke('html').should('eq', content)
    cy.get(".ProseMirror").first().type("{ctrl}a").type("{backspace}").type(newIntro).blur()
    cy.get(".ProseMirror").first().invoke('text').should('eq', newIntro)


    // find first section title but uses same logic as intro so no need for further tests
    cy.findByDisplayValue(firstSection.title)


    // updates subsection title
    cy.findByDisplayValue(firstSubSection.title).focus().type("{selectAll}").type(newSubSectionTitle).blur()

    // updates subsection content
    cy.get(".ProseMirror").eq(1).invoke('html').should('eq', firstSubSection.content)
    cy.get(".ProseMirror").eq(1).type("{ctrl}a").type("{backspace}").type(newSubSectionContent).blur()
    cy.get(".ProseMirror").eq(1).invoke('text').should('eq', newSubSectionContent)


    // go back on detail page
    cy.visit(`/article/${dbObject.uuid}`)

    // look for new intro title and content 
    cy.findAllByText(newTitle).should('have.length', 2) // 2 bcz of table of content
    cy.get("#intro-content").invoke('text').should('eq', newIntro)

    // look for updated subsection content and title
    cy.findAllByText(newSubSectionTitle).should('have.length', 2) // 2 bcz of table of content
    cy.get("#section-0-subsection-0").invoke('text').should('eq', newSubSectionContent)
  })

  it('Adds subsection', () => {
    const secondSubSectionTitle = "So you can add subsections!"
    const secondSubSectionContent = "And you can add content as well! Incredible..."

    cy.visit(`/article/${dbObject.uuid}/edit`)

    cy.findByText('Add Sub Section', { exact: false }).click()
    cy.get('input').eq(3).type(secondSubSectionTitle).blur()
    cy.get(".ProseMirror").eq(2).type("{ctrl}a").type("{backspace}").type(secondSubSectionContent).blur()
    cy.get(".ProseMirror").eq(2).invoke('text').should('eq', secondSubSectionContent)
    cy.wait(500)

    // go back on detail page
    cy.visit(`/article/${dbObject.uuid}`)

    cy.findAllByText(secondSubSectionTitle).should('have.length', 2) // 2 bcz of table of content
    cy.get("#section-0-subsection-1").invoke('text').should('eq', secondSubSectionContent)
  })
})