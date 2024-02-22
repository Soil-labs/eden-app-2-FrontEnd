import { Dispatch, SetStateAction, useEffect } from "react";

import { Step } from "../Wizard";

export interface IBrandedWizardStepsHeaderProps {
  steps: Array<Step>;
  currentStep: number;
  setStep: Dispatch<SetStateAction<number>>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const BrandedWizardStepsHeader = ({
  steps,
  currentStep,
  setStep,
}: IBrandedWizardStepsHeaderProps) => {
  useEffect(() => {
    const activeStep = document.querySelector(`#wizard-header-${currentStep}`);

    if (activeStep) {
      activeStep.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [currentStep]);

  return (
    <div className="scrollbar-hide absolute left-0 top-0 flex w-full overflow-x-scroll py-4 md:justify-center">
      {steps.map((step, index) => (
        <div
          id={`wizard-header-${index}`}
          key={index}
          className="flex items-center"
        >
          <div
            className={classNames(
              currentStep === index
                ? "text-edenGreen-600"
                : "text-edenGray-700 cursor-pointer",
              currentStep !== index && step.navigationDisabled
                ? "!cursor-not-allowed"
                : ""
            )}
            onClick={() => {
              if (currentStep != index && !step.navigationDisabled)
                setStep(index);
            }}
          >
            <span
              className={classNames(
                "whitespace-nowrap text-xs",
                currentStep === index
                  ? "text-edenGreen-600"
                  : "text-edenGray-700"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <span className="px-1 pt-[2px] text-xl leading-[1rem] text-[#E7E7E7]">
              /
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
