import { Maybe, PreviousProjectsType } from "@eden/package-graphql/generated";
import { Calendar, TextArea, TextField, TextHeading3 } from "@eden/package-ui";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

const INITIAL_DATA = {
  title: "",
  skills: [],
  startDate: "",
  endDate: "",
  description: "",
};

export interface IUserExperienceCardProps {
  background?: Maybe<Maybe<PreviousProjectsType>[]>;
  // eslint-disable-next-line no-unused-vars
  handleSubmit?: (val: any) => void;
  // eslint-disable-next-line no-unused-vars
  handleChange?: (val: any) => void;
  // eslint-disable-next-line no-unused-vars
  handleChangeOpenExperience?: (val: any) => void;
}

export const UserExperienceCard = ({
  background = [{ ...INITIAL_DATA }, { ...INITIAL_DATA }, { ...INITIAL_DATA }],
  // eslint-disable-next-line no-unused-vars
  handleSubmit,
  handleChange,
  handleChangeOpenExperience,
}: IUserExperienceCardProps) => {
  const [experiences, setExperiences] = useState(background);
  const [experienceOpen, setExperienceOpen] = useState<number | null>(null);

  const handleAddExperience = () => {
    setExperiences([...(experiences || []), { ...INITIAL_DATA }]);
  };
  const handleOpenExperience = (index: number, open: boolean) => {
    setExperienceOpen(open ? index : null);
  };

  useEffect(() => {
    if (handleChange) handleChange(experiences);
  }, [experiences]);

  useEffect(() => {
    if (handleChangeOpenExperience) handleChangeOpenExperience(experienceOpen);
  }, [experienceOpen]);

  return (
    <div className="">
      <TextHeading3 className="mb-2 w-full text-left text-lg">
        Share most Important experience!
      </TextHeading3>
      <p className="mb-4 text-slate-400">
        A ⭐️ marks your top 2 most relevant experiences
      </p>
      <p className="mb-4 flex text-slate-600">
        <span className="ml-8">What did you do?</span>
        <span className="ml-24">Where did you do it?</span>
      </p>
      {experiences?.map((item, index) => (
        <ExperienceForm
          key={index}
          open={experienceOpen === index}
          handleOpen={(open: boolean) => {
            handleOpenExperience(index, open);
          }}
          handleChange={(val: any) => {
            setExperiences((prev) => {
              const newExperiences = [...(prev || [])];

              newExperiences[index] = val;
              return newExperiences;
            });
          }}
          relevant={index < 2}
          defaultValue={experiences[index]}
        />
      ))}
      <div className="flex justify-center">
        <PlusCircleIcon
          width={34}
          height={34}
          className="cursor-pointer text-slate-600  hover:text-slate-400"
          onClick={handleAddExperience}
        />
      </div>
    </div>
  );
};

const ExperienceForm = ({
  defaultValue,
  open = false,
  handleOpen,
  handleChange,
  relevant = false,
}: {
  defaultValue?: Maybe<PreviousProjectsType>;
  open?: boolean;
  // eslint-disable-next-line no-unused-vars
  handleOpen?: (open: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  handleChange?: (val: any) => void;
  relevant?: boolean;
}) => {
  const [val, setVal] = useState<PreviousProjectsType>({
    title: defaultValue?.title,
    description: defaultValue?.description,
    startDate: defaultValue?.startDate,
    endDate: defaultValue?.endDate,
  });
  const [role, setRole] = useState<string[]>([
    defaultValue?.title?.split(" in ")[0] || "",
    defaultValue?.title?.split(" in ")[1] || "",
  ]);

  useEffect(() => {
    if (handleChange) handleChange(val);
  }, [val]);

  useEffect(() => {
    if (role[0] && !role[1]) {
      setVal({ ...val, title: role[0] });
    } else if (role[0] && role[1]) {
      setVal({ ...val, title: `${role[0]} in ${role[1]}` });
    } else if (!role[0] && role[1]) {
      setRole(["", ""]);
      setVal({ ...val, title: "" });
    } else if (!role[0] && !role[1]) {
      setVal({ ...val, title: "" });
    }

    if (handleOpen && role[0].length > 0 && !open) {
      handleOpen(true);
    }
  }, [role]);

  return (
    <div className="mb-2">
      <div className="flex items-center">
        <span
          className={`mr-3 ${
            !role[0] ? "cursor-default text-slate-400" : "cursor-pointer"
          }`}
          onClick={() => {
            if (!role[0]) return;
            if (handleOpen) handleOpen(!open);
          }}
        >
          {open ? "▼" : "▶"}
        </span>
        <div className="flex items-center gap-3">
          <div className="w-48">
            <TextField
              defaultValue={role[0]}
              placeholder="Type your role"
              onChange={(e) => setRole([e.target.value, role[1]])}
              className="h-8 !rounded-full"
            />
          </div>
          <span>x</span>
          <div className="w-48">
            <TextField
              defaultValue={role[1]}
              placeholder="Company/project/DAO"
              onChange={(e) => setRole([role[0], e.target.value])}
              className="h-8 !rounded-full"
            />
          </div>
        </div>
        {relevant && <span className="ml-3 text-xl">⭐️</span>}
      </div>
      {open && (
        <div className="mb-4 grid w-full grid-cols-2 gap-8 border-b border-b-gray-300 pb-4 pt-4">
          <div>
            <p className="mb-3 w-full text-left text-sm font-medium">
              Description: {`(optional)`}
            </p>
            <TextArea
              rows={5}
              name="description"
              placeholder="Start typing here..."
              onChange={(e) => setVal({ ...val, description: e.target.value })}
              value={defaultValue?.description || ""}
            />
          </div>

          <div>
            <div>
              <div className="mt-3">
                <p className="mb-3 w-full text-left text-sm font-medium">
                  Timeline: {`(optional)`}
                </p>
                <Calendar
                  onlyMonthPicker
                  containerClassName="w-full mb-4"
                  buttonClassName="w-full rounded-xl"
                  label="Start Date"
                  onChange={(e) =>
                    setVal({ ...val, startDate: (e.unix * 1000).toString() })
                  }
                />
                <Calendar
                  onlyMonthPicker
                  containerClassName="w-full"
                  buttonClassName="w-full rounded-xl"
                  label="End Date"
                  onChange={(e) => {
                    setVal({ ...val, endDate: (e.unix * 1000).toString() });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
