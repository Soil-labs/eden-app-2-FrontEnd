import { gql, useMutation, useQuery } from "@apollo/client";
import {
  ProjectsContext,
  ProjectsModal,
  ProjectsProvider,
  UserContext,
} from "@eden/package-context";
import { MATCH_NODES_TO_PROJECT_ROLES } from "@eden/package-graphql";
import {
  MatchSkillsToProjectsOutput,
  Members,
  Mutation,
} from "@eden/package-graphql/generated";
import {
  AppUserSubmenuLayout,
  Button,
  Card,
  CardGrid,
  FillUserProfileContainer,
  GridItemNine,
  GridItemSix,
  GridItemThree,
  GridLayout,
  Loading,
  ProjectNodeMatchCard,
  ProjectsModalContainer,
  SEO,
  SubmenuSelector,
  ViewUserProfileContainer,
  WarningCard,
} from "@eden/package-ui";
import { STEPS } from "@eden/package-ui/utils";
import { getFillProfilePercentage } from "@eden/package-ui/utils/fill-profile-percentage";
import { useContext, useEffect, useState } from "react";

import welcome from "../../public/welcome.png";
import type { NextPageWithLayout } from "../_app";

const UPDATE_NODES = gql`
  mutation ($fields: updateNodesToMemberInput!) {
    updateNodesToMember(fields: $fields) {
      _id
    }
  }
`;

const ProjectsPage: NextPageWithLayout = () => {
  const { setOpenModal } = useContext(ProjectsContext);
  const { currentUser, selectedServerID } = useContext(UserContext);
  const [nodesID, setNodesID] = useState<string[] | null>(null);
  const [view, setView] = useState<"grants" | "profile">("grants");
  const [startWelcome, setStartWelcome] = useState(false);

  const [userState, setUserState] = useState<Members>();

  useEffect(() => {
    if (currentUser) {
      setUserState(currentUser);
    }
  }, [currentUser]);

  const { data: dataProjects, loading } = useQuery(
    MATCH_NODES_TO_PROJECT_ROLES,
    {
      variables: {
        fields: {
          nodesID: nodesID,
          serverID: selectedServerID,
        },
      },
      skip: !nodesID || !selectedServerID,
      context: { serviceName: "soilservice" },
    }
  );

  // if (dataProjects) console.log("dataProjects", dataProjects);

  const [updateNodes] = useMutation(UPDATE_NODES, {
    onCompleted({ updateNodesToMember }: Mutation) {
      if (!updateNodesToMember) console.log("updateNodesToMember is null");
      // console.log("updateMember", updateNodesToMember);
      // setSubmitting(false);
    },
    onError() {
      console.log("error");
    },
  });

  useEffect(() => {
    if (
      currentUser &&
      getFillProfilePercentage(currentUser) < 30 &&
      !startWelcome
    ) {
      setOpenModal(ProjectsModal.START_WELCOME);
      setStartWelcome(true);
    }

    if (currentUser) {
      const nodes: string[] = [];

      currentUser?.nodes?.find((item) => {
        // if (item?.nodeData?.node == "sub_typeProject") {
        nodes.push(item?.nodeData?._id as string);
        // }
      });
      setNodesID(nodes);
    }
  }, [currentUser]);

  // ------- PROFILE VIEW -------
  const [step, setStep] = useState(STEPS.ROLE);

  const [experienceOpen, setExperienceOpen] = useState<number | null>(null);

  const handleUpdateNodes = (val: string[], type: string) => {
    if (!currentUser || val.length === 0) return;
    updateNodes({
      variables: {
        fields: {
          nodeType: type,
          nodesID: val,
        },
      },
      context: { serviceName: "soilservice" },
    });
  };

  if (!currentUser) return null;

  return (
    <>
      <SEO />
      <GridLayout>
        {view === "grants" && (
          <>
            <GridItemThree>
              <Card className={`lg:h-85 flex flex-col gap-2`}>
                <Card shadow className={"bg-white p-6"}>
                  <SubmenuSelector title={`Good Morning,`} />
                </Card>

                <Card
                  shadow
                  className="my-4 flex h-20 w-full flex-grow justify-center bg-white py-6 font-semibold"
                >
                  <div className={``}>
                    <Button
                      variant="primary"
                      radius="default"
                      size="md"
                      onClick={() => {
                        setOpenModal(ProjectsModal.START_WELCOME);
                        setStartWelcome(true);
                      }}
                    >
                      Update search parameters
                    </Button>
                  </div>
                </Card>
                {currentUser && getFillProfilePercentage(currentUser) < 50 && (
                  <WarningCard
                    profilePercentage={getFillProfilePercentage(currentUser)}
                    onClickCompleteProfile={() => setView("profile")}
                  />
                )}
              </Card>
            </GridItemThree>
            <GridItemNine>
              <Card
                shadow
                className="scrollbar-hide lg:h-85 overflow-scroll bg-white p-4"
              >
                {loading && (
                  <div className={`h-52`}>
                    <Loading />
                  </div>
                )}
                <CardGrid>
                  {dataProjects?.matchNodesToProjectRoles?.map(
                    (project: MatchSkillsToProjectsOutput, index: number) => (
                      <ProjectNodeMatchCard
                        key={index}
                        matchedProject={project}
                      />
                    )
                  )}
                </CardGrid>
              </Card>
            </GridItemNine>
          </>
        )}
        {view === "profile" && (
          <>
            <GridItemSix>
              <Card shadow className={"h-85 bg-white"}>
                <FillUserProfileContainer
                  step={step}
                  state={userState}
                  setState={setUserState}
                  setStep={setStep}
                  setExperienceOpen={setExperienceOpen}
                  setView={setView}
                  percentage={getFillProfilePercentage(currentUser)}
                />
              </Card>
            </GridItemSix>
            <GridItemSix>
              <Card shadow className={"h-85 bg-white"}>
                <ViewUserProfileContainer
                  step={step}
                  user={userState}
                  experienceOpen={experienceOpen}
                  setExperienceOpen={setExperienceOpen}
                />
              </Card>
            </GridItemSix>
          </>
        )}
      </GridLayout>
      <ProjectsModalContainer
        image={welcome.src}
        setArrayOfNodes={(val, type) => {
          // console.log("array of nodes val", val);
          handleUpdateNodes(val as string[], type);
        }}
        percentage={getFillProfilePercentage(currentUser)}
      />
    </>
  );
};

ProjectsPage.getLayout = (page) => (
  <ProjectsProvider>
    <AppUserSubmenuLayout showSubmenu={false}>{page}</AppUserSubmenuLayout>
  </ProjectsProvider>
);

export default ProjectsPage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  if (!session || session.error === "RefreshAccessTokenError") {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
