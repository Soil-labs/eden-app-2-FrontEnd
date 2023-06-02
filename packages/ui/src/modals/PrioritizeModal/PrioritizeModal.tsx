import {
  BatteryStepper,
  Button,
  Modal,
  RangeSlider,
  TextBody,
  TextHeading3,
  Tooltip,
  UserAttributeChart,
} from "@eden/package-ui";
import { useEffect, useState } from "react";

export type SkillsType =
  | "experience"
  | "accountability"
  | "skillMatch"
  | "availability";

const SKILLS: { name: SkillsType; tooltip: string; displayName: string }[] = [
  {
    name: "experience",
    displayName: "Experience",
    tooltip:
      "Allocating more points to ‘experience’ will prioritize matches who have proven track of record.",
  },
  {
    name: "accountability",
    displayName: "Accountability",
    tooltip:
      "Accountability is a complex atribute that combines previous experiences, collaborations and endorsements.",
  },
  {
    name: "skillMatch",
    displayName: "Skill Match",
    tooltip:
      "Skill match is an exact match between the sills you requested and one that caontributor possess.",
  },
  {
    name: "availability",
    displayName: "Availability",
    tooltip:
      "Allocating more points to ‘availability’ ensures you get matches, who can contribute most ammount of hours.",
  },
];

export interface PrioritizeModalProps {
  openModal?: boolean;
  onClose: () => void;
  battery?: boolean;
  numMatches?: number | string;
  batteryPercentage?: number;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: {
    experience: number;
    accountability: number;
    skillMatch: number;
    availability: number;
  }) => void;
}

export const PrioritizeModal = ({
  onClose,
  battery = false,
  batteryPercentage = 75,
  openModal,
  onSubmit,
  numMatches,
}: PrioritizeModalProps) => {
  const [range, setRange] = useState({
    experience: 20,
    accountability: 20,
    skillMatch: 20,
    availability: 20,
  });
  const [remaining, setRemaining] = useState(400);

  const handlePrioritized = (skill: string, range: number) => {
    setRange((prevState) => ({ ...prevState, [skill]: range }));
  };

  useEffect(() => {
    const remaining = Object.values(range).reduce((prev, curr) => {
      return prev - curr;
    }, 400);

    setRemaining(remaining);
  }, [range, remaining]);

  return (
    <Modal open={openModal} closeOnEsc={false}>
      <div>
        <div className="flex justify-between">
          <div className="flex-1">
            <TextHeading3>Let me get your priorities straight.</TextHeading3>
            <TextBody className={`font-medium text-gray-500`}>
              On a scale from 0 to 100, how would you rate the importance to
              each attribute
            </TextBody>
          </div>

          {battery && (
            <BatteryStepper
              batteryPercentage={batteryPercentage}
              numMatches={numMatches}
            />
          )}
        </div>

        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-1 my-8 ml-4 flex w-full max-w-md flex-col justify-center">
            {SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="relative flex flex-wrap items-baseline justify-between"
              >
                <Tooltip className="-left-5 -top-3 h-5 w-5 text-gray-500 md:absolute">
                  {skill.tooltip}
                </Tooltip>
                <TextBody>{skill.displayName}</TextBody>
                <RangeSlider
                  defaultValue={range[skill.name]}
                  showNumbers
                  max={range[skill.name] + remaining}
                  className="max-w-xs"
                  onChange={(val) => handlePrioritized(skill.name, val)}
                />
              </div>
            ))}
          </div>
          <div className="col-span-1">
            <UserAttributeChart
              positions={[
                {
                  positionInfo: {
                    attributes: range,
                    discordName: "priorities",
                  },
                },
              ]}
            />
          </div>
        </section>
        <div className="flex justify-between">
          <Button radius="rounded" variant={`secondary`} onClick={onClose}>
            Skip
          </Button>
          <Button
            radius="rounded"
            variant={`secondary`}
            onClick={() => onSubmit(range)}
          >
            Next
          </Button>
        </div>
      </div>
    </Modal>
  );
};
