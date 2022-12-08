import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Badge } from "./";

test("if `text` prop is empty, nothing is rendered", () => {
  render(<Badge />);

  expect(
    screen.queryByRole("button", { name: "remove" })
  ).not.toBeInTheDocument();
});

test("if `closeButton` is enabled, displays a close button and clicking it calls the `onClose` callback", async () => {
  const onClose = jest.fn();

  render(<Badge text="hello" closeButton onClose={onClose} />);

  const closeButton = screen.getByRole("button", { name: "remove" });

  await userEvent.click(closeButton);

  expect(onClose).toHaveBeenCalledTimes(1);
});

test("text is truncated with the `cutText` prop", () => {
  const text = Array.from({ length: 12 })
    .map(() => "a")
    .join("");

  // defaults to 8 characters
  const { rerender } = render(<Badge text={text} />);

  expect(screen.getByText("aaaaaaaa...")).toBeInTheDocument();

  // can manually set a number of characters
  rerender(<Badge text={text} cutText={10} />);

  expect(screen.getByText("aaaaaaaaaa...")).toBeInTheDocument();

  // renders the full text if text is shorter than the cutLength
  rerender(<Badge text="a" cutText={10} />);

  expect(screen.getByText("a")).toBeInTheDocument();
});

test("tooltip displays the full text on hover", async () => {
  const user = userEvent.setup();

  render(<Badge text="hello world" closeButton />);

  await user.hover(screen.getByRole("button", { name: /remove/i }));

  expect(screen.getByRole("tooltip")).toHaveTextContent("hello world");
});
