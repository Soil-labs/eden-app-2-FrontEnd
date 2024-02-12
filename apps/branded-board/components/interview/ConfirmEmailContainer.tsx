"use client";
import { useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { UPDATE_MEMBER } from "@eden/package-graphql";
import { Position } from "@eden/package-graphql/generated";
import { Button } from "@eden/package-ui";
import axios from "axios";
import { useContext, useState } from "react";
import { IoMail } from "react-icons/io5";
import { toast } from "react-toastify";

interface IConfirmEmailContainerProps {
  email: string;
  position?: Position;
}

const ConfirmEmailContainer = ({
  email,
  position,
}: IConfirmEmailContainerProps) => {
  const { currentUser } = useContext(UserContext);

  const [value, setValue] = useState<string>(email);
  const emailIsValid = value.includes("@") && value.includes(".");

  const [updateMember, { loading: loadingUpdateMember }] = useMutation(
    UPDATE_MEMBER,
    {
      onCompleted({}) {
        console.log("completed");
        axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/mail-service/send-mail-confirm-application` as string,
          {
            mailTo: value,
            candidateName: currentUser?.discordName,
            jobTitle: position?.name,
            companyName: position?.company?.name,
            applicationSubmittedUrl: `https://edenprotocol.app/interview/${position?._id}/submitted`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      },
      onError: () => {
        toast.error("Server error");
      },
    }
  );

  const handleSendEmail = (_email: string) => {
    console.log("send email", _email);
    updateMember({
      variables: {
        fields: { _id: currentUser?._id, conduct: { email: value } },
      },
    });
  };

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center">
      <div className="bg-edenPink-100 mx-auto mb-2 block w-fit rounded-full">
        {image}
      </div>
      <h2 className="text-edenGreen-600">Confirm your application.</h2>
      <h3 className="text-edenGreen-600 mb-4">
        Click the link in the e-mail I just sent you!
      </h3>
      <p>Check your inbox - be sure to check your spam.</p>
      <p className="mb-4 text-xs">
        & make sure to mark my e-mails as “not spam” if I do end up there. 🙃
      </p>
      {email ? (
        <p className="mb-2">This👇 is the e-mail I used.</p>
      ) : (
        <p className="mb-2">Submit your email here👇</p>
      )}
      <div className="border-EdenGray-100 mb-8 flex w-72 items-center rounded-md border bg-white">
        <div className="border-edenGray-100 ml-auto border-r px-3">
          <IoMail size={"1.6rem"} className="text-edenGray-600" />
        </div>
        <input
          type="email"
          defaultValue={email}
          className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </div>
      <Button
        variant="secondary"
        className="mx-auto"
        onClick={() => {
          handleSendEmail(value);
        }}
        disabled={!emailIsValid || loadingUpdateMember}
        loading={loadingUpdateMember}
      >
        Send Again
      </Button>
    </div>
  );
};

export default ConfirmEmailContainer;

const image = (
  <svg
    width="98"
    height="98"
    viewBox="0 0 98 98"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M62.4715 46.5886V44.1629C62.4715 40.1756 59.8094 36.9297 55.8601 36.9297H43.11C39.1621 36.9297 36.5 40.1756 36.5 44.1629V53.0818C36.5 57.072 39.1621 60.315 43.11 60.3048H49.3668"
      stroke="#00462C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M57.1493 44.5273L51.38 49.2196C50.2927 50.0836 48.7529 50.0836 47.6657 49.2196L41.8467 44.5273"
      stroke="#00462C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M54.455 56.5052C53.934 54.8764 54.5426 53.0171 56.2517 52.4668C57.1506 52.1807 58.1328 52.3457 58.8875 52.912C59.6435 52.3501 60.6228 52.1851 61.5204 52.4668C63.2279 53.0171 63.8424 54.8764 63.3213 56.5052C62.5098 59.0827 58.8875 61.0705 58.8875 61.0705C58.8875 61.0705 55.2942 59.1133 54.455 56.5052Z"
      stroke="#00462C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M77.0308 23.0166L70.0025 30.0448M25.0586 74.9892L32.0867 67.9569M77.0308 74.9892L70.0025 67.9569M25.0586 23.0166L32.0867 30.0448"
      stroke="#00462C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      opacity="0.4"
      d="M51.042 12.25V22.1903M51.042 85.75V75.8095M87.792 49H77.8515M14.292 49H24.2323"
      stroke="#00462C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
