import { render } from "../../../utils/jest-apollo";
import { CreateProjectTempContainer } from ".";

describe("CreateProjectTempContainer", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <CreateProjectTempContainer
        setProjectUIdata={(val) => console.log(val)}
        setSelectedRole={(val) => console.log(val)}
        onFetchProject={() => console.log("change = ")}
      />
    );

    expect(container).toBeInTheDocument();
  });
});
