import { useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { FIND_PROJECT, MATCH_NODES_MEMBERS } from "@eden/package-graphql";
import { NodesType, Project } from "@eden/package-graphql/generated";
import {
  AppUserSubmenuLayout,
  Card,
  ChampionNodesMatchContainer,
  CreateProjectContainer,
  GridItemNine,
  GridItemSix,
  GridItemThree,
  GridLayout,
  ProjectEditSelectorCard,
  SEO,
  ViewProjectContainer,
} from "@eden/package-ui";
import { PROJECT_STEPS } from "@eden/package-ui/utils/enums/fill-project-steps";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../_app";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { selectedServerID } = useContext(UserContext);

  const [view, setView] = useState<"main" | "project">("main");

  const [step, setStep] = useState(PROJECT_STEPS.START);
  const [project, setProject] = useState<Project>();

  const [roleIndex, setRoleIndex] = useState<number>(0);

  const { data: dataProject } = useQuery(FIND_PROJECT, {
    variables: {
      fields: {
        _id,
      },
    },
    skip: !_id,
  });

  const [selectedRole, setSelectedRole] = useState(
    dataProject?.findProject?.role[0]
  );

  const { data: matchingMembers } = useQuery(MATCH_NODES_MEMBERS, {
    variables: {
      fields: {
        nodesID: selectedRole?.nodes.map(
          (node: NodesType) => node?.nodeData?._id
        ),
        serverID: selectedServerID?.filter((id) =>
          dataProject?.findProject?.serverID?.includes(id)
        ),
      },
    },
    skip:
      !selectedRole ||
      !dataProject?.findProject?.serverID ||
      selectedServerID.length === 0,
  });

  // if (matchingMembers) console.log("matchingMembers", matchingMembers);

  useEffect(() => {
    if (dataProject?.findProject) setProject(dataProject?.findProject);
  }, [dataProject]);

  if (!dataProject) return null;

  return (
    <>
      <SEO />
      {view === "main" && (
        <GridLayout>
          <GridItemThree>
            <ProjectEditSelectorCard
              project={dataProject?.findProject}
              handleSelectRole={(role) => {
                setSelectedRole(role);
              }}
              selectedRole={selectedRole}
              onBack={() => router.push(`/champion-board`)}
              // onEdit={() => setView("project")}
            />
          </GridItemThree>
          <GridItemNine>
            <ChampionNodesMatchContainer
              selectedRole={selectedRole}
              project={dataProject.findProject}
              matchingMembers={matchingMembers?.matchNodesToMembers}
            />
          </GridItemNine>
        </GridLayout>
      )}
      {view === "project" && (
        <GridLayout>
          <GridItemSix>
            <CreateProjectContainer
              step={step}
              state={project}
              setState={setProject}
              setStep={setStep}
              roleIndex={roleIndex}
              onSetRoleIndex={setRoleIndex}
              setView={setView}
            />
          </GridItemSix>
          <GridItemSix>
            <Card shadow className={"h-85 bg-white"}>
              <ViewProjectContainer
                step={step}
                project={project}
                roleIndex={roleIndex}
                onSetRoleIndex={setRoleIndex}
              />
            </Card>
          </GridItemSix>
        </GridLayout>
      )}
    </>
  );
};

ProjectPage.getLayout = (page) => (
  <AppUserSubmenuLayout showSubmenu={false}>{page}</AppUserSubmenuLayout>
);

export default ProjectPage;

import { IncomingMessage, ServerResponse } from "http";
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
