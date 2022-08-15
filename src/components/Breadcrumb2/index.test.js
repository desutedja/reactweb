import React from 'react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import {render, fireEvent, screen} from '@testing-library/react'
import Breadcrumb from './index'

test('shows the title', () => {

  const history = createMemoryHistory()
  render(
    <Router history={history}>
        <Breadcrumb title="Text-Title" />
    </Router>
  )

  const titleElement = screen.getByTestId("title")

  expect(titleElement).toBeInTheDocument();
  expect(titleElement).toHaveTextContent("Text-Title");
  expect(titleElement).toHaveClass("Breadcrumb");
})