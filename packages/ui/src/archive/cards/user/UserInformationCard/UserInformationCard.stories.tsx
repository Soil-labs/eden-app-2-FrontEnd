import { getPreviousProjectsTypeMock } from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UserInformationCard } from "./UserInformationCard";

export default {
  title: "Archive/Cards/User/UserInformationCard",
  component: UserInformationCard,
  argTypes: {},
} as ComponentMeta<typeof UserInformationCard>;

const Template: ComponentStory<typeof UserInformationCard> = (args) => (
  <UserInformationCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  previousProjects: getPreviousProjectsTypeMock(),
  isEditable: true,
};
