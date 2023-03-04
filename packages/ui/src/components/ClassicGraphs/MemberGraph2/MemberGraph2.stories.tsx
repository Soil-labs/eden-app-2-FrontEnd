import { getMember } from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { MemberGraph2 } from "./MemberGraph2";

export default {
  title: "Components/MemberGraph2",
  component: MemberGraph2,
  argTypes: {},
} as ComponentMeta<typeof MemberGraph2>;

const Template: ComponentStory<typeof MemberGraph2> = (args) => {
  return <MemberGraph2 {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  memberId: getMember()._id!,
};
