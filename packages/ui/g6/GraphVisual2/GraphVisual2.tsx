import "./style.css";

import G6 from "@antv/g6";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import GraphMenu from "./graphMenu";
import {
  addNodeAndEdge,
  edgeStrength,
  handleCheckboxChange,
  linkDistance,
  tooltip,
  // updateNodes,
  updateNodesBackendSettings,
} from "./settings/graphFunctions";
import { Graph } from "./settings/interfaceGraph";

export interface IGraphVisualisation {
  data2: Graph;
  width: number;
  height: number;
  settingsGraphs?: any;
  updateSettings?: any;
  hasMenu?: boolean;
}

const loadingNode: Graph = {
  nodes: [
    {
      id: "node0",
      size: 80,
    },
  ],
  edges: [],
};

//  -------------- Graph Functions ------------

function refreshDragedNodePosition(e: any) {
  const model = e.item.get("model");

  model.fx = e.x;
  model.fy = e.y;
}
//  -------------- Graph Functions ------------

let graph2: any;

export const GraphVisual = ({
  width,
  height,
  data2,
  settingsGraphs = undefined,
  updateSettings = undefined,
  hasMenu = true,
}: IGraphVisualisation) => {
  const ref = React.useRef(null);

  //  -------------- Graph Setup ----------------
  useEffect(() => {
    if (!graph2) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      graph2 = new G6.Graph({
        container: ref.current as unknown as string | HTMLElement,
        width: width,
        height: height,
        modes: {
          default: ["drag-canvas", "zoom-canvas"],
          // default: ["drag-canvas", "zoom-canvas", "activate-relations"],
        },
        animate: true, // Boolean, whether to activate the animation when global changes happen
        defaultNode: {
          type: "circle",
          labelCfg: {
            style: {
              fill: "#000000A6",
              fontSize: 10,
            },
          },
          style: {
            stroke: "#72CC4A",
            width: 150,
          },
        },
        defaultEdge: {
          type: "line",
        },
        layout: {
          type: "force",
          preventOverlap: true,
          strictRadial: true,
          linkDistance: (d: any) => {
            return linkDistance(d);
          },
          edgeStrength: (d: any) => {
            return edgeStrength(d);
          },
        },
        plugins: [tooltip],
      });

      // updateNodes(loadingNode, graph2, setItems, setCheckedItems);
      // updateNodesBackendSettings(loadingNode, graph2);
      updateNodesBackendSettings(
        loadingNode,
        graph2,
        setItems,
        setCheckedItems
      );

      graph2.on("node:dragstart", (e: any) => {
        graph2.layout();
        refreshDragedNodePosition(e);
      });
      graph2.on("node:drag", (e: any) => {
        const forceLayout = graph2.get("layoutController").layoutMethods[0];

        forceLayout.execute();
        refreshDragedNodePosition(e);
      });
      graph2.on("node:dragend", function (e: any) {
        e.item.get("model").fx = null;
        e.item.get("model").fy = null;
      });
      graph2.on("node:click", (e: any) => {
        const nodeConnectID = e.item._cfg.id;

        addNodeAndEdge(nodeConnectID, {}, graph2);
      });
    }
  }, [data2]);

  useEffect(() => {
    setTimeout(function () {
      // protect it for firing the rerender too early

      // updateNodes(data2, graph2, setItems, setCheckedItems);
      // updateNodesBackendSettings(data2, graph2);
      // console.log("data2 = ", data2);
      updateNodesBackendSettings(data2, graph2, setItems, setCheckedItems);
    }, 100);
  }, [data2]);
  //  -------------- Graph Setup ----------------

  // ---------- Menue Nodes, Check UnCheck -------------
  const [checkedItems, setCheckedItems] = useState<any>([]);
  // const [items] = useState([]);
  const [items, setItems] = useState([]);
  // ---------- Menue Nodes, Check UnCheck -------------

  useEffect(() => {
    if (graph2) {
      graph2.changeSize(width, height);
      graph2.refresh();
    }
  }, [width, height]);

  console.log("settingsGraphs = ", settingsGraphs);

  return (
    <div className="relative w-full">
      {/* {data2?.nodes && data2?.nodes?.length == 1 ? <div>loading</div> : true} */}
      <div ref={ref} className="flex justify-center"></div>

      {hasMenu && (
        <GraphMenu
          items={items}
          checkedItems={checkedItems}
          handleCheckboxChange={handleCheckboxChange}
          data2={data2}
          setCheckedItems={setCheckedItems}
          graph={graph2}
          settingsGraphs={settingsGraphs}
          updateSettings={updateSettings}
        />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(GraphVisual), {
  ssr: false,
});
