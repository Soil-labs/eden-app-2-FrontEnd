import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Favorite } from ".";

test("when user clicks the favorite button to trigger the on favorite callback", async () => {
  const user = userEvent.setup();
  const onFavorite = jest.fn();

  const { rerender } = render(<Favorite favorite onFavorite={onFavorite} />);

  // find the button, click it, and validate that callback is called
  await user.click(screen.getByRole("button"));
  expect(onFavorite).toHaveBeenCalledTimes(1);

  // enabled the `disabled` prop, click the button again, and validate that the
  // callback isn't called again
  rerender(<Favorite favorite onFavorite={onFavorite} disabled />);
  await user.click(screen.getByRole("button"));
  expect(onFavorite).toHaveBeenCalledTimes(1);
});
