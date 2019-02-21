import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import renderer from "react-test-renderer";

import { initializeFirebase } from "../firebase";

import List from "./List";

configure({ adapter: new Adapter() });

describe("src/Components/List", () => {
  it("should render", () => {
    initializeFirebase();
    const component = renderer.create(<List />);

    expect(component).toMatchSnapshot();
  });
});
