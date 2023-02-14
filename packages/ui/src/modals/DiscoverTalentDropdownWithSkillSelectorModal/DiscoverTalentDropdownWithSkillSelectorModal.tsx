import { Maybe, Node } from "@eden/package-graphql/generated";
import {
  BatteryStepper,
  Button,
  Modal,
  NodesSearchSkill,
  SelectNodes,
  TextBody,
  TextHeading3,
} from "@eden/package-ui";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Data = {
  _id: string;
  title: string;
  battery?: boolean;
  subtitle?: string;
  hideSkip?: boolean;
  numMatches?: string;
  itemsTitle?: string;
};

export interface IDiscoverTalentDropdownWithSkillSelectorModalProps {
  openModal?: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (val: string[]) => void;
  title?: string;
  subTitle?: string;
  nodeType?: "expertise" | "typeProject";
  matchType?: string;
  previousValues?: string[];
  batteryPercentage?: number;
}

export const DiscoverTalentDropdownWithSkillSelectorModal = ({
  onClose,
  openModal,
  onSubmit,
  title = `Alright, tell me who should I find to help you with your project?`,
  subTitle = `Please pick only one role for now!`,
  nodeType,
  // eslint-disable-next-line no-unused-vars
  previousValues,
  batteryPercentage,
}: IDiscoverTalentDropdownWithSkillSelectorModalProps) => {
  // console.log("hackathon talent dropdown modal", dataNodes);
  const section: Data = useMemo(
    () => ({
      _id: "main",
      title: title
        ? title
        : "Alright, tell me who should I find to help you with your project?",
      subtitle: subTitle ? subTitle : "Please pick only one role for now!",
      battery: true,
      itemsTitle: "Focus On:",
    }),
    [title, subTitle]
  );

  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [showAdvancedSkill, setShowAdvancedSkill] = useState<boolean>(false);
  const [skillsNodes, setSkillsNodes] = useState<any[]>([]);

  const handleNext = () => {
    if (selectedNodes.length === 0) {
      toast.error("You should at least choose on of the items before proceed");
    } else {
      if (onSubmit) {
        const _mappedNodes: Node[] = skillsNodes.map(
          (_node: any) =>
            ({
              _id: _node.skillInfo.subSubNodeID,
              node: "sub_skill",
            } as Node)
        );

        debugger;
        onSubmit!(
          [...selectedNodes, ..._mappedNodes].map((_node) => _node._id!)
        );
      } else onClose!();
    }
  };

  useEffect(() => {
    console.log("nodes", skillsNodes);
  }, [skillsNodes]);

  const handleSetNodes = (value: Maybe<Node | undefined>[]) => {
    setSelectedNodes(value as Node[]);
  };

  return (
    <Modal open={openModal} closeOnEsc={false}>
      {section && (
        <div>
          <div className={`mb-12 flex justify-between`}>
            <div>
              <div className="flex justify-between">
                <div className="flex-1">
                  <TextHeading3>{section?.title}</TextHeading3>
                  <TextBody className={`font-medium text-gray-500`}>
                    {section?.subtitle}
                  </TextBody>
                </div>
              </div>
              <section className="mt-4">
                <div>
                  <TextHeading3>{section?.itemsTitle}</TextHeading3>
                </div>

                <SelectNodes
                  nodeType={nodeType as string}
                  selectedNodes={selectedNodes.map((_node) => ({
                    nodeData: _node,
                  }))}
                  onChangeNodes={(val) => {
                    // console.log("on change", val);
                    handleSetNodes(val);
                  }}
                />
                <div
                  className={`flex justify-center items-center mt-5 mx-auto w-9/12 ${
                    showAdvancedSkill && "mb-52"
                  }`}
                >
                  {!showAdvancedSkill && (
                    <button
                      className="cursor-pointer text-gray-500 hover:text-gray-700 underline"
                      onClick={() => setShowAdvancedSkill((prev) => !prev)}
                    >
                      Show Advanced Skill
                    </button>
                  )}
                  {showAdvancedSkill && (
                    <NodesSearchSkill
                      skills={skillsNodes}
                      setSkills={(val: any) => {
                        setSkillsNodes(val);
                      }}
                    />
                  )}
                </div>
              </section>
            </div>
            <div>
              {section?.battery && (
                <BatteryStepper
                  batteryPercentage={batteryPercentage || 0}
                  // batteryPercentage={Math.min(
                  //   (batteryPercentage || 0) + selectedNodes.length * 5,
                  //   30
                  // )}
                  showPercentage
                />
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <Button radius="rounded" variant={`secondary`} onClick={onClose}>
                Skip
              </Button>
            </div>
            <Button radius="rounded" variant={`secondary`} onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};