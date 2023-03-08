import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  ENTER_ROOM,
  FIND_MEMBER,
  FIND_MEMBERS,
  FIND_ROOM,
  MATCH_NODES_MEMBERS_LITE,
  MEMBER_UPDATED_IN_ROOM_SUB,
  ROOM_UPDATED,
} from "@eden/package-graphql";
import { Members } from "@eden/package-graphql/generated";
import {
  AppPublicLayout,
  Card,
  GridItemNine,
  GridItemThree,
  GridLayout,
  // NodesOnboardPartyContainer,
  OnboardRoomCard,
  SEO,
  TextBody,
  TextField,
  TextHeading3,
  UsersToMeetCard,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../_app";

const OnboardPartyPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { partyId } = router.query;
  const { currentUser } = useContext(UserContext);

  const [members, setMembers] = useState<Members[]>([]);
  const [memberID, setMemberID] = useState("");
  const [nodesID, setNodesID] = useState<string[] | null>(null);

  const { data: dataRoom } = useQuery(FIND_ROOM, {
    variables: {
      fields: {
        _id: partyId,
      },
    },
    skip: !partyId,
  });

  // if (dataRoom?.findRoom) console.log("dataRoom", dataRoom?.findRoom);

  const { data: dataMembers, refetch: refetchMatchMembers } = useQuery(
    MATCH_NODES_MEMBERS_LITE,
    {
      variables: {
        fields: {
          nodesID: nodesID,
          serverID: dataRoom?.findRoom?.serverID,
        },
      },
      skip: !nodesID || !dataRoom?.findRoom?.serverID,
    }
  );

  // if (dataMembers) console.log("dataMembers", dataMembers?.matchNodesToMembers);

  const { data: dataMember, refetch: refetchMember } = useQuery(FIND_MEMBER, {
    variables: {
      fields: {
        _id: memberID,
      },
    },
    skip: !memberID,
  });

  // if (dataMember) console.log("dataMember", dataMember?.findMember);

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
    : dataRoom?.findRoom?.members.map((member: Members) => member._id);

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
    onError: (error) => {
      console.log("error", error);
    },
  });

  useEffect(() => {
    // if user logged in and not in party, add currentUser to party
    if (!currentUser || !partyId) return;
    if (
      partyId &&
      !!membersIds?.length &&
      currentUser &&
      membersIds.some((id) => id === currentUser?._id)
    ) {
      return;
    }
    if (!dataRoom || !dataRoom.findRoom) return;
    enterRoom({
      variables: {
        fields: {
          roomID: partyId,
          memberID: currentUser?._id,
        },
      },
    });
  }, [currentUser, membersIds, partyId, dataRoom]);

  useEffect(() => {
    console.log("memberID = ", memberID);
    console.log("dataMember = ", dataMember);

    if (dataMember && dataMember.findMember && dataMember.findMember.nodes) {
      // let nodesTS: string = [];
      console.log("change = ");

      const nodesTS = dataMember.findMember.nodes.map(
        (node: { nodeData: any }) => {
          return node.nodeData._id;
        }
      );

      setNodesID(nodesTS);
      console.log("nodesTS = ", nodesTS);

      refetchMatchMembers();
    }
  }, [dataMember]);

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
      <SEO />
      <GridLayout>
        <GridItemThree>
          <div className={`lg:h-85 mb-8 flex flex-col gap-4 lg:mb-0`}>
            <OnboardRoomCard room={dataRoom?.findRoom} />
            {!currentUser ? (
              <p>
                You must be logged in to edit your profile.
                <br />
                If you can&rsquo;t log in ask the onboarder for help
              </p>
            ) : (
              <Card shadow className="flex-grow bg-white p-4">
                <TextHeading3 className="mb-2 text-lg">
                  User Search Matches
                </TextHeading3>
                <TextBody>Discord ID:</TextBody>
                <div className={`flex justify-center space-x-4`}>
                  <TextField
                    name="textfield"
                    type="text"
                    onChange={(e) => {
                      setMemberID(e.target.value);
                      refetchMember();
                    }}
                  />
                </div>
              </Card>
            )}
          </div>
        </GridItemThree>
        <GridItemNine>
          <div className={`lg:h-85 flex flex-col gap-4`}>
            <UsersToMeetCard
              title={
                !(
                  dataMember &&
                  dataMember.findMember &&
                  dataMember.findMember.discordName
                )
                  ? `Search for Member`
                  : ` Best people for ${dataMember.findMember.discordName}:`
              }
              members={dataMembers?.matchNodesToMembers}
              refetchMatchMembers={refetchMatchMembers}
            />

            {/* <NodesOnboardPartyContainer members={members} /> */}
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
