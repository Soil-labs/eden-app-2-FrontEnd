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

const DYNAMIC_SEARCH_GRAPH = gql`
  query ($fields: dynamicSearchGraphInput!) {
    dynamicSearchGraph(fields: $fields) {
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

export interface IDynamicSearchGraphProps {
  nodesID: [string];
}

export const DynamicSearchGraph = ({ nodesID }: IDynamicSearchGraphProps) => {
  const refContainer = useRef<HTMLDivElement>();

  const [data, setData] = useState<Graph>({
    nodes: [{ id: "node1", size: 50 }],
    edges: [],
  });
  const [width, setWidth] = useState<number>(0);

  const [dataGraphAPI, setDataGraphAPI] = useState<any>(undefined);

  const {} = useQuery(DYNAMIC_SEARCH_GRAPH, {
    variables: {
      fields: {
        // nodesID: ["63eaefc44862b62edc3037b4", "63eaefebdf71c82f61c177eb"],
        nodesID: nodesID,
        showAvatar: true,

        nodeSettings: [
          nodeSettingsPreset["dynamicSearch"]["main"],
          nodeSettingsPreset["sub_typeProject"]["main"],
          nodeSettingsPreset["typeProject"]["main"],
          nodeSettingsPreset["sub_expertise"]["main"],
          nodeSettingsPreset["expertise"]["main"],
        ],
        edgeSettings: [
          // // ------ split sub_typeProject|dynamicSearch -------
          edgeSettingsPreset["sub_typeProject|dynamicSearch"]["typeProject"],
          edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          edgeSettingsPreset["typeProject|dynamicSearch"]["edge"],
          // // ------ split sub_typeProject|dynamicSearch -------

          // ------ split sub_expertise|dynamicSearch -------
          // edgeSettingsPreset["sub_expertise|dynamicSearch"]["edge"],
          edgeSettingsPreset["sub_expertise|dynamicSearch"]["expertise"],
          edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          edgeSettingsPreset["expertise|dynamicSearch"]["edge"],
          // ------ split sub_expertise|dynamicSearch -------

          // //  ------ Create Far Distance between member and project ------
          // edgeSettingsPreset["dynamicSearch|sub_expertise"]["hiddenEdge"],
          edgeSettingsPreset["expertise|expertise"]["hiddenEdge"],
          edgeSettingsPreset["expertise|typeProject"]["hiddenEdge"],
          // //  ------ Create Far Distance between member and project ------
        ],
      },
    },
    skip: nodesID == undefined,
    // skip: selectedOption !== "Option 8",
    context: { serviceName: "soilservice" },
    onCompleted: (data) => {
      if (data) {
        setDataGraphAPI(data.dynamicSearchGraph);
      }
    },
  });

  // ----------- Update the Graph Visual ----------
  useEffect(() => {
    if (dataGraphAPI) {
      const resNodeData = backendGraphToVisualGraph(dataGraphAPI, true, true);

      setData({
        nodes: resNodeData.nodes,
        edges: resNodeData.edges,
      });
    }
  }, [dataGraphAPI]);
  // ----------- Update the Graph Visual ----------

  // ----------- Update the Hight/Width of the Graph Visual ----------
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
  // ----------- Update the Hight/Width of the Graph Visual ----------

  const [graph2, setGraph2] = useState<any>();

  return (
    <>
      {refContainer && (
        <div
          className="h-[540px] w-full"
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
      )}
    </>
  );
};
