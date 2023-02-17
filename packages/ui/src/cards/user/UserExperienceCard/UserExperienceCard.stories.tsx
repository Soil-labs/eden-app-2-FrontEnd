import { getPreviousProjectsTypeMockArray } from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UserExperienceCard } from "./UserExperienceCard";

export default {
  title: "Cards/User/UserExperienceCard",
  component: UserExperienceCard,
  argTypes: {},
} as ComponentMeta<typeof UserExperienceCard>;

const Template: ComponentStory<typeof UserExperienceCard> = (args) => (
  <UserExperienceCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  background: getPreviousProjectsTypeMockArray(3),
};
