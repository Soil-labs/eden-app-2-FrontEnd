import { useQuery } from "@apollo/client";
import { FIND_NODES } from "@eden/package-graphql";
import { Maybe, Node, NodesType } from "@eden/package-graphql/generated";
import { Loading } from "@eden/package-ui";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";

import { SelectNodesBox } from "../SelectNodesBox";

export interface ISelectNodesProps {
  selectedNodes?: Maybe<Maybe<NodesType>[]>;
  nodeType: string;
  // onChangeNodeID?: React.Dispatch<React.SetStateAction<string[]>>;
  // eslint-disable-next-line no-unused-vars
  onChangeNodes?: (val: Maybe<Node | undefined>[]) => void;
  onChange?: React.Dispatch<
    React.SetStateAction<Maybe<NodesType | undefined>[]>
  >;
}

export const SelectNodes = ({
  selectedNodes = [],
  nodeType,
  // onChangeNodeID,
  onChangeNodes,
  onChange,
}: ISelectNodesProps) => {
  const [nodes, setNodes] = useState<Maybe<Node | undefined>[]>(
    selectedNodes?.map((node) => node?.nodeData) || []
  );

  const { data: nodesData } = useQuery(FIND_NODES, {
    variables: {
      fields: {
        node: nodeType,
      },
    },
    skip: !nodeType,
  });

  useEffect(() => {
    if (onChangeNodes) onChangeNodes(nodes);

    onChange &&
      onChange(
        nodes.map((node) => {
          return {
            nodeData: node,
          };
        })
      );
  }, [nodes]);

  return (
    <div className="flex w-full flex-wrap justify-center gap-1">
      {/* ----{JSON.stringify(nodes)}---- */}
      {nodesData?.findNodes ? (
        !isEmpty(nodesData) &&
        nodesData?.findNodes?.map((item: Node, index: number) => {
          const _selectedNodes = nodes!.filter((node) =>
            node!?.aboveNodes?.some((aboveNode) => aboveNode?._id === item._id)
          );

          return (
            <SelectNodesBox
              multiple
              key={index}
              defaultValues={_selectedNodes}
              caption={item?.name || ""}
              items={item?.subNodes}
              onChange={(val: Maybe<Node | undefined>[]) => {
                if ((onChange || onChangeNodes) && nodes) {
                  let _newNodes = [
                    ...nodes.filter((node) => {
                      return !(
                        node?.node?.includes(nodeType) &&
                        node.aboveNodes!.some(
                          (_node) => _node?._id === item._id
                        )
                      );
                    }),
                  ];

                  val.forEach((node) => {
                    if (_newNodes.some((_node) => node?._id === _node?._id)) {
                      _newNodes = _newNodes.filter(
                        (_node) => node?._id === _node?._id
                      );
                    } else {
                      _newNodes = [..._newNodes, node];
                    }
                  });

                  setNodes(_newNodes);
                }
              }}
            />
          );
        })
      ) : (
        <Loading />
      )}
    </div>
  );
};
