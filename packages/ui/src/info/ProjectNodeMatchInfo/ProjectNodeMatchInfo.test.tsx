import { MockedProvider } from "@apollo/client/testing";
import { matchNodesToProjectRolesMock } from "@eden/package-mock";
import { render } from "@testing-library/react";

import { ProjectNodeMatchInfo } from "./ProjectNodeMatchInfo";

describe("ProjectNodeMatchInfo", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <MockedProvider>
        <ProjectNodeMatchInfo matchedProject={matchNodesToProjectRolesMock()} />
      </MockedProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
