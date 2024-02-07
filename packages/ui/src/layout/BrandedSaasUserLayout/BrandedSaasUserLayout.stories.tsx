import { DynamicSessionProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { BrandedSaasUserLayout } from "./BrandedSaasUserLayout";

export default {
  title: "Layout/BrandedSaasUserLayout",
  component: BrandedSaasUserLayout,
  argTypes: {},
} as ComponentMeta<typeof BrandedSaasUserLayout>;

const Template: ComponentStory<typeof BrandedSaasUserLayout> = (args) => (
  <DynamicSessionProvider fetchingToken={false}>
    <BrandedSaasUserLayout {...args} />
  </DynamicSessionProvider>
);

export const Default = Template.bind({});
Default.args = {};
