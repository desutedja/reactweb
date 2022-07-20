import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import Template from "../../components/Template";
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

it("renders without crashing", () => {
    // const title = 'Test'
  
    const history = createMemoryHistory()
    const { container, getByText } = render(
      <Router history={history}>
          <Template />
      </Router>
    )
    // const div = document.createElement("div");
    // render(<Template />, div);
})

it("matches snapshot", () => {
    const title = 'Test'
    const history = createMemoryHistory()
    const tree = renderer.create(
        <Router history={history}>
            <Template title={title}/>
        </Router>).toJSON();
    expect(tree).toMatchSnapshot();
})