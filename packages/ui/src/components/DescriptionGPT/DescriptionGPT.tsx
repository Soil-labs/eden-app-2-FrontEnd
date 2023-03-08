import { gql, useMutation } from "@apollo/client";
import { Button, TextArea } from "@eden/package-ui";
import { useState } from "react";

export const MESSAGE_TO_GPT = gql`
  mutation ($fields: messageToGPTInput!) {
    messageToGPT(fields: $fields) {
      message
    }
  }
`;

export const INPUT_TO_GPT = gql`
  mutation ($fields: inputToGPTInput!) {
    inputToGPT(fields: $fields) {
      descriptionRole
      benefitsRole
      expectationsRole
    }
  }
`;

enum CATEGORY {
  Skill = "skill",
  Project = "project",
  Role = "role",
}

type AiButtonState =
  | "Eden AI Autocomplete"
  | "Autocomplete in progress"
  | "Eden AI Refine";

export interface IDescriptionGPTProps {
  showTextArea: boolean;
  customPrompt?: string;
  messageFromParent?: string;
  oneLinerFromParent?: String;
  titleRole?: String;
  expertiseRole?: [String];
  onReturnProjectDescription?: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  onReturnRoleDescription?: React.Dispatch<React.SetStateAction<string | null>>;
  onClickGPTCondition: "messageToGPT" | "inputToGPT";
  descriptionFromAI?: string | null;
}

export const DescriptionGPT = ({
  showTextArea,
  customPrompt,
  messageFromParent,
  oneLinerFromParent,
  titleRole,
  expertiseRole,
  onReturnProjectDescription,
  onReturnRoleDescription,
  onClickGPTCondition,
  descriptionFromAI,
}: IDescriptionGPTProps) => {
  const [responseFromGTP, setResponseFromGTP] = useState("");
  const [messageToGTP, setMessageToGTP] = useState("");
  const [state, setState] = useState<AiButtonState>("Eden AI Autocomplete");

  const [messageToGPT] = useMutation(MESSAGE_TO_GPT, {
    onCompleted({ messageToGPT }) {
      if (onReturnProjectDescription && messageToGPT.message) {
        console.log("messageToGPT", messageToGPT);
        //The line below brings messageToGPT.message to the parent
        onReturnProjectDescription(messageToGPT.message);

        setState("Eden AI Refine");
        // console.log(
        //   "messageToGPT.message from onCompleted",
        //   messageToGPT.message
        // );
      }
    },
  });

  const [inputToGPT] = useMutation(INPUT_TO_GPT, {
    onCompleted({ inputToGPT }) {
      if (inputToGPT && onReturnRoleDescription)
        // console.log("+++++inputToGPT+++++", inputToGPT);
        onReturnRoleDescription(inputToGPT);
      // onReturn(messageToGPT.message);
      setState("Eden AI Refine");
    },
  });

  // const autocomplete =
  //   'I want you to act as a text extension assistant. Do not edit or change the sentences I give you in any way. I give you sentences and you return those sentences unedited with a continuation to those sentences. \nExample: \nI write: A plumber is a tradesperson who specializes in installing and maintaining systems used for water, sewage and drainage. They are responsible for installing, repairing and maintaining pipes, fixtures and other plumbing equipment.\nYou respond with:  A plumber is a tradesperson who specializes in installing and maintaining systems used for water, sewage and drainage. They are responsible for installing, repairing and maintaining pipes, fixtures and other plumbing equipment.   Plumbers also inspect structures to identify any potential problems, such as clogged drains, leaking pipes and faulty water heaters. In addition, they install appliances such as dishwashers and water heaters, and may be asked to perform basic carpentry work to install kitchen and bathroom cabinets.\nI write: Today was a crazy day in the lab, instruments were not working and our computer system went down. Everyone was scrambling to find a solution, with no luck. \nYou respond with: Today was a crazy day in the lab, instruments were not working and our computer system went down. Everyone was scrambling to find a solution, with no luck. After a few hours of troubleshooting, we realized that we needed to call in a professional. We contacted a local plumber, who arrived quickly and was able to diagnose the problem in no time. He was able to repair the faulty wiring and get our instruments and computer system back up and running. We were extremely thankful for his expertise, and all of the researchers were relieved that our experiments could get back on track.\n\nExample complete.\n\nDo not write "You respond with:" in you response\n\nHere are the sentence/sentences that I give you: \n\n\n';

  const onClickGPT = async (prompt?: any, category?: CATEGORY | undefined) => {
    if (onClickGPTCondition === "messageToGPT") {
      setState("Autocomplete in progress");
      messageToGPT({
        variables: {
          fields: {
            message: (customPrompt || "") + messageFromParent,
            category: category,
            prompt: prompt,
          },
        },
      });
    }
    if (onClickGPTCondition === "inputToGPT") {
      setState("Autocomplete in progress");
      await inputToGPT({
        variables: {
          fields: {
            oneLinerProject: oneLinerFromParent,
            titleRole: titleRole,
            descriptionProject: descriptionFromAI,
            expertiseRole: expertiseRole,
          },
        },
      });
      // console.log("inputToGPT", inputToGPT);
      // console.log(
      //   "titleRole=====",
      //   titleRole,

      //   "oneLinerFromParent======",
      //   oneLinerFromParent
      // );
    }
  };

  const handleChange = (e: any) => {
    if (!responseFromGTP) {
      setMessageToGTP(messageFromParent || "");
      // console.log("*************messageToGTP****************", messageToGTP);
    } else {
      setMessageToGTP("");
      setResponseFromGTP(e.target.value);
      // console.log("*************responseFromGTP*************", responseFromGTP);
    }
  };

  return (
    <>
      <div className=" items-end space-y-2">
        {showTextArea && (
          <TextArea
            placeholder="Write a one-liner describing your project and Eden AI will write the rest!"
            label="Project Description"
            onChange={handleChange}
            value={responseFromGTP ? responseFromGTP : messageToGTP}
            rows={8}
          />
        )}
        {state === "Eden AI Autocomplete" || state === "Eden AI Refine" ? (
          <Button
            variant="primary"
            //For category: onClick={() => onClickGPT(undefined, Category.Skill)}
            onClick={() => onClickGPT(prompt)}
          >
            {state}
          </Button>
        ) : (
          <Button variant="default" loading={true}>
            {state}
          </Button>
        )}
      </div>
    </>
  );
};
