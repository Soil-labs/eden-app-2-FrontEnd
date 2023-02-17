/* eslint-disable no-unused-vars */
import {
  LevelEnum,
  Maybe,
  // eslint-disable-next-line camelcase
} from "@eden/package-graphql/generated";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosAdd } from "react-icons/io";

import { Button } from "../../elements";

type LevelType = {
  title: string;
  level: string;
};

type skillType = {
  skillInfo: {
    nodeID: string;
    subNodeID: string;
    subSubNodeID: string;
  };
  level: Maybe<LevelEnum> | undefined;
};

export interface SkillSelectorProps {
  levels?: LevelType[];
  setSelected: (value: string | null) => void;
  setSkills: (value: any) => void;
  // eslint-disable-next-line camelcase
  skills: skillType[] | undefined;
  item: any;
  selected: string | null;
  isOpen: boolean | undefined;
  setIsOpen: (value: boolean) => void;
  subSelectedId: string | null;
  subSubSelectedId: string | null;
}

export const SkillSelector = ({
  levels,
  setSelected,
  setSkills,
  skills,
  item,
  selected,
  isOpen,
  setIsOpen,
  subSelectedId,
  subSubSelectedId,
}: SkillSelectorProps) => {
  return (
    <motion.div
      layout
      transition={{ duration: 0.3 }}
      onClick={() => {
        if (
          skills!.filter((s) => s?.skillInfo?.subSubNodeID === item._id)
            .length > 0
        ) {
          return;
        } else {
          setSelected(item._id);
          setIsOpen(true);
          if (selected) {
            setSelected(null);
            //   // setIsOpen(false);
          }
        }
      }}
      key={item._id}
      className="border-b-[1px] border-[#EDF2F7]"
    >
      <motion.div
        style={{ background: "rgba(137, 213, 255, 0.1)" }}
        className="group flex w-full cursor-pointer items-center justify-between py-3 px-5"
        onClick={() => {
          if (
            !levels &&
            skills!.filter((s: any) => s?.skillInfo?.subSubNodeID === item._id)
              .length === 0
          ) {
            setSkills([
              ...skills!,
              {
                skillInfo: {
                  nodeID: subSubSelectedId,
                  subNodeID: subSelectedId,
                  subSubNodeID: item._id,
                },
                level: null,
              },
            ]);
          }

          // setIsOpen(false);
          setSelected(null);
        }}
      >
        <motion.span
          layout
          className=" px-2 text-sm text-slate-700 group-hover:text-slate-500"
        >
          {item.name}
        </motion.span>
        <motion.div layout>
          {skills!.filter((s: any) => s?.skillInfo?.subSubNodeID === item._id)
            .length > 0 ? (
            <CheckCircleIcon color="rgb(116, 250, 109)" width={24} />
          ) : (
            <IoIosAdd size="1.5rem" />
          )}
        </motion.div>
      </motion.div>

      {levels && isOpen && selected === item._id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: "rgba(137, 213, 255, 0.1)" }}
          className="user-select-none ml-2 px-4 pt-1 pb-2"
        >
          <motion.p className="mb-1 text-xs font-medium text-slate-500">
            SKILL LEVEL
          </motion.p>
          <motion.div className="-ml-1 flex gap-2">
            {levels!.map((level, index) => (
              <Button
                key={index}
                className="text-xs transition-all duration-200 ease-out hover:scale-110 hover:border-blue-500 hover:font-bold hover:text-blue-800"
                size="sm"
                style={{ background: "rgba(137, 213, 255, 0.15)" }}
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    skills!.filter(
                      (s: any) => s?.skillInfo?.subSubNodeID === item._id
                    ).length === 0
                  ) {
                    setSkills([
                      ...skills!,
                      {
                        skillInfo: {
                          nodeID: subSubSelectedId,
                          subNodeID: subSelectedId,
                          subSubNodeID: item._id,
                        },
                        level: level.level,
                      },
                    ]);
                  }
                  // setIsOpen(false);
                  setSelected(null);
                }}
                variant="secondary"
              >
                {level.title.toUpperCase()}
              </Button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
