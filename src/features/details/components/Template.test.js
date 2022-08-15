import { render, screen } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Template from "./Template";

describe("Template Component", () => {
    test("render Template component", () => {
        const history = createMemoryHistory()
        const {} = render(
            <Router history={history}>
                <Template />
            </Router>
        );

        const outputElement = screen.getByText('Details');
        expect(outputElement).toBeInTheDocument();
    });

    // test("render h2 pageTitle", () => {});

})