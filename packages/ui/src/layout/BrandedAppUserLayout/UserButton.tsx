"use client";

import { DynamicSessionContext, UserContext } from "@eden/package-context";
import { useContext } from "react";
import { FiLogOut } from "react-icons/fi";

import { MenuDropdown } from "../../components";
import { Avatar } from "../../elements";

const UserButton = () => {
  const { currentUser } = useContext(UserContext);
  const { logOut } = useContext(DynamicSessionContext);

  const handleLogout = () => {
    logOut();
  };

  return currentUser ? (
    <div className={"relative"}>
      <div className="z-10">
        <MenuDropdown
          positionX="left"
          positionY="bottom"
          clickableElement={
            <div className="flex items-center">
              <div className="mr-2 inline-block">
                <Avatar size="xs" src={currentUser.discordAvatar!} />
              </div>
              <span className="font-Moret whitespace-nowrap font-bold">
                {currentUser.discordName}
              </span>
            </div>
          }
        >
          {[
            <li
              key={1}
              className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
              onClick={handleLogout}
            >
              <FiLogOut className="inline pb-px" size={16} />
              {" log out"}
            </li>,
          ]}
        </MenuDropdown>
      </div>
    </div>
  ) : null;
};

export default UserButton;
