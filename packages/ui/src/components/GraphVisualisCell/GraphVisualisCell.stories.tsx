// import { getMember } from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GraphVisualisCell } from "./GraphVisualisCell";
// import dynamic from "next/dynamic";
// const GraphVisualisCell = dynamic(() => import("./GraphVisualisCell"), {
//   ssr: false,
// });

export default {
  title: "Components/GraphVisualisCell",
  component: GraphVisualisCell,
  argTypes: {},
} as ComponentMeta<typeof GraphVisualisCell>;

const Template: ComponentStory<typeof GraphVisualisCell> = (args) => {
  return <GraphVisualisCell {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  data2: {
    nodes: [
      { id: "node0", size: 50 },
      { id: "node1", size: 30 },
      { id: "node2", size: 30 },
      { id: "node3", size: 30 },
      { id: "node4", size: 30 },
      { id: "node5", size: 30 },
      { id: "node6", size: 15 },
      { id: "node7", size: 15 },
      { id: "node8", size: 15 },
      { id: "node9", size: 15 },
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
    ],
  },
};
