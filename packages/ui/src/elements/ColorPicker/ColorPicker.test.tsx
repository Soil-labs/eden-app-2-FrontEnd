import { fireEvent, render, screen } from "@testing-library/react";

import { ColorPicker } from "./";

test("color is controlled", () => {
  const value = "rgb(255,255,255)";
  const onChange = jest.fn();

  const { rerender } = render(
    <ColorPicker value={value} onChange={onChange} />
  );

  expect(screen.getByLabelText(/project color/i)).toHaveValue("#ffffff");

  // unfortunately `testing-library` doesn't provide a way to interact with
  // `color` specifically, but we can fire an event that is pretty close to how
  // the native element would be interacted with in the browser
  fireEvent.input(screen.getByLabelText(/project color/i), {
    target: { value: "#000000" },
  });

  // value doesn't change because `onChange` didn't change it
  expect(value).toEqual("rgb(255,255,255)");
  // but it was called with the right value
  expect(onChange).toHaveBeenCalledWith("rgb(0,0,0)");

  // value changes when the prop changes
  rerender(<ColorPicker value={"rgb(0,0,0)"} onChange={onChange} />);
  expect(screen.getByLabelText(/project color/i)).toHaveValue("#000000");
});
