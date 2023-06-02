import { gql, useQuery } from "@apollo/client";
import { Members } from "@eden/package-graphql/generated";
import { Button, TextInputLabel } from "@eden/package-ui";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BsFillPatchCheckFill } from "react-icons/bs";

import { DropdownMenu } from "./";

const FIND_NODES = gql`
  query ($fields: findNodesInput) {
    findNodes(fields: $fields) {
      _id
      name
      node
    }
  }
`;

type EndorsementInputs = {
  node: {
    value: string;
    label: string;
  };
  message: string;
};

interface IEndorsementView3Props {
  member?: Members;
  onNext: () => void;
}

export const EndorsementView3 = ({
  member,
  onNext,
}: IEndorsementView3Props) => {
  const [showMessage, setShowMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const { register, handleSubmit, control, watch, reset } =
    useForm<EndorsementInputs>({});
  const onSubmit: SubmitHandler<EndorsementInputs> = (data) => {
    console.log("data", data);
    // console.log(data.node.value);
    // createEndorsementLink({
    //   variables: {
    //     fields: {
    //       message: data.message,
    //       nodesID: [data.node.value],
    //     },
    //   },
    // });
  };
  const { data: nodesData } = useQuery(FIND_NODES, {
    variables: {
      fields: {
        node: "Skill",
      },
    },
  });

  const baseMessage = (skill: string) =>
    `I'm updating my professional profile and would love your endorsement on Eden for my proficiency in ${skill}. Your support means a lot, Thanks!`;

  useEffect(() => {
    const subscription = watch((data) => {
      // console.log("WATCH ---- data", data);
      if (data.node?.value) {
        setShowMessage(true);
        reset({
          message: baseMessage(data.node.label || ""),
        });
      }
      if (data.message !== "") setShowButton(true);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div>
      <div className={`flex flex-col text-center`}>
        <div className={`mx-auto`}>
          <BsFillPatchCheckFill className={`h-32 w-32 text-green-400`} />
        </div>
        <div className={`text-2xl font-medium text-neutral-800`}>
          Thank you for endorsing @{member?.discordName}!
        </div>
      </div>

      <div className={`mb-4 mt-8`}>
        <div
          className={`my-2 text-center text-lg font-medium uppercase text-neutral-700`}
        >
          Invite @{member?.discordName} to endorse you
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`m-auto mt-8 h-96 max-w-xl`}>
          <div className={`my-8`}>
            <TextInputLabel>{`What do you want to be endorsed for?`}</TextInputLabel>
            <div className={`my-4`}>
              <Controller
                control={control}
                name={`node`}
                render={({ field: { onChange } }) => (
                  <DropdownMenu
                    options={nodesData?.findNodes || []}
                    onSelect={onChange}
                  />
                )}
              />
            </div>
          </div>
          {!nodesData?.findNodes && (
            <div className={`my-8`}>
              <div className={`text-center font-medium`}>
                <div className={`text-neutral-700`}>Loading Skills...</div>
                <div className={`text-neutral-700`}>
                  This may take a few seconds.
                </div>
              </div>
            </div>
          )}

          {showMessage && (
            <div className={`my-8`}>
              <TextInputLabel
                htmlFor={`message`}
              >{`Add a Message:`}</TextInputLabel>
              <textarea
                id={`message`}
                className={`input-primary`}
                required
                rows={8}
                {...register(`message`)}
              />
            </div>
          )}
        </div>
        <div className={`my-2 flex w-full justify-end`}>
          {showButton && (
            <Button type={`button`} onClick={onNext}>
              Invite
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
