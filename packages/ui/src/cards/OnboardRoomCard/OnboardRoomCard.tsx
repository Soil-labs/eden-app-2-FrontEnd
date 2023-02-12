import { Members, Rooms } from "@eden/package-graphql/generated";
import {
  Avatar,
  Card,
  MemberModal,
  TextHeading3,
  TextLabel2,
} from "@eden/package-ui";
import { useState } from "react";

export interface IOnboardRoomCardProps {
  room?: Rooms;
}

export const OnboardRoomCard = ({ room }: IOnboardRoomCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Members | null>(null);

  if (!room) return null;
  // console.log("room", room);
  return (
    <>
      <Card shadow className={`bg-white p-4`}>
        <div className={`flex`}>
          <div className={``}>
            <Avatar isProject size={`sm`} src={room?.avatar || ""} />
          </div>
          <div className={`my-auto ml-4`}>
            <TextHeading3>{room?.name}</TextHeading3>
          </div>
        </div>
        <div className={`mt-2 flex`}>
          <div>📍</div>
          <div
            className={`text-darkGreen font-poppins xl:text-md ml-4 space-y-4 text-xs sm:text-sm`}
          >
            <p>{room?.description}</p>
          </div>
        </div>
        <TextLabel2>Hosts</TextLabel2>
        <div className={`mt-2 flex `}>
          <div className={`flex w-full flex-nowrap`}>
            {room?.hosts?.map((member, index) => (
              <button
                key={index}
                className={`-mr-3`}
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedMember(member);
                }}
              >
                <Avatar
                  size={`xs`}
                  src={member?.discordAvatar || ""}
                  alt={member?.discordName ?? "avatar"}
                />
              </button>
            ))}
          </div>
          <div className={`w-full`}></div>
        </div>
      </Card>

      <MemberModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember}
      />
    </>
  );
};
