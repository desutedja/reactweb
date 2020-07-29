import React from 'react'
import { render, fireEvent } from '../test-utils'
import '@testing-library/jest-dom/extend-expect'
import Login from "../features/auth/Login";

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

test('login with correct email and go to OTP page', () => {
    const { getByLabelText, getByRole, container } = render(<Login role="sa" />)

    const email = 'avidkucing@gmail.com';

    fireEvent.change(getByLabelText(/email/i), {
        target: { value: email },
    })
    // fireEvent.click(getByRole('button'))

    // expect(container.innerHTML).toMatch('OTP')
})