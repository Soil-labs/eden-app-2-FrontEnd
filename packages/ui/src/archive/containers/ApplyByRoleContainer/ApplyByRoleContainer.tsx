/* eslint-disable camelcase */
import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  MatchSkillsToProjectsOutput,
  Maybe,
  Members,
  Mutation,
  Project,
  RoleType,
} from "@eden/package-graphql/generated";
import {
  AvatarList,
  AvatarProps,
  Card,
  Loading,
  NumberCircle,
  OpenPositionCard,
  ProjectChampion,
  TextHeading1,
} from "@eden/package-ui";
import { useContext, useEffect, useState } from "react";

import { round } from "../../../../utils";
import { ProjectHeader } from "../../components/ProjectHeader/ProjectHeader";
import { ApplyByRoleModal } from "../../modals/ApplyByRoleModal/ApplyByRoleModal";

const SET_FAVORITE = gql`
  mutation ($fields: addFavoriteProjectInput!) {
    addFavoriteProject(fields: $fields) {
      _id
    }
  }
`;

export interface IApplyByRoleContainerProps {
  project?: Project;
  matchedProjects?: Maybe<Array<Maybe<MatchSkillsToProjectsOutput>>>;
  refetch?: () => void;
  loadingProject?: boolean;
  // eslint-disable-next-line no-unused-vars
  onViewProject: (val: boolean) => void;
}

export const ApplyByRoleContainer = ({
  project,
  matchedProjects,
  refetch,
  loadingProject,
  onViewProject,
}: IApplyByRoleContainerProps) => {
  const { currentUser } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRoleView, setIsRoleView] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [roleID, setRoleID] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleType>();

  useEffect(() => {
    if (currentUser?.projects && currentUser?.projects.length > 0 && project) {
      currentUser?.projects.forEach((element) => {
        if (project?._id === element?.info?._id) {
          setIsFavorite(element?.favorite || false);
        }
      });
    }
  }, [currentUser?.projects, project]);

  useEffect(() => {
    if (roleID) setShowModal(true);
    else setShowModal(false);
  }, [roleID]);

  const [addFavoriteProject, {}] = useMutation(SET_FAVORITE, {
    onCompleted({ addFavoriteProject }: Mutation) {
      if (!addFavoriteProject) console.log("addFavoriteProject is null");
      setSubmitting(false);
      setIsFavorite(!isFavorite);
    },
  });

  const matchedProject = matchedProjects?.find(
    (matched) => matched?.project?._id === project?._id
  );

  // if (project) console.log("project", project);
  // if (matchedProject) console.log("matchedProject", matchedProject);

  const filterCommittedTeam = project?.team?.filter(
    (member) => member?.phase === "committed"
  );

  const filterCommittedTeamAvatars = filterCommittedTeam?.map((member) => ({
    src: member?.memberInfo?.discordAvatar,
    size: "xs",
    alt: member?.memberInfo?.discordName,
  }));

  const zeroMatchedProjects = project?.role?.filter(
    // @ts-ignore
    (role) => role?._id !== matchedProject?.projectRoles[0]?.projectRole?._id
  );

  if (loadingProject)
    return (
      <Card shadow className={`h-85 bg-white px-6 py-6`}>
        <Loading />
      </Card>
    );

  if (!project) return null;

  return (
    <Card shadow className={`h-85 flex flex-col bg-white px-6 py-4`}>
      <div className={`flex justify-end`}>
        <button
          onClick={() => onViewProject(false)}
          className={`text-slate-500 underline`}
        >
          grid view
        </button>
      </div>
      <div className={`grid grid-cols-3`}>
        <div className={`col-span-2`}>
          <ProjectHeader
            project={project}
            isFavoriteButton
            onSwitchView={() => setIsRoleView(!isRoleView)}
            isRoleView={isRoleView}
            submitting={submitting}
            isFavorite={isFavorite}
            onSetFavorite={() => {
              setSubmitting(true);
              addFavoriteProject({
                variables: {
                  fields: {
                    projectID: project?._id,
                    memberID: currentUser?._id,
                    favorite: !isFavorite,
                  },
                },
              });
            }}
          />
        </div>
        <div>
          {matchedProject && (
            <div className={`mb-4 flex flex-col items-center px-4 last:pr-0`}>
              <span>⚡ Match</span>
              <span className={`text-soilPurple text-3xl font-semibold`}>
                {round(Number(matchedProject?.matchPercentage), 1) || 0}%
              </span>
            </div>
          )}
          <div
            className={`m-auto flex w-full flex-col content-center items-center justify-center`}
          >
            <ProjectChampion member={project?.champion as Members} />
          </div>
          <div
            className={`my-2 flex w-full flex-col content-center items-center justify-center`}
          >
            <div
              className={`font-Inter my-2 text-lg font-semibold uppercase text-zinc-500`}
            >
              Core Team
            </div>
            <AvatarList avatars={filterCommittedTeamAvatars as AvatarProps[]} />
          </div>
        </div>
      </div>
      {isRoleView && (
        <div className={`my-4 flex`}>
          <TextHeading1>Matching Open Roles</TextHeading1>
          <span className={`my-auto pl-4`}>
            <NumberCircle value={matchedProject?.projectRoles?.length || 0} />
          </span>
        </div>
      )}

      {isRoleView ? (
        <div className={`scrollbar-hide flex flex-grow overflow-y-scroll`}>
          <div
            className={`grid grow grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3`}
          >
            {matchedProject?.projectRoles?.map((role, index) => (
              <OpenPositionCard
                key={index}
                role={role?.projectRole}
                percentage={role?.matchPercentage || 0}
                onApply={(val) => {
                  setRoleID(val);
                  setSelectedRole(role?.projectRole as RoleType);
                }}
              />
            ))}
            {zeroMatchedProjects?.map((role, index) => (
              <OpenPositionCard
                key={index}
                role={role}
                percentage={0}
                onApply={(val) => {
                  setRoleID(val);
                  setSelectedRole(role as RoleType);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className={`my-6`}>
            <TextHeading1>Project Activity</TextHeading1>
          </div>
        </div>
      )}
      <ApplyByRoleModal
        roleID={roleID}
        role={selectedRole}
        project={project}
        isModalOpen={showModal}
        onClose={() => setRoleID("")}
        refetch={refetch}
      />
    </Card>
  );
};
