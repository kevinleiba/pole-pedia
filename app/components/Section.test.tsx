import React from 'react'
import { render } from '@testing-library/react'

import Section from './Section'

describe("Section", () => {
  test("can render without crashing", () => {
    render(<Section />)

  })
})