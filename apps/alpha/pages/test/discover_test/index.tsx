import { useQuery } from "@apollo/client";
import {
  DiscoverContext,
  DiscoverModal,
  DiscoverProvider,
  UserContext,
} from "@eden/package-context";
import { FIND_PROJECT, MATCH_NODES_MEMBERS } from "@eden/package-graphql";
import {
  MatchMembersToSkillOutput,
  RoleType,
} from "@eden/package-graphql/generated";
import {
  AppUserSubmenuLayout,
  Card,
  DiscoverContainer,
  SEO,
  UserDiscoverCardTest,
} from "@eden/package-ui";
import { ExclamationIcon } from "@heroicons/react/solid";
import { useContext, useState } from "react";

import type { NextPageWithLayout } from "../../_app";

const DiscoverPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { selectedServerID } = useContext(UserContext);
  const [nodesID, setNodesID] = useState<string[] | null>(null);
  const [selectedRole] = useState<RoleType | null>(null);
  const { openModal } = useContext(DiscoverContext);

  const { data: dataMembers } = useQuery(MATCH_NODES_MEMBERS, {
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

  return (
    <>
      <SEO />
      <div className="bg-background container mx-auto flex max-w-screen-2xl flex-col gap-4 py-8 px-2 sm:px-5 lg:flex-row lg:justify-between xl:gap-8 ">
        <div
          className={`flex w-full flex-col ${
            openModal !== DiscoverModal.SKILLS_CATEGORY ? "lg:basis-1/3" : ""
          }`}
        >
          <Card
            className={`scrollbar-hide  overflow-scroll bg-white p-4 lg:max-h-[540px] `}
          >
            <DiscoverContainer
              setArrayOfNodes={(val) => {
                setNodesID(val);
              }}
            />
          </Card>
        </div>

        {openModal !== DiscoverModal.SKILLS_CATEGORY && (
          <Card
            shadow
            className="scrollbar-hide max-h-[564px] max-w-[870px] basis-2/3 overflow-scroll bg-white p-4"
          >
            {nodesID?.length ? (
              <div>
                <span className="text-lg font-semibold">
                  Hiring for your Project :{" "}
                  {dataMembers?.matchNodesToMembers.length ?? 0} Users{" "}
                </span>
                <div className="grid gap-5 pt-2 pb-6 md:grid-cols-3 ">
                  {dataMembers?.matchNodesToMembers.map(
                    (member: MatchMembersToSkillOutput, index: number) => (
                      <UserDiscoverCardTest
                        key={index}
                        matchMember={member}
                        role={selectedRole}
                        project={dataProject?.findProject}
                        invite
                        phase=""
                      />
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full p-4 text-lg font-semibold">
                Preview Opportunities :
                <div className="flex h-full flex-col items-center justify-center  text-center opacity-20 ">
                  <span>
                    Your profile is 23% complete.
                    <br /> It has to be 60% to be visible to eden network
                  </span>
                  <br />
                  <>
                    <ExclamationIcon color="#ff9c59" width={40} />
                    <span className=" text-zinc-800 opacity-80">
                      Keep adding more info
                    </span>
                  </>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
      {/* </GridItemEight>
      </GridLayout> */}
    </>
  );
};

DiscoverPage.getLayout = (page) => (
  <DiscoverProvider>
    <AppUserSubmenuLayout showSubmenu={false}>{page}</AppUserSubmenuLayout>
  </DiscoverProvider>
);

export default DiscoverPage;

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
