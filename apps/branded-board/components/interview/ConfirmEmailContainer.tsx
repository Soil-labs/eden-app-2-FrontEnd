"use client";
import { useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { UPDATE_MEMBER } from "@eden/package-graphql";
import { Position } from "@eden/package-graphql/generated";
import { Button } from "@eden/package-ui";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { IoMail } from "react-icons/io5";
import { TbHeart } from "react-icons/tb";
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
  const router = useRouter();
  const { subdomain } = router.query;

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
            applicationSubmittedUrl: `https://${subdomain}.joineden.ai/interview/${position?._id}/submitted`,
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
    <div className="mx-auto flex h-full max-w-sm flex-col items-center justify-center">
      <div className="mb-6 w-full">
        <div className="bg-edenGray-100 text-edenGray-900 mb-2 flex h-12 w-12 items-center justify-center rounded-2xl pb-px pl-px">
          <TbHeart size={"1.2rem"} />
        </div>
        <p className="">All set!</p>
        <p className="text-edenGray-700 text-xs">
          {
            "We just sent you a link on your email! Click the link to confirm your application."
          }
        </p>
      </div>
      <div className="border-EdenGray-100 mb-8 flex h-[2.5rem] w-full max-w-sm items-center rounded-md border bg-white">
        <div className="border-edenGray-100 ml-auto border-r px-3">
          <IoMail size={"1.6rem"} className="text-edenGray-600" />
        </div>
        <input
          type="email"
          defaultValue={email}
          className="h-full w-full resize-none bg-transparent p-2 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </div>
      <Button
        variant="primary"
        className="hover:!bg-edenGray-100 mx-auto w-full !border-black font-normal !text-black"
        style={{ fontFamily: "Roboto, sans-serif" }}
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
