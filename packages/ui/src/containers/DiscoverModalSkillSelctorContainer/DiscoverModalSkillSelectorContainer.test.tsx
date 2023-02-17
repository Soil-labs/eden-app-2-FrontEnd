import { render } from "../../../utils/jest-apollo";
import { DiscoverModalSkillSelectorContainer } from ".";

describe("DiscoverModalContainer", () => {
  it("renders without throwing", () => {
    const { container } = render(<DiscoverModalSkillSelectorContainer />);

    expect(container).toBeInTheDocument();
  });
});
