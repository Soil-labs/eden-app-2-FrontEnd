// G6component.js
import G6 from "@antv/g6";
// import dynamic from "next/dynamic";
// const G6 = dynamic(() => import("@antv/g6"), {
//   ssr: false,
// });
import React, { useEffect } from "react";
// import ReactDOM from "react-dom";

// const globalFontSize = 10;

const data2 = {
  nodes: [
    {
      id: "node0",
      size: 70,
      label: "eloi",
      style: {
        fill: "#bae637",
        stroke: "#eaff8f",
        lineWidth: 5,
      },
    },
    { id: "node1", size: 50, label: "sbelka" },
    { id: "node2", size: 50, label: "waxy" },
    { id: "node3", size: 50, label: "figma" },
    { id: "node4", size: 50, label: "UX" },
    { id: "node5", size: 50, label: "ImpactBilli" },
    { id: "node6", size: 30 },
    { id: "node7", size: 30 },
    { id: "node8", size: 30 },
    { id: "node9", size: 30 },
    { id: "node10", size: 30 },
    { id: "node11", size: 30 },
  ],
  edges: [
    { source: "node0", target: "node1" },
    { source: "node0", target: "node2" },
    { source: "node0", target: "node3" },
    { source: "node0", target: "node4" },
    { source: "node0", target: "node5" },
    { source: "node1", target: "node6" },
    { source: "node1", target: "node7" },
    { source: "node2", target: "node8" },
    { source: "node2", target: "node9" },
    { source: "node9", target: "node10" },
    { source: "node9", target: "node11" },
  ],
};

const G6component = () => {
  const ref = React.useRef(null);

  let graph = null;

  useEffect(() => {
    if (!graph) {
      // const minimap = new G6.Minimap();

      console.log("G6 = ", G6);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      graph = new G6.Graph({
        container: ref.current,
        width: 600,
        height: 400,
        // plugins: [minimap],
        modes: {
          default: ["drag-canvas", "zoom-canvas"],
        },
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
          linkDistance: (d) => {
            if (d.source.id === "node0") {
              return 100;
            }
            return 60;
          },
        },
      });

      // console.log("data = ", data);
      // console.log("data2 = ", data2);

      graph.data(data2);
      graph.render();
    }
  }, []);

  return (
    <>
      {/* <p>boyanda</p> */}
      <div ref={ref}></div>
    </>
  );
};

export default G6component;
