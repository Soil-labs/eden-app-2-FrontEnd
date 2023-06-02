import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PercentageAnalysis } from "./PercentageAnalysis";

export default {
  title: "Components/PercentageAnalysis",
  component: PercentageAnalysis,
  argTypes: {},
} as ComponentMeta<typeof PercentageAnalysis>;

const Template: ComponentStory<typeof PercentageAnalysis> = (args) => {
  return <PercentageAnalysis {...args} />;
};

export const Default = Template.bind({});
Default.args = {};
