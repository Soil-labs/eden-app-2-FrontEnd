import { UserContext } from "@eden/package-context";
import {
  CandidateProfileCard,
  Card,
  GridItemNine,
  GridItemThree,
  GridLayout,
} from "@eden/package-ui";
import { useContext } from "react";

import { ReviewMemberContainer } from "./components";

export const ReviewFlow = ({}) => {
  const { currentUser } = useContext(UserContext);

  return (
    <GridLayout>
      <GridItemThree>
        <Card shadow className={"bg-white"}>
          <CandidateProfileCard member={currentUser} />
          <div className={`p-4 font-semibold uppercase text-neutral-800`}>
            My Endorsements
          </div>
        </Card>
      </GridItemThree>
      <GridItemNine>
        <Card
          shadow
          className={"scrollbar-hide h-85 overflow-scroll bg-white p-4"}
        >
          <ReviewMemberContainer />
        </Card>
      </GridItemNine>
    </GridLayout>
  );
};
