import { gql, useMutation, useQuery } from "@apollo/client";
import {
  DiscoverContext,
  DiscoverModal,
  DiscoverProvider,
  UserContext,
} from "@eden/package-context";
import {
  FIND_MEMBER_INFO,
  FIND_PROJECT,
  MATCH_NODES_MEMBERS,
  // MATCH_NODES_MEMBERS_LITE,
} from "@eden/package-graphql";
import {
  MatchMembersToSkillOutput,
  MatchPercentage,
  Members,
  NodesType,
  PreferencesType,
  PreferencesTypeFind,
  Project,
  RoleType,
} from "@eden/package-graphql/generated";
import {
  AppUserSubmenuLayout,
  AvatarList,
  Badge,
  Button,
  Card,
  CardGrid,
  ChatSimple,
  CommonServerAvatarList,
  DiscoverModalContainer,
  GridItemNine,
  GridItemThree,
  GridLayout,
  LongText,
  MemberInfo,
  RoleList,
  SendMessageUserToUser,
  SEO,
  SocialMediaComp,
  SubmenuSelector,
  TextHeading3,
  TextLabel1,
  UserInviteModal,
  UserWithDescription,
  WarningCard,
} from "@eden/package-ui";
import { Fragment, useContext, useEffect, useState } from "react";

import welcome from "../../../public/welcome.png";
import type { NextPageWithLayout } from "../../_app";

const DiscoverWithChatPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  // const { selectedServer, memberServerIDs } = useContext(UserContext);
  const { setOpenModal } = useContext(DiscoverContext);
  const { selectedServerID } = useContext(UserContext);
  const [nodesID, setNodesID] = useState<string[] | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [preferences, setPreferences] = useState<PreferencesType>({
    findCoFounder: {
      interestedMatch:
        currentUser?.preferences?.findCoFounder?.interestedMatch || null,
    } as PreferencesTypeFind,
    findMentee: {
      interestedMatch:
        currentUser?.preferences?.findMentee?.interestedMatch || null,
    } as PreferencesTypeFind,
    findMentor: {
      interestedMatch:
        currentUser?.preferences?.findMentor?.interestedMatch || null,
    } as PreferencesTypeFind,
    findProject: {
      interestedMatch:
        currentUser?.preferences?.findProject?.interestedMatch || null,
    } as PreferencesTypeFind,
    findUser: {
      interestedMatch:
        currentUser?.preferences?.findUser?.interestedMatch || null,
    } as PreferencesTypeFind,
  });

  const { data: dataMembers } = useQuery(MATCH_NODES_MEMBERS, {
    variables: {
      fields: {
        nodesID: nodesID,
        serverID: selectedServerID,
        preference: Object.keys(preferences).filter(
          (key: string) =>
            (preferences[key as keyof PreferencesType] as PreferencesTypeFind)
              ?.interestedMatch || false
        ),
      },
    },
    skip: !nodesID || !selectedServerID,
  });

  // if (dataMembers) console.log("dataMembers", dataMembers);

  const { data: dataProject } = useQuery(FIND_PROJECT, {
    variables: {
      fields: {
        _id: router.query.project,
      },
    },
    skip: !router.query.project,
  });

  // if (dataProject) console.log("dataProject", dataProject);

  return (
    <>
      <SEO />
      <GridLayout>
        <GridItemThree>
          <Card className={`scrollbar-hide lg:h-85 overflow-scroll p-1`}>
            <Card shadow className={"bg-white p-6"}>
              <SubmenuSelector title={`Good Morning,`} />
            </Card>
            {dataProject?.findProject?.role &&
              dataProject?.findProject?.role.length > 0 && (
                <Card className={`scrollbar-hide overflow-scroll bg-white p-4`}>
                  <RoleList
                    roles={dataProject?.findProject?.role}
                    addRole={false}
                    handleSelectRole={(role) => {
                      setSelectedRole(role);
                      setNodesID(
                        role?.nodes?.map(
                          (node: Maybe<NodesType>) => node?.nodeData?._id || ""
                        ) || null
                      );
                    }}
                    selectedRole={selectedRole}
                  />
                </Card>
              )}
            {!dataProject?.findProject?.title && (
              <Card
                shadow
                className="my-4 flex h-20 w-full flex-grow justify-center bg-white py-6 font-semibold"
              >
                <div className={``}>
                  <Button
                    variant="primary"
                    radius="default"
                    size="md"
                    onClick={() => {
                      setOpenModal(DiscoverModal.SKILLS_CATEGORY);
                    }}
                  >
                    Update search parameters
                  </Button>
                </div>
              </Card>
            )}
            {!dataProject?.findProject?.title && (
              <WarningCard
                // profilePercentage={getFillProfilePercentage({
                //   ...state,
                //   nodes:
                //     currentUser &&
                //     currentUser.nodes &&
                //     currentUser.nodes?.length > (nodesID || []).length
                //       ? currentUser.nodes
                //       : nodesID,
                // })}
                onClickCompleteProfile={() => router.push(`/create-project`)}
                text1="You can see users"
                text2="Users can't find your project"
                textButton="Create a project"
              />
            )}
          </Card>
        </GridItemThree>
        <GridItemNine>
          <Card
            shadow
            className="scrollbar-hide h-85 overflow-scroll bg-white p-4"
          >
            <CardGrid>
              {dataMembers?.matchNodesToMembers?.map(
                (member: MatchMembersToSkillOutput, index: number) => (
                  <UserDiscoverCard
                    key={index}
                    matchMember={member}
                    role={selectedRole}
                    project={dataProject?.findProject}
                    invite
                    phase={``}
                  />
                )
              )}
            </CardGrid>
          </Card>
        </GridItemNine>
      </GridLayout>
      {!dataProject?.findProject?._id && (
        <DiscoverModalContainer
          image={welcome.src}
          setArrayOfNodes={(val) => {
            setNodesID(val);
          }}
          setPreferences={(val: PreferencesType) => {
            setPreferences(val);
          }}
        />
      )}
    </>
  );
};

DiscoverWithChatPage.getLayout = (page) => (
  <DiscoverProvider>
    <AppUserSubmenuLayout showSubmenu={false}>{page}</AppUserSubmenuLayout>
  </DiscoverProvider>
);

export default DiscoverWithChatPage;

import { round } from "@eden/package-ui/utils";
import { Maybe } from "graphql/jsutils/Maybe";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
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

  return {
    props: {},
  };
}

const EDEN_GPT_REPLY = gql`
  query EdenGPTsearchProfiles($fields: edenGPTsearchProfilesInput) {
    edenGPTsearchProfiles(fields: $fields) {
      reply
    }
  }
`;

// const nodesExample = {
//   nodes: [
//     {
//       id: "node0",
//       size: 80,
//       x: 5,
//       y: 5,
//       label: "eloi",
//       // ----------- Shwow Avatar User ---------
//       type: "image",
//       img: "https://cdn.discordapp.com/avatars/961730944170090516/e5844ca759a74e995027a0e50c5cb1bf.png",
//       clipCfg: {
//         show: true,
//         type: "circle",
//         r: 25,
//       },
//       style: {
//         height: 50,
//         width: 50,
//       },
//       // ----------- Shwow Avatar User ---------
//     },
//   ],
//   edges: [],
// };

export interface IUserDiscoverCardProps {
  matchMember?: Maybe<MatchMembersToSkillOutput>;
  project?: Maybe<Project>;
  role?: Maybe<RoleType>;
  invite?: boolean;
  messageUser?: boolean;
  phase?: string;
}

const UserDiscoverCard = ({
  matchMember,
  project,
  role,
  invite,
  phase,
}: IUserDiscoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const member = matchMember?.member;
  const matchPercentage = matchMember?.matchPercentage;
  const nodesPercentage = matchMember?.nodesPercentage;

  if (!member) return null;

  return (
    <Card border>
      <div className={`flex justify-center`}>
        <div>
          <div className={`relative flex flex-col items-center`}>
            <UserWithDescription
              member={member}
              percentage={round(Number(matchPercentage?.totalPercentage), 0)}
            />
            {member?.links && (
              <div className="flex justify-center">
                <SocialMediaComp size="sm" title="" links={member?.links} />
              </div>
            )}
          </div>
        </div>
        <div className="absolute right-2 top-2">
          <Button onClick={() => setIsOpen(!isOpen)}>More</Button>
        </div>
      </div>

      <div className="flex">
        <LongText
          cutText={100}
          text={(member?.bio as string) || ""}
          className={`text-darkGreen font-Inter my-2 text-sm`}
        />
      </div>

      {member?.serverID && (
        <CommonServerAvatarList
          label={`common servers`}
          size={`xs`}
          serverID={member?.serverID as string[]}
        />
      )}

      {nodesPercentage && (
        <div>
          <p className="font-Inter mb-1 text-sm font-bold text-zinc-500">
            🛠 Top skills
          </p>
          <div>
            {nodesPercentage.slice(0, 6).map((node, index) => (
              <Badge
                text={node?.node?.name || ""}
                key={index}
                className={`bg-soilPurple/20 py-px text-xs`}
              />
            ))}
          </div>
        </div>
      )}

      {member?.endorsements && member?.endorsements.length > 0 && (
        <div className="mt-4">
          <TextLabel1>🎙 ENDORSEMENTS</TextLabel1>
          <div className={`flex`}>
            <AvatarList
              className="inline-block !w-auto !justify-start"
              avatars={member?.endorsements
                .slice(0, 5)
                .map((endorsement: any) => ({
                  size: "xs",
                  src: endorsement?.endorser?.discordAvatar,
                }))}
            />
            {member?.endorsements.slice(5).length > 0 && (
              <p className="text-soilGray ml-6 mt-1 inline">
                +{member?.endorsements.slice(8).length} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* {(item.lifetimeStakeTRST || item.totalTRST) && (
        <div className="-mx-2 mt-3 -mb-3 flex">
          {item.lifetimeStakeTRST && (
            <LifetimeTRST
              member={item}
              lifetimeStakeTRST={item?.lifetimeStakeTRST}
              averageMonthlyReturnTRST={
                Math.round((item?.lifetimeStakeTRST / 100) * 10) / 10
              }
            />
          )}
          {item.totalTRST && (
            <div className="bg-soilPurple ml-auto mr-0 whitespace-nowrap rounded-xl px-2 text-sm text-white">{`${item.totalTRST} $TRST`}</div>
          )}
        </div>
      )} */}

      {invite && project && role ? (
        <UserInviteModal
          open={isOpen}
          member={member}
          project={project}
          role={role}
          phase={phase}
          matchPercentage={matchPercentage}
          onClose={() => setIsOpen(!isOpen)}
        />
      ) : (
        <>
          <UserMessageModal
            open={isOpen}
            member={member}
            matchPercentage={matchPercentage}
            onClose={() => setIsOpen(!isOpen)}
          />
        </>
      )}
    </Card>
  );
};

import { toast } from "react-toastify";

const SET_APPLY_TO_PROJECT = gql`
  mutation ($fields: changeTeamMember_Phase_ProjectInput!) {
    changeTeamMember_Phase_Project(fields: $fields) {
      _id
    }
  }
`;

export interface IUserMessageModalProps {
  member?: Members;
  matchPercentage?: Maybe<MatchPercentage>;
  open?: boolean;
  onClose?: () => void;
}

const UserMessageModal = ({
  member,
  matchPercentage,
  open,
  onClose,
}: IUserMessageModalProps) => {
  const { data: dataMemberInfo } = useQuery(FIND_MEMBER_INFO, {
    variables: {
      fields: {
        _id: member?._id,
      },
    },
    skip: !member?._id || !open,
  });

  const findMember = dataMemberInfo?.findMember;
  const [showMessage, setShowMessage] = useState(false);

  const [changeTeamMemberPhaseProject, {}] = useMutation(SET_APPLY_TO_PROJECT, {
    onCompleted: () => {
      console.log(changeTeamMemberPhaseProject);
      toast.success("success");
      onClose && onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const [chatN, setChatN] = useState([
    {
      user: "01",
      message: "Hey I am Eden AI, how can I help you?",
    },
  ]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [messageUser, setMessageUser] = useState<string>("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [edenAIsentMessage, setEdenAIsentMessage] = useState<boolean>(false);

  // const [keywordsDiscussion, setKeywordsDiscussion] = useState<any>([]);

  // const [nodesN, setNodesN] = useState<any>(nodesExample);

  const handleSentMessage = (messageN: any, userN: any) => {
    const chatT = [...chatN];

    chatT.push({
      user: userN,
      message: messageN,
    });
    setChatN(chatT);

    console.log("messageN ==------- ", messageN);

    setMessageUser(messageN);

    // eslint-disable-next-line react-hooks/rules-of-hooks

    setEdenAIsentMessage(true);

    // console.log("handleSentMessage = ", chatT);
  };

  // const mergeUniqueKeywords = (arr1: any, arr2: any) => {
  //   const uniqueKeywords = new Set([...arr1, ...arr2]);

  // const newKeywords = Array.from(arr2.filter(keyword => !uniqueKeywords.has(keyword)));
  // const newKeywords = arr2.filter((keyword: any) => !arr1.includes(keyword));

  // const nodesNew = [...nodesN.nodes];

  // const edgesNew = [...nodesN.edges];

  // newKeywords.forEach((keyword: any) => {
  //   if (keyword != "") {
  //     nodesNew.push({
  //       id: keyword,
  //       label: keyword,
  //       size: 40,
  //     });
  //     edgesNew.push({
  //       source: "node0",
  //       target: keyword,
  //     });
  //   }
  // });

  // setNodesN({
  //   nodes: nodesNew,
  //   edges: edgesNew,
  // });

  // const mergeUniqueK = Array.from(uniqueKeywords);

  // const mergeUniqueKNew = [];

  // for (let i = 0; i < mergeUniqueK.length; i++) {
  //   if (mergeUniqueK[i] !== "") {
  //     mergeUniqueKNew.push(mergeUniqueK[i]);
  //   }
  // }

  // console.log(mergeUniqueKNew);

  //   return mergeUniqueKNew;
  // };

  const { data: dataEdenGPTReply } = useQuery(EDEN_GPT_REPLY, {
    variables: {
      fields: {
        message: messageUser,
        profileIDs: [member?._id],
      },
    },
    skip: messageUser == "",
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (dataEdenGPTReply && edenAIsentMessage == true) {
      const chatT = [...chatN];

      chatT.push({
        user: "01",
        message: dataEdenGPTReply.edenGPTsearchProfiles.reply,
      });
      setChatN(chatT);

      setEdenAIsentMessage(false);

      // if the dataEdenGPTReply.edenGPTreply.keywords are new then add them to keywordsDiscussion

      // const keywordsAI = dataEdenGPTReply.edenGPTsearchProfiles.keywords;

      // const newKeywords = mergeUniqueKeywords(keywordsDiscussion, keywordsAI);

      // if (keywordsAI.length > 0) {
      //   setKeywordsDiscussion(newKeywords);
      // }
    }
  }, [dataEdenGPTReply]);
  if (!member) return null;
  // if (!findMember) return null;

  return (
    <ChatModal open={open} onClose={onClose}>
      {open && (
        <div
          className="h-8/10 fixed -right-[340px] bottom-0 z-50 w-[300px] rounded-lg bg-white"
          onClick={(e) => {
            console.log("this event :)");

            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <ChatSimple chatN={chatN} handleSentMessage={handleSentMessage} />
        </div>
      )}
      <div className={`h-8/10 scrollbar-hide w-full overflow-scroll`}>
        <div className={`mt-4 grid grid-cols-5`}>
          <div className={`col-span-2 flex justify-end`}></div>
          <div className={`col-span-1 h-8`}></div>
          <div className={`col-span-2`}>
            {!showMessage && (
              <Button onClick={() => setShowMessage(!showMessage)}>
                Connect with {member?.discordName}
              </Button>
            )}
            {showMessage && (
              <Button onClick={() => setShowMessage(!showMessage)}>
                Cancel Message
              </Button>
            )}
          </div>
        </div>
        <div className={`-mt-12`}>
          {showMessage ? (
            <div>
              <div>
                <UserWithDescription
                  member={member}
                  percentage={matchPercentage?.totalPercentage || undefined}
                />
              </div>
              <div className={`my-4`}>
                <TextHeading3 className={`text-md text-gray-500`}>
                  Start a converstation with @{member?.discordName}.
                </TextHeading3>
              </div>
              <SendMessageUserToUser member={member} />
            </div>
          ) : (
            <MemberInfo
              member={findMember || member}
              percentage={matchPercentage?.totalPercentage || undefined}
            />
          )}
        </div>
      </div>
    </ChatModal>
  );
};

import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

export type ChatModalProps = {
  title?: string;
  children?: React.ReactNode;
  open?: boolean;
  closeOnEsc?: boolean;
  onClose?: () => void;
};

const ChatModal = ({
  title = "",
  children,
  open = false,
  closeOnEsc = true,
  onClose,
}: ChatModalProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const onCloseModal = () => {
    if (onClose) onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={"fixed inset-0 z-10 overflow-y-auto"}
        onClose={() => {
          if (onClose) {
            onCloseModal();
          }
          if (closeOnEsc) setIsOpen(false);
          onClose && onClose();
        }}
      >
        <div
          className={
            "flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
          }
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={
                "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              }
            />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className={"hidden sm:inline-block sm:h-screen sm:align-middle"}
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={
                "relative z-30 inline-block rounded-lg bg-white p-2 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 sm:align-middle"
              }
            >
              <div
                className={"absolute top-0 right-0 hidden pt-4 pr-4 sm:block"}
              >
                {closeOnEsc && (
                  <button
                    type="button"
                    className={
                      "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    }
                    onClick={() => {
                      setIsOpen(false);
                      onClose && onClose();
                    }}
                  >
                    <span className={"sr-only"}>Close</span>
                    <XIcon className={"h-6 w-6"} aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className={"sm:flex"}>
                <div className={"mt-3 w-full sm:mt-0"}>
                  <Dialog.Title
                    as="h3"
                    className={`text-lg font-medium leading-6 text-gray-900 ${
                      closeOnEsc ? "mr-12" : ""
                    }`}
                  >
                    {title}
                  </Dialog.Title>
                  <div className={"mt-2"}>{children}</div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
