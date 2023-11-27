import { gql, useMutation, useQuery } from "@apollo/client";
import { CompanyContext } from "@eden/package-context";
import {
  AppUserLayoutNew,
  Button,
  CutTextTooltip,
  EdenAiProcessingModal,
  Modal,
} from "@eden/package-ui";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { NextPageWithLayout } from "../../_app";

const FIND_COMPANY_FROM_SLUG = gql`
  query ($fields: findCompanyFromSlugInput) {
    findCompanyFromSlug(fields: $fields) {
      _id
      name
      imageUrl
      slug
      positions {
        _id
        name
        status
        talentList {
          _id
          name
        }
      }
    }
  }
`;

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

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const [companyLoading, setCompanyLoading] = useState(true);
  const { company, getCompanyFunc } = useContext(CompanyContext);
  const [updatePositionLoading, setUpdatePositionLoading] =
    useState<boolean>(false);
  const [createPositionOpen, setCreatePositionOpen] = useState<boolean>(false);
  const [comingSoon, setComingSoon] = useState<boolean>(false);
  const [newPositionId, setNewPositionId] = useState<string | null>(null);

  const { data: findCompanyData } = useQuery(FIND_COMPANY_FROM_SLUG, {
    variables: {
      fields: {
        slug: router.query.slug,
      },
    },
    onCompleted(_findCompanyData) {
      if (
        !_findCompanyData?.findCompanyFromSlug?.positions ||
        _findCompanyData?.findCompanyFromSlug?.positions?.length === 0
      ) {
        setCompanyLoading(false);
      }
    },
  });

  const handleExploreCommunities = () => {
    console.log("hey", companyLoading);
  };

  const handleSetupCustomFlow = () => {
    console.log("hey");
  };

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

  const [autoUpdatePosition] = useMutation(AUTO_UPDATE_POSITION, {
    onCompleted(autoUpdatePositionData) {
      getCompanyFunc();
      router.push(
        `/${company?.slug}/jobs/${autoUpdatePositionData.autoUpdatePositionCompInformation_V2._id}?edit=true`
      );
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

  const [bulkUpdatePosition] = useMutation(BULK_UPDATE_POSITION, {
    onCompleted() {
      autoUpdatePosition({
        variables: {
          fields: {
            positionID: newPositionId,
          },
        },
      });
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

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

  return (
    <div className="h-full">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>

      {creatingPositionModal}
      <Modal open={comingSoon} onClose={() => setComingSoon(false)} closeOnEsc>
        <div
          className={`font-poppins bg-white p-8 text-center text-3xl font-semibold text-gray-600`}
        >
          Coming Soon
        </div>
      </Modal>
      <CreatePositionModal
        onClose={() => setCreatePositionOpen(false)}
        open={createPositionOpen}
        onSubmit={handleSubmitCreatePosition}
      />

      <div className="relative mx-auto h-full max-w-screen-2xl rounded">
        <div className="z-40 grid h-full grid-cols-12 gap-4">
          <div className="bg-edenPink-100 relative col-span-3 h-full pl-1 pr-2">
            <div className="border-edenGreen-400 relative mb-2 border-b pb-2 text-center">
              <h1 className="text-edenGreen-600">
                {"Communities you're subscribed to"}
              </h1>
            </div>

            <div className="scrollbar-hide h-[calc(100%-106px)] overflow-y-auto px-2 pt-4">
              <div className="bg-edenPink-300 flex flex-row items-center rounded-lg px-2 py-4">
                <Image
                  width="56"
                  height="56"
                  src={findCompanyData?.findCompanyFromSlug?.imageUrl}
                  alt={`${findCompanyData?.findCompanyFromSlug?.name} image`}
                />
                <div className="ml-4 flex flex-col">
                  <h1 className="text-edenGreen-600">
                    {findCompanyData?.findCompanyFromSlug?.name}
                  </h1>
                  <p>5000+ active web3 developers.</p>
                </div>
              </div>
            </div>
            <div className="bg-edenPink-500 absolute bottom-0 flex w-full justify-around px-6 py-2">
              <Button
                className="w-60 text-center"
                variant="primary"
                onClick={handleExploreCommunities}
              >
                Explore more communities
              </Button>
            </div>
          </div>
          <div className="col-span-6 h-full flex-grow bg-white px-[7%]">
            <h1 className="text-edenGreen-600 mb-5">Your Opportunities</h1>
            <div className="grid-wrap scrollbar-hide grid h-[calc(100%-54px)] grid-cols-2 gap-x-[8%] gap-y-6 overflow-y-auto">
              <div
                className="flex min-h-[200px] flex-col items-center rounded-lg bg-[url('/new-opportunity.png')] bg-cover bg-no-repeat p-3 align-baseline opacity-70 hover:cursor-pointer hover:opacity-80 hover:shadow-lg"
                onClick={handleCreatePosition}
              >
                <div className="mt-9 flex aspect-square h-[30%] items-center justify-center">
                  <svg
                    width="55"
                    height="55"
                    viewBox="0 0 55 55"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M39.09 0.5C48.1575 0.5 54.25 6.865 54.25 16.3375V38.4125C54.25 47.885 48.1575 54.25 39.09 54.25H15.66C6.5925 54.25 0.5 47.885 0.5 38.4125V16.3375C0.5 6.865 6.5925 0.5 15.66 0.5H39.09ZM39.09 4.25H15.66C8.73 4.25 4.25 8.9925 4.25 16.3375V38.4125C4.25 45.7575 8.73 50.5 15.66 50.5H39.09C46.0225 50.5 50.5 45.7575 50.5 38.4125V16.3375C50.5 8.9925 46.0225 4.25 39.09 4.25ZM27.375 16.3183C28.41 16.3183 29.25 17.1583 29.25 18.1933V25.475L36.5413 25.4755C37.5763 25.4755 38.4163 26.3155 38.4163 27.3505C38.4163 28.3855 37.5763 29.2255 36.5413 29.2255L29.25 29.225V36.5107C29.25 37.5457 28.41 38.3857 27.375 38.3857C26.34 38.3857 25.5 37.5457 25.5 36.5107V29.225L18.2087 29.2255C17.1712 29.2255 16.3337 28.3855 16.3337 27.3505C16.3337 26.3155 17.1712 25.4755 18.2087 25.4755L25.5 25.475V18.1933C25.5 17.1583 26.34 16.3183 27.375 16.3183Z"
                      fill="#F9E1ED"
                    />
                  </svg>
                </div>
                <h1 className="text-edenPink-400 mt-2">
                  Launch new opportunity
                </h1>
              </div>
              {findCompanyData &&
                findCompanyData.findCompanyFromSlug.positions &&
                findCompanyData.findCompanyFromSlug.positions.map(
                  (position: any, index: number) => (
                    <div
                      className="bg-edenGreen-400 text-edenPink-400 relative min-h-[200px] rounded-lg p-3 hover:cursor-pointer hover:bg-[#6c9584] hover:shadow-lg"
                      key={`position${index}`}
                      onClick={() =>
                        router.push(
                          `/${company?.slug}/dashboard-new/${position._id}`
                        )
                      }
                    >
                      <div className="flex flex-row items-center justify-start gap-4">
                        <div className="min-w-[155px] max-w-[200px]">
                          <CutTextTooltip
                            className="text-edenPink-400 text-left"
                            text={position.name}
                          />
                        </div>
                        <svg
                          width="19"
                          height="9"
                          viewBox="0 0 19 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.17223 0.854527C8.93745 0.938686 8.79108 1.09872 8.79108 1.27277V3.98307H0.736774C0.330082 3.98307 1.14441e-05 4.19729 1.14441e-05 4.46125C1.14441e-05 4.7252 0.330082 4.93942 0.736774 4.93942H8.79108V7.64972C8.79108 7.82441 8.93745 7.98444 9.17223 8.06796C9.40701 8.15276 9.69386 8.14702 9.92078 8.05458L17.7167 4.8661C17.9309 4.77812 18.0605 4.62574 18.0605 4.46125C18.0605 4.29675 17.9309 4.14437 17.7167 4.05639L9.92078 0.867917C9.80093 0.819461 9.66439 0.794596 9.52784 0.794596C9.40603 0.794596 9.28323 0.814998 9.17223 0.854527Z"
                            fill="#00462C"
                          />
                        </svg>
                      </div>
                      <div className="text-edenGreen-200 text-left text-[8px]">
                        <span>posted on </span>
                        <span className="underline">24th of November 2023</span>
                        <span> Miltiadis Saratzidis</span>
                      </div>
                      <div className="mt-2 flex flex-col">
                        <div className="flex h-[34px] w-full flex-row items-center">
                          <div className="text-edenGreen-600 border-edenGray-100 ml-1 mr-4 flex h-[22px] w-[34px] items-center justify-center rounded-[2.78px] border bg-white text-sm">
                            23
                          </div>
                          <div className="text-edenGreen-600 text-base font-bold">
                            <span className="font-Moret underline">
                              Talents to review
                            </span>
                            <span className="font-Moret"> in pools</span>
                          </div>
                        </div>
                        <div className="flex h-[34px] w-full flex-row items-center">
                          <div className="text-edenGreen-600 border-edenGray-100 ml-1 mr-4 flex h-[22px] w-[34px] items-center justify-center rounded-[2.78px] border bg-white text-sm">
                            42
                          </div>
                          <div className="text-edenGreen-600 text-base font-bold">
                            <span className="font-Moret">Talents </span>
                            <span className="font-Moret underline">
                              reviewed
                            </span>
                          </div>
                        </div>
                        <div className="flex h-[34px] w-full flex-row items-center">
                          <div className="text-edenGreen-600 border-edenGray-100 ml-1 mr-4 flex h-[22px] w-[34px] items-center justify-center rounded-[2.78px] border bg-white text-sm">
                            3
                          </div>
                          <div className="text-edenGreen-600 text-base font-bold">
                            <span className="font-Moret underline">
                              Invited
                            </span>
                            <span className="font-Moret">
                              {" "}
                              for 2nd interview
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute right-5 top-6">
                        <svg
                          width="13"
                          height="3"
                          viewBox="0 0 13 3"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
                          <circle cx="6.5" cy="1.5" r="1.5" fill="white" />
                          <circle cx="11.5" cy="1.5" r="1.5" fill="white" />
                        </svg>
                      </div>
                      <div className="absolute bottom-[9px] left-2 text-[10px]">
                        <span className="underline">Link</span>
                        <span> to live post</span>
                      </div>
                      <div className="absolute bottom-[9px] right-[55px] text-[10px]">
                        <span>Published in </span>
                        <span className="underline">2/2</span>
                        <span> communities</span>
                      </div>
                      <div className="bg-edenGreen-300 absolute bottom-[9px] right-3 h-[11px] w-[34px] rounded-[10px]" />
                      <div className="bg-edenGreen-600 absolute bottom-[5.5px] right-3 h-[18px] w-[18px] rounded-full" />
                    </div>
                  )
                )}
            </div>
          </div>
          <div className="bg-edenPink-100 relative col-span-3 h-full pl-2 pr-1">
            <div className="border-edenGreen-400 relative mb-2 border-b pb-2 text-center">
              <h1 className="text-edenGreen-600">
                {"AI-powered Engage Flows"}
              </h1>
            </div>

            <div className="scrollbar-hide max-h-[calc(100%-160px)] overflow-y-auto px-2 pt-2">
              <button
                className="bg-edenPink-300 hover:bg-edenPink-400 my-4 flex w-[calc(100%-32px)] flex-row items-center rounded-md py-2 hover:cursor-pointer hover:shadow-md"
                onClick={() => setComingSoon(true)}
              >
                <div className="border-edenGreen-300 flex h-11 w-14 items-center justify-center border-r">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.40537 6.06455C2.33543 5.06666 3.65893 4.50976 5.21796 4.50976H14.2811C15.8435 4.50976 17.1675 5.06635 18.0973 6.06481C19.0214 7.05723 19.5 8.4252 19.5 9.9563V13.7453C19.5 15.2759 19.0213 16.6437 18.0971 17.636C17.1672 18.6343 15.8429 19.1908 14.2801 19.1908H5.21796C3.65557 19.1908 2.33171 18.6342 1.40222 17.6359C0.47837 16.6435 0 15.2758 0 13.7453V9.9563C0 8.4245 0.48076 7.05659 1.40537 6.06455ZM2.50267 7.08726C1.87993 7.7554 1.5 8.7358 1.5 9.9563V13.7453C1.5 14.9661 1.8785 15.9461 2.50007 16.6137C3.11601 17.2753 4.02614 17.6908 5.21796 17.6908H14.2801C15.4725 17.6908 16.3832 17.2753 16.9994 16.6136C17.6213 15.946 18 14.966 18 13.7453V9.9563C18 8.735 17.6213 7.7548 16.9995 7.08701C16.3833 6.42528 15.4729 6.00976 14.2811 6.00976H5.21796C4.03042 6.00976 3.11994 6.42498 2.50267 7.08726Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.3104 0.27669C10.5718 0.59799 10.5232 1.07038 10.2019 1.33179L4.48117 5.98624C4.15987 6.24765 3.68748 6.1991 3.42607 5.8778C3.16465 5.5565 3.2132 5.08411 3.5345 4.8227L9.2553 0.16825C9.5766 -0.0931598 10.0489 -0.0446099 10.3104 0.27669Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M14.6914 11.3203C15.1056 11.3203 15.4414 11.6561 15.4414 12.0703V14.5443C15.4414 14.9585 15.1056 15.2943 14.6914 15.2943C14.2772 15.2943 13.9414 14.9585 13.9414 14.5443V12.0703C13.9414 11.6561 14.2772 11.3203 14.6914 11.3203Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.7852 11.3203C12.1994 11.3203 12.5352 11.6561 12.5352 12.0703V14.5443C12.5352 14.9585 12.1994 15.2943 11.7852 15.2943C11.3709 15.2943 11.0352 14.9585 11.0352 14.5443V12.0703C11.0352 11.6561 11.3709 11.3203 11.7852 11.3203Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.05859 13.3071C4.05859 12.0899 5.04532 11.1016 6.26412 11.1016C7.48293 11.1016 8.4697 12.0899 8.4697 13.3071C8.4697 14.5256 7.48261 15.5126 6.26412 15.5126C5.04564 15.5126 4.05859 14.5256 4.05859 13.3071ZM6.26412 12.6016C5.87439 12.6016 5.55859 12.9177 5.55859 13.3071C5.55859 13.6971 5.87407 14.0126 6.26412 14.0126C6.65418 14.0126 6.96965 13.6971 6.96965 13.3071C6.96965 12.9177 6.65386 12.6016 6.26412 12.6016Z"
                      fill="#00462C"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3.62695 9.0332C3.62695 8.619 3.96274 8.2832 4.37695 8.2832H15.1232C15.5374 8.2832 15.8732 8.619 15.8732 9.0332C15.8732 9.4474 15.5374 9.7832 15.1232 9.7832H4.37695C3.96274 9.7832 3.62695 9.4474 3.62695 9.0332Z"
                      fill="#00462C"
                    />
                  </svg>
                </div>
                <div className="flex flex-col px-3">
                  <h1 className="text-edenGreen-600">Talent radio</h1>
                  <p className="text-edenGray-500">
                    Fav profile based recruitment
                  </p>
                </div>
              </button>
              <button
                className="bg-edenPink-300 hover:bg-edenPink-400 my-4 flex w-[calc(100%-32px)] flex-row items-center rounded-md py-2 hover:cursor-pointer hover:shadow-md"
                onClick={() => setComingSoon(true)}
              >
                <div className="border-edenGreen-300 flex h-11 w-14 items-center justify-center border-r">
                  <svg
                    width="37"
                    height="37"
                    viewBox="0 0 37 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.223 25.2281C28.262 24.4814 28.7235 23.3892 29.0797 22.2286C29.3202 21.4479 29.3884 16.9983 29.4048 15.3079C29.4167 14.1384 30.3679 13.2004 31.5375 13.2004C32.6981 13.2004 33.6464 14.1295 33.6687 15.2916C33.731 18.5463 34.0842 22.3724 33.0558 25.5159C32.1682 28.226 30.3784 30.5903 27.9354 32.0788"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22.3624 32.2318C22.3474 30.3617 22.4069 25.8915 22.6739 24.4356C23.1192 21.9868 25.494 18.6949 29.3082 19.7783"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5827 25.2281C11.5438 24.4814 11.0822 23.3892 10.726 22.2286C10.4856 21.4479 10.4173 16.9983 10.401 15.3079C10.3891 14.1384 9.43775 13.2004 8.26824 13.2004C7.10763 13.2004 6.15926 14.1295 6.137 15.2916C6.07467 18.5463 5.72144 22.3724 6.74995 25.5159C7.63747 28.226 9.42736 30.5903 11.8703 32.0788"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.4469 32.2318C17.4618 30.3617 17.4023 25.8915 17.1353 24.4356C16.6901 21.9868 14.3154 18.6949 10.5011 19.7783"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      opacity="0.4"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21.2106 14.6228H18.5954C18.1843 14.6228 17.8503 14.2889 17.8503 13.8763V11.7525H15.7221C15.311 11.7525 14.9771 11.4185 14.9771 11.0059V8.38492C14.9771 7.97381 15.311 7.63839 15.7221 7.63839H17.8503V5.51605C17.8503 5.10347 18.1843 4.76953 18.5954 4.76953H21.2106C21.6231 4.76953 21.957 5.10347 21.957 5.51605V7.63839H24.0838C24.4965 7.63839 24.8304 7.97381 24.8304 8.38492V11.0059C24.8304 11.4185 24.4965 11.7525 24.0838 11.7525H21.957V13.8763C21.957 14.2889 21.6231 14.6228 21.2106 14.6228Z"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col px-3">
                  <h1 className="text-edenGreen-600">Smart referrals</h1>
                  <p className="text-edenGray-500">
                    Ask the right people for referrals
                  </p>
                </div>
              </button>
              <button
                className="bg-edenPink-300 hover:bg-edenPink-400 my-4 flex w-[calc(100%-32px)] flex-row items-center rounded-md py-2 hover:cursor-pointer hover:shadow-md"
                onClick={() => setComingSoon(true)}
              >
                <div className="border-edenGreen-300 flex h-11 w-14 items-center justify-center border-r">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6392 20.9996L8.4647 20.1113C7.99184 19.9186 7.45964 19.9342 6.99943 20.1541L6.22789 20.5228C5.41742 20.911 4.4795 20.3195 4.48047 19.4205L4.4902 6.98325C4.4902 4.52364 5.85817 3 8.31292 3H15.721C18.1825 3 19.5203 4.52364 19.5203 6.98325V11.274"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.1047 14.8594V20.9997M17.1047 14.8594L14.6895 17.2849M17.1047 14.8594L19.5201 17.2849"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.1075 9.04297H9.13867M12.4506 12.9025H9.13867"
                      stroke="#00462C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col px-3">
                  <h1 className="text-edenGreen-600">Passive Talent Pitch</h1>
                  <p className="text-edenGray-500">
                    Reach talent that is not actively looking
                  </p>
                </div>
              </button>
            </div>
            <div className="bg-edenGreen-600 absolute bottom-0 flex w-full justify-around px-6 py-2">
              <Button
                className="w-56 border-white text-center text-white"
                onClick={handleSetupCustomFlow}
              >
                Setup custom engage flow
              </Button>
            </div>
          </div>
        </div>
        <button
          className="text-edenGreen-600 absolute -top-14 right-[300px] z-[200] flex flex-row hover:font-medium"
          onClick={() => router.push(`/${router.query.slug}/dashboard-new`)}
        >
          <svg
            width="30"
            height="29"
            viewBox="0 0 30 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.5859 15.0678C23.9327 19.8089 19.6431 23.4695 14.4486 23.4695C8.80175 23.4695 4.2251 19.1445 4.2251 13.8081C4.2251 8.87985 8.1304 4.81237 13.1765 4.22046"
              stroke="#00462C"
              stroke-width="1.77187"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.4062 18.5222L25.5658 22.4437"
              stroke="#00462C"
              stroke-width="1.77187"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22.2306 3.71192L23.1646 5.48764C23.2121 5.57729 23.3021 5.63935 23.4067 5.6543L25.4974 5.93933C25.5814 5.94967 25.658 5.99219 25.7102 6.05541C25.8075 6.17609 25.793 6.34619 25.6761 6.44963L24.1607 7.83458C24.0841 7.90238 24.0489 8.00353 24.0695 8.10122L24.432 10.0551C24.4575 10.2171 24.3407 10.3689 24.1692 10.3953C24.0987 10.4056 24.0257 10.3941 23.9612 10.3642L22.0992 9.44248C22.0056 9.39422 21.8937 9.39422 21.8001 9.44248L19.9246 10.37C19.7665 10.4447 19.5756 10.3895 19.4892 10.2436C19.4576 10.185 19.4455 10.1183 19.4576 10.0539L19.8201 8.09892C19.8382 8.00123 19.8042 7.90238 19.7289 7.83227L18.2049 6.44849C18.0821 6.33125 18.0821 6.14161 18.2049 6.02438C18.256 5.9807 18.3192 5.95082 18.3874 5.93933L20.4792 5.65314C20.5839 5.63705 20.6739 5.57499 20.7212 5.48534L21.6541 3.71192C21.6919 3.63952 21.7575 3.5855 21.839 3.55906C21.9205 3.53377 22.008 3.54067 22.0846 3.5763C22.1479 3.60619 22.199 3.65331 22.2306 3.71192Z"
              stroke="#00462C"
              stroke-width="1.77187"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          All your opportunities
        </button>
      </div>
    </div>
  );
};

HomePage.getLayout = (page: any) => <AppUserLayoutNew>{page}</AppUserLayoutNew>;

export default HomePage;

import { IncomingMessage, ServerResponse } from "http";
import Head from "next/head";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel === 5) {
    return {
      props: { key: url },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session.user!.id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  console.log(res.status);

  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access?company=${ctx.query.slug}`,
        permanent: false,
      },
    };
  }

  if (res.status === 404) {
    return {
      redirect: {
        destination: `/create-company`,
        permanent: false,
      },
    };
  }

  const _companyAuth = await res.json();

  if (
    res.status === 200 &&
    _companyAuth.company.type !== "COMMUNITY" &&
    (!_companyAuth.company.stripe ||
      !_companyAuth.company.stripe.product ||
      !_companyAuth.company.stripe.product.ID)
  ) {
    return {
      redirect: {
        destination: `/${_companyAuth.company.slug}/dashboard/subscription`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}
