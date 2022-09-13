import { render, screen } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import TemplatePushNotif from "../../details/components/TemplatePushNotif";

describe("TemplatePushNotif Component", () => {
  test("renderTitleNotNull", () => {
    const history = createMemoryHistory();
    const {} = render(
      <Router history={history}>
        <TemplatePushNotif title="Push Notification" />
      </Router>
    );

    const outputElement = screen.getByText("Push Notification");

    expect(outputElement).toBeInTheDocument();
  });

  test("renderTitleIsNull", () => {
    const history = createMemoryHistory();
    const {} = render(
      <Router history={history}>
        <TemplatePushNotif title={false} />
      </Router>
    );

    const outputElement = screen.getByText("Details");

    expect(outputElement).toBeInTheDocument();
  });

  test("renderPageTitleNotNull", () => {
    const history = createMemoryHistory();
    const {} = render(
      <Router history={history}>
        <TemplatePushNotif pagetitle="Push Notification Page" />
      </Router>
    );

    const outputElement = screen.getByTestId("page-title");

    expect(outputElement).toBeTruthy();
    expect(outputElement.innerHTML).toBe("Push Notification Page");
  });

  test("renderPageTitleIsNull", () => {
    const history = createMemoryHistory();
    const {} = render(
      <Router history={history}>
        <TemplatePushNotif pagetitle={false} />
      </Router>
    );

    const outputElement = screen.getByTestId("page-title");

    expect(outputElement.innerHTML).toBeFalsy();
  });
});
