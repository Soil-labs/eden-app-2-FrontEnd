import { GrantsContext, GrantsModal } from "@eden/package-context";
import {
  DiscoverTalentDropdownModal,
  SkipFlowModal,
  WarningModal,
  WelcomeModal,
} from "@eden/package-ui";
import { useContext, useState } from "react";

const rangeNumbers: number[] = [];

for (let i = 0; i < 500; i++) {
  rangeNumbers.push(Math.floor(Math.random() * 80) + 1);
}

export interface IGrantsModalContainerProps {
  image?: any;
  // eslint-disable-next-line no-unused-vars
  setArrayOfNodes?: (val: string[], type: string) => void;
  percentage?: number;
}

export const GrantsModalContainer = ({
  image,
  setArrayOfNodes,
  percentage = 0,
}: IGrantsModalContainerProps) => {
  const { openModal, setOpenModal } = useContext(GrantsContext);

  const [nextStep, setNextStep] = useState<any>(null);

  const matchType = `Grants`;

  // console.log("grants modal container", openModal);

  return (
    <>
      {openModal === GrantsModal.SKIP_ALERT && (
        <SkipFlowModal
          openModal={openModal === GrantsModal.SKIP_ALERT}
          onSkipStep={() => setOpenModal(nextStep)}
          onSkipFlow={() => setOpenModal(null)}
          percentage={percentage}
        />
      )}

      {openModal === GrantsModal.START_WELCOME && (
        <WelcomeModal
          image={image}
          openModal={openModal === GrantsModal.START_WELCOME}
          onNext={() => {
            setOpenModal(GrantsModal.NODES_ROLE);
          }}
        />
      )}

      {openModal === GrantsModal.NODES_ROLE && (
        <DiscoverTalentDropdownModal
          openModal={openModal === GrantsModal.NODES_ROLE}
          onClose={() => {
            setOpenModal(GrantsModal.SKIP_ALERT);
            setNextStep(GrantsModal.NODES_PROJECTS);
          }}
          onSubmit={(val: string[]) => {
            // console.log("val", val);
            if (val) if (setArrayOfNodes) setArrayOfNodes(val, "sub_expertise");
            setOpenModal(GrantsModal.NODES_PROJECTS);
          }}
          title={`First select your role`}
          subTitle={`Choose any role you want!`}
          nodeType={`expertise`}
          matchType={matchType}
          batteryPercentage={percentage}
        />
      )}

      {openModal === GrantsModal.NODES_PROJECTS && (
        <DiscoverTalentDropdownModal
          openModal={openModal === GrantsModal.NODES_PROJECTS}
          onClose={() => {
            setOpenModal(GrantsModal.SKIP_ALERT);
            setNextStep(GrantsModal.WARNING);
          }}
          onSubmit={(val: string[] | null) => {
            // console.log("val", val);
            if (val) if (setArrayOfNodes) setArrayOfNodes(val, "sub_expertise");
            setOpenModal(GrantsModal.WARNING);
          }}
          title={`Let's get you sorted! What type of projects are you looking for?`}
          subTitle={`You can choose any area of interest!`}
          nodeType={`typeProject`}
          matchType={matchType}
          batteryPercentage={percentage}
        />
      )}

      {openModal === GrantsModal.WARNING && (
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
