import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { UPDATE_PROJECT } from "@eden/package-graphql";
import {
  Maybe,
  Mutation,
  RoleTemplate,
  SkillRoleType,
} from "@eden/package-graphql/generated";
import {
  Button,
  Card,
  Dropdown,
  Loading,
  RoleSelector,
  EmojiSelector,
  SearchSkill,
  SkillVisualisationComp,
  SocialMediaInput,
  TextArea,
  OpenPositionCard,
  TextBody,
  TextField,
  TextHeading3,
  TextLabel,
} from "@eden/package-ui";
import { useContext, useEffect, useState } from "react";

import { timezones } from "../../../constants";

export interface ICreateProjectTempContainerProps {
  roles?: Maybe<Array<Maybe<RoleTemplate>>>;
  projectData?: any;
  projectUIdata?: any;
  dataProject?: any;
  selectedRole?: any;
  setProjectUIdata: (val: any) => void;
  onFetchProject: () => void;
  setSelectedRole: (val: any) => void;
}

export const CreateProjectTempContainer = ({
  roles,
  projectData,
  projectUIdata,
  dataProject,
  selectedRole,
  setProjectUIdata,
  onFetchProject,
  setSelectedRole,
}: ICreateProjectTempContainerProps) => {
  const { currentUser } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const [projectID, setProjectID] = useState<string>("");

  const [newRoleTitle, setNewRoleTitle] = useState<string>("");

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    onCompleted({ updateProject }: Mutation) {
      if (!updateProject) console.log("updateProject is null");
      console.log("updateProject", updateProject);
      setSubmitting(false);
    },
  });

  const handleSave = () => {
    if (!currentUser) return;
    setSubmitting(true);

    let field: any = {};

    if (projectUIdata?._id) field._id = projectUIdata._id;
    if (projectUIdata?.title) field.title = projectUIdata.title;
    if (projectUIdata?.description)
      field.description = projectUIdata.description;
    if (projectUIdata?.serverID) field.serverID = projectUIdata.serverID;

    console.log("field = ", field);

    updateProject({
      variables: {
        fields: { ...field },
      },
    });
  };

  if (submitting) return <Loading title="Saving..." />;

  return (
    <>
      <Card className="mb-8 bg-white p-6">
        <section className="mb-6 flex justify-between">
          <TextHeading3>Create New Project:</TextHeading3>
          <Button
            variant="primary"
            className={``}
            disabled={submitting}
            onClick={() => handleSave()}
          >
            Update Project
          </Button>
        </section>
        <section className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="col-span-1">
            <div className="mb-3">
              <TextBody>Title:</TextBody>
              <div className={`flex justify-center space-x-4`}>
                <TextField
                  name="textfield"
                  type="text"
                  // value={titleProject.toString()}
                  // onChange={(e) => setTitleProject(e.target.value)}
                  value={projectUIdata?.title}
                  onChange={(e) =>
                    setProjectUIdata({
                      ...projectUIdata,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <br />
              <TextBody>Bio:</TextBody>
              <TextArea
                // value={currentUser?.bio!}
                // onChange={(e) => setBio(e.target.value)}
                value={projectUIdata?.description}
                onChange={(e) =>
                  setProjectUIdata({
                    ...projectUIdata,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <TextBody>serverID:</TextBody>
            <div className={`flex justify-center space-x-4`}>
              <TextField
                name="textfield"
                type="text"
                value={projectUIdata?.serverID.toString()}
                onChange={(e) =>
                  setProjectUIdata({
                    ...projectUIdata,
                    serverID: e.target.value,
                  })
                }
              />
            </div>
            <br />
          </div>
          <div className="col-span-1">
            <div className="justify-around">
              <TextBody className="mb-1">Select Emoji</TextBody>

              <div className="p-3">
                <EmojiSelector
                  size={80}
                  emoji={projectUIdata?.emoji}
                  // onSelection={(value) => setEmoji(value)}
                  onSelection={(value) =>
                    setProjectUIdata({
                      ...projectUIdata,
                      emoji: value,
                    })
                  }
                />
              </div>
              <br />
              <TextBody>Project ID:</TextBody>
              <div className={`flex justify-center space-x-4`}>
                <TextField
                  name="textfield"
                  type="text"
                  // value={projectID.toString()}
                  // onChange={(e) => setProjectID(e.target.value)}
                  value={projectUIdata?._id}
                  onChange={(e) =>
                    setProjectUIdata({
                      ...projectUIdata,
                      _id: e.target.value,
                    })
                  }
                />
              </div>
              <br />

              <Button
                variant="primary"
                className={``}
                disabled={submitting}
                onClick={() => {
                  console.log("change = -------0-000");
                  onFetchProject();
                  console.log("projectID = ", projectID);
                  console.log("dataProject = ", dataProject);
                }}
              >
                Find Project
              </Button>
            </div>
          </div>
        </section>

        <div className={`scrollbar-hide flex flex-grow overflow-y-scroll`}>
          <div
            className={`grid grow grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3`}
          >
            {dataProject?.findProject?.role?.length > 0 ? (
              <>
                {dataProject?.findProject?.role?.map(
                  (role: any, index: any) => {
                    let roleSkills: any = {};

                    roleSkills.title = role.title;

                    if (selectedRole == index) {
                      roleSkills.skills = [
                        {
                          skillData: {
                            _id: "637ad5a6f0f9c427e03a03a8",
                            name: "Selected",
                          },
                        },
                      ];
                    }
                    // console.log("roleSkills = ", roleSkills);
                    return (
                      <OpenPositionCard
                        key={index}
                        role={roleSkills}
                        percentage={23}
                        onApply={(val) => {
                          console.log("apply = ");
                          setSelectedRole(index);
                        }}
                      />
                    );
                  }
                )}

                <Card shadow border>
                  <TextBody>New Role Title:</TextBody>
                  <div className={`flex justify-center space-x-4`}>
                    <TextField
                      name="textfield"
                      type="text"
                      value={newRoleTitle}
                      onChange={(e) => setNewRoleTitle(e.target.value)}
                    />
                  </div>
                  <br />

                  <Button
                    variant="tertiary"
                    className={``}
                    disabled={submitting}
                    onClick={() => {
                      console.log("change = -------0-000");
                      onFetchProject();
                      console.log("projectID = ", projectID);
                      console.log("dataProject = ", dataProject);
                    }}
                  >
                    Find Project
                  </Button>
                </Card>
              </>
            ) : (
              true
            )}
          </div>
        </div>
      </Card>
    </>
  );
};
