import { useQuery } from "@apollo/client";
import { FIND_NODES } from "@eden/package-graphql";
import { Node } from "@eden/package-graphql/generated";
import {
  Badge,
  Button,
  Loading,
  Modal,
  SelectBoxNode,
  TextHeading2,
  TextHeading3,
} from "@eden/package-ui";
import { forEach, isEmpty, map } from "lodash";
import { useEffect, useState } from "react";

export interface ISelectNodesModalProps {
  openModal?: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (val: string[] | null) => void;
  welcomeMessage?: string;
  title?: string;
  subTitle?: string;
  nodeType?: "typeProject" | "expertise";
  submitButtonLabel?: string;
}

export const SelectNodesModal = ({
  openModal,
  onClose,
  onSubmit,
  welcomeMessage,
  title,
  nodeType,
  submitButtonLabel = `Finished`,
}: ISelectNodesModalProps) => {
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: Node[];
  }>({});
  const [selectedNodes, setSelectedNodes] = useState<string[] | null>(null);

  const { data: dataNodes } = useQuery(FIND_NODES, {
    variables: {
      fields: {
        node: nodeType,
      },
    },
    skip: !nodeType,
  });

  if (dataNodes?.findNodes) console.log("dataNodes", dataNodes?.findNodes);

  useEffect(() => {
    if (selectedItems) {
      const selectedNodeId: string[] = [];

      // console.log("selectedItems", selectedItems);

      forEach(selectedItems, (el) => {
        if (!isEmpty(el)) {
          forEach(el, (item) => {
            selectedNodeId.push(item?._id as string);
          });
        }
      });
      setSelectedNodes(selectedNodeId);
    }
  }, [selectedItems]);

  const handleFinish = () => {
    onSubmit && onSubmit(selectedNodes as any);
  };

  return (
    <Modal open={openModal} closeOnEsc={false} onClose={onClose}>
      <div>
        <div className={`mb-12 flex justify-between`}>
          <div>
            <div className="flex justify-between">
              <div className="flex-1">
                <TextHeading2>{welcomeMessage}</TextHeading2>
                <TextHeading3>{title}</TextHeading3>
              </div>
            </div>
            <section className="mt-4">
              <div className={`h-24`}>
                {map(selectedItems, (el, key) => {
                  return (
                    <div key={key} className={`flex flex-wrap`}>
                      {map(el, (item) => {
                        return (
                          <div
                            key={item?._id}
                            className={`mr-2 mb-2 flex items-center`}
                          >
                            <Badge
                              text={item?.name || ""}
                              colorRGB={`209,247,196`}
                              className={`font-Inter text-sm`}
                              // closeButton={true}
                              onClose={() => {
                                const newSelectedItems = { ...selectedItems };

                                newSelectedItems[key] = newSelectedItems[
                                  key
                                ].filter((el) => el._id !== item?._id);
                                setSelectedItems(newSelectedItems);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div className="my-8 ml-4 flex h-52 w-full flex-wrap justify-center gap-2">
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
                            console.log("val", val);
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

        <div className="flex justify-between">
          <div></div>
          <Button radius="rounded" variant={`secondary`} onClick={handleFinish}>
            {submitButtonLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
