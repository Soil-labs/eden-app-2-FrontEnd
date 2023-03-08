import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  ENTER_ROOM,
  FIND_MEMBERS,
  FIND_ROOM,
  MATCH_NODES_MEMBERS_LITE,
  MEMBER_UPDATED_IN_ROOM_SUB,
  ROOM_UPDATED,
} from "@eden/package-graphql";
import { Maybe, Members, Rooms } from "@eden/package-graphql/generated";
import {
  AppPublicLayout,
  EditProfileOnboardPartyNodesCard,
  GridItemNine,
  GridItemThree,
  GridLayout,
  NodesOnboardPartyContainer,
  OnboardRoomCard,
  SEO,
  UsersToMeetCard,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../_app";

const OnboardPartyPage: NextPageWithLayout = ({
  room,
  error,
}: {
  room: Rooms;
  error: string;
}) => {
  const router = useRouter();
  const { partyId } = router.query;
  const { currentUser } = useContext(UserContext);

  const [members, setMembers] = useState<Members[]>([]);
  const [nodesID, setNodesID] = useState<string[] | null>(null);
  const [memberEnterRoom, setMemberEnterRoom] = useState<boolean>(false);

  // console.log("room", room);

  const { data: dataMembers, refetch: refetchMatchMembers } = useQuery(
    MATCH_NODES_MEMBERS_LITE,
    {
      variables: {
        fields: {
          nodesID: nodesID,
          serverID: room?.serverID,
        },
      },
      skip: !nodesID || !room?.serverID || error?.length > 0,
    }
  );

  // if (dataMembers) console.log("dataMembers", dataMembers?.matchNodesToMembers);

  useEffect(() => {
    if (currentUser && currentUser.nodes) {
      const nodesID = currentUser?.nodes.map((node) => node?.nodeData?._id);

      setNodesID(nodesID as string[]);
    }
  }, [currentUser]);

  const { data: dataRoomSubscription } = useSubscription(ROOM_UPDATED, {
    variables: {
      fields: { _id: partyId },
    },
    skip: !partyId,
  });

  const membersIds: Array<string> = dataRoomSubscription
    ? dataRoomSubscription.roomUpdated.members.map(
        (member: Members) => member._id
      )
    : room?.members &&
      room?.members.map((member: Maybe<Members>) => member?._id);

  useSubscription(MEMBER_UPDATED_IN_ROOM_SUB, {
    variables: {
      fields: { _id: partyId },
    },
    skip: !partyId,
    onData: ({ data }) => {
      const newMemberData = data?.data?.memberUpdatedInRoom;

      setMembers(
        members.map((member: Members) => {
          if (member._id !== newMemberData?._id) return member;
          return newMemberData;
        })
      );
    },
  });

  const [enterRoom] = useMutation(ENTER_ROOM, {
    onError: () => {
      console.log("error");
    },
  });

  useEffect(() => {
    // if user logged in and not in party, add currentUser to party
    if (!currentUser || !partyId || memberEnterRoom) return;
    if (
      partyId &&
      !!membersIds?.length &&
      currentUser &&
      membersIds.some((id) => id === currentUser?._id)
    ) {
      return;
    }

    if (!memberEnterRoom) {
      enterRoom({
        variables: {
          fields: {
            roomID: partyId,
            memberID: currentUser?._id,
          },
        },
      });
      setMemberEnterRoom(true);
    }
  }, [currentUser, membersIds, partyId]);

  const {} = useQuery(FIND_MEMBERS, {
    variables: {
      fields: {
        _id: membersIds,
      },
    },
    skip: !membersIds || members.length === membersIds.length,
    onCompleted: (data) => {
      if (data) {
        setMembers(data.findMembers);
      }
    },
  });

  return (
    <>
      <SEO
        image={room?.avatar as string}
        title={room?.name as string}
        description={room?.description as string}
      />
      <GridLayout>
        <GridItemThree>
          <div className={`lg:h-85 mb-8 flex flex-col gap-4 lg:mb-0`}>
            <OnboardRoomCard room={room} />
            {!currentUser ? (
              <p>
                You must be logged in to edit your profile.
                <br />
                If you can&rsquo;t log in ask the onboarder for help
              </p>
            ) : (
              <EditProfileOnboardPartyNodesCard
                serverID={room?.serverID || ""}
                RoomID={partyId as string}
              />
            )}
          </div>
        </GridItemThree>
        <GridItemNine>
          <div className={`lg:h-85 flex flex-col gap-4`}>
            {currentUser && (
              <UsersToMeetCard
                members={dataMembers?.matchNodesToMembers}
                refetchMatchMembers={refetchMatchMembers}
              />
            )}
            <NodesOnboardPartyContainer members={members} />
          </div>
        </GridItemNine>
      </GridLayout>
    </>
  );
};

OnboardPartyPage.getLayout = (page) => (
  <AppPublicLayout>{page}</AppPublicLayout>
);

export default OnboardPartyPage;

import type { GetServerSideProps } from "next";

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(),
});

type Props = {
  room: Rooms | null;
  error: string | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { partyId } = context.query;

  try {
    const { data } = await client.query({
      query: FIND_ROOM,
      variables: {
        fields: {
          _id: partyId,
        },
        ssr: true,
      },
    });

    // console.log("data", data);

    return {
      props: {
        room: data.findRoom,
        error: data.findRoom ? null : "Room not found",
      },
    };
  } catch (error) {
    return {
      props: {
        room: null,
        error: "Room not found",
      },
    };
  }
};
