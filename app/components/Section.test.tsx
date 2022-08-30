import { render } from '@testing-library/react'

import Section from './Section'

describe("Section", () => {
  const content = "Batman is a superhero appearing in American comic books published by DC Comics."
  test("can render content", () => {
    render(<Section content={`<p>${content}</p>`} onBlur={() => { }} />)


    const firstLine = document.querySelector('p')
    expect(firstLine?.innerText).toBe(content)
    // TODO --> test on blur
  })
})