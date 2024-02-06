import { ComponentMeta, ComponentStory } from "@storybook/react";

import { BrandedLeftToggleNav } from "./BrandedLeftToggleNav";

export default {
  title: "Components/BrandedLeftToggleNav",
  component: BrandedLeftToggleNav,
  argTypes: {},
} as ComponentMeta<typeof BrandedLeftToggleNav>;

const Template: ComponentStory<typeof BrandedLeftToggleNav> = (args) => (
  <BrandedLeftToggleNav {...args} />
);

export const Default = Template.bind({});
Default.args = {};
