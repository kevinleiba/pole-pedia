// @ts-ignore
import { title } from '../../mocks/section'

describe("Index page", () => {
  before(() => {
    cy.clearDb()
    cy.seedDb()
  })

  it('Displays index page with all articles', () => {
    cy.visit('/')
    cy.findByText(title)
  })

  it('Displays newly created article', () => {

  })
})