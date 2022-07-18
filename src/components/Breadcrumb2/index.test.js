import React from 'react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import {render, fireEvent, screen} from '@testing-library/react'
import Breadcrumb from './index'

test('shows the title', () => {
  const title = 'Test'

  const history = createMemoryHistory()
  const { container, getByText } = render(
    <Router history={history}>
        <Breadcrumb title={title} />
    </Router>
  )

  expect(screen.getByText(title)).toBeInTheDocument()
})