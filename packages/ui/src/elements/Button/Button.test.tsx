import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./";

test("user can click the button", async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();

  // interactive by default
  const { rerender } = render(<Button onClick={onClick}>Hello World</Button>);

  await user.click(screen.getByRole("button", { name: /hello world/i }));

  expect(onClick).toHaveBeenCalledTimes(1);

  // re-render with `disabled`, no longer interactive
  rerender(
    <Button disabled onClick={onClick}>
      Hello World
    </Button>
  );
  await user.click(screen.getByRole("button", { name: /hello world/i }));

  expect(onClick).toHaveBeenCalledTimes(1);
});
