import { render } from "../../../utils/jest-apollo";
import { AdminReportsContainer } from ".";

jest.mock("react-confetti");

test("User can get to the YOU DID IT modal ", async () => {
  const { container } = render(<AdminReportsContainer />);

  expect(container).toBeInTheDocument();
});
