import { useQuery } from "@apollo/client";
import {
  DiscoverContext,
  DiscoverModal,
  DiscoverProvider,
  UserContext,
} from "@eden/package-context";
import {
  FIND_PROJECT,
  // MATCH_NODES_MEMBERS,
  MATCH_NODES_MEMBERS_LITE,
} from "@eden/package-graphql";
import {
  MatchMembersToSkillOutput,
  NodesType,
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
  UserDiscoverCard,
  WarningCard,
} from "@eden/package-ui";
import { useContext, useState } from "react";

import welcome from "../../public/welcome.png";
import type { NextPageWithLayout } from "../_app";

const DiscoverPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { setOpenModal } = useContext(DiscoverContext);
  const { selectedServerID } = useContext(UserContext);
  const [nodesID, setNodesID] = useState<string[] | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const { data: dataMembers } = useQuery(MATCH_NODES_MEMBERS_LITE, {
    variables: {
      fields: {
        nodesID: nodesID,
        serverID: selectedServerID,
      },
    },
    skip: !nodesID || !selectedServerID,
  });

  const { data: dataProject } = useQuery(FIND_PROJECT, {
    variables: {
      fields: {
        _id: router.query.project,
      },
    },
    skip: !router.query.project,
  });

  // if (dataMembers) console.log("dataMembers", dataMembers);

  return (
    <>
      <SEO />
      <GridLayout>
        <GridItemThree>
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
              className="mb-4 w-full flex-grow border-[2px] bg-white p-10 font-semibold"
            >
              <div className="mt-3">
                <Button
                  variant="primary"
                  radius="default"
                  size="md"
                  onClick={() => {
                    setOpenModal(DiscoverModal.START_INFO);
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
                    phase=""
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
