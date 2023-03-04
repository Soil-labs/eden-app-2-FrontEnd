import { MockedProvider } from "@apollo/client/testing";
import { getMember } from "@eden/package-mock";
import { render } from "@testing-library/react";

import { MemberGraph2 } from ".";

describe("SendMessageToUserModal", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <MockedProvider>
        <MemberGraph2 memberId={getMember()._id!} />
      </MockedProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
