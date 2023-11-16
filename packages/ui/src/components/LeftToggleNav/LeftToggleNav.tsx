import { gql, useMutation } from "@apollo/client";
import { CompanyContext, UserContext } from "@eden/package-context";
import {
  Avatar,
  Button,
  EdenAiProcessingModal,
  MenuDropdown,
  Modal,
} from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useContext, useState } from "react";
import { IconPickerItem } from "react-fa-icon-picker";
import { useForm } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
import {
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsChevronUp,
} from "react-icons/bs";
import { FaChartBar, FaFile } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";

const UPDATE_POSITION = gql`
  mutation ($fields: updatePositionInput!) {
    updatePosition(fields: $fields) {
      _id
    }
  }
`;
const AUTO_UPDATE_POSITION = gql`
  mutation AutoUpdatePositionCompInformation(
    $fields: autoUpdatePositionCompInformationInput
  ) {
    autoUpdatePositionCompInformation(fields: $fields) {
      _id
      name
      whoYouAre

      company {
        _id
        name
        description
        mission
        whatsToLove
      }
    }
  }
`;
const BULK_UPDATE_POSITION = gql`
  mutation (
    $fieldsUpdatePosition: updatePositionInput!
    $fieldsWebsiteToMemoryCompany: websiteToMemoryCompanyInput!
  ) {
    updatePosition(fields: $fieldsUpdatePosition) {
      _id
    }
    websiteToMemoryCompany(fields: $fieldsWebsiteToMemoryCompany) {
      report
      interviewQuestionsForPosition {
        originalQuestionID
        originalContent
        personalizedContent
      }
    }
  }
`;

export interface LeftToggleNavProps {
  unwrapped: boolean;
  logoLink?: string;
  onToggleNav?: () => void;
}

export const LeftToggleNav = ({
  unwrapped = false,
  logoLink = "/",
  onToggleNav,
}: LeftToggleNavProps) => {
  const router = useRouter();
  const { company, getCompanyFunc } = useContext(CompanyContext);

  const [updatePositionLoading, setUpdatePositionLoading] =
    useState<boolean>(false);
  const [unwrappedPosition, setUnwrappedPosition] =
    useState<string | null>(null);
  const [createPositionOpen, setCreatePositionOpen] = useState<boolean>(false);
  const [newPositionId, setNewPositionId] = useState<string | null>(null);

  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onCompleted(updatePositionData) {
      getCompanyFunc();
      setNewPositionId(updatePositionData.updatePosition._id);
      setUpdatePositionLoading(false);
      setCreatePositionOpen(true);
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

  const [autoUpdatePosition] = useMutation(AUTO_UPDATE_POSITION, {
    onCompleted(autoUpdatePositionData) {
      getCompanyFunc();
      router.push(
        `/${company?.slug}/jobs/${autoUpdatePositionData.autoUpdatePositionCompInformation._id}?edit=true`
      );
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

  const [bulkUpdatePosition] = useMutation(BULK_UPDATE_POSITION, {
    onCompleted() {
      // getCompanyFunc();
      autoUpdatePosition({
        variables: {
          fields: {
            positionID: newPositionId,
            mustUpdate: [
              "mission",
              "description",
              "whoYouAre",
              "whatTheJobInvolves",
              "benefits",
              "values",
              "founders",
              "whatsToLove",
            ],
          },
        },
      });
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

  const creatingPositionModal = (
    <EdenAiProcessingModal
      title="Creating position"
      open={updatePositionLoading}
    ></EdenAiProcessingModal>
  );

  const handleSubmitCreatePosition = (data: any) => {
    setUpdatePositionLoading(true);

    bulkUpdatePosition({
      variables: {
        fieldsUpdatePosition: {
          _id: newPositionId,
          name: data.name,
        },
        fieldsWebsiteToMemoryCompany: {
          positionID: newPositionId,
          message: data.description,
        },
      },
    });
  };

  const handleCreatePosition = () => {
    const randId = uuidv4();

    setUpdatePositionLoading(true);

    updatePosition({
      variables: {
        fields: {
          name: `New Opportunity ${randId}`,
          companyID: company?._id,
        },
      },
    });
  };

  const hideCreatePosition =
    router.pathname.includes("/jobs") ||
    router.pathname.includes("/subscription") ||
    router.pathname.includes("/interview/") ||
    router.pathname.includes("/create-company") ||
    router.pathname.includes("/train-eden-ai");

  const hideTalentPools =
    router.pathname.includes("/jobs") ||
    router.pathname.includes("/subscription") ||
    router.pathname.includes("/interview/") ||
    router.pathname.includes("/create-company") ||
    router.pathname.includes("/train-eden-ai");

  return (
    <nav
      className={classNames(
        "bg-edenPink-400 transition-width fixed left-0 bottom-0 z-30 flex w-screen flex-row justify-around items-center ease-in-out",
        unwrapped ? "h-[14.5rem]" : "h-16"
      )}
    >
      <button
        className="flex flex-col items-center transform active:scale-90 transition duration-150 ease-in-out hover:bg-gray-100 rounded-full"
        onClick={() => router.push("/input")}
      >
        <FaFile className="hover:bg-gray-100" />
        <span className="hover:bg-gray-100">Flow of Day</span>
      </button>
      <button
        className="flex flex-col items-center transform active:scale-90 transition duration-150 ease-in-out hover:bg-gray-100 rounded-full"
        onClick={() => router.push("/chart")}
      >
        <FaChartBar className="hover:bg-gray-100" />
        <span className="hover:bg-gray-100">Chart</span>
      </button>
      {/* <button className="flex flex-col items-center transform active:scale-90 transition duration-150 ease-in-out hover:bg-gray-100 rounded-full"
        onClick={() => router.push('/chart')}
      >
        <FaFile className="hover:bg-gray-100"/>
        <span className="hover:bg-gray-100">Button 3</span>
      </button> */}
    </nav>
  );
};

export interface UserButtonProps {
  unwrapped: boolean;
}

const UserButton = ({ unwrapped }: UserButtonProps) => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  const { company } = useContext(CompanyContext);

  const handleLogout = () => {
    signOut();
    localStorage.removeItem("eden_access_token");
  };

  const userIsAdmin =
    company?.employees &&
    company?.employees!.some(
      (_empl) =>
        _empl?.user?._id === currentUser?._id && _empl?.typeT === "ADMIN"
    );

  return currentUser ? (
    <div
      className={classNames(
        "border-edenPink-500 flex h-[5.5rem] items-center border-t p-4",
        unwrapped ? "" : "justify-center"
      )}
    >
      <div className={"relative mr-auto flex w-2/3 items-center"}>
        <div className="z-10">
          <MenuDropdown
            positionX="right"
            positionY="top"
            clickableElement={
              <Avatar size="xs" src={currentUser.discordAvatar!} />
            }
          >
            {[
              userIsAdmin ? (
                <li
                  key={0}
                  className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
                  onClick={() => {
                    router.push(`/${company.slug}/dashboard/pending-requests`);
                  }}
                >
                  user access requests
                </li>
              ) : (
                <></>
              ),
              <li
                key={1}
                className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
                onClick={handleLogout}
              >
                <FiLogOut className="inline pb-px" size={16} />
                {" log out"}
              </li>,
            ]}
          </MenuDropdown>
        </div>
        {unwrapped && (
          <span className="font-Moret text-edenGreen-600 ml-2 whitespace-nowrap">
            {currentUser.discordName}
          </span>
        )}
      </div>
      {unwrapped && (
        <FiLogOut className="cursor-pointer" size={20} onClick={handleLogout} />
      )}
    </div>
  ) : null;
};

export interface CreatePositionModalProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: any) => void;
}

const CreatePositionModal = ({
  open,
  onClose,
  onSubmit,
}: CreatePositionModalProps) => {
  const { register, handleSubmit } = useForm<any>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <Modal open={open} onClose={onClose} closeOnEsc>
      <h2 className="text-edenGreen-600 mb-4 text-center">
        Launch opportunity
      </h2>
      <form>
        <div className="mb-4">
          <label className="text-edenGray-700 mb-1 block text-sm">
            Title of your opportunity
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Write a title"
            className="border-edenGray-500 block w-full rounded-md border bg-transparent px-3 py-2 focus:outline-none"
          />
        </div>
        <div className="mb-8">
          <label className="text-edenGray-700 mb-1 block text-sm">
            {
              "Paste your job description below. Don't worry about making it look pretty, we'll fix all that in a bit."
            }
          </label>
          <textarea
            {...register("description")}
            rows={5}
            placeholder="This is a sample text..."
            className="border-edenGray-500 block w-full rounded-md border bg-transparent px-3 py-2 focus:outline-none"
          />
        </div>
        <Button
          onClick={handleSubmit((data) => onSubmit(data))}
          variant="secondary"
          className="mx-auto block"
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
};
