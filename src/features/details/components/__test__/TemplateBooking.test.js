import { render, screen } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import TemplateBooking from "./../TemplateBooking";

describe("TemplateBooking Component", () => {
  test("renderTitleNotNull", () => {
    const history = createMemoryHistory();
    const {} = render(
      <Router history={history}>
        <TemplateBooking title="Booking" />
      </Router>
    );

    const outputElement = screen.getByText("Booking");

    expect(outputElement).toBeInTheDocument();
  });

  test("renderTitleIsNull", () => {
    const history = createMemoryHistory();
    const {} = render(
      <Router history={history}>
        <TemplateBooking title={false} />
      </Router>
    );

    const outputElement = screen.getByText("Details");

    expect(outputElement).toBeInTheDocument();
  });

  test("renderPageTitleNotNull", () => {
    const history = createMemoryHistory();
    const {} = render(
      <Router history={history}>
        <TemplateBooking pagetitle="Booking Page" />
      </Router>
    );

    const outputElement = screen.getByTestId("page-title");

    expect(outputElement).toBeTruthy();
    expect(outputElement.innerHTML).toBe("Booking Page");
  });

  test("renderPageTitleIsNull", () => {
    const history = createMemoryHistory();
    const {} = render(
      <Router history={history}>
        <TemplateBooking pagetitle={false} />
      </Router>
    );

    const outputElement = screen.getByTestId("page-title");

    expect(outputElement.innerHTML).toBeFalsy();
  });
});