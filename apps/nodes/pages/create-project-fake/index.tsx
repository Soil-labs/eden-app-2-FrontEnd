import { gql, useMutation, useQuery } from "@apollo/client";
import { FIND_ROLE_TEMPLATES, FIND_PROJECT } from "@eden/package-graphql";
import { Mutation } from "@eden/package-graphql/generated";
import {
  AppUserSubmenuLayout,
  Badge,
  Button,
  Card,
  CreateProjectTempContainer,
  SelectNodesModal,
  SEO,
} from "@eden/package-ui";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";

export const ADD_NODES_PROJECT_ROLE = gql`
  mutation ($fields: addNodesToProjectRoleInput!) {
    addNodesToProjectRole(fields: $fields) {
      _id
    }
  }
`;

import type { NextPageWithLayout } from "../_app";

const ProfilePage: NextPageWithLayout = () => {
  const { data: dataRoles } = useQuery(FIND_ROLE_TEMPLATES, {
    variables: {
      fields: {},
    },
    context: { serviceName: "soilservice" },
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const submenu = [
    {
      Icon: <FaUserEdit size={25} />,
      FunctionName: "Edit Profile",
      onFunctionCallback: () => setActiveIndex(0),
    },
  ];

  const [openModalExpertise, setopenModalExpertise] = useState(false);

  const [openModalTypeProject, setopenModalTypeProject] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [addNodesProjectRole] = useMutation(ADD_NODES_PROJECT_ROLE, {
    onCompleted({ addNodesToProjectRole }: Mutation) {
      if (!addNodesToProjectRole) console.log("addNodesToProjectRole is null");
      // console.log("updateMember", addNodesToProjectRole);
      // setSubmitting(false);
      refetchProject();
    },
  });

  const handleSaveNodes = (nodes: string[]) => {
    console.log("nodes", nodes);
    console.log(
      "asdfasdf = ",
      dataProject?.findProject?.role[selectedRole]?._id
    );
    if (!dataProject) return;

    addNodesProjectRole({
      variables: {
        fields: {
          projectRoleID: dataProject?.findProject?.role[selectedRole]?._id,
          nodesID: nodes,
        },
      },
    });
  };

  const [projectUIdata, setProjectUIdata] = useState<any>({
    _id: "",
    title: "",
    description: "",
    emoji: "",
    serverID: "",
  });

  const { data: dataProject, refetch: refetchProject } = useQuery(
    FIND_PROJECT,
    {
      variables: {
        fields: {
          _id: projectUIdata?._id,
        },
      },
      skip: !projectUIdata?._id,
      context: { serviceName: "soilservice" },
    }
  );

  useEffect(() => {
    if (dataProject) {
      const field: any = {};

      console.log("dataProject.findProject = ", dataProject?.findProject);

      if (dataProject.findProject?.description)
        field.description = dataProject.findProject?.description;

      if (dataProject.findProject?.emoji)
        field.emoji = dataProject.findProject?.emoji;

      if (dataProject.findProject?.serverID)
        field.serverID = dataProject.findProject?.serverID[0];

      if (dataProject.findProject?.title)
        field.title = dataProject.findProject?.title;

      if (dataProject.findProject?._id)
        field._id = dataProject.findProject?._id;

      setProjectUIdata({
        ...projectUIdata,
        ...field,
      });
    }
  }, [dataProject]);

  const [selectedRole, setSelectedRole] = useState(-1);

  // console.log("dataProject = ", dataProject);

  return (
    <>
      <SEO />
      <AppUserSubmenuLayout submenu={submenu} activeIndex={activeIndex}>
        <Card
          shadow
          className={`h-85 scrollbar-hide overflow-y-scroll bg-white`}
        >
          {activeIndex === 0 && (
            <>
              {selectedRole > -1 ? (
                <Card shadow className={`mb-4 p-6`}>
                  <div className={`flex justify-between`}>
                    <div>
                      <Button
                        onClick={() =>
                          setopenModalExpertise(!openModalExpertise)
                        }
                      >
                        Select Skills
                      </Button>
                    </div>
                    <div>
                      {dataProject?.findProject?.role[selectedRole]?.nodes?.map(
                        (item, index) => {
                          if (item?.nodeData?.node == "sub_expertise") {
                            return (
                              <Badge
                                key={index}
                                text={item?.nodeData?.name || ""}
                                colorRGB={`209,247,196`}
                                className={`font-Inter text-sm`}
                                cutText={16}
                              />
                            );
                          }
                        }
                      )}
                    </div>
                  </div>
                </Card>
              ) : (
                true
              )}

              {selectedRole > -1 ? (
                <Card shadow className={`mb-4 p-6`}>
                  <div className={`flex justify-between`}>
                    <div>
                      <Button
                        onClick={() =>
                          setopenModalTypeProject(!openModalTypeProject)
                        }
                      >
                        Select Type Project
                      </Button>
                    </div>
                    <div>
                      {dataProject?.findProject?.role[selectedRole]?.nodes?.map(
                        (item, index) => {
                          if (item?.nodeData?.node == "sub_typeProject") {
                            return (
                              <Badge
                                key={index}
                                text={item?.nodeData?.name || ""}
                                colorRGB={`209,147,296`}
                                className={`font-Inter text-sm`}
                                cutText={16}
                              />
                            );
                          }
                        }
                      )}
                    </div>
                  </div>
                </Card>
              ) : (
                true
              )}

              <SelectNodesModal
                title="Add your Expertise"
                openModal={openModalExpertise}
                onClose={() => {
                  setopenModalExpertise(false);
                }}
                onSubmit={(val: any) => {
                  console.log("change = ");
                  handleSaveNodes(val);
                  setopenModalExpertise(false);
                }}
                nodeType={`expertise`}
              />

              <SelectNodesModal
                title="Add the Types of Projects that you like"
                openModal={openModalTypeProject}
                onClose={() => {
                  setopenModalTypeProject(false);
                }}
                onSubmit={(val: any) => {
                  handleSaveNodes(val);
                  setopenModalTypeProject(false);
                }}
                nodeType={`typeProject`}
              />

              <CreateProjectTempContainer
                roles={dataRoles?.findRoleTemplates}
                projectData="test"
                dataProject={dataProject}
                projectUIdata={projectUIdata}
                selectedRole={selectedRole}
                setProjectUIdata={(val: any) => {
                  setProjectUIdata(val);
                }}
                onFetchProject={() => {
                  refetchProject();
                }}
                setSelectedRole={(val: any) => {
                  setSelectedRole(val);
                }}
              />
            </>
          )}
        </Card>
      </AppUserSubmenuLayout>
    </>
  );
};

export default ProfilePage;

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
