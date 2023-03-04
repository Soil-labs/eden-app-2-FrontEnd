import { gql, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import { RefObject, useEffect, useRef, useState } from "react";

import { edgeSettingsPreset } from "../../../../g6/GraphVisual/data/edgeSettingsPreset";
import { nodeSettingsPreset } from "../../../../g6/GraphVisual/data/nodeSettingsPreset";
import { Graph } from "../../../../g6/GraphVisual/settings/interfaceGraph";
import { backendGraphToVisualGraph } from "../utils/helperFunctions";

const GraphVisual2 = dynamic(
  () => import("@eden/package-ui/g6/GraphVisual2/GraphVisual2"),
  {
    ssr: false,
  }
);

const FIND_MEMBER_GRAPH = gql`
  query ($fields: findMemberGraphInput!) {
    findMemberGraph(fields: $fields) {
      nodesVisual {
        _id
        name
        type
        avatar
        fakeID
        originalNode
        extraDistanceRation
        style {
          fill
          stroke
          size
        }
      }
      edges {
        source
        target
        distanceRation
        style {
          fill
          stroke
          distance
          strength
        }
      }
    }
  }
`;

export interface IMemberGraphProps {
  memberId: string;
}

export const MemberGraph = ({ memberId }: IMemberGraphProps) => {
  const refContainer = useRef<HTMLDivElement>();

  const [data, setData] = useState<Graph>({
    nodes: [{ id: "node1", size: 50 }],
    edges: [],
  });
  const [width, setWidth] = useState<number>(0);

  const [dataGraphAPI, setDataGraphAPI] = useState<any>(undefined);

  const {} = useQuery(FIND_MEMBER_GRAPH, {
    variables: {
      fields: {
        memberID: memberId,
        showAvatar: true,
        nodeSettings: [
          nodeSettingsPreset["Member"]["main"],
          nodeSettingsPreset["sub_typeProject"]["main"],
          nodeSettingsPreset["typeProject"]["main"],
          nodeSettingsPreset["sub_expertise"]["main"],
          nodeSettingsPreset["expertise"]["main"],
          nodeSettingsPreset["skill"]["main"],
        ],
        edgeSettings: [
          // ------ split sub_typeProject|Member -------
          edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
          edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          edgeSettingsPreset["typeProject|Member"]["edge"],
          // ------ split sub_typeProject|Member -------

          // ------ split skill|Member -------
          edgeSettingsPreset["skill|Member"]["doubleSplitEdge"],
          // edgeSettingsPreset["skill|Member"]["edge"],
          edgeSettingsPreset["skill|sub_expertise"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // ------ split skill|Member -------

          // ------ split sub_expertise|Member -------
          edgeSettingsPreset["sub_expertise|Member"]["expertise"],
          edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          edgeSettingsPreset["expertise|Member"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // ------ split sub_expertise|Member -------

          // //  ------ Create Far Distance between member and project ------
          edgeSettingsPreset["expertise|expertise"]["hiddenEdge"],
          // edgeSettingsPreset["typeProject|sub_expertise"]["hiddenEdge"],
          edgeSettingsPreset["expertise|typeProject"]["hiddenEdge"],
          // edgeSettingsPreset["Project|expertise"]["hiddenEdge"],
          // edgeSettingsPreset["Projet|typeProject"]["hiddenEdge"],
          // edgeSettingsPreset["expertise|expertise"]["hiddenEdge"],
          // // edgeSettingsPreset["Project|Member"]["hiddenEdge"],
          // edgeSettingsPreset["typeProject|expertise"]["hiddenEdge"],
          // //  ------ Create Far Distance between member and project ------
        ],
      },
    },
    skip: !memberId,
    context: { serviceName: "soilservice" },
    onCompleted: (data) => {
      if (data) {
        setDataGraphAPI(data.findMemberGraph);
      }
    },
  });

  // ----------- Update the Graph Visual ----------
  useEffect(() => {
    if (dataGraphAPI) {
      const resNodeData = backendGraphToVisualGraph(dataGraphAPI, true, false);

      setData({
        nodes: resNodeData.nodes,
        edges: resNodeData.edges,
      });
    }
  }, [dataGraphAPI]);
  // ----------- Update the Graph Visual ----------

  useEffect(() => {
    const getwidth = () => {
      setWidth(refContainer.current?.offsetWidth!);
    };

    // when the component gets mounted
    setWidth(refContainer.current?.offsetWidth!);

    // to handle page resize
    window.addEventListener("resize", getwidth);
    // remove the event listener before the component gets unmounted
    return () => window.removeEventListener("resize", getwidth);
  }, []);
  console.log("dorothino = ");

  const [graph2, setGraph2] = useState<any>();

  return (
    <>
      {/* {refContainer && ( */}
      <div
        className="h-full w-full"
        ref={refContainer as RefObject<HTMLDivElement>}
      >
        {data && data.nodes && data.nodes.length > 0 ? (
          <GraphVisual2
            data2={data}
            width={width}
            height={refContainer.current?.offsetHeight!}
            hasMenu={false}
            graph2={graph2}
            setGraph2={setGraph2}
          />
        ) : (
          <p>Dont have Graph Data Yet</p>
        )}
      </div>
      {/* )} */}
    </>
  );
};
