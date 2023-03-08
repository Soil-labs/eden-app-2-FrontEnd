import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { UPDATE_MEMBER } from "@eden/package-graphql";
import { Mutation, Project, RoleType } from "@eden/package-graphql/generated";
import {
  Button,
  ConfettiContainer,
  Dropdown,
  Modal,
  SendMessageToChampion,
  SocialMediaInput,
  TextArea,
  TextField,
  TextHeading2,
  TextHeading3,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { timezones } from "../../../../constants";

const SET_APPLY_TO_PROJECT = gql`
  mutation ($fields: changeTeamMember_Phase_ProjectInput!) {
    changeTeamMember_Phase_Project(fields: $fields) {
      _id
    }
  }
`;

export interface IApplyByRoleModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  roleID?: string;
  role?: RoleType;
  project?: Project;
  refetch?: () => void;
}

export const ApplyByRoleModal = ({
  isModalOpen,
  onClose,
  roleID,
  role,
  project,
  refetch,
}: IApplyByRoleModalProps) => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [sendMessageView, setSendMessageView] = useState(false);

  const [profileBio, setProfileBio] = useState(currentUser?.bio || "");
  const [timezone, setTimezone] = useState(currentUser?.timeZone || "");
  const [hoursPerWeek, setHoursPerWeek] = useState(
    currentUser?.hoursPerWeek || 0
  );
  const [twitterHandle, setTwitterHandle] = useState("");
  const [githubHandle, setGithubHandle] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");

  useEffect(() => {
    // filter currentUser links for twitter, github, telegram
    const twitterLink = currentUser?.links?.find(
      (link) => link?.name === "twitter"
    );

    // remove https://twitter.com/ from the link
    if (twitterLink?.url)
      setTwitterHandle(twitterLink?.url?.replace("https://twitter.com/", ""));

    const githubLink = currentUser?.links?.find(
      (link) => link?.name === "github"
    );

    // remove https://github.com/ from the link
    if (githubLink?.url)
      setGithubHandle(githubLink?.url?.replace("https://github.com/", ""));

    const telegramLink = currentUser?.links?.find(
      (link) => link?.name === "telegram"
    );

    setTelegramHandle(telegramLink?.url || "");
  }, [currentUser]);

  const [updateMember, {}] = useMutation(UPDATE_MEMBER, {
    onCompleted({ updateMember }: Mutation) {
      if (!updateMember) console.log("updateMember is null");
      setSubmitting(false);
    },
  });

  const [changeTeamMemberPhaseProject, {}] = useMutation(SET_APPLY_TO_PROJECT, {
    onCompleted: () => {
      if (refetch) refetch();
      setSubmitting(false);
    },
    onError: (error) => {
      console.log("onError", error);
    },
  });

  const handleApply = async () => {
    // console.log("handleApply");
    // console.log("roleID", roleID);
    setSubmitting(true);
    updateMember({
      variables: {
        fields: {
          // _id: currentUser?._id,
          serverID: currentUser?.serverID,
          bio: profileBio,
          hoursPerWeek: hoursPerWeek,
          timeZone: timezone,
          links: [
            {
              name: "twitter",
              url: twitterHandle ? `https://twitter.com/${twitterHandle}` : "",
            },
            {
              name: "github",
              url: githubHandle ? `https://github.com/${githubHandle}` : "",
            },
            {
              name: "telegram",
              url: telegramHandle,
            },
          ],
        },
      },
    });
    changeTeamMemberPhaseProject({
      variables: {
        fields: {
          projectID: project?._id,
          memberID: currentUser?._id,
          roleID,
          phase: "engaged",
        },
      },
    });

    setApplied(true);
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={onClose}>
        {!applied ? (
          <div className={``}>
            <TextHeading2>
              Let’s finish up your profile before you apply to the project!
            </TextHeading2>
            <div>
              <TextHeading3>Short Bio</TextHeading3>
              <TextArea
                rows={3}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
              />
            </div>
            <div className={`mt-4 text-center`}>
              <TextHeading3>What’s your availability?</TextHeading3>
            </div>
            <div className={`mx-auto w-40`}>
              <Dropdown
                value={timezone}
                items={timezones}
                placeholder={`Timezone`}
                onSelect={(val) => setTimezone(val.name)}
              />
            </div>

            <div className={`flex justify-center space-x-4`}>
              <div className={`w-24`}>
                <TextField
                  placeholder={`Hours`}
                  radius="pill"
                  type={`number`}
                  value={hoursPerWeek.toString()}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                />
              </div>
              <div className={`my-auto font-medium text-zinc-600`}>
                hrs. / week
              </div>
            </div>
            <div className={`mt-4 text-center`}>
              <TextHeading3>DROP YOUR SOCIALS</TextHeading3>
            </div>
            <p className={`my-4 text-center text-xs`}>
              adding links is not required, but it significantly boosts your
              discoverability.
            </p>
            <SocialMediaInput
              platform="twitter"
              placeholder={`Twitter Handle`}
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              shape="rounded"
            />
            <SocialMediaInput
              platform="github"
              placeholder={`Github Handle`}
              value={githubHandle}
              onChange={(e) => setGithubHandle(e.target.value)}
              shape="rounded"
            />
            <SocialMediaInput
              platform="telegram"
              placeholder={`Telegram Handle`}
              value={telegramHandle}
              onChange={(e) => setTelegramHandle(e.target.value)}
              shape="rounded"
            />

            <div className={`flex justify-center`}>
              <Button onClick={() => handleApply()} disabled={submitting}>
                Submit Application
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!sendMessageView ? (
              <div className={`h-7/10 relative -mt-8 w-full`}>
                <ConfettiContainer>
                  <div className={`m-auto justify-center`}>
                    <div
                      className={`text-darkGreen my-auto pt-32 text-center text-4xl font-bold`}
                    >
                      YOU DID IT!
                    </div>
                    <div
                      className={`absolute bottom-36 flex w-full justify-center`}
                    >
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSendMessageView(true);
                        }}
                        disabled={submitting}
                      >
                        Send a message to the team
                      </Button>
                    </div>
                    <div
                      className={`absolute bottom-24 flex w-full justify-center`}
                    >
                      {" "}
                      - OR -
                    </div>
                    <div
                      className={`absolute bottom-8 flex w-full justify-center`}
                    >
                      <Button
                        onClick={() => {
                          onClose();
                          router.push(`/home`);
                        }}
                        disabled={submitting}
                      >
                        Return Home
                      </Button>
                    </div>
                  </div>
                </ConfettiContainer>
              </div>
            ) : (
              <SendMessageToChampion project={project} role={role} />
            )}
          </>
        )}
      </Modal>
    </>
  );
};
