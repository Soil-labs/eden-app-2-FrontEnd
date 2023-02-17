import { render } from "../../../utils/jest-apollo";
import { DiscoverTalentDropdownWithSkillSelectorModal } from ".";

describe("DiscoverTalentDropdownModal", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <DiscoverTalentDropdownWithSkillSelectorModal
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    expect(container).toBeInTheDocument();
  });
});
