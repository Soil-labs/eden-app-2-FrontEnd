import { Members } from "@eden/package-graphql/generated";
import {
  Badge,
  NodeList,
  // SocialMediaComp,
  TextLabel1,
  UserBackground,
} from "@eden/package-ui";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { FC, useState } from "react";

type NodeDisplay = {
  nameRelevantNode: string;
  nameOriginalNode: string;
  score: number;
  color: string;
};

type relevantNodeObj = {
  [key: string]: {
    nodes: NodeDisplay[];
  };
};

interface Props {
  member?: Members;
  mostRelevantMemberNode?: relevantNodeObj;
}

export const InfoTab: FC<Props> = ({ member, mostRelevantMemberNode }) => {
  const [experienceOpen, setExperienceOpen] = useState<number | null>(null);
  const [seeMore, setSeeMore] = useState(false);

  return (
    <>
      <div className="mb-4 grid grid-cols-2">
        <div className="col-span-2 p-2">
          <div className="my-4 flex flex-col items-start justify-center">
            <TextLabel1>🌸 Short bio</TextLabel1>
            {member?.bio ? (
              <>
                <p className="text-soilBody font-Inter whitespace-pre-wrap font-normal">
                  {seeMore
                    ? member.bio
                    : member.bio.length > 600
                    ? member.bio.substring(0, 600) + "..."
                    : member.bio}
                </p>
                {member.bio.length > 600 && (
                  <p
                    className="mt-1 w-full cursor-pointer text-center text-sm"
                    onClick={() => setSeeMore(!seeMore)}
                  >
                    {`see ${seeMore ? "less" : "more"}`}
                    <span>
                      {seeMore ? (
                        <ChevronUpIcon width={16} className="ml-2 inline" />
                      ) : (
                        <ChevronDownIcon width={16} className="ml-2 inline" />
                      )}
                    </span>
                  </p>
                )}
              </>
            ) : (
              <div className="flex w-full animate-pulse space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <div className="col-2 p-2">
          <section className="mb-2 w-full text-left">
            <TextLabel1 className="text-xs">🔎 INTERESTS</TextLabel1>
            <div className="ml-4 inline-flex flex-wrap">
              {["Travelling", "Trading", "Community", "DAOs"].map(
                (preference: string, index: number) => (
                  <Badge
                    key={index}
                    text={preference}
                    colorRGB="224,151,232"
                    className={`font-Inter text-sm`}
                    closeButton={false}
                    cutText={16}
                  />
                )
              )}
            </div>
          </section>

          <section className="mb-2 w-full text-center">
            <div className="my-4 flex justify-center">
              {member?.links && member?.links.length > 0 && (
                <SocialMediaComp size="sm" links={member?.links} />
              )}
            </div>
          </section>
        </div> */}
      </div>
      <div className="mb-4 grid grid-cols-2">
        {mostRelevantMemberNode &&
        member &&
        member?._id &&
        Object.keys(mostRelevantMemberNode).length > 0 &&
        mostRelevantMemberNode[member?._id] ? (
          <>
            <div className="col-1 p-2">
              <section className="mb-2 w-full text-left">
                <TextLabel1 className="text-xs">🌺 TOP SKILLS</TextLabel1>
                <div className="ml-4  flex-wrap">
                  {mostRelevantMemberNode[member?._id].nodes
                    .slice(0, 7)
                    .map((node: NodeDisplay, index: number) => (
                      <Badge
                        text={node?.nameRelevantNode || ""}
                        key={index}
                        // className={`bg-soilPurple/20 py-px text-xs`}
                        // className={`px-2 py-1 text-white rounded ${getBackgroundColorClass(node.score)}`}
                        // className={`px-2 py-1 text-white rounded bg-purple-400`}
                        className={`rounded px-1 py-1 text-xs text-white ${node.color}`}
                        cutText={17}
                      />
                    ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="col-1 p-2">
            <section className="mb-2 w-full text-left">
              <TextLabel1 className="text-xs">🌺 TOP SKILLS</TextLabel1>
              <div className="ml-4 inline-flex flex-wrap">
                {member?.nodes && member?.nodes.length > 0 && (
                  <NodeList
                    overflowNumber={3}
                    nodes={member?.nodes}
                    colorRGB={`224,151,232`}
                  />
                )}
              </div>
            </section>
          </div>
        )}
        <div className="col-1 grid grid-cols-2">
          {/* First Column: Availability, Location, Timezone */}
          <div className="col-1 p-2">
            <section className="mb-2 w-full text-left">
              <TextLabel1 className="mb-2 text-xs">⏳️ AVAILABILITY</TextLabel1>
              <p className="ml-4 font-bold text-slate-600">
                {member?.hoursPerWeek
                  ? `${member?.hoursPerWeek} hrs\\week`
                  : "unavailable"}
              </p>
            </section>
            <section className="mb-2 w-full text-left">
              <TextLabel1 className="mb-2 text-xs">🌍 Location</TextLabel1>
              <p className="ml-4 font-bold text-slate-600">
                {member?.location ? `${member?.location}` : "-"}
              </p>
            </section>
            <section className="mb-2 w-full text-left">
              <p>
                <TextLabel1 className="mb-2 text-xs">🧭 Timezone</TextLabel1>
              </p>
              <div className="ml-4 inline-flex">
                <p className="font-bold text-slate-600">
                  {member?.timeZone ? `${member?.timeZone}` : "-"}
                </p>
              </div>
            </section>
          </div>
          {/* Second Column: Hourly Rate, Level, Notice */}
          <div className="col-2 p-2">
            <section className="mb-2 w-full text-left">
              <p>
                <TextLabel1 className="text-xs">💰 Hourly rate</TextLabel1>
              </p>
              <div>
                {member?.budget?.perHour !== null &&
                member?.budget?.perHour !== undefined &&
                member?.budget?.perHour >= 0 ? (
                  <p className="ml-4 text-sm">
                    <span className="text-xl font-bold text-[#fcba03]">
                      ${member.budget.perHour}
                    </span>{" "}
                    / hour
                  </p>
                ) : (
                  <span className="ml-4 font-bold text-slate-600">-</span>
                )}
              </div>
            </section>
            <section className="mb-2 w-full text-left">
              <p>
                <TextLabel1 className="text-xs">⭐ Level</TextLabel1>
              </p>
              <div>
                {member?.experienceLevel?.total ? (
                  <Badge
                    className="ml-4 text-sm"
                    colorRGB="151,232,163"
                    text={
                      member?.experienceLevel?.total <= 3
                        ? "Junior"
                        : member?.experienceLevel?.total <= 6
                        ? "Mid"
                        : "Senior"
                    }
                  />
                ) : (
                  <span className="ml-4 font-bold text-slate-600">-</span>
                )}
              </div>
            </section>
            <section className="mb-2 w-full text-left">
              <TextLabel1 className="text-xs">🍀 Notice</TextLabel1>
              <p className="ml-4">2 Weeks</p>
            </section>
          </div>
        </div>
      </div>
      {member?.previousProjects && member?.previousProjects.length ? (
        <section className=" w-full pb-4 text-left">
          <TextLabel1 className="text-xs">🍒 BACKGROUND</TextLabel1>
          <UserBackground
            background={member?.previousProjects || []}
            setExperienceOpen={setExperienceOpen!}
            experienceOpen={experienceOpen!}
          />
        </section>
      ) : null}
    </>
  );
};
