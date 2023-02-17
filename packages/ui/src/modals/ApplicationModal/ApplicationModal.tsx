import { Maybe, ProjectMemberType } from "@eden/package-graphql/generated";
import {
  AvailabilityComp,
  Avatar,
  AvatarList,
  AvatarProps,
  Modal,
  ProgressStepper,
  ProjectChampion,
} from "@eden/package-ui";

export interface ApplicationModalProps {
  isModalOpen: boolean;
  project?: Maybe<ProjectMemberType>;
  onClose?: () => void;
}

export const ApplicationModal = ({
  isModalOpen,
  project,
  onClose,
}: ApplicationModalProps) => {
  const filterCommittedTeam = project?.info?.team?.filter(
    (member) => member?.phase === "committed"
  );

  const filterCommittedTeamAvatars = filterCommittedTeam?.map((member) => ({
    src: member?.memberInfo?.discordAvatar,
    size: "xs",
    alt: member?.memberInfo?.discordName,
  }));

  return (
    <Modal open={isModalOpen} onClose={onClose}>
      <div className="mb-10 flex gap-10 p-5">
        <div className="flex flex-col items-start justify-center gap-5">
          <div className="flex items-center justify-center gap-3">
            <div>
              <Avatar
                size="lg"
                isProject
                emoji={project?.info?.emoji as string}
                backColorEmoji={project?.info?.backColorEmoji as string}
              />
            </div>
            <div>
              <h1 className="text-soilHeading1 font-semibold">
                {project?.info?.title}
              </h1>
              <p className="text-soilHeading3 text-soilGray leading-6">
                {project?.info?.descriptionOneLine}
              </p>
            </div>
          </div>
          <p className="text-soilBody font-Inter">
            {project?.info?.description}
          </p>
          <div className="w-full">
            <h1 className="text-soilHeading3 font-medium">
              {project?.role?.title}
            </h1>
            <div className="flex items-start justify-between">
              <ul>
                <li>{project?.role?.keyResponsibilities}</li>
              </ul>
              <div className="text-soilGray font-medium">
                <AvailabilityComp
                  timePerWeek={project?.role?.hoursPerWeek || undefined}
                  seed={project?.role?.budget?.perHour || undefined}
                />

                {/* <div>
                  <h1>
                    📆1 season {project?.role?.dateRangeStart} -{" "}
                    {project?.role?.dateRangeEnd}
                  </h1>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center justify-center">
            <h3>Match</h3>
            <h1 className="text-soilHeading1 text-soilPurple font-poppins font-semibold">
              65%
            </h1>
          </div>
          <div
            className={`m-auto flex w-full flex-col content-center items-center justify-center `}
          >
            <ProjectChampion member={project?.info?.champion!} />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="font-Inter text-soilGray text-soilHeading3 mb-3 font-semibold">
              CORE TEAM
            </p>
            <AvatarList avatars={filterCommittedTeamAvatars as AvatarProps[]} />
          </div>
        </div>
      </div>
      <ProgressStepper
        steps={[
          {
            name: "Applied",
            completed:
              project?.phase === "engaged" ||
              project?.phase === "shortlisted" ||
              project?.phase === "invited",
          },
          {
            name: "Reviewed",
            completed:
              project?.phase === "shortlisted" || project?.phase === "invited",
          },
          { name: "Assesment", completed: project?.phase === "invited" },
          { name: "interview", completed: false },
          { name: "Induction", completed: false },
          { name: "Onboarding", completed: false },
        ]}
      />
    </Modal>
  );
};
