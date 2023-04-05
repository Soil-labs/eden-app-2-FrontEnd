import { gql, useQuery } from "@apollo/client";
import { Maybe, Members, NodesType } from "@eden/package-graphql/generated";
import {
  Avatar,
  Badge,
  Card,
  // MemberGraph,
  DynamicSearchMemberGraph,
  MemberModal,
  NodeList,
  SocialMediaComp,
  TextBody,
  TextHeading3,
  TextLabel1,
  UserBackground,
  UserWithDescription,
} from "@eden/package-ui";
import { useState } from "react";

// import { trimParentheses } from "../../../utils/trim-parentheses";
import { StarRating } from "../../flows/ReviewFlow/components";

export interface IMemberInfoWithDynamicGraph2Props {
  member?: Maybe<Members>;
  percentage?: number;
  loading?: boolean;
  hasGraph?: boolean;
  nodesID?: any;
  conversation?: any;
  relatedNodesMemberToMatch?: any;
}

const EDEN_GPT_SUMMARY_PROFILE = gql`
  query ($fields: edenGPTsummaryProfileInput!) {
    edenGPTsummaryProfile(fields: $fields) {
      reply
    }
  }
`;

// const HighlightText = ({ text }) => {
//   // const highlightStyle = "bg-yellow-200 font-semibold";
//   // const highlightStyle = "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white px-1 py-0.5 rounded-md shadow-md";
//   const highlightStyle =
//     "bg-blue-200 text-blue-800 px-1 py-0.5 rounded-md shadow-sm";

//   const parts = text.split("*");
//   const highlightedText = parts.map((part: string, index: number) => {
//     if (index % 2 === 1) {
//       return (
//         <span key={index} className={highlightStyle}>
//           {part}
//         </span>
//       );
//     } else {
//       return part;
//     }
//   });

//   return <p>{highlightedText}</p>;
// };
interface HighlightTextProps {
  text: string | null;
}

const HighlightText = ({ text }: HighlightTextProps) => {
  // const highlightStyle =
  //   "bg-blue-200 text-blue-800 px-1 py-0.5 rounded-md shadow-sm";
  const bulletPoint = (
    <span className="mx-2 -mt-1 text-xl font-bold text-blue-500">•</span>
  );

  if (text == null) text = "";

  // const parts = text.replace(/^\n+/g, "").split(/\n-+/);
  const parts = text.replace(/^\n+/g, "").split(/\n\s*[•-]\s*/);

  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].replace(/-/g, "").replace(/•/g, "");
  }

  // parts = parts.replace(/-/g, "");
  const highlightedText = parts.map((part: string, index: number) => {
    return (
      <span key={index} className="-ml-2 mb-1 flex">
        {bulletPoint}
        <span>{part.trim()}</span>
        <br />
      </span>
    );
  });

  return <span>{highlightedText}</span>;
};

export const MemberInfoWithDynamicGraph2 = ({
  member,
  percentage,
  loading = false,
  nodesID,
  conversation,
  relatedNodesMemberToMatch,
}: IMemberInfoWithDynamicGraph2Props) => {
  const [experienceOpen, setExperienceOpen] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log("nodesID -- -2--2-2 = ", nodesID);

  const [edenGPTsummary, setEdenGPTsummary] = useState<string | null>(null);
  const [loadingGPTsummary, setLoadingGPTsummary] = useState<boolean>(true);

  const {} = useQuery(EDEN_GPT_SUMMARY_PROFILE, {
    variables: {
      fields: {
        conversation: conversation,
        memberID: member?._id,
      },
    },
    // skip: nodesID == undefined,
    skip: !member?._id || !conversation,
    // skip: selectedOption !== "Option 8",
    onCompleted: (data) => {
      if (data) {
        setEdenGPTsummary(data?.edenGPTsummaryProfile?.reply);
        setLoadingGPTsummary(false);
        console.log(
          "data.edenGPTsummaryProfile = ",
          data.edenGPTsummaryProfile
        );
        // setDataGraphAPI(data.dynamicSearchToMemberGraphGPT);
      }
    },
  });

  const _bio = member?.bio?.split("\n").reduce((acc, val) => {
    if (val === "\n") return acc.splice(1);
    return acc;
  }, member?.bio?.split("\n"));

  console.log(_bio);

  if (!member) return null;

  // console.log("member = ", member);

  return (
    <div>
      <div className="mb-10 sm:grid sm:grid-cols-6">
        <div className="flex flex-col items-center justify-end sm:col-span-2">
          {/* <p className="border-b border-slate-200 text-center"> */}
          <p className="text-center">
            <span className="text-sm text-slate-400">Total earned:</span>
            <br />
            <span className="text-2xl font-bold text-[#fcba03]">
              ${member.totalIncome}
            </span>
          </p>
          {/* <p className="text-center text-sm text-slate-400">Eden lvl3</p> */}
        </div>
        <div className="sm:col-span-2">
          <UserWithDescription member={member} />
        </div>
        <div className="flex flex-col items-center justify-end sm:col-span-2">
          <p className="text-center">
            <span className="text-sm text-slate-400">Completed gigs:</span>
            <br />
            <span className="text-2xl">{member.completedOpportunities}</span>
          </p>
          {/* <p className="text-center text-sm text-slate-400">💎 Eden Native</p> */}
        </div>
      </div>
      <div className="mb-8 sm:grid-cols-6">
        <div className="relative my-4 flex flex-col items-start justify-center rounded-xl bg-cyan-50 p-4 pt-3 sm:col-span-4 sm:my-0">
          <p className="mb-2">
            <TextLabel1>
              🪄 Why {member.discordName} is Perfect for you? 🪄{" "}
            </TextLabel1>
          </p>
          {!loadingGPTsummary ? (
            <>
              <p className="text-soilBody font-Inter mb-4 font-normal">
                {/* {edenGPTsummary} */}
                <HighlightText text={edenGPTsummary || ""} />
              </p>
            </>
          ) : (
            <>
              <div className="flex w-full animate-pulse space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                </div>
              </div>
            </>
          )}
          <span className="absolute bottom-2 right-3 text-slate-600">
            By Eden AI
          </span>
        </div>
        {/* <div></div>
        {member?.links && member?.links.length > 0 && (
          <SocialMediaComp links={member?.links} />
        )} */}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-12">
        <div className="sm:col-span-7 sm:my-0">
          {!!member?.bio && <TextLabel1>🪪 Short bio</TextLabel1>}
          {!loading ? (
            <p className="text-soilBody font-Inter mb-2 whitespace-pre-wrap font-normal">
              {_bio}
            </p>
          ) : (
            <div className="flex w-full animate-pulse space-x-4">
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 rounded bg-slate-200"></div>
                <div className="h-3 rounded bg-slate-200"></div>
              </div>
            </div>
          )}
          <div className="">
            <p className="mb-2 text-left">
              <TextLabel1>🧙‍♂️ Relevant Skills</TextLabel1>
            </p>
            {relatedNodesMemberToMatch
              .slice(0, 6)
              .map((info: any, index: number) => (
                <Badge
                  text={info?.MemberRelevantnode?.name || ""}
                  key={index}
                  // className={`bg-soilPurple/20 py-px text-xs`}
                  // className={`px-2 py-1 text-white rounded ${getBackgroundColorClass(info.score)}`}
                  // className={`px-2 py-1 text-white rounded bg-purple-400`}
                  className={`rounded px-1 py-1 text-xs text-white ${info.color}`}
                  cutText={18}
                />
              ))}
            {/* {member.endorseSummary?.mainNodes!.map(
              (node: EndorseNode | null, index: number) => (
                <Badge
                  key={index}
                  text={trimParentheses(node?.node?.name || "")}
                  colorRGB={"255,119,193"}
                  className={`font-Inter text-xl text-white`}
                  closeButton={false}
                  cutText={99}
                />
              )
            )} */}
          </div>
        </div>
        <div className="col-span-2"></div>
        <div className="flex flex-col items-center sm:col-span-3 sm:my-0">
          {member.bio &&
            member.budget?.perHour !== undefined &&
            member.budget?.perHour !== null && (
              <section className="border-soilGrey-200 mb-4 w-full rounded-xl border p-2 text-center">
                <p className="text-center">
                  <TextLabel1>⚡️ Match</TextLabel1>
                </p>
                <p className="text-center text-[62px] font-bold leading-none text-[#cb10ff]">
                  {percentage}%
                </p>
              </section>
            )}
          <section className="border-soilGrey-200 mb-4 w-full rounded-xl border p-2 text-center">
            <p className="text-center">
              <TextLabel1>💰 Hourly rate</TextLabel1>
            </p>
            <p className="text-center">
              <span className="text-2xl font-bold text-[#fcba03]">
                ${member.budget?.perHour}
              </span>{" "}
              per hour
            </p>
            <p className="text-center text-sm text-slate-400">
              Base rate + tax
            </p>
          </section>
          <section className="border-soilGrey-200 mb-4 w-full rounded-xl border p-2 text-center">
            <TextLabel1>❤️ Availability</TextLabel1>
            <p className="text-center font-bold text-slate-600">
              <span className="text-2xl">{member.hoursPerWeek}</span> hours/week
            </p>
          </section>
          <section className="border-soilGrey-200 mb-4 w-full rounded-xl border p-2 text-center">
            <TextLabel1>💎 Experience</TextLabel1>
            <p className="text-center font-bold text-slate-600">
              <span className="text-xl">
                {member.expirienceLevel?.total === 3 && "Junior"}
                {member.expirienceLevel?.total === 6 && "Mid"}
                {member.expirienceLevel?.total === 9 && "Senior"}
              </span>
            </p>
          </section>
          <section className="border-soilGrey-200 mb-4 w-full rounded-xl border p-2 text-center">
            <TextLabel1>🌍 Timezone</TextLabel1>
            <p className="text-center font-bold text-slate-600">
              {`${member.timeZone}${
                member.location ? " (" + member.location + ")" : ""
              }`}
            </p>
          </section>
        </div>
      </div>
      {/* {JSON.stringify(member.endorsementsReceive)} */}
      <section className="mb-8">
        <p className="mb-2">
          <TextLabel1>👑 Reviews</TextLabel1>
        </p>
        <section className="grid grid-cols-12 gap-2">
          {/* <Card
            className="!border-accentColor col-span-6 bg-green-50 px-4 pt-4"
            border
            shadow
          >
            <div className="mb-2 flex w-full">
              <div className="flex flex-col">
                <TextHeading3 className="text-md">General Vibe</TextHeading3>
                <div className="flex items-center text-left">
                  <span className="mr-2">
                    <StarRating
                      isReadOnly
                      rating={member.endorseSummary?.averageStars!}
                    />
                  </span>
                  <span>{`(${member.endorseSummary?.numberEndorsement})`}</span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <TextLabel1>Total Stake</TextLabel1>
                <p className="text-sm">
                  {member.endorseSummary?.totalStake} $TRST
                </p>
              </div>
            </div>
            <NodeList
              colorRGB={`235,225,255`}
              nodes={member.endorseSummary?.mainNodes?.map(
                (node) =>
                  ({
                    nodeData: {
                      name: node?.node?.name,
                    },
                  } as NodesType)
              )}
            />
            <section className={`mb-6`}>
              <TextBody>{member.endorseSummary?.summary}</TextBody>
            </section>
          </Card> */}
          <div className="col-span-12 flex overflow-x-auto pl-4">
            {member.endorsementsReceive &&
              member.endorsementsReceive.length > 1 && (
                <Card
                  className="!border-accentColor mr-4 w-[320px] flex-none bg-green-50 px-4 pt-4"
                  border
                  shadow
                >
                  <div className="mb-2 flex w-full">
                    <div className="flex flex-col">
                      <TextHeading3 className="text-md !font-bold">
                        General Vibe
                      </TextHeading3>
                      <div className="flex items-center text-left">
                        <span className="mr-2">
                          <StarRating
                            isReadOnly
                            rating={member.endorseSummary?.averageStars!}
                          />
                        </span>
                        <span>{`(${member.endorseSummary?.numberEndorsement})`}</span>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <TextLabel1>Total Stake</TextLabel1>
                      <p className="text-sm">
                        {member.endorseSummary?.totalStake} $TRST
                      </p>
                    </div>
                  </div>
                  <NodeList
                    colorRGB={`235,225,255`}
                    nodes={member.endorseSummary?.mainNodes?.map(
                      (node) =>
                        ({
                          nodeData: {
                            name: node?.node?.name,
                          },
                        } as NodesType)
                    )}
                  />
                  <section className={`mb-6`}>
                    <TextBody className="text-[13px]">
                      {member.endorseSummary?.summary}
                    </TextBody>
                  </section>
                </Card>
              )}
            {member.endorsementsReceive?.map((endorsement, index) => (
              <Card
                className="mr-4 w-[320px] flex-none px-4 pt-4"
                border
                shadow
                key={index}
              >
                <div className="mb-2 flex w-full">
                  <button onClick={() => setIsModalOpen(true)}>
                    <div className="mr-2">
                      <Avatar
                        src={endorsement?.userSend?.discordAvatar || ""}
                        size={`md`}
                      />
                    </div>
                  </button>
                  <div>
                    <TextHeading3 className="text-soilGray">
                      @{endorsement?.userSend?.discordName}
                    </TextHeading3>
                    {endorsement?.userSend?.memberRole?.title && (
                      <p className="text-sm text-gray-400">
                        {endorsement?.userSend?.memberRole.title}
                      </p>
                    )}
                    <StarRating isReadOnly rating={endorsement?.stars!} />
                  </div>
                  <div className="ml-auto text-right">
                    <TextLabel1>Stake</TextLabel1>
                    <p className="text-sm">{endorsement?.stake} $TRST</p>
                  </div>
                </div>
                <NodeList
                  colorRGB={`235,225,255`}
                  nodes={endorsement?.nodes?.map(
                    (node) =>
                      ({
                        nodeData: {
                          name: node?.node?.name,
                        },
                      } as NodesType)
                  )}
                />
                <section className={`mb-6`}>
                  <TextBody className="text-[13px]">
                    {endorsement?.endorsementMessage}
                  </TextBody>
                </section>
                <MemberModal
                  member={endorsement?.userSend as Members}
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(!isModalOpen)}
                />
              </Card>
            ))}
          </div>
        </section>
      </section>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-6">
        {/* MEMEBER.ENDORSEMENT NO LONGER EXISTS */}

        <div className="sm:col-span-4 sm:my-0">
          {member?.previousProjects && member?.previousProjects.length && (
            <UserBackground
              background={member?.previousProjects || []}
              setExperienceOpen={setExperienceOpen!}
              experienceOpen={experienceOpen!}
            />
          )}
        </div>
        <div className="flex flex-col items-center sm:col-span-2 sm:my-0">
          <section className="mb-4">
            {member?.links && member?.links.length > 0 && (
              <SocialMediaComp links={member?.links} />
            )}
          </section>
        </div>
      </div>

      <div className="mt-3 h-[360px] w-full">
        <DynamicSearchMemberGraph
          memberID={member._id!}
          nodesID={nodesID}
          disableZoom={true}
          graphType={"KG_AI2"}
          // graphType={"KG_AI"}
          // zoomGraph={1.1}
        />
      </div>
    </div>
  );
};
