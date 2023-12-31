import { gql, useQuery, useSubscription } from "@apollo/client";
import { FIND_CURRENTUSER, FIND_CURRENTUSER_SUB } from "@eden/package-graphql";
import { ServerTemplate } from "@eden/package-graphql/generated";
import mixpanel from "mixpanel-browser";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";

// import { isAllServers, isEdenStaff } from "../../data";
import { UserContext } from "./UserContext";

export const FIND_SERVERS = gql`
  query ($fields: findServersInput) {
    findServers(fields: $fields) {
      _id
      name
      serverAvatar
      serverType
      channel {
        chatID
        forumID
      }
    }
  }
`;

export interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: session } = useSession();

  const { id } = session?.user || { id: null };

  const [memberServers, setMemberServers] = useState<ServerTemplate[]>([]);
  const [selectedServerID, setSelectedServerID] = useState<string[]>([]);
  const [memberServerIDs, setMemberServerIDs] = useState<string[]>([]);

  const { data: dataMember, refetch: refechProfile } = useQuery(
    FIND_CURRENTUSER,
    {
      variables: {
        fields: {
          _id: id,
        },
      },
      skip: !id,
      // context: { serviceName: "soilservice" },
      ssr: false,
      onCompleted: (data) => {
        // console.log("dataMember", data);
        // if user is not found, remove access token. This is in case the user is not in the db but has a valid access token
        if (!data.findMember) localStorage.removeItem("eden_access_token");
      },
    }
  );

  useSubscription(FIND_CURRENTUSER_SUB, {
    variables: {
      fields: {
        _id: id,
      },
    },
    skip: !id,
    // context: { serviceName: "soilservice" },
  });

  useQuery(FIND_SERVERS, {
    variables: {
      fields: {
        _id: memberServerIDs,
      },
    },
    skip: memberServerIDs.length === 0,
    // context: { serviceName: "soilservice" },
    onCompleted: (data) => {
      setMemberServers([...data.findServers]);
      // setSelectedServer(data.findServers[0]);
    },
  });

  // if (dataServers) console.log("dataServers", dataServers?.findServers);

  useMemo(() => {
    if (dataMember) {
      setMemberServerIDs(dataMember.findMember?.serverID || []);
      setSelectedServerID(dataMember.findMember?.serverID || []);
    }

    if (dataMember && process.env.NODE_ENV === "development") {
      console.log(`==== current USER ====`);
      console.log(dataMember.findMember);
      console.log(`==== ----------- ====`);
    }
  }, [dataMember]);

  // ----- MIXPANEL ------
  useMemo(() => {
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      if (id) {
        // ----- Identify user ------
        mixpanel.identify(id);
      } else {
        // ----- Reset Id ------
        mixpanel.reset();
      }
    }
  }, [id]);

  const injectContext = {
    currentUser: dataMember?.findMember || undefined,
    refechProfile: refechProfile,
    memberServers,
    memberServerIDs,
    selectedServerID,
    setSelectedServerID,
  };

  return (
    <UserContext.Provider value={injectContext}>
      {children}
    </UserContext.Provider>
  );
};
