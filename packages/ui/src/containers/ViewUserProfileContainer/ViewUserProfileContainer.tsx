import { Members } from "@eden/package-graphql/generated";
import {
  Badge,
  Card,
  IPREFERENCES_TITLE,
  NodeList,
  PREFERENCES_TITLE,
  SocialMediaComp,
  TextLabel1,
  UserBackground,
  UserWithDescription,
} from "@eden/package-ui";
import { STEPS } from "@eden/package-ui/utils/enums/fill-profile-steps";

export interface IViewUserProfileContainerProps {
  step?: STEPS;
  user?: Members;
  experienceOpen: number | null;
  setExperienceOpen: React.Dispatch<React.SetStateAction<number | null>>;
}

export const ViewUserProfileContainer = ({
  step,
  user,
  experienceOpen,
  setExperienceOpen,
}: IViewUserProfileContainerProps) => {
  const subExpertise = user?.nodes?.filter(
    (node) => node?.nodeData?.node === "sub_expertise"
  );

  const projectType = user?.nodes?.filter(
    (node) => node?.nodeData?.node === "sub_typeProject"
  );

  const selectedPreferences = user?.preferences
    ? (Object.keys(user?.preferences) as [keyof IPREFERENCES_TITLE]).filter(
        (key) => user.preferences![key]?.interestedMatch && key.includes("find")
      )
    : null;

  return (
    <Card className="bg-white p-4">
      <p>Preview of your profile:</p>
      <div className={`h-75 scrollbar-hide w-full overflow-scroll p-2`}>
        <div
          className={`mb-4 flex w-full justify-center ${
            step !== STEPS.ROLE ? "blur-sm" : ""
          }`}
        >
          <UserWithDescription member={user} />
        </div>
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-5">
          <div
            className={`my-4 flex flex-col items-start justify-center sm:col-span-3 sm:my-0 ${
              step !== STEPS.BIO ? "blur-sm" : ""
            }`}
          >
            <TextLabel1>🪪 Short bio</TextLabel1>
            <p className="text-soilBody font-Inter font-normal">{user?.bio}</p>
          </div>
          <div></div>
          <div className={`pl-14 ${step !== STEPS.SOCIALS ? "blur-sm" : ""}`}>
            <SocialMediaComp size={`sm`} links={user?.links} />
          </div>
        </div>
        {selectedPreferences && (
          <div className={`mb-4  ${step !== STEPS.ROLE ? "blur-sm" : ""}`}>
            <TextLabel1>🔎 PREFERENCES</TextLabel1>

            <div>
              {selectedPreferences.map(
                (preference: keyof IPREFERENCES_TITLE, index: number) => (
                  <Badge
                    key={index}
                    text={PREFERENCES_TITLE[preference]}
                    colorRGB={`255,255,167`}
                    className={`font-Inter text-sm`}
                    closeButton={false}
                    cutText={16}
                  />
                )
              )}
            </div>
          </div>
        )}
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2`}>
          <div
            className={`flex flex-col ${
              step !== STEPS.EXPERTISE && step !== STEPS.BIO ? "blur-sm" : ""
            }`}
          >
            <NodeList
              label={`EXPERTISE`}
              nodes={subExpertise}
              colorRGB={`235,225,255`}
            />
          </div>
          <div
            className={`flex flex-col ${
              step !== STEPS.PREFERRED_PROJECTS ? "blur-sm" : ""
            }`}
          >
            <NodeList
              label={`PREFERRED PROJECTS`}
              nodes={projectType}
              colorRGB={`209,247,196`}
            />
          </div>
        </div>
        <div
          className={`my-4 ${
            step !== STEPS.EXP && step !== STEPS.EXP_DETAIL ? "blur-sm" : ""
          }`}
        >
          {user?.previousProjects && (
            <UserBackground
              background={user.previousProjects}
              initialEndorsements={[
                {
                  endorser: {
                    discordAvatar:
                      "https://cdn.discordapp.com/embed/avatars/4.png",
                    discordName: "BluePanda",
                    discriminator: "0001",
                  },
                  endorsementMessage:
                    "One of the finest people I’ve ever known in business or any field. Simply the most brilliant opportunity creator I've ever worked with.",
                  arweaveTransactionID: "123",
                  // level: {
                  //   name: 2000,
                  //   smallName: "L2",
                  //   meaning: "Community Favourite",
                  //   SuccessfulEndorsementsGive: "23",
                  //   SuccessfulEndorsementsReceive: "12",
                  // },
                },
              ]}
              setExperienceOpen={setExperienceOpen!}
              experienceOpen={experienceOpen!}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
