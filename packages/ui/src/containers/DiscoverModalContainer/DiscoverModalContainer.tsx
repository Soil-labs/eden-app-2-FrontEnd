import { DiscoverContext, DiscoverModal } from "@eden/package-context";
import { PreferencesType } from "@eden/package-graphql/generated";
import {
  DiscoverTalentDropdownModal,
  PreferencesModal,
  PrioritizeModal,
  RequirementsModal,
  SkipFlowModal,
  WelcomeModal,
} from "@eden/package-ui";
import { useContext, useEffect, useState } from "react";

const rangeNumbers: number[] = [];

for (let i = 0; i < 500; i++) {
  rangeNumbers.push(Math.floor(Math.random() * 80) + 1);
}

export interface IDiscoverModalContainerProps {
  image?: any;
  // eslint-disable-next-line no-unused-vars
  setArrayOfNodes?: (val: string[]) => void;
  // eslint-disable-next-line no-unused-vars
  setPreferences?: (val: PreferencesType) => void;
}

export const DiscoverModalContainer = ({
  image,
  setArrayOfNodes,
  setPreferences,
}: IDiscoverModalContainerProps) => {
  const { project, openModal, setOpenModal } = useContext(DiscoverContext);

  const [nextStep, setNextStep] = useState<any>(null);
  const [nodeIdArray, setNodeIdArray] = useState<string[]>([]);

  useEffect(() => {
    if (nodeIdArray) {
      setArrayOfNodes?.(nodeIdArray);
    }
  }, [nodeIdArray]);

  useEffect(() => {
    setOpenModal(DiscoverModal.START_INFO);
  }, []);

  const matchType = `People`;

  return (
    <>
      {openModal === DiscoverModal.SKIP_ALERT && (
        <SkipFlowModal
          openModal={openModal === DiscoverModal.SKIP_ALERT}
          onSkipStep={() => setOpenModal(nextStep)}
          onSkipFlow={() => setOpenModal(null)}
          // percentage={50}
        />
      )}

      {openModal === DiscoverModal.START_INFO && (
        <WelcomeModal
          image={image}
          openModal={openModal === DiscoverModal.START_INFO}
          onNext={() => {
            setOpenModal(DiscoverModal.PREFERENCES);
          }}
          text="members"
        />
      )}

      {openModal === DiscoverModal.PREFERENCES && (
        <PreferencesModal
          key={"" + project?.role?.length}
          // battery
          openModal={openModal === DiscoverModal.PREFERENCES}
          onClose={() => {
            setOpenModal(DiscoverModal.SKIP_ALERT);
            setNextStep(DiscoverModal.SKILLS_CATEGORY);
          }}
          onSubmit={(val) => {
            if (val) {
              if (setPreferences) setPreferences(val);
            }
            setOpenModal(DiscoverModal.SKILLS_CATEGORY);
          }}
          // numMatches={38}
        />
      )}

      {openModal === DiscoverModal.SKILLS_CATEGORY && (
        <DiscoverTalentDropdownModal
          openModal={openModal === DiscoverModal.SKILLS_CATEGORY}
          onClose={() => {
            setOpenModal(DiscoverModal.SKIP_ALERT);
            setNextStep(DiscoverModal.PRIORITIZE);
          }}
          onSubmit={(val: string[]) => {
            console.log("val", val);
            if (val) {
              if (setNodeIdArray) setNodeIdArray(val);
            }
            setOpenModal(DiscoverModal.SKILLS_SUBCATEGORY);
          }}
          title={`Who are you looking for?`}
          subTitle={`Select what you want them to help you with.`}
          nodeType={`expertise`}
          matchType={matchType}
          previousValues={nodeIdArray}
        />
      )}

      {openModal === DiscoverModal.SKILLS_SUBCATEGORY && (
        <DiscoverTalentDropdownModal
          openModal={openModal === DiscoverModal.SKILLS_SUBCATEGORY}
          onClose={() => {
            setOpenModal(DiscoverModal.SKIP_ALERT);
            setNextStep(DiscoverModal.PRIORITIZE);
          }}
          onSubmit={(val: string[] | null) => {
            console.log("val2", val);
            if (val) {
              if (setNodeIdArray) setNodeIdArray(val);
            }

            // if (setArrayOfNodes) setArrayOfNodes(val);
            setOpenModal(DiscoverModal.PRIORITIZE);
          }}
          title={`Who are you looking for?`}
          subTitle={`Select what you want them to help you with.`}
          nodeType={`typeProject`}
          matchType={matchType}
          previousValues={nodeIdArray}
        />
      )}

      {openModal === DiscoverModal.PRIORITIZE && (
        <PrioritizeModal
          key={"" + project?.role?.length}
          // battery
          openModal={openModal === DiscoverModal.PRIORITIZE}
          onClose={() => {
            setOpenModal(DiscoverModal.SKIP_ALERT);
            setNextStep(DiscoverModal.REQUIREMENTS);
          }}
          onSubmit={(val) => {
            console.log(val);
            setOpenModal(DiscoverModal.REQUIREMENTS);
          }}
          // numMatches={38}
        />
      )}

      {openModal === DiscoverModal.REQUIREMENTS && (
        <RequirementsModal
          salaryData={rangeNumbers}
          // battery
          openModal={openModal === DiscoverModal.REQUIREMENTS}
          onClose={() => {
            // setOpenModal(LaunchProjectModal.PROJECT_INFO);
            setOpenModal(null);
          }}
          onSubmit={(val) => {
            console.log(val);
            setOpenModal(null);
            // setOpenModal(null);
          }}
          // numMatches={23}
        />
      )}
    </>
  );
};
