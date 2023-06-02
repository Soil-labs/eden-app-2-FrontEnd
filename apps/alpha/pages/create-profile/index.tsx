import { UserContext } from "@eden/package-context";
import { Members } from "@eden/package-graphql/generated";
import {
  AppUserSubmenuLayout,
  Card,
  CreateProfileFlow,
  DynamicSearchGraph,
  GridItemSix,
  GridLayout,
  MemberInfoWithDynamicGraph2,
} from "@eden/package-ui";
import { useContext, useEffect, useState } from "react";

const ProfilePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  // const [view, setView] = useState<"grants" | "profile">("grants");
  const [stepView, setStepView] = useState<number | null>(null);

  const [userState, setUserState] = useState<Members>();
  // const [experienceOpen, setExperienceOpen] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUserState(currentUser);
    }
  }, [currentUser]);

  // useEffect(() => {
  //   if (userState?.nodes) setStepView(0);
  // }, [userState?.nodes]);

  useEffect(() => {
    let graphWrapper;

    if (stepView === 0) {
      graphWrapper = document.querySelector(`#dynamic-search-graph-preview`);
    }
    if (stepView === 1 || stepView === 3) {
      graphWrapper = document.querySelector(`#user-with-description`);
    }
    if (stepView === 2) {
      graphWrapper = document.querySelector(`#user-background`);
    }
    if (stepView === 4) {
      graphWrapper = document.querySelector(`#socials`);
    }

    if (graphWrapper)
      graphWrapper?.scrollIntoView({ behavior: "smooth", inline: "end" });
  }, [stepView]);

  const handleStepChange = (val: any) => {
    setStepView(val);
  };

  if (!currentUser) return null;

  return (
    <AppUserSubmenuLayout showSubmenu={false}>
      <GridLayout>
        <GridItemSix>
          <Card className={"h-[88vh] bg-white shadow"}>
            <CreateProfileFlow
              setUserState={setUserState}
              userState={userState}
              handleStepChange={handleStepChange}
            />
          </Card>
        </GridItemSix>
        <GridItemSix>
          <Card
            className={
              "scrollbar-hide h-[88vh] overflow-scroll bg-white p-4 shadow"
            }
          >
            <MemberInfoWithDynamicGraph2
              // step={step}
              member={userState}
              nodesID={userState?.nodes?.map((node) => node?.nodeData?._id)}
              hasGraph={false}
            />
            {userState && (
              <div id="dynamic-search-graph-preview">
                <DynamicSearchGraph
                  nodesID={
                    userState.nodes && userState.nodes.length
                      ? userState.nodes?.map(
                          (_node) => _node?.nodeData?._id as string
                        )
                      : []
                  }
                  // activeNodes={Object.values(nodeObj).map(
                  //   (node: any) => node.active
                  // )}
                  // isNewNodes={Object.values(nodeObj).map(
                  //   (node: any) => node.isNew
                  // )}
                  // setActivateNodeEvent={setActivateNodeEvent}
                  height={"380"}
                  // // graphType={"simple"}
                  // // graphType={"KG_AI_2"}
                  graphType={"KG_AI_2_plusIndustry"}
                  // // zoomGraph={1.1}
                  // setRelatedNodePopup={handleOpenPopup}
                  disableZoom={true}
                />
              </div>
            )}
          </Card>
        </GridItemSix>
      </GridLayout>
    </AppUserSubmenuLayout>
  );
};

export default ProfilePage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

import { NextPageWithLayout } from "../_app";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
