import { ComponentMeta, ComponentStory } from "@storybook/react";

import { DiscoverTalentDropdownWithSkillSelectorModal } from "./DiscoverTalentDropdownWithSkillSelectorModal";

export default {
  title: "Modals/DiscoverTalentDropdownModal",
  component: DiscoverTalentDropdownWithSkillSelectorModal,
  argTypes: {},
} as ComponentMeta<typeof DiscoverTalentDropdownWithSkillSelectorModal>;

const Template: ComponentStory<
  typeof DiscoverTalentDropdownWithSkillSelectorModal
> = (args) => <DiscoverTalentDropdownWithSkillSelectorModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  openModal: true,
  nodeType: "expertise",
  title: `Who are you looking for?`,
  subTitle: `Select what you want them to help you with.`,
  matchType: "People",
  batteryPercentage: 50,
  onClose: () => null,
  onSubmit: (data) => {
    console.log(data);
  },
};
