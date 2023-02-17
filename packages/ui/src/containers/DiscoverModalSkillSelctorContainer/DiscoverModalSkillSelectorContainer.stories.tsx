import { DiscoverProvider } from "@eden/package-context";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { DiscoverModalSkillSelectorContainer } from "./DiscoverModalSkillSelectorContainer";

export default {
  title: "Containers/DiscoverModalSkillSelectorContainer",
  component: DiscoverModalSkillSelectorContainer,
  argTypes: {},
} as ComponentMeta<typeof DiscoverModalSkillSelectorContainer>;

const Template: ComponentStory<typeof DiscoverModalSkillSelectorContainer> = (
  args
) => {
  return (
    <DiscoverProvider>
      <DiscoverModalSkillSelectorContainer {...args} />
    </DiscoverProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
