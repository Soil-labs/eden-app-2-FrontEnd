import { ComponentMeta, ComponentStory } from "@storybook/react";

import { DynamicSearchProjectGraph } from "./DynamicSearchProjectGraph";

export default {
  title: "Components/DynamicSearchProjectGraph",
  component: DynamicSearchProjectGraph,
  argTypes: {},
} as ComponentMeta<typeof DynamicSearchProjectGraph>;

const Template: ComponentStory<typeof DynamicSearchProjectGraph> = (args) => {
  return <DynamicSearchProjectGraph {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  nodesID: [""],
  projectId: "908392557258604544",
};
