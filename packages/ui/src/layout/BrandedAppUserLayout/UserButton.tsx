"use client";

import { DynamicSessionContext, UserContext } from "@eden/package-context";
import Link from "next/link";
import { useContext } from "react";
import { FiLogOut } from "react-icons/fi";

import { MenuDropdown } from "../../components";
import { Avatar } from "../../elements";

const UserButton = ({ branded = false }) => {
  const { currentUser } = useContext(UserContext);
  const { logOut } = useContext(DynamicSessionContext);

  const handleLogout = () => {
    logOut();
  };

  const menuItems =
    branded && currentUser?.companies && currentUser?.companies.length > 0
      ? [
          <li
            key={0}
            className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
          >
            <Link
              href={`/dashboard/${currentUser?.companies[0]?.company?.slug}`}
            >
              {"My company dashboard"}
            </Link>
          </li>,
          <li
            key={1}
            className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
            onClick={handleLogout}
          >
            <FiLogOut className="inline pb-px" size={16} />
            {" log out"}
          </li>,
        ]
      : [
          <li
            key={1}
            className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
            onClick={handleLogout}
          >
            <FiLogOut className="inline pb-px" size={16} />
            {" log out"}
          </li>,
        ];

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
          {menuItems}
        </MenuDropdown>
      </div>
    </div>
  ) : null;
};

export default UserButton;
