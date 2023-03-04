import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GraphVisual } from "./GraphVisual";
import { Graph } from "./settings/interfaceGraph";

export default {
  title: "G6/GraphVisual",
  component: GraphVisual,
  argTypes: {},
} as ComponentMeta<typeof GraphVisual>;

const Template: ComponentStory<typeof GraphVisual> = (args) => {
  // console.log("nodeTypeStyle", nodeTypeStyle);
  return <GraphVisual {...args} />;
};

const data2: Graph = {
  nodes: [
    {
      id: "node0",
      size: 80,
      x: 5,
      y: 5,
      label: "eloi",
      // ----------- Shwow Avatar User ---------
      type: "image",
      img: "https://cdn.discordapp.com/avatars/961730944170090516/e5844ca759a74e995027a0e50c5cb1bf.png",
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
    },
    { id: "node1", x: 100, y: 150, size: 50, label: "sbelka" },
    { id: "node2", x: 10, y: 10, size: 50, label: "waxy" },
    { id: "node3", x: 20, y: 10, size: 50, label: "figma" },
    { id: "node4", x: 30, y: 10, size: 50, label: "UX" },
    { id: "node5", x: 40, y: 10, size: 50, label: "ImpactBilli" },
    { id: "node6", x: 500, y: 100, size: 30 },
    { id: "node7", x: 600, y: 100, size: 30 },
    { id: "node8", x: 700, y: 100, size: 30 },
    { id: "node9", x: 800, y: 100, size: 30 },
    { id: "node10", x: 900, y: 100, size: 30 },
    { id: "node11", x: 1000, y: 100, size: 30 },
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

export const Default = Template.bind({});
Default.args = {
  data2: data2,
  width: 500,
  height: 500,
};
