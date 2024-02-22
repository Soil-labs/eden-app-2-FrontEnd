import { ComponentMeta, ComponentStory } from "@storybook/react";

import { BrandedWizardStepsHeader } from "./BrandedWizardStepsHeader";

export default {
  title: "Components/BrandedWizardStepsHeader",
  component: BrandedWizardStepsHeader,
  argTypes: {},
} as ComponentMeta<typeof BrandedWizardStepsHeader>;

const Template: ComponentStory<typeof BrandedWizardStepsHeader> = (args) => (
  <BrandedWizardStepsHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {};
