import { ProjectsContext, ProjectsModal } from "@eden/package-context";
import {
  DiscoverTalentDropdownModal,
  RequirementsModal,
  SkipFlowModal,
  WarningModal,
  WelcomeModal,
} from "@eden/package-ui";
import { useContext, useState } from "react";

const rangeNumbers: number[] = [];

for (let i = 0; i < 500; i++) {
  rangeNumbers.push(Math.floor(Math.random() * 80) + 1);
}

export interface IProjectsModalContainerProps {
  image?: any;
  // eslint-disable-next-line no-unused-vars
  setArrayOfNodes?: (val: string[], type: string) => void;
  percentage?: number;
}

export const ProjectsModalContainer = ({
  image,
  setArrayOfNodes,
  percentage = 0,
}: IProjectsModalContainerProps) => {
  const { openModal, setOpenModal } = useContext(ProjectsContext);

  const [nextStep, setNextStep] = useState<any>(null);

  const matchType = ``;

  return (
    <>
      {openModal === ProjectsModal.SKIP_ALERT && (
        <SkipFlowModal
          openModal={openModal === ProjectsModal.SKIP_ALERT}
          onSkipStep={() => setOpenModal(nextStep)}
          onSkipFlow={() => setOpenModal(null)}
          percentage={percentage}
        />
      )}

      {openModal === ProjectsModal.START_WELCOME && (
        <WelcomeModal
          image={image}
          openModal={openModal === ProjectsModal.START_WELCOME}
          onNext={() => {
            setOpenModal(ProjectsModal.NODES_ROLE);
          }}
        />
      )}

      {openModal === ProjectsModal.NODES_ROLE && (
        <DiscoverTalentDropdownModal
          openModal={openModal === ProjectsModal.NODES_ROLE}
          onClose={() => {
            setOpenModal(ProjectsModal.SKIP_ALERT);
            setNextStep(ProjectsModal.NODES_PROJECTS);
          }}
          onSubmit={(val: string[]) => {
            // console.log("val", val);
            if (val) {
              if (setArrayOfNodes) setArrayOfNodes(val, "sub_expertise");
            }
            setOpenModal(ProjectsModal.NODES_PROJECTS);
          }}
          title={`First select your role`}
          subTitle={`Choose any role you want!`}
          nodeType={`expertise`}
          matchType={matchType}
          batteryPercentage={percentage}
        />
      )}

      {openModal === ProjectsModal.NODES_PROJECTS && (
        <DiscoverTalentDropdownModal
          openModal={openModal === ProjectsModal.NODES_PROJECTS}
          onClose={() => {
            setOpenModal(ProjectsModal.SKIP_ALERT);
            setNextStep(ProjectsModal.REQUIREMENTS);
          }}
          onSubmit={(val: string[] | null) => {
            // console.log("val", val);
            if (val) {
              if (setArrayOfNodes) setArrayOfNodes(val, "sub_typeProject");
            }
            setOpenModal(ProjectsModal.REQUIREMENTS);
          }}
          title={`Let's get you sorted! What type of projects are you looking for?`}
          subTitle={`You can choose any area of interest!`}
          nodeType={`typeProject`}
          matchType={matchType}
          batteryPercentage={percentage}
        />
      )}

      {openModal === ProjectsModal.REQUIREMENTS && (
        <RequirementsModal
          salaryData={rangeNumbers}
          battery
          numMatches={percentage}
          openModal={openModal === ProjectsModal.REQUIREMENTS}
          matchType={matchType}
          onClose={() => {
            setNextStep(ProjectsModal.WARNING);
          }}
          onSubmit={(val) => {
            console.log(val);
            setOpenModal(ProjectsModal.WARNING);
          }}
        />
      )}

      {openModal === ProjectsModal.WARNING && (
        <WarningModal
          openModal
          profilePercentage={percentage}
          canSeeProjects={true}
          canProjectsSee={false}
          onSkip={function (): void {
            setOpenModal(null);
          }}
          onNext={function (): void {
            setOpenModal(null);
          }}
        />
      )}
    </>
  );
};
