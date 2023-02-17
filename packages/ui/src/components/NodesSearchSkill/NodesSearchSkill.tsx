/* eslint-disable camelcase */
import { useQuery } from "@apollo/client";
import { FIND_MAIN_NODES, NODE_AUTOCOMPLETE } from "@eden/package-graphql";
import { LevelEnum, Maybe } from "@eden/package-graphql/generated";
import { Loading, NodesExpandable } from "@eden/package-ui/src";
import { Combobox } from "@headlessui/react";
import { EmojiSadIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

type LevelProp = {
  title: string;
  level: string;
};

type skillType = {
  skillInfo: {
    nodeID: string;
    subNodeID: string;
    subSubNodeID: string;
  };
  level: Maybe<LevelEnum> | undefined;
};

export interface NodesCategorySkillProps {
  skills: skillType[] | undefined;
  setSkills: any;
  levels?: LevelProp[];
}

export const NodesSearchSkill = ({
  skills,
  setSkills,
  levels,
}: NodesCategorySkillProps) => {
  const [query, setQuery] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [inFocus, setInFocus] = useState<boolean>(false);
  const [debouncedQuery] = useDebounce(query, 1000);

  const { data: dataSkills, loading: skillLoading } = useQuery(
    NODE_AUTOCOMPLETE,
    {
      variables: {
        fields: {
          search: debouncedQuery,
          nodeType: "skill",
          rootType: "expertise",
        },
      },
      skip: !debouncedQuery,
    }
  );

  const { data: AllSkillsData, loading: ALLSkillsDataLoading } = useQuery(
    FIND_MAIN_NODES,
    {
      variables: {
        fields: {
          node: "expertise",
        },
      },
    }
  );

  const AllCategoery: any = useMemo(() => [], []);

  useEffect(() => {
    if (AllSkillsData?.findNodes && ALLSkillsDataLoading === false) {
      AllSkillsData.findNodes.forEach((skill: any) => {
        AllCategoery.push({
          _id: skill._id,
          category: skill.name,
        });
        // console.log("all skill data", AllSkillsData.findNodes);
      });
    }
  }, [AllSkillsData, ALLSkillsDataLoading]);

  const filteredItems = dataSkills
    ? dataSkills.nodes_autocomplete?.filter((item: any) => {
        return item.name.toLowerCase();
      })
    : [];

  const groups = filteredItems?.reduce((groups: any, item: any) => {
    // console.log("groups", groups[item.name]);
    return {
      ...groups,
      [item.name!]: [...(groups[item.subNodes!] || []), item],
    };
  }, {});

  const allSkillGroup = AllCategoery?.reduce((groups: any, item: any) => {
    return {
      ...groups,
      [item.category!]: [...(groups[item.category] || []), item],
    };
  }, {});

  useEffect(() => {
    if (dataSkills?.length > 0) {
      setSelected(dataSkills?.nodes_autocomplete[0]._id);
    }
  }, [dataSkills]);

  return (
    <Combobox
      value={skills}
      // TODO: remove this any
      onChange={(item: any) => {
        setIsOpen(item._id === item._id);
        setSelected(item._id || null);
        if (isOpen) {
          setIsOpen(false);
          setSelected(null);
        }
      }}
    >
      <div className="relative mt-1 mb-4 w-full">
        <div className="relative z-30">
          <SearchIcon
            className="pointer-events-none absolute top-2.5 left-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Combobox.Input
            style={{
              boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.15)",
            }}
            className="h-10 w-full rounded-xl border-0 bg-white pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search for a skill.."
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => {
              setInFocus(true);
              setIsOpen(true);
            }}
          />
        </div>
        {filteredItems.length >= 0 && debouncedQuery.length >= 0 && isOpen && (
          <div
            className="fixed top-0 left-0 z-20 h-screen w-screen"
            onClick={() => {
              setIsOpen(false);
              setInFocus(false);
            }}
          ></div>
        )}

        {skillLoading && isOpen && (
          <div className="absolute top-12 z-40 border-t border-gray-100 bg-white py-14 px-6 text-center text-sm sm:px-14">
            <Loading />
          </div>
        )}

        {filteredItems.length >= 0 && debouncedQuery.length >= 0 && isOpen && (
          <Combobox.Options
            static
            className="scrollbar-hide absolute top-12 z-30 h-80 w-full scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto rounded-md border bg-white pb-2 shadow-lg"
          >
            {Object.entries(
              debouncedQuery === "" && inFocus ? allSkillGroup : groups!
            ).map(([category, id], index) => (
              <NodesExpandable
                query={debouncedQuery}
                category={category}
                // @ts-ignore
                id={id[0]._id}
                skills={skills!}
                isOpen={isOpen}
                selected={selected}
                dataSkills={dataSkills?.nodes_autocomplete}
                subNodes={dataSkills?.nodes_autocomplete[index].subNodes}
                setIsOpen={setIsOpen}
                setSkills={setSkills}
                key={index}
                setSelected={setSelected}
                levels={levels}
                // setExpanding={(e: boolean) => setInFocus(e)}
                isExpandingOpenByDefault={debouncedQuery == "" ? false : !index}
              />
            ))}
          </Combobox.Options>
        )}

        {dataSkills?.nodes_autocomplete.length <= 0 &&
          debouncedQuery !== "" &&
          filteredItems!.length === 0 &&
          isOpen && (
            <div className="absolute top-12 z-30 border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14">
              <EmojiSadIcon
                className="mx-auto h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
              <p className="mt-4 font-semibold text-gray-900">No skill found</p>
              <p className="mt-2 text-gray-500">
                We couldn’t find anything with that term. Please try again.
              </p>
            </div>
          )}
      </div>
    </Combobox>
  );
};
