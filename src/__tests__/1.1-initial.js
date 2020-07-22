import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from '../App'

jest.mock('../firebase', () => {
    const set = jest.fn();

    return {
        database: jest.fn(() => ({
            ref: jest.fn(() => ({
                push: jest.fn(() => ({
                    set,
                })),
            })),
        })),
    };
});

test('initial app start', () => {
    const history = createMemoryHistory()
    const { container } = render(
        <Router history={history}>
            <App />
        </Router>
    )
    expect(container.innerHTML).toMatch('Login')
})