import { getMember } from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { MemberGraph } from "./MemberGraph";

export default {
  title: "Components/MemberGraph",
  component: MemberGraph,
  argTypes: {},
} as ComponentMeta<typeof MemberGraph>;

const Template: ComponentStory<typeof MemberGraph> = (args) => {
  return <MemberGraph {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  memberId: getMember()._id!,
};
