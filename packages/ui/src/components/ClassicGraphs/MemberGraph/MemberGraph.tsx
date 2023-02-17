import { gql, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import { RefObject, useEffect, useRef, useState } from "react";

import { edgeSettingsPreset } from "../../../../g6/GraphVisual/data/edgeSettingsPreset";
import { nodeSettingsPreset } from "../../../../g6/GraphVisual/data/nodeSettingsPreset";
import { Graph } from "../../../../g6/GraphVisual/settings/interfaceGraph";

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

const GraphVisual = dynamic(
  () => import("@eden/package-ui/g6/GraphVisual/GraphVisual"),
  {
    ssr: false,
  }
);

export interface IMemberGraphProps {
  memberId: string;
}

export const MemberGraph = ({ memberId }: IMemberGraphProps) => {
  const refContainer = useRef<HTMLDivElement>();
  const settingsGraphs = {
    useAvatar: true,
    updateGraph: false,
    memberID1: memberId,
  };

  const [data, setData] = useState<Graph>({
    nodes: [{ id: "node1", size: 50 }],
    edges: [],
  });
  const [width, setWidth] = useState<number>(0);

  const { data: dataGraphAPImember } = useQuery(FIND_MEMBER_GRAPH, {
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

          // ------ Change edge --------
          // {
          //   ...edgeSettingsPreset["typeProject|Member"]["edge"],
          //   mainEdge: {
          //     ...edgeSettingsPreset["typeProject|Member"]["edge"].mainEdge,
          //     style: {
          //       color: "#C5947C",
          //     },
          //   },
          // },
          // ------ Change edge --------
        ],
      },
    },
    skip: !memberId,
    context: { serviceName: "soilservice" },
  });

  const updateGraph = (settingsGraphNow: any) => {
    const dataGraphAPI = dataGraphAPImember.findMemberGraph;

    console.log("dataGraphAPI = ", dataGraphAPI);
    const nodeDataObj: any = {};
    const edgesDataGraph = dataGraphAPI.edges.map(
      (edge: { source: any; target: any; distanceRation: any; style: any }) => {
        if (!nodeDataObj[edge.source]) {
          nodeDataObj[edge.source] = {
            numberConnections: 1,
          };
        } else {
          nodeDataObj[edge.source].numberConnections += 1;
        }
        if (!nodeDataObj[edge.target]) {
          nodeDataObj[edge.target] = {
            numberConnections: 1,
          };
        } else {
          nodeDataObj[edge.target].numberConnections += 1;
        }
        return {
          source: edge.source,
          target: edge.target,
          distanceRation: edge.distanceRation,
          style: edge.style,
        };
      }
    );

    let nodesDataGraph = dataGraphAPI.nodesVisual.map(
      (node: {
        _id: any;
        name: any;
        type: string;
        avatar: string;
        extraDistanceRation: Number;
        style: any;
      }) => {
        let extraStyle = {};

        if (settingsGraphNow.useAvatar == true && node.avatar != undefined) {
          extraStyle = {
            // ----------- Shwow Avatar User ---------
            type: "image",
            img: node.avatar,
            clipCfg: {
              show: true,
              type: "circle",
              r: 25,
            },
            style: {
              height: 50,
              width: 50,
            },
            // ----------- Shwow Avatar User ---------
          };
        }
        if (settingsGraphNow.useAvatar == false && node.avatar != undefined) {
          extraStyle = {
            // ----------- Shwow Avatar User ---------
            type: node.type,
            // img: "",
            clipCfg: {},
            style: {},
            // ----------- Shwow Avatar User ---------
          };
        }

        return {
          id: node._id,
          label: node.name,
          nodeType: node.type,
          extraDistanceRation: node.extraDistanceRation,
          size: 50,
          numberConnections: nodeDataObj[node._id]
            ? nodeDataObj[node._id].numberConnections
            : 0,
          propertise: {
            name: node.name,
          },
          style: node.style,
          ...extraStyle,
        };
      }
    );

    if (nodesDataGraph.length == 0) {
      nodesDataGraph = [{ id: "node1", size: 50 }];
    }

    setData({
      nodes: nodesDataGraph,
      edges: edgesDataGraph,
    });
  };

  useEffect(() => {
    if (dataGraphAPImember?.findMemberGraph) {
      updateGraph(settingsGraphs);
    }
  }, [dataGraphAPImember?.findMemberGraph]);

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
  return (
    <>
      {refContainer && (
        <div
          className="h-[340px] w-full"
          ref={refContainer as RefObject<HTMLDivElement>}
        >
          {data && data.nodes && data.nodes.length > 0 ? (
            <GraphVisual
              data2={data}
              width={width}
              height={refContainer.current?.offsetHeight!}
              hasMenu={false}
              // height={500}
              // height={(1.3 * width) / 4}
              // data2={data2}
              // handleClick={handleClick}
            />
          ) : (
            // <>{JSON.stringify(data)}</>
            <p>Dont have Graph Data Yet</p>
          )}
        </div>
      )}
    </>
  );
};
