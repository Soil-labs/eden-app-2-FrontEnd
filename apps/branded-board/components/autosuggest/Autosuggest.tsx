"use client";

import { gql, useMutation } from "@apollo/client";
import { classNames } from "@dynamic-labs/sdk-react-core";
import { CandidateType } from "@eden/package-graphql/generated";
import {
  Avatar,
  Button,
  CandidateInfo,
  CandidateTypeSkillMatch,
  EdenIconExclamation,
  EdenTooltip,
} from "@eden/package-ui";
import { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";

const AUTOSUGGEST_TALENT = gql`
  mutation AutoSuggestTalentForPosition(
    $fields: autoSuggestTalentForPositionInput
  ) {
    autoSuggestTalentForPosition(fields: $fields) {
      user {
        _id
        discordName
        discordAvatar
      }
      scoreCardTotal {
        score
      }
      scoreCardCategoryMemories {
        category
        score
        scoreCardsPosition {
          score
          card {
            _id
            content
            # futurePotential
            # keyPriority
          }
          scoreCardsCandidate {
            card {
              # score {
              #   overall
              # }
              _id
              content
            }
            scoreAlignment
          }
        }
      }
    }
  }
`;

interface AutosuggestProps {
  positionID: string | undefined;
}

const Autosuggest = ({ positionID }: AutosuggestProps) => {
  const [open, setOpen] = useState(true);

  const [suggestedCandidates, setSuggestedCandidates] = useState<
    CandidateType[]
  >([]);

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  const [autoSuggestTalentForPosition] = useMutation(AUTOSUGGEST_TALENT, {
    onCompleted: (data) => {
      const _suggestedCandidates = data.autoSuggestTalentForPosition;

      setSuggestedCandidates(_suggestedCandidates);
    },
  });

  const handleClick = () => {
    if (positionID) {
      autoSuggestTalentForPosition({
        variables: {
          fields: {
            positionID: positionID,
            maxScoreCardsCheck: 8,
            pageSize: 3,
            pageNumber: 1,
            neighborNodeMaxSize: 3,
            scoreCardMaxSize: 6,
          },
        },
      });
    }
  };

  return (
    <>
      <section className="relative mb-4">
        <div className="bg-edenPink-100 w-full overflow-hidden rounded-md px-4 py-4">
          <h2 className="text-edenGreen-600">
            Let&apos;s find your perfect candidate on Eden network.
          </h2>
          <button
            className="rounded-md bg-black px-8 py-1 text-white"
            onClick={handleClick}
          >
            Suggest candidates
          </button>

          <div
            className={classNames(
              "scrollbar-hide overflow-x-scroll transition-all ease-in-out",
              open ? "max-h-[30vh] pt-4" : "max-h-0 pt-0"
            )}
          >
            <div className="flex items-stretch whitespace-nowrap">
              {suggestedCandidates.length > 0 &&
                suggestedCandidates.map((candidate, index) => {
                  const _candidate = candidate as CandidateTypeSkillMatch;

                  return (
                    <CandidateCard
                      candidate={_candidate}
                      onClick={() => {
                        setSelectedUserId(_candidate.user?._id!);
                      }}
                      key={index}
                    />
                  );
                })}
            </div>
          </div>
        </div>
        <div
          className={classNames(
            "text-edenGray-700 absolute right-0 top-0 flex cursor-pointer items-center px-2 py-3 text-xs"
          )}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <BiChevronUp color="#626262" size={"1.2rem"} />
          ) : (
            <BiChevronDown color="#626262" size={"1.2rem"} />
          )}
        </div>
      </section>
      {selectedUserId && (
        <div className="fixed right-0 top-0 z-50 h-screen w-[50vw]">
          <CandidateInfo
            memberID={selectedUserId}
            percentage={
              suggestedCandidates.find(
                (candidate) => candidate.user?._id === selectedUserId
              )?.scoreCardTotal?.score
            }
            // handleCreateNewList={handleCreateNewList}
            // summaryQuestions={selectedUserSummaryQuestions}
            // mostRelevantMemberNode={mostRelevantMemberNode}
            // candidate={candidatesOriginalList?.find(
            //   (candidate) =>
            //     candidate?.user?._id?.toString() ==
            //     router.query.candidate2?.toString()
            // )}
            onClose={() => {
              setSelectedUserId(undefined);
            }}
            // talentListsAvailables={talentListsAvailables}
            // handleAddCandidatesToList={handleAddCandidatesToList}
            showAskEden={false}
          />
        </div>
      )}
    </>
  );
};

export default Autosuggest;

interface ICandidateCardProps {
  candidate: CandidateTypeSkillMatch;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const CandidateCard = ({ candidate, onClick }: ICandidateCardProps) => {
  return (
    <div
      className="border-edenGray-100 group relative mr-4 inline-block w-80 cursor-pointer whitespace-normal rounded-md border bg-white last:mr-0"
      onClick={onClick}
    >
      <div className="relative flex h-full px-4 pb-2 pt-2" onClick={onClick}>
        <div className="mr-4 flex items-center">
          <Avatar src={candidate.user?.discordAvatar || ""} size="sm" />
        </div>
        <div className="flex w-3/4 flex-col justify-center">
          <p className="font-bold">{candidate.user?.discordName}</p>
          {candidate.analysisCandidateEdenAI?.background?.oneLiner && (
            <p className="text-edenGray-600 w-full whitespace-normal text-xs">
              {candidate.analysisCandidateEdenAI.background.oneLiner}
            </p>
          )}
        </div>
        <Button
          className="bg-edenGreen-100 group-hover:bg-edenGreen-200 absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center !rounded-full !p-0"
          variant="tertiary"
        >
          <FaArrowRight size={"0.75rem"} />
        </Button>
        {candidate.analysisCandidateEdenAI?.background?.content && (
          <EdenTooltip
            id={candidate.user?._id + "_tooltip"}
            innerTsx={
              <div className="w-96">
                <span className="text-gray-600">
                  {candidate.analysisCandidateEdenAI?.background?.content}
                </span>
              </div>
            }
            place="top"
            effect="solid"
            backgroundColor="white"
            border
            borderColor="#e5e7eb"
            padding="0.5rem"
          >
            <div className="bg-edenPink-200 absolute -right-2 -top-1 h-5 w-5 rounded-full p-1">
              <EdenIconExclamation className="h-full w-full" />
            </div>
          </EdenTooltip>
        )}
      </div>
    </div>
  );
};
