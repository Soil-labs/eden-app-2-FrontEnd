import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { FIND_ROOMS } from "@eden/package-graphql";
import {
  AdminLayout,
  Avatar,
  AvatarMemberList,
  Button,
  Card,
  SEO,
  ServerSelector,
  TextField,
  TextHeading2,
  TextHeading3,
} from "@eden/package-ui";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

import type { NextPageWithLayout } from "../../_app";

const formatDate = (date: any) => {
  const offset = 0;

  // const currentDate = new Date();
  // const offset2 = currentDate.getTimezoneOffset() / 100;

  // console.log(offset2); // -300

  var d = new Date(date * 1);
  var utc = d.getTime() + d.getTimezoneOffset() * 60000; //This converts to UTC 00:00
  var nd = new Date(utc + 3600000 * offset);

  return nd.toLocaleString();
};

const CREATE_ROOM = gql`
  mutation ($fields: createRoomInput!) {
    createRoom(fields: $fields) {
      _id
    }
  }
`;

const DiscoverPage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const [selectedServer, setSelectedServer] = useState<ServerTemplate>({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");

  const [roomUrl, setRoomUrl] = useState("");

  const { data: dataRoom } = useQuery(FIND_ROOMS, {
    variables: {
      fields: {},
    },
    context: { serviceName: "soilservice" },
  });

  if (dataRoom) console.log("dataRoom", dataRoom);

  const { roomsData, pageInfo } = dataRoom?.findRooms || {};

  const [createRoom] = useMutation(CREATE_ROOM, {
    onCompleted: (data) => {
      // console.log("createRoom completed", data);
      setRoomUrl(data.createRoom._id);
    },
  });

  const handleCreateRoom = () => {
    if (!selectedServer?._id) toast.error("Please select a server");
    if (!currentUser || !selectedServer?._id) return;
    createRoom({
      variables: {
        fields: {
          name,
          description,
          avatar,
          hostID: [currentUser?._id],
          serverID: selectedServer?._id,
        },
      },
      context: { serviceName: "soilservice" },
    });
  };

  // return null;

  return (
    <>
      <SEO />
      <div
        className={`h-9/10 scrollbar-hide m-3 w-full space-y-4 overflow-y-scroll p-1`}
      >
        <Card shadow className="scrollbar-hide w-full bg-white p-4">
          <div className={`grid grid-cols-2`}>
            <div className={`col-span-1`}>
              <TextHeading2>Create a Room</TextHeading2>
              <div className={``}>
                <div className={`font-Inter my-auto font-medium text-gray-700`}>
                  Select a Discord Server to Connect in
                </div>
                <ServerSelector
                  compareServerID={[]}
                  onChangeServer={(val) => setSelectedServer(val)}
                />
              </div>
              <Card>
                <TextField
                  label={`Room Name`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label={`Room Description`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                  label={`Room Image`}
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
                <div className={`my-6`}>
                  <Button onClick={() => handleCreateRoom()}>
                    Create Room
                  </Button>
                </div>
              </Card>
            </div>
            <div className={`col-span-1`}>
              <TextHeading2>Room Url</TextHeading2>

              {roomUrl && (
                <Card>
                  <TextHeading3>{`https://eden-alpha-develop.vercel.app/party/onboard/${roomUrl}`}</TextHeading3>
                  <div className={`my-6`}>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://eden-alpha-develop.vercel.app/party/onboard/${roomUrl}`
                        );
                        toast.success("room link copied to clipboard");
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                  <div className={`my-6`}>
                    <Button
                      onClick={() =>
                        window.open(
                          `https://eden-alpha-develop.vercel.app/party/onboard/${roomUrl}`,
                          "_blank"
                        )
                      }
                    >
                      Go to Room
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>
        <Card shadow className={`bg-white p-4`}>
          <div className={`flex justify-between`}>
            <TextHeading2>Rooms</TextHeading2>
            <div className={`font-medium text-gray-600`}>
              {pageInfo?.totalResults} Total
            </div>
          </div>

          <div className={`gap-4`}>
            {roomsData?.map((room: any) => (
              <Card key={room._id} className={`border-b-2 p-2`}>
                <div className={`flex`}>
                  <div>
                    <Avatar src={room.avatar} size={`sm`} isProject />
                  </div>

                  <div className={`ml-4 mt-2 flex w-full justify-between`}>
                    <TextHeading3>{room.name}</TextHeading3>
                    <div className={`text-sm text-gray-500`}>
                      {formatDate(room.registeredAt)} - UTC
                    </div>
                  </div>
                </div>

                <div>{room?.description}</div>
                <div className={`my-6 flex justify-between`}>
                  <div>
                    <AvatarMemberList size={`xs`} members={room?.members} />
                  </div>

                  <Button
                    onClick={() =>
                      window.open(
                        `https://eden-alpha-develop.vercel.app/party/onboard/${room._id}`,
                        "_blank"
                      )
                    }
                  >
                    Go to Room
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

DiscoverPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default DiscoverPage;

import { ServerTemplate } from "@eden/package-graphql/generated";
import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session || session.error === "RefreshAccessTokenError") {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel && session.accessLevel > 5) {
    return {
      redirect: {
        destination: `/home`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
