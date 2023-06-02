import { gql, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import { RefObject, useEffect, useRef, useState } from "react";

import { edgeSettingsPreset } from "../../../../g6/GraphVisual/data/edgeSettingsPreset";
import { nodeSettingsPreset } from "../../../../g6/GraphVisual/data/nodeSettingsPreset";
import { Graph } from "../../../../g6/GraphVisual/settings/interfaceGraph";
import { PercentageAnalysis } from "../../PercentageAnalysis";
import { backendGraphToVisualGraph } from "../utils/helperFunctions";

const GraphVisual = dynamic(
  () => import("@eden/package-ui/g6/GraphVisual/GraphVisual"),
  {
    ssr: false,
  }
);
// const DYNAMIC_SEARCH_TO_MEMBER_GRAPH = gql`
//   query ($fields: dynamicSearchToMemberGraphV2Input!) {
//     dynamicSearchToMemberGraphV2(fields: $fields) {
//       nodesVisual {
//         _id
//         name
//         type
//         comboId
//         avatar
//         fakeID
//         originalNode
//         extraDistanceRation
//         style {
//           fill
//           stroke
//           size
//         }
//       }
//       edges {
//         source
//         target
//         distanceRation
//         style {
//           fill
//           stroke
//           distance
//           strength
//         }
//       }
//       combos {
//         id
//         label
//       }
//     }
//   }
// `;

const DYNAMIC_SEARCH_TO_MEMBER_GRAPH_GPT = gql`
  query ($fields: dynamicSearchToMemberCategoryGroupInput!) {
    dynamicSearchToMemberCategoryGroup(fields: $fields) {
      nodesVisual {
        _id
        name
        type
        comboId
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

export interface IDynamicSearchMemberGraphProps {
  nodesID: string[];
  memberID: string;
  disableZoom?: boolean;
  graphType?: string;
  zoomGraph?: number;
}

export const DynamicSearchMemberGraph = ({
  nodesID,
  memberID,
  disableZoom,
  graphType,
  zoomGraph,
}: IDynamicSearchMemberGraphProps) => {
  const refContainer = useRef<HTMLDivElement>();

  const [data, setData] = useState<Graph>({
    nodes: [{ id: "node1", size: 50 }],
    edges: [],
    combos: [],
  });
  const [width, setWidth] = useState<number>(0);

  const [dataGraphAPI, setDataGraphAPI] = useState<any>(undefined);

  const [nodeSettings, setNodeSettings] = useState<any>([]);
  const [edgeSettings, setEdgeSettings] = useState<any>([]);

  useEffect(() => {
    if (graphType == undefined || graphType == "original_KG") {
      setNodeSettings([
        nodeSettingsPreset["Member"]["main"],
        nodeSettingsPreset["dynamicSearch"]["main"],
        nodeSettingsPreset["sub_typeProject"]["main"],
        nodeSettingsPreset["typeProject"]["main"],
        nodeSettingsPreset["sub_expertise"]["main"],
        nodeSettingsPreset["expertise"]["main"],
      ]);

      setEdgeSettings([
        // ------ split sub_typeProject|dynamicSearch -------
        edgeSettingsPreset["sub_typeProject|dynamicSearch"]["edge"],
        // ------ split sub_typeProject|dynamicSearch -------

        // ------ split skill|Member -------
        edgeSettingsPreset["sub_expertise|Member"]["expertise_close"],
        edgeSettingsPreset["sub_expertise|expertise"]["edge"],
        edgeSettingsPreset["expertise|Member"]["edge"],
        // ------ split skill|Member -------

        // ------ split sub_typeProject|Member -------
        edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
        edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
        edgeSettingsPreset["typeProject|Member"]["edge"],
        // ------ split sub_typeProject|Member -------

        // ------ split sub_expertise|dynamicSearch -------
        edgeSettingsPreset["sub_expertise|dynamicSearch"]["edge_close"],
        // ------ split sub_expertise|dynamicSearch -------

        // //  ------ Create Far Distance between member and project ------
        edgeSettingsPreset["expertise|expertise"]["hiddenEdge"],
        edgeSettingsPreset["Member|dynamicSearch"]["hiddenEdgeFar"],
        // //  ------ Create Far Distance between member and project ------
      ]);
    } else if (graphType == "KG_AI") {
      setNodeSettings([
        nodeSettingsPreset["Combo"]["main"],
        nodeSettingsPreset["Member"]["main"],
        nodeSettingsPreset["Skill"]["smallBlue"],
        nodeSettingsPreset["Expertise"]["smallBlue"],
        nodeSettingsPreset["Role"]["smallBlue"],
        nodeSettingsPreset["dynamicSearch"]["main"],
      ]);

      setEdgeSettings([
        edgeSettingsPreset["dynamicSearch|Role"]["edge"],
        edgeSettingsPreset["dynamicSearch|Skill"]["edge"],
        edgeSettingsPreset["dynamicSearch|Expertise"]["edge"],

        edgeSettingsPreset["Member|Role"]["long"],
        edgeSettingsPreset["Member|Skill"]["long"],
        edgeSettingsPreset["Member|Expertise"]["long"],

        edgeSettingsPreset["Skill|Role"]["edge"],
        edgeSettingsPreset["Skill|Expertise"]["edge"],
        edgeSettingsPreset["Role|Expertise"]["edge"],

        edgeSettingsPreset["Skill|Skill"]["edge"],
        edgeSettingsPreset["Expertise|Expertise"]["edge"],
        edgeSettingsPreset["Role|Role"]["edge"],

        // ----- Combo ------
        edgeSettingsPreset["dynamicSearch|Combo"]["edge"],
        edgeSettingsPreset["Skill|Combo"]["edge"],
        edgeSettingsPreset["Role|Combo"]["edge"],
        edgeSettingsPreset["Expertise|Combo"]["edge"],
        edgeSettingsPreset["Member|Combo"]["edge"],
        // ----- Combo ------

        // //  ------ Create Far Distance between member and project ------
        edgeSettingsPreset["dynamicSearch|Member"]["hiddenEdge"],
        // //  ------ Create Far Distance between member and project ------
      ]);
    } else if (graphType == "KG_AI2") {
      setNodeSettings([
        nodeSettingsPreset["Combo"]["main"],
        nodeSettingsPreset["Member"]["main"],
        nodeSettingsPreset["Skill"]["smallBlue"],
        nodeSettingsPreset["Category"]["smallBlue"],
        nodeSettingsPreset["Group"]["smallBlue"],
        nodeSettingsPreset["dynamicSearch"]["main"],
      ]);

      setEdgeSettings([
        edgeSettingsPreset["dynamicSearch|Role"]["edge"],
        edgeSettingsPreset["dynamicSearch|Skill"]["edge"],
        edgeSettingsPreset["dynamicSearch|Expertise"]["edge"],

        edgeSettingsPreset["Member|Role"]["long"],
        edgeSettingsPreset["Member|Skill"]["long"],
        edgeSettingsPreset["Member|Expertise"]["long"],

        edgeSettingsPreset["Skill|Role"]["edge"],
        edgeSettingsPreset["Skill|Expertise"]["edge"],
        edgeSettingsPreset["Role|Expertise"]["edge"],

        edgeSettingsPreset["Skill|Skill"]["edge"],
        edgeSettingsPreset["Expertise|Expertise"]["edge"],
        edgeSettingsPreset["Role|Role"]["edge"],

        // ----- Combo ------
        edgeSettingsPreset["dynamicSearch|Combo"]["edge"],
        edgeSettingsPreset["Skill|Combo"]["edge"],
        edgeSettingsPreset["Role|Combo"]["edge"],
        edgeSettingsPreset["Expertise|Combo"]["edge"],
        edgeSettingsPreset["Member|Combo"]["edge"],
        // ----- Combo ------

        // //  ------ Create Far Distance between member and project ------
        edgeSettingsPreset["dynamicSearch|Member"]["hiddenEdge"],
        // //  ------ Create Far Distance between member and project ------
      ]);
    }
  }, [data]);

  const {} = useQuery(DYNAMIC_SEARCH_TO_MEMBER_GRAPH_GPT, {
    variables: {
      fields: {
        // nodesID: ["63eaefc44862b62edc3037b4", "63eaefebdf71c82f61c177eb"],
        nodesID: nodesID.slice(0, 10),
        memberID: memberID,
        showAvatar: true,
        nodeSettings: nodeSettings,
        edgeSettings: edgeSettings,
      },
    },
    // skip: nodesID == undefined,
    skip: !memberID || nodeSettings.length == 0 || edgeSettings.length == 0,
    // skip: selectedOption !== "Option 8",
    onCompleted: (data) => {
      if (data) {
        setDataGraphAPI(data.dynamicSearchToMemberCategoryGroup);
      }
    },
  });

  // ----------- Update the Graph Visual ----------
  useEffect(() => {
    if (dataGraphAPI) {
      console.log("dataGraphAPI = ", dataGraphAPI);
      const resNodeData = backendGraphToVisualGraph(dataGraphAPI, true, true);

      setData({
        nodes: resNodeData.nodes,
        edges: resNodeData.edges,
        combos: resNodeData.combos,
      });
    }
  }, [dataGraphAPI]);
  // ----------- Update the Graph Visual ----------

  // ------------------ centerGraph --------------
  const [centerGraph, setCenterGraph] = useState<any>(false);

  useEffect(() => {
    setTimeout(function () {
      setCenterGraph(true); // Start Centering the Graph
    }, 1050);

    setTimeout(function () {
      setCenterGraph(false); // Stop Centering the Graph
    }, 1400);
  }, []);
  // ------------------ centerGraph --------------

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
  const [graph, setGraph] = useState<any>();

  return (
    <>
      <div className=" ml-24 w-9/12">
        <PercentageAnalysis matchingMax={30} tabCategory="skills" />
      </div>
      {refContainer && (
        <div
          className="h-full w-full"
          ref={refContainer as RefObject<HTMLDivElement>}
        >
          {data && data.nodes && data.nodes.length > 0 ? (
            <GraphVisual
              data2={data}
              width={width}
              height={refContainer.current?.offsetHeight!}
              hasMenu={false}
              graph={graph}
              setGraph={setGraph}
              disableZoom={disableZoom}
              centerGraph={centerGraph}
              zoomGraph={zoomGraph}
            />
          ) : (
            <p>Dont have Graph Data Yet</p>
          )}
        </div>
      )}
    </>
  );
};
