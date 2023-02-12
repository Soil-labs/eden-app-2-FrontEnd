import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { FIND_ROLE_TEMPLATES, UPDATE_MEMBER } from "@eden/package-graphql";
import {
  Maybe,
  Members,
  Mutation,
  Node,
  NodesType,
  PreferencesType,
  PreferencesTypeFind,
  RoleTemplate,
} from "@eden/package-graphql/generated";
import {
  // BatteryStepper,
  Button,
  Card,
  FillSocialLinks,
  IPREFERENCES_TITLE,
  Loading,
  PREFERENCES_TITLE,
  RoleSelector,
  SelectNodes,
  TextArea,
  UserExperienceCard,
} from "@eden/package-ui";
import { STEPS } from "@eden/package-ui/utils/enums/fill-profile-steps";
import { CheckIcon } from "@heroicons/react/outline";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

export interface IFillUserProfileContainerProps {
  state?: Members;
  setState: Dispatch<SetStateAction<any>>;
  step?: string | undefined;
  setStep: Dispatch<SetStateAction<STEPS>>;
  setView?: Dispatch<SetStateAction<"grants" | "profile">>;
  experienceOpen?: number | null;
  percentage?: number;
  setExperienceOpen?: React.Dispatch<React.SetStateAction<number | null>>;
}

const UPDATE_NODES_MEMBER = gql`
  mutation ($fields: updateNodesToMemberInput!) {
    updateNodesToMember(fields: $fields) {
      _id
    }
  }
`;
const ADD_PREFERENCES_TO_MEMBER = gql`
  mutation ($fields: addPreferencesToMemberInput!) {
    addPreferencesToMember(fields: $fields) {
      _id
    }
  }
`;

export const FillUserProfileContainer = ({
  step,
  state,
  setState,
  setStep,
  setView,
  setExperienceOpen,
  percentage = 0,
}: IFillUserProfileContainerProps) => {
  const { currentUser } = useContext(UserContext);
  //   const [salaries, setSalaries] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [updateNodes, {}] = useMutation(UPDATE_NODES_MEMBER, {
    onCompleted({ updateNodesToMember }: Mutation) {
      if (!updateNodesToMember) console.log("updateNodesToMember is null");
      console.log("updateNodesToMember", updateNodesToMember);
    },
    onError: () => {
      setSubmitting(false);
    },
  });

  const [addPreferences, {}] = useMutation(ADD_PREFERENCES_TO_MEMBER, {
    onCompleted({ addPreferencesToMember }: Mutation) {
      if (!addPreferencesToMember)
        console.log("addPreferencesToMember is null");
      console.log("addPreferencesToMember", addPreferencesToMember);
    },
    onError: () => {
      setSubmitting(false);
    },
  });

  const [updateMember] = useMutation(UPDATE_MEMBER, {
    onCompleted({ updateMember }: Mutation) {
      if (!updateMember) console.log("updateMember is null");
      // console.log("updateMember", updateMember);
      updateNodes({
        variables: {
          fields: {
            nodeType: "sub_expertise",
            nodesID: state?.nodes
              ?.filter((node) => node?.nodeData?.node === "sub_expertise")
              .map((node) => node?.nodeData?._id),
            memberID: currentUser?._id,
          },
        },
        context: { serviceName: "soilservice" },
      });
    },
    onError: () => {
      setSubmitting(false);
    },
  });

  const { data: dataRoles } = useQuery(FIND_ROLE_TEMPLATES, {
    variables: {
      fields: {},
    },
    context: { serviceName: "soilservice" },
  });

  const handleSetRole = (value: RoleTemplate) => {
    setState({
      ...state,
      memberRole: value,
    });
  };

  const handleSetBio = (value: string) => {
    setState({
      ...state,
      bio: value,
    });
  };

  const handleSetBackground = (value: any[]) => {
    setState({
      ...state,
      previusProjects: value,
    });
  };

  const handleSetNodes = (value: Maybe<Node | undefined>[]) => {
    setState({
      ...state,
      nodes: value.map((item: Maybe<Node | undefined>) => ({
        nodeData: item,
      })) as NodesType,
    });
  };

  const handleSetPreferences = () => {
    setState({
      ...state,
      preferences: preferences,
    });
  };

  const handleSubmitForm = () => {
    const fields = {
      bio: state?.bio,
      hoursPerWeek: state?.hoursPerWeek,
      links: state?.links?.map((item: any) => ({
        url: item?.url,
        name: item?.name,
      })),
      memberRole: state?.memberRole?._id || undefined,
      previusProjects: state?.previusProjects?.map((item: any) => ({
        description: item.description,
        endDate: item.endDate,
        startDate: item.startDate,
        title: item.title,
      })),
      onbording: {
        signup: true,
        percentage: percentage,
      },
    };

    updateMember({
      variables: {
        fields: fields,
      },
      context: { serviceName: "soilservice" },
    });
  };

  const handleSubmitPreferences = () => {
    const fields = {
      memberID: currentUser?._id,
      preferences: Object.keys(preferences).map((key) => ({
        preference: key,
        interestedMatch: (
          preferences[key as keyof PreferencesType] as PreferencesTypeFind
        )?.interestedMatch,
      })),
    };

    addPreferences({
      variables: {
        fields: fields,
      },
      context: { serviceName: "soilservice" },
    });
  };

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

  useEffect(() => {
    handleSetPreferences();
  }, [preferences]);

  return (
    <Card className="bg-white p-4">
      <div className="scrollbar-hide h-8/10 overflow-scroll">
        <section className="mb-12 grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <h2 className="mb-2 text-lg font-medium">
              {`Hello & Welcome! Let’s complete your profile step by step 🚀`}
            </h2>
            <p>
              {`Your profile is at ${percentage}% right now. In order to be visible to
                other members your profile should be at least 50% complete.`}
            </p>
          </div>
          {/* <div className="col-span-1">
            <BatteryStepper showPercentage batteryPercentage={percentage} />
          </div> */}
        </section>
        {!currentUser && (
          <div className="h-80">
            <Loading title="Loading your profile..." />
          </div>
        )}
        {submitting && (
          <div className="h-80">
            <Loading title="Submitting..." />
          </div>
        )}
        {currentUser && !submitting && (
          <section className="mb-4">
            {step === STEPS.ROLE && (
              <>
                <p className="mb-4">{`Let's start with your role:`}</p>
                <RoleSelector
                  value={state?.memberRole?.title || ""}
                  roles={
                    dataRoles?.findRoleTemplates as Maybe<
                      Array<Maybe<RoleTemplate>>
                    >
                  }
                  onSelect={(val) => {
                    handleSetRole(val as RoleTemplate);
                  }}
                />

                <p className="mb-4 mt-6">{`Choose what you use Eden Network for:`}</p>
                <div className="flex w-full flex-wrap">
                  {Object.keys(preferences).map((key: string, index) => (
                    <div key={index} className="relative mr-4 mb-4">
                      <input
                        type="checkbox"
                        checked={
                          (
                            preferences[
                              key as keyof PreferencesType
                            ] as PreferencesTypeFind
                          )?.interestedMatch || false
                        }
                        id={key}
                        className="peer hidden"
                        onChange={(e) => {
                          // console.log(e.target.checked);
                          setPreferences({
                            ...preferences,
                            [key]: {
                              interestedMatch: e.target.checked || null,
                            },
                          });
                        }}
                      />
                      <label
                        htmlFor={key}
                        className="peer-checked:text-accentColor peer-checked:border-accentColor border-soilGray block select-none rounded-full border px-4 py-2 peer-checked:border-2 peer-checked:pr-10 peer-checked:font-bold"
                      >
                        {PREFERENCES_TITLE[key as keyof IPREFERENCES_TITLE]}
                      </label>
                      <label
                        htmlFor={key}
                        className="absolute top-2 right-2 hidden peer-checked:block"
                      >
                        <CheckIcon className="text-accentColor" width={30} />
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
            {step === STEPS.BIO && (
              <>
                <p>{`Add your expertise:`}</p>
                <SelectNodes
                  nodeType={"expertise"}
                  selectedNodes={state?.nodes}
                  onChangeNodes={(val) => {
                    handleSetNodes(val);
                  }}
                />
                <p>{`Please write a short bio!`}</p>
                <TextArea
                  onChange={(e) => {
                    handleSetBio(e.target.value);
                  }}
                  value={(state?.bio as string) || ""}
                />
              </>
            )}
            {/* {step === STEPS.COMPENSATION && (
              <>
                <p>{`What's your expected compensation?`}</p>
                <SalaryRangeChart
                  data={salaries}
                  onChange={(val) => {
                    setState({
                      ...state,
                      expectedSalary: val.values[1],
                    });
                  }}
                />
              </>
            )} */}
            {step === STEPS.SOCIALS && (
              <>
                <p>{`Share your socials!`}</p>
                <FillSocialLinks
                  links={currentUser?.links || []}
                  onChange={(val) => {
                    setState({
                      ...state,
                      links: val,
                    });
                  }}
                />
              </>
            )}
            {step === STEPS.EXP && (
              <UserExperienceCard
                background={state?.previusProjects}
                handleChange={(val) => handleSetBackground(val)}
                handleChangeOpenExperience={(val) => {
                  if (setExperienceOpen) setExperienceOpen(val);
                }}
              />
            )}
          </section>
        )}
        {currentUser && !submitting && (
          <section className="relative flex pb-4">
            {step === STEPS.EXP &&
              percentage < 50 &&
              !state?.previusProjects?.some((bg: any) => !!bg.title) && (
                <section className="absolute right-0 -top-6">
                  <span className="text-red-400">{`fill minimum 50% and 1 background`}</span>
                </section>
              )}
            {step !== STEPS.ROLE && (
              <Button
                onClick={() => {
                  if (step === STEPS.BIO && setStep) setStep(STEPS.ROLE);
                  if (step === STEPS.SOCIALS && setStep) setStep(STEPS.BIO);
                  if (step === STEPS.EXP && setStep) setStep(STEPS.SOCIALS);
                }}
              >
                Prev
              </Button>
            )}
            {step !== STEPS.EXP && (
              <Button
                className="ml-auto"
                onClick={() => {
                  if (step === STEPS.ROLE && setStep) {
                    const hasPreferences = state?.preferences
                      ? (
                          Object.keys(state?.preferences) as [
                            keyof IPREFERENCES_TITLE
                          ]
                        ).filter(
                          (key) =>
                            state.preferences![key]?.interestedMatch &&
                            key.includes("find")
                        ).length > 0
                      : false;

                    if (!state?.memberRole?._id) {
                      toast.error("Please Choose Role");
                      return;
                    }
                    if (!hasPreferences) {
                      toast.error("Please Choose Preferences");
                      return;
                    }
                    setStep(STEPS.BIO);
                    handleSubmitForm();
                    handleSubmitPreferences();
                  }
                  if (step === STEPS.BIO && setStep) {
                    if (!state?.bio || state?.bio?.length < 30) {
                      toast.error("Bio should be at least 30 characters");
                      return;
                    }
                    if (state?.nodes?.length === 0) {
                      toast.error("Please Choose Your Expertise");
                      return;
                    }
                    setStep(STEPS.SOCIALS);
                    handleSubmitForm();
                  }
                  if (step === STEPS.SOCIALS && setStep) {
                    setStep(STEPS.EXP);
                    handleSubmitForm();
                  }
                }}
              >
                Next
              </Button>
            )}
            {step === STEPS.EXP && (
              <Button
                variant="primary"
                className={`ml-auto disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-200`}
                disabled={
                  percentage < 50 &&
                  !state?.previusProjects?.some((bg: any) => !!bg.title)
                }
                onClick={() => {
                  handleSubmitForm();
                  setStep(STEPS.ROLE);
                  setView && setView("grants");
                }}
              >
                Submit
              </Button>
            )}
          </section>
        )}
      </div>
    </Card>
  );
};
