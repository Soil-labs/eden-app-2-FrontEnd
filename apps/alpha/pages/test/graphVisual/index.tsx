//index.tsx
// import G6 from "@antv/g6";

import { AppUserLayout } from "@eden/package-ui";
import dynamic from "next/dynamic";
const G6component = dynamic(() => import("./G6component"), {
  ssr: false,
});

import React from "react";

import { NextPageWithLayout } from "../../_app";

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

const TestPage: NextPageWithLayout = () => {
  return (
    <>
      {/* <p>asdf</p> */}
      <G6component data2={data2} />
    </>
  );
};

TestPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default TestPage;
