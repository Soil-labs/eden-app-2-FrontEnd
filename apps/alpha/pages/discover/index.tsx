import { useQuery } from "@apollo/client";
import {
  DiscoverContext,
  DiscoverModal,
  DiscoverProvider,
  UserContext,
} from "@eden/package-context";
import {
  FIND_PROJECT,
  MATCH_NODES_MEMBERS,
  // MATCH_NODES_MEMBERS_LITE,
} from "@eden/package-graphql";
import {
  MatchMembersToSkillOutput,
  NodesType,
  PreferencesType,
  PreferencesTypeFind,
  RoleType,
} from "@eden/package-graphql/generated";
import {
  AppUserSubmenuLayout,
  Button,
  Card,
  CardGrid,
  DiscoverModalContainer,
  GridItemNine,
  GridItemThree,
  GridLayout,
  RoleList,
  SEO,
  SubmenuSelector,
  UserDiscoverCard,
  WarningCard,
} from "@eden/package-ui";
import { useContext, useState } from "react";

import welcome from "../../public/welcome.png";
import type { NextPageWithLayout } from "../_app";

const DiscoverPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  // const { selectedServer, memberServerIDs } = useContext(UserContext);
  const { setOpenModal } = useContext(DiscoverContext);
  const { selectedServerID } = useContext(UserContext);
  const [nodesID, setNodesID] = useState<string[] | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [preferences, setPreferences] = useState<PreferencesType>({
    findCoFounder: {
      interestedMatch:
        currentUser?.preferences?.findCoFounder?.interestedMatch || null,
    } as PreferencesTypeFind,
    findMentee: {
      interestedMatch:
        currentUser?.preferences?.findMentee?.interestedMatch || null,
    } as PreferencesTypeFind,
    findMentor: {
      interestedMatch:
        currentUser?.preferences?.findMentor?.interestedMatch || null,
    } as PreferencesTypeFind,
    findProject: {
      interestedMatch:
        currentUser?.preferences?.findProject?.interestedMatch || null,
    } as PreferencesTypeFind,
    findUser: {
      interestedMatch:
        currentUser?.preferences?.findUser?.interestedMatch || null,
    } as PreferencesTypeFind,
  });

  const { data: dataMembers } = useQuery(MATCH_NODES_MEMBERS, {
    variables: {
      fields: {
        nodesID: nodesID,
        serverID: selectedServerID,
        preference: Object.keys(preferences).filter(
          (key: string) =>
            (preferences[key as keyof PreferencesType] as PreferencesTypeFind)
              ?.interestedMatch || false
        ),
      },
    },
    skip: !nodesID || !selectedServerID,
  });

  // if (dataMembers) console.log("dataMembers", dataMembers);

  const { data: dataProject } = useQuery(FIND_PROJECT, {
    variables: {
      fields: {
        _id: router.query.project,
      },
    },
    skip: !router.query.project,
  });

  // if (dataProject) console.log("dataProject", dataProject);

  return (
    <>
      <SEO />
      <GridLayout>
        <GridItemThree>
          <Card className={`scrollbar-hide lg:h-85 overflow-scroll p-1`}>
            <Card shadow className={"bg-white p-6"}>
              <SubmenuSelector title={`Good Morning,`} />
            </Card>
            {dataProject?.findProject?.role &&
              dataProject?.findProject?.role.length > 0 && (
                <Card className={`scrollbar-hide overflow-scroll bg-white p-4`}>
                  <RoleList
                    roles={dataProject?.findProject?.role}
                    addRole={false}
                    handleSelectRole={(role) => {
                      setSelectedRole(role);
                      setNodesID(
                        role?.nodes?.map(
                          (node: Maybe<NodesType>) => node?.nodeData?._id || ""
                        ) || null
                      );
                    }}
                    selectedRole={selectedRole}
                  />
                </Card>
              )}
            {!dataProject?.findProject?.title && (
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
                      setOpenModal(DiscoverModal.SKILLS_CATEGORY);
                    }}
                  >
                    Update search parameters
                  </Button>
                </div>
              </Card>
            )}
            {!dataProject?.findProject?.title && (
              <WarningCard
                // profilePercentage={getFillProfilePercentage({
                //   ...state,
                //   nodes:
                //     currentUser &&
                //     currentUser.nodes &&
                //     currentUser.nodes?.length > (nodesID || []).length
                //       ? currentUser.nodes
                //       : nodesID,
                // })}
                onClickCompleteProfile={() => router.push(`/create-project`)}
                text1="You can see users"
                text2="Users can't find your project"
                textButton="Create a project"
              />
            )}
          </Card>
        </GridItemThree>
        <GridItemNine>
          <Card
            shadow
            className="scrollbar-hide h-85 overflow-scroll bg-white p-4"
          >
            <CardGrid>
              {dataMembers?.matchNodesToMembers?.map(
                (member: MatchMembersToSkillOutput, index: number) => (
                  <UserDiscoverCard
                    key={index}
                    matchMember={member}
                    role={selectedRole}
                    project={dataProject?.findProject}
                    invite
                    phase={``}
                  />
                )
              )}
            </CardGrid>
          </Card>
        </GridItemNine>
      </GridLayout>
      {!dataProject?.findProject?._id && (
        <DiscoverModalContainer
          image={welcome.src}
          setArrayOfNodes={(val) => {
            setNodesID(val);
          }}
          setPreferences={(val: PreferencesType) => {
            setPreferences(val);
          }}
        />
      )}
    </>
  );
};

DiscoverPage.getLayout = (page) => (
  <DiscoverProvider>
    <AppUserSubmenuLayout showSubmenu={false}>{page}</AppUserSubmenuLayout>
  </DiscoverProvider>
);

export default DiscoverPage;

import { Maybe } from "graphql/jsutils/Maybe";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session || session.error === "RefreshAccessTokenError") {
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
