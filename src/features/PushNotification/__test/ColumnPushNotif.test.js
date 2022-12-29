import { render } from "@testing-library/react";
import React from "react";
import ColumnPushNotif from "../../../features/details/components/ColumnPushNotif";

describe("Template Component", () => {
  test("renderImageOutputTrue", () => {
    const { getByTestId } = render(<ColumnPushNotif image="image" />);

    const imageOutput = getByTestId("image-output");

    expect(imageOutput).toBeTruthy();
    expect(imageOutput.src).toContain("image");
  });

  test("renderImageOutputFalse", () => {
    const { getByTestId } = render(<ColumnPushNotif image={false} />);

    const imageOutput = getByTestId("image-output");

    expect(imageOutput).toBeTruthy();
    expect(imageOutput.src).toContain("http://localhost/default_img.jpg");
  });

  test("renderLinkOutputTrue", () => {
    const { queryByTestId } = render(<ColumnPushNotif link="site-link" />);

    const linkOutput = queryByTestId("link-avail");

    expect(linkOutput).toBeTruthy();
    expect(linkOutput.innerHTML).toContain("site-link");
  });

  test("renderLinkOutputFalse", () => {
    const { queryByTestId } = render(<ColumnPushNotif link={false} />);

    const linkOutput = queryByTestId("link-avail");

    expect(linkOutput).toBeTruthy();
    expect(linkOutput.innerHTML).toContain("Not Available");
  });
});
