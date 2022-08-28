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

  it("Adds section and a subsection", () => {
    const newSectionTitle = "Last and new section"
    const lastSubSectionTitle = "Last sub section title"
    const lastSubSectionContent = "Last content.... maybe?"

    cy.visit(`/article/${dbObject.uuid}/edit`)

    cy.findByText('Add Section', { exact: false }).click()
    cy.get('input').eq(4).type(newSectionTitle).blur()
    cy.wait(500)


    cy.findAllByText('Add Sub Section', { exact: false }).eq(1).click()
    cy.get('input').eq(5).type(lastSubSectionTitle).blur()
    cy.wait(500)
    cy.get(".ProseMirror").eq(3).type("{ctrl}a").type("{backspace}").type(lastSubSectionContent).blur()
    cy.get(".ProseMirror").eq(3).invoke('text').should('eq', lastSubSectionContent)
    cy.wait(500)


    // go back on detail page
    cy.visit(`/article/${dbObject.uuid}`)

    cy.findAllByText(newSectionTitle).should('have.length', 2) // 2 bcz of table of content
    cy.get("#section-1-subsection-0").invoke('text').should('eq', lastSubSectionContent)
  })
})

describe("create article", () => {
  before(() => {
    cy.clearDb()
    cy.seedDb()
    cy.setArticleUuid()
  })

  it("can create an article", () => {
    const title = "Create an Article... article"
    const content = "It is actually not that simple...."


    const sectionTitle = "Technical challenges"

    const subSectionTitle = "Cypress is new to me"
    const subSectionContent = "So I need to familiarise with its assertions and stuf..."

    cy.visit("/article/new")

    cy.url().should("match", /\/article\/.{8}-.{4}-.{4}-.{4}-.{12}/)

    // intro
    cy.get("input").type(title)
    cy.get(".ProseMirror").first().type("{ctrl}a").type("{backspace}").type(content).blur()
    cy.get(".ProseMirror").first().invoke('text').should('eq', content)

    // section
    cy.findByText('Add Section', { exact: false }).click()

    cy.get("input").eq(1).type(sectionTitle)
    cy.findByText('Add Sub Section', { exact: false }).click()

    cy.get("input").eq(2).type(subSectionTitle)
    cy.get(".ProseMirror").eq(1).type("{ctrl}a").type("{backspace}").type(subSectionContent).blur()
    cy.get(".ProseMirror").eq(1).invoke('text').should('eq', subSectionContent)
    cy.wait(500)

    cy.findByText("View article", { exact: false }).click()

    cy.findAllByText(title).should('have.length', 2)
    cy.get("#intro-content").invoke('text').should('eq', content)

    cy.findAllByText(sectionTitle).should('have.length', 2)
    cy.findAllByText(subSectionTitle).should('have.length', 2)
    cy.get("#section-0-subsection-0").invoke('text').should('eq', subSectionContent)

  })
})