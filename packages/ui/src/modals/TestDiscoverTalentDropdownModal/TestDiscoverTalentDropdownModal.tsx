import { gql, useQuery } from "@apollo/client";
import { Node } from "@eden/package-graphql/generated";
import {
  Button,
  Loading,
  // Modal,
  SelectBoxNode,
  TextBody,
  TextHeading3,
} from "@eden/package-ui";
import { forEach, isEmpty, map } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const FIND_NODES = gql`
  query ($fields: findNodesInput) {
    findNodes(fields: $fields) {
      _id
      name
      subNodes {
        _id
        name
      }
    }
  }
`;

type Data = {
  _id: string;
  title: string;
  battery?: boolean;
  subtitle?: string;
  hideSkip?: boolean;
  numMatches?: string;
};

export interface ITestDiscoverTalentDropdownModalProps {
  openModal?: boolean;
  // eslint-disable-next-line no-unused-vars
  onNext?: (val: string[], valNames: string[]) => void;
  onPrev?: () => void;
  title?: string;
  subTitle?: string;
  nodeType?: "expertise" | "typeProject";
  matchType?: string;
  batteryPercentage?: number;
}

export const TestDiscoverTalentDropdownModal = ({
  openModal,
  onNext,
  // onPrev,
  title = `Your role`,
  subTitle = ``,
  nodeType,
}: // batteryPercentage,
ITestDiscoverTalentDropdownModalProps) => {
  // console.log("hackathon talent dropdown modal", dataNodes);
  const section: Data = useMemo(
    () => ({
      _id: "main",
      title: title ? title : "Your role",
      subtitle: subTitle ? subTitle : ``,
      battery: true,
    }),
    [title]
  );

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: Node[];
  }>({});
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const [numMatches, setNumMatches] = useState(137);

  const { data: dataNodes } = useQuery(FIND_NODES, {
    variables: {
      fields: {
        node: nodeType,
      },
    },
    skip: !nodeType,
  });

  // if (dataNodes?.findNodes) console.log("dataNodes", dataNodes?.findNodes);

  const handleNext = () => {
    if (numMatches === 0) {
      toast.error("You should at least choose on of the items before proceed");
    } else {
      if (onNext) onNext!(selectedNodes, selectedNames);
    }
  };

  // const handleBack = () => {
  //   if (onPrev) onPrev!();
  // };

  useEffect(() => {
    const _numMatches = numMatches;

    if (_numMatches) setNumMatches(_numMatches);
  }, [numMatches, selectedItems]);

  useEffect(() => {
    if (selectedItems) {
      const selectedNodeId: string[] = [];
      const selectedNodeNames: string[] = [];

      forEach(selectedItems, (el) => {
        if (!isEmpty(el)) {
          forEach(el, (item) => {
            selectedNodeId.push(item?._id as string);
            selectedNodeNames.push(item?.name as string);
          });
        }
      });
      setSelectedNodes(selectedNodeId);
      setSelectedNames(selectedNodeNames);
    }
  }, [selectedItems]);

  return (
    <>
      {openModal && section && (
        <div>
          <div className={`mb-12 mt-5 flex`}>
            <div className="w-full">
              <div className="flex-1 pb-4 text-center">
                <TextHeading3>{section?.title}</TextHeading3>
              </div>

              <TextBody
                className={`py-2 text-center font-medium text-gray-500`}
              >
                {section?.subtitle}
              </TextBody>
              <section className="w-full  pt-7">
                <div className="my-8 ml-4 flex h-10 w-full flex-wrap justify-center gap-2">
                  {dataNodes?.findNodes ? (
                    <>
                      {!isEmpty(dataNodes?.findNodes) &&
                        map(dataNodes?.findNodes, (item: any, key: number) => (
                          <SelectBoxNode
                            multiple
                            key={key}
                            caption={item?.name}
                            items={item?.subNodes}
                            onChange={(val) => {
                              setSelectedItems((prevState) => ({
                                ...prevState,
                                [item?._id]: val,
                              }));
                            }}
                          />
                        ))}
                    </>
                  ) : (
                    <Loading />
                  )}
                </div>
              </section>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button radius="rounded" variant={`secondary`} onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
