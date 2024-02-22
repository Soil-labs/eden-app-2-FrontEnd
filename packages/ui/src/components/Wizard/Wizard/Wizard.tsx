import { Button } from "@eden/package-ui";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

import { BrandedWizardStepsHeader } from "../BrandedWizardStepsHeader";
import { IWizardStepProps } from "../WizardStep";
import { WizardStepsHeader } from "../WizardStepsHeader";

export type Step = {
  label: string;
  navigationDisabled: boolean;
};

export interface IWizardProps {
  children: Array<React.ReactElement<IWizardStepProps>>;
  showStepsHeader?: boolean;
  branded?: boolean;
  // eslint-disable-next-line no-unused-vars
  onStepChange?: (val: any) => void;
  canPrev?: boolean;
  forceStep?: number | undefined; //forces the step to change from outside the component
  animate?: boolean;
}

export const Wizard = ({
  children,
  showStepsHeader = false,
  branded = false,
  onStepChange,
  canPrev = true,
  forceStep,
  animate = false,
}: IWizardProps) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (typeof forceStep === "number" && forceStep !== step) {
      setStep(forceStep);
    }
  }, [forceStep]);

  const isHidePrev = () => {
    let _disabled = false;

    if (step <= 0 || !canPrev) _disabled = true;

    return _disabled;
  };

  const handlePrevClick = () => {
    if (!isHidePrev()) setStep(step - 1);
  };

  const isHideNext = () => {
    let _hide = false;

    if (step >= children.length - 1 || children[step].props.hideNext)
      _hide = true;

    return _hide;
  };

  const isNextDisabled = () => {
    let _disabled = false;

    if (step >= children.length - 1) _disabled = true;

    const { nextDisabled } = children[step].props || false;

    if (nextDisabled) _disabled = true;

    return _disabled;
  };

  const handleNextClick = () => {
    if (!isNextDisabled()) setStep(step + 1);
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    if (onStepChange) onStepChange(step);
  }, [step]);

  return (
    <div className="relative h-full">
      {showStepsHeader &&
        (branded ? (
          <BrandedWizardStepsHeader
            currentStep={step}
            steps={children.map(
              (_step) =>
                ({
                  label: _step.props.label,
                  navigationDisabled: _step.props.navigationDisabled || false,
                } as Step)
            )}
            setStep={setStep}
          />
        ) : (
          <WizardStepsHeader
            currentStep={step}
            steps={children.map(
              (_step) =>
                ({
                  label: _step.props.label,
                  navigationDisabled: _step.props.navigationDisabled || false,
                } as Step)
            )}
            setStep={setStep}
          />
        ))}
      {showStepsHeader && <div className="pt-14"></div>}
      <div
        className={classNames(
          showStepsHeader ? "h-[calc(100%-10rem)]" : "h-[calc(100%-4rem)]",
          "w-full"
        )}
      >
        {animate
          ? children.map((item, index) => (
              <Transition
                key={index}
                className="h-full w-full"
                show={index === step}
                enter="transition-all ease-in-out duration-500 delay-[200ms]"
                enterFrom="opacity-0 translate-x-6"
                enterTo="opacity-100 translate-x-0"
                leave="transition-all ease-in-out duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-6"
              >
                {item}
              </Transition>
            ))
          : children[step]}
      </div>
      {/* <div className="pt-20"></div> */}
      <div className="absolute bottom-0 left-0 flex w-full rounded-b-2xl p-4">
        {!isHidePrev() && (
          <Button
            className="mr-auto"
            variant="secondary"
            onClick={handlePrevClick}
            disabled={isHidePrev()}
          >
            Previous
          </Button>
        )}

        {/* JUST FOR TESTING REMOVE BEFORE PROD */}
        {/* <Button
          className="!border-white !bg-white text-gray-50 hover:!text-gray-200"
          variant="secondary"
          onClick={() => {
            setStep(step + 1);
          }}
        >
          Next
        </Button> */}
        {/* ------ */}

        {!isHideNext() &&
          (children[step].props.nextButton ? (
            children[step].props.nextButton
          ) : (
            <Button
              className={classNames(canPrev ? "ml-auto" : "mx-auto")}
              variant="secondary"
              onClick={handleNextClick}
              disabled={isNextDisabled()}
            >
              Next
            </Button>
          ))}
      </div>
    </div>
  );
};
