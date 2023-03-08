import { useQuery } from "@apollo/client";
import { FIND_MEMBER_INFO } from "@eden/package-graphql";
import { Maybe, Members } from "@eden/package-graphql/generated";
import { MemberInfo, Modal } from "@eden/package-ui";

export interface IMemberModalProps {
  member?: Maybe<Members>;
  percentage?: number;
  open?: boolean;
  onClose?: () => void;
}

export const MemberModal = ({
  member,
  percentage,
  open,
  onClose,
}: IMemberModalProps) => {
  const { data: dataMemberInfo } = useQuery(FIND_MEMBER_INFO, {
    variables: {
      fields: {
        _id: member?._id,
      },
    },
    skip: !member?._id || !open,
  });

  const findMember = dataMemberInfo?.findMember;

  if (!member) return null;
  // if (!findMember) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className={`h-8/10 scrollbar-hide w-full overflow-scroll`}>
        <MemberInfo member={findMember || member} percentage={percentage} />
      </div>
    </Modal>
  );
};
