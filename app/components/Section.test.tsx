import { render } from '@testing-library/react'

import Section from './Section'

describe("Section", () => {
  const content = "Batman is a superhero appearing in American comic books published by DC Comics."
  test("can render content", () => {
    const onUpdate = vi.fn()
    render(<Section content={`<p>${content}</p>`} onUpdate={onUpdate} />)


    const firstLine = document.querySelector('p')
    expect(firstLine?.innerText).toBe(content)
    // can't figure how to test onUpdate...
  })
})