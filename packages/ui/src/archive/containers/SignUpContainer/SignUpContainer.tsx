import { gql, useMutation } from "@apollo/client";
import { Mutation } from "@eden/package-graphql/generated";
import { Button, Card, FormStepper, Loading } from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import {
  SignUpViewBio,
  SignUpViewConfirm,
  SignUpViewShare,
  SignUpViewSkills,
  SignUpViewSocials,
  SignUpViewSuccess,
  SignUpViewXP,
} from "./";
import { SignUpContext } from "./context";

const UPDATE_MEMBER = gql`
  mutation ($fields: updateMemberInput!) {
    updateMember(fields: $fields) {
      _id
    }
  }
`;

export interface SignUpContainerProps {}

export const SignUpContainer = ({}: SignUpContainerProps) => {
  const router = useRouter();
  const {
    profileBio,
    contentMostProud,
    contentShowcaseAbility,
    hoursPerWeek,
    timezone,
    twitterHandle,
    githubHandle,
    telegramHandle,
  } = useContext(SignUpContext);

  // console.log("currentUser", currentUser);

  const [currentIndex, setCurrentIndex] = useState(1);
  const maxSteps = 6;

  const [submittingProfile, setSubmittingProfile] = useState(false);

  const [updateMember, {}] = useMutation(UPDATE_MEMBER, {
    onCompleted({ updateMember }: Mutation) {
      if (!updateMember) console.log("updateMember is null");
      setCurrentIndex(maxSteps + 1);
      setSubmittingProfile(false);
    },
    onError(error) {
      console.log(error);
    },
  });

  const onClickProfile = () => {
    updateMember({
      variables: {
        fields: {
          bio: profileBio,
          content: {
            mostProud: contentMostProud,
            showCaseAbility: contentShowcaseAbility,
          },
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
          // skills: [],
          onbording: {
            signup: true,
          },
        },
      },
    });
  };

  const SignUpView = () => {
    switch (currentIndex) {
      case 1:
        return <SignUpViewBio />;
      case 2:
        return <SignUpViewSocials />;
      case 3:
        return <SignUpViewXP />;
      case 4:
        return <SignUpViewShare />;
      case 5:
        return <SignUpViewSkills />;
      case 6:
        return <SignUpViewConfirm />;
      case 7:
        return <SignUpViewSuccess />;
      default:
        return <div>error</div>;
    }
  };

  return (
    <main className={`bg-background`}>
      <Card shadow className="h-9/10 bg-white">
        {submittingProfile ? (
          <Loading title={`Submitting...`} />
        ) : (
          <div className={`relative h-full`}>
            <div className={`p-6`}>
              {currentIndex <= maxSteps && (
                <FormStepper
                  currentStep={currentIndex}
                  numberofSteps={maxSteps}
                />
              )}
            </div>

            {/* view window */}
            {SignUpView && SignUpView()}

            {/* navigation */}
            <div
              className={`absolute bottom-2 flex w-full justify-between p-6`}
            >
              <div>
                {currentIndex !== 1 && currentIndex !== maxSteps + 1 && (
                  <Button onClick={() => setCurrentIndex(currentIndex - 1)}>
                    <BsArrowLeft className={`my-auto mr-2`} />
                    PREVIOUS
                  </Button>
                )}
              </div>
              <div>
                {currentIndex < maxSteps ? (
                  <Button
                    variant={`primary`}
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                  >
                    NEXT
                    <BsArrowRight className={`my-auto ml-2`} />
                  </Button>
                ) : currentIndex === maxSteps ? (
                  <Button
                    variant={`primary`}
                    onClick={() => {
                      setSubmittingProfile(true);
                      onClickProfile();
                    }}
                  >
                    FINISH
                    <BsArrowRight className={`my-auto ml-2`} />
                  </Button>
                ) : (
                  <Button
                    variant={`primary`}
                    onClick={() => router.push(`/projects`)}
                  >
                    FIND A PROJECT
                    <BsArrowRight className={`my-auto ml-2`} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
};
