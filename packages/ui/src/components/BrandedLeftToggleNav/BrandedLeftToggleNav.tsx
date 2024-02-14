import { gql, useMutation } from "@apollo/client";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import {
  CompanyContext,
  DynamicSessionContext,
  UserContext,
} from "@eden/package-context";
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
  mutation autoUpdatePositionCompInformation_V2(
    $fields: autoUpdatePositionCompInformationInput
  ) {
    autoUpdatePositionCompInformation_V2(fields: $fields) {
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

export interface BrandedLeftToggleNavProps {
  unwrapped: boolean;
  logoLink?: string;
  onToggleNav?: () => void;
}

export const BrandedLeftToggleNav = ({
  unwrapped = false,
  logoLink = "/",
  onToggleNav,
}: BrandedLeftToggleNavProps) => {
  const router = useRouter();
  const { company, getCompanyFunc } = useContext(CompanyContext);

  const [updatePositionLoading, setUpdatePositionLoading] =
    useState<boolean>(false);
  const [unwrappedPosition, setUnwrappedPosition] = useState<string | null>(
    null
  );
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
        `/jobs/${autoUpdatePositionData.autoUpdatePositionCompInformation_V2._id}?edit=true`
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
            // mustUpdate: [
            //   "mission",
            //   "description",
            //   "whoYouAre",
            //   "whatTheJobInvolves",
            //   "benefits",
            //   "values",
            //   "founders",
            //   "whatsToLove",
            // ],
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
    router.pathname.includes("/train-eden-ai") ||
    router.pathname.includes("/redirect-page");

  const hideTalentPools =
    router.pathname.includes("/jobs") ||
    router.pathname.includes("/subscription") ||
    router.pathname.includes("/interview/") ||
    router.pathname.includes("/create-company") ||
    router.pathname.includes("/train-eden-ai") ||
    router.pathname.includes("/redirect-page");

  const _link = company?.slug ? `/dashboard/${company?.slug}` : logoLink;

  return (
    <nav
      className={classNames(
        "bg-edenPink-400 transition-width fixed left-0 top-0 z-30 flex h-screen flex-col ease-in-out",
        unwrapped ? "w-[14.5rem]" : "w-16"
      )}
    >
      {/* ---- Eden logo section ---- */}
      <section className="border-edenPink-500 relative flex h-[4.5rem] items-center border-b p-4">
        <Link href={_link}>
          {unwrapped ? (
            <img
              src="/eden-imagotype.png"
              alt="Eden Protocol"
              width={68}
              className="cursor-pointer"
            />
          ) : (
            <Image
              src="/eden-logo.png"
              alt=""
              width={30}
              height={30}
              className="cursor-pointer"
            />
          )}
        </Link>
        <div
          className="color-edenGreen-600 bg-edenPink-500 absolute -bottom-3 -right-2 z-10 -mb-px flex h-12 h-6 w-5 w-6 cursor-pointer items-center justify-center rounded-md"
          onClick={onToggleNav}
        >
          {unwrapped ? (
            <BsChevronLeft className="w-3" />
          ) : (
            <BsChevronRight className="w-3" />
          )}
        </div>
      </section>

      {/* ---- Talent Pools Section ---- */}
      <section className="scrollbar-hide relative mb-auto max-h-[calc(100vh-15rem)] overflow-y-scroll px-4 py-8">
        {company && !hideTalentPools && (
          <>
            <h3
              className={classNames(
                "transition-height mb-4 overflow-hidden whitespace-nowrap ease-in-out",
                unwrapped ? "h-6" : "h-0"
              )}
            >
              Your Talent Pools
            </h3>
            {company &&
              company.positions &&
              company.positions
                .filter(
                  (_position) =>
                    _position?.status !== "ARCHIVED" &&
                    _position?.status !== "DELETED"
                )
                .map((position, index) => (
                  <Link
                    key={index}
                    href={`/dashboard/${company.slug}/${position?._id}`}
                  >
                    <div
                      className={classNames(
                        "hover:bg-edenPink-200 relative -mx-4 min-h-[3rem] w-[calc(100%+2rem)] px-4 py-2",
                        unwrapped ? "border-edenPink-500 border-b" : "",
                        router.query.positionID === position?._id
                          ? "bg-edenPink-200"
                          : ""
                      )}
                    >
                      <div className="flex items-center justify-center">
                        {router.query.positionID === position?._id && (
                          <div className="bg-edenGreen-500 absolute left-0 top-0 h-full w-1"></div>
                        )}
                        <div className="text-edenGreen-500 flex h-6 w-6 items-center justify-center rounded-md bg-white bg-opacity-30">
                          <IconPickerItem
                            icon={position?.icon || "FaCode"}
                            size={"1rem"}
                            color="#00462C"
                          />
                        </div>
                        {unwrapped && (
                          <div className="ml-2 mr-auto w-full">
                            <div className="whitespace-nowrap text-sm font-bold">
                              {position?.name?.slice(0, 20)}
                              {position?.name?.length! > 20 ? "..." : ""}
                              {position?.talentList ? (
                                <div
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setUnwrappedPosition(
                                      unwrappedPosition === position?._id
                                        ? null
                                        : position._id!
                                    );
                                  }}
                                  className="hover:bg-edenPink-500 flexitems-center absolute right-1 top-5 flex h-5 w-5 items-center justify-center justify-center rounded-full"
                                >
                                  {unwrappedPosition === position?._id ? (
                                    <BsChevronUp className="-mb-px w-3" />
                                  ) : (
                                    <BsChevronDown className="-mb-px w-3" />
                                  )}
                                </div>
                              ) : null}
                            </div>
                            <p className="text-edenGray-700 whitespace-nowrap text-xs">
                              {company?.name}
                            </p>
                          </div>
                        )}
                      </div>
                      {unwrapped && unwrappedPosition === position?._id && (
                        <ul className="mb-2 mt-2 pl-6">
                          {[
                            { _id: "000", name: "All candidates" },
                            ...position?.talentList!,
                          ]?.map((_talentList, index) => (
                            <li key={index}>
                              <Link
                                href={`/dashboard/${company.slug}/${
                                  position?._id
                                }${
                                  _talentList?._id !== "000"
                                    ? "?listID=" + _talentList?._id
                                    : ""
                                }`}
                                className="text-xs hover:font-bold"
                              >
                                {_talentList?.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Link>
                ))}
          </>
        )}
      </section>

      {/* ---- Create Position Button Section ---- */}
      {!hideCreatePosition && (
        <section className="h-20 pt-4">
          <Button
            className={classNames(
              "mx-auto flex items-center whitespace-nowrap",
              unwrapped ? "" : "!px-2"
            )}
            onClick={handleCreatePosition}
          >
            <BiPlus size={"1.3rem"} className="" />
            {unwrapped && (
              <span className="font-Moret ml-1">Add Opportunity</span>
            )}
          </Button>
          {creatingPositionModal}
          <CreatePositionModal
            onClose={() => setCreatePositionOpen(false)}
            open={createPositionOpen}
            onSubmit={handleSubmitCreatePosition}
          />
        </section>
      )}

      {/* ---- User Button Section ---- */}
      <section className={classNames(!company ? "mt-auto" : "")}>
        <UserButton unwrapped={unwrapped} />
      </section>
    </nav>
  );
};

interface UserButtonProps {
  unwrapped: boolean;
}

const UserButton = ({ unwrapped }: UserButtonProps) => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  const { company } = useContext(CompanyContext);
  const { handleLogOut } = useDynamicContext();
  const { edenSession } = useContext(DynamicSessionContext);

  const handleLogout = () => {
    handleLogOut();
    localStorage.removeItem("eden_access_token");
  };

  const userIsAdmin =
    (company?.employees &&
      company?.employees?.some(
        (_empl) =>
          _empl?.user?._id === currentUser?._id && _empl?.typeT === "ADMIN"
      )) ||
    edenSession?.accessLevel === 5;

  const menuItems = userIsAdmin
    ? [
        <li
          key={0}
          className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
          onClick={() => {
            router.push(`/dashboard/${company?.slug}/pending-requests`);
          }}
        >
          manage employees
        </li>,
        <li
          key={1}
          className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
          onClick={handleLogout}
        >
          <FiLogOut className="inline pb-px" size={16} />
          {" log out"}
        </li>,
      ]
    : [
        <li
          key={1}
          className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
          onClick={handleLogout}
        >
          <FiLogOut className="inline pb-px" size={16} />
          {" log out"}
        </li>,
      ];

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
            {menuItems}
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

interface CreatePositionModalProps {
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
