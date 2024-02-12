import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { EmployeeTypeInput } from "@eden/package-graphql/generated";
import {
  BrandedAppUserLayout,
  Button,
  EdenAiProcessingModal,
  Loading,
} from "@eden/package-ui";
import { getCookieFromContext } from "@eden/package-ui/utils";
import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { HiPencil } from "react-icons/hi";
import { toast } from "react-toastify";

import { NextPageWithLayout } from "../../_app";

type FormData = {
  companyName: string;
  companyAbbreviation: string;
  companyDescription: string;
};

const UPDATE_COMPANY = gql`
  mutation ($fields: updateCompanyInput!) {
    updateCompany(fields: $fields) {
      _id
      name
      type
      slug
      description
    }
  }
`;

const UPDATE_COMPANY_DETAILS = gql`
  mutation ($fields: updateCompanyDetailsInput!) {
    updateCompanyDetails(fields: $fields) {
      _id
      slug
      name
      imageUrl
    }
  }
`;
const ADD_EMPLOYEES_COMPANY = gql`
  mutation ($fields: addEmployeesCompanyInput!) {
    addEmployeesCompany(fields: $fields) {
      _id
      name
      slug
      employees {
        typeT
        user {
          _id
          discordName
        }
      }
    }
  }
`;

function toKebabCase(inputString: string): string {
  // Replace all non-alphanumeric characters with hyphens
  const kebabCaseString = inputString.replace(/[^a-zA-Z0-9]/g, "-");

  // Convert the string to lowercase
  return kebabCaseString.toLowerCase();
}

const CompanySetup: NextPageWithLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState<FormData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploadingCompanyImage, setUploadingCompanyImage] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    // formState: { errors },
  } = useForm();
  const { currentUser } = useContext(UserContext);

  const router = useRouter();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const communityIDs = router.query.community
    ? [router.query.community].flat(1)
    : [];

  const priceID = router.query.product
    ? [router.query.product].flat(1)[0]
    : undefined;

  const [updateCompanyDetails] = useMutation(UPDATE_COMPANY_DETAILS, {
    onCompleted(data) {
      paymentHandler(data.updateCompanyDetails.slug);
    },
    onError() {
      toast.error("An error occurred while submitting");
      setSubmitting(false);
    },
  });

  const [addEmployeesCompany] = useMutation(ADD_EMPLOYEES_COMPANY, {
    onCompleted(data) {
      updateCompanyDetails({
        variables: {
          fields: {
            slug: data.addEmployeesCompany.slug,
            imageUrl: getValues("companyImageUrl"),
          },
        },
      });
    },
    onError() {
      toast.error("An error occurred while submitting");
      setSubmitting(false);
    },
  });

  const [updateCompany] = useMutation(UPDATE_COMPANY, {
    // eslint-disable-next-line no-unused-vars
    onCompleted(data) {
      addEmployeesCompany({
        variables: {
          fields: {
            companyID: data.updateCompany._id,
            employees: [
              { typeT: "ADMIN", status: "ACTIVE", userID: currentUser?._id },
            ] as EmployeeTypeInput[],
          },
        },
      });
    },
    onError() {
      toast.error("An error occurred while submitting");
      setSubmitting(false);
    },
  });

  const handleFileChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingCompanyImage(true);
      try {
        if (e.target.files[0] > 1 * 1024 * 1024) {
          // setSizeErr(true);
          setUploadingCompanyImage(false);
          return;
        }

        const postid = `${toKebabCase(getValues("companyName"))}_${Math.floor(
          100000 + Math.random() * 900000
        )}`;
        const blob = e.target.files[0].slice(
          0,
          e.target.files[0].size,
          "application/png"
        );

        const newFile = new File([blob], `${postid}.png`, {
          type: "application/png",
        });

        const formData = new FormData();

        formData.append("imgfile", newFile);

        await axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/storage/store-image` as string,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        setValue(
          "companyImageUrl",
          `https://storage.googleapis.com/eden_companies_images/${postid}.png`
        );
        setUploadingCompanyImage(false);
      } catch (error) {
        setUploadingCompanyImage(false);
        // toast.error(error);
      }
    }
  };

  const submitHandler = (data: any) => {
    setFormData(data);
    // console.log("data from handler:", data);
    setSubmitting(true);
    updateCompany({
      variables: {
        fields: {
          name: data.companyName,
          slug: toKebabCase(data.companyName),
          type: "COMPANY",
          description: data.companyDescription,
          communitiesSubscribedID: communityIDs,
        },
      },
    });
  };

  const paymentHandler = async (slug?: string) => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    const redirect = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/stripe/create-checkout-session` as string,
      {
        // eslint-disable-next-line camelcase
        price_id: priceID,
        // eslint-disable-next-line camelcase
        success_url: `${origin}/dashboard/${slug}`,
        // eslint-disable-next-line camelcase
        cancel_url: `${origin}/dashboard/subscription/${slug}`,
        companySlug: slug,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": `*`,
        },
      }
    );

    if (origin && redirect.data) window.location.assign(redirect.data);
  };

  const buttonDisabled =
    !watch("companyName") ||
    !watch("companyImageUrl") ||
    !watch("companyDescription");
  // !getValues("companyUrl") ||

  return (
    <>
      <div className="mx-auto h-screen w-full max-w-2xl items-center justify-center">
        <h1 className="text-edenGreen-600 mb-8">Set up your company profile</h1>
        <h2 className="text-md">Create your company</h2>
        <p className="text-edenGray-700 mb-4">
          Provide all the necessary information needed to create a company on
          Eden. You can add more information later.
        </p>

        <form
          className="flex w-full flex-col"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="mb-4">
            <p className="text-xs">Company Name</p>
            <div className="border-edenGray-500 bg-edenGray-100 flex w-full items-center rounded-md border text-xs">
              <input
                type="text"
                id="Name"
                className="h-[34px] w-full bg-transparent p-2"
                required
                {...register("companyName")}
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs">Company logo</p>
            <label
              htmlFor="file-upload"
              className="border-edenGray-500 relative block flex h-28 w-28 cursor-pointer items-center justify-center rounded-lg rounded-md border p-2 hover:bg-black hover:bg-opacity-20"
            >
              {uploadingCompanyImage && (
                <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
                  <Loading title="" />
                </div>
              )}
              <img src={getValues("companyImageUrl") || ""} className="" />
              <HiPencil
                size={20}
                className="text-edenGray-500 absolute bottom-1 right-1 opacity-60"
              />
              <input
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInput}
                type="file"
                accept=".png"
              ></input>
            </label>
          </div>

          {/* <div className="mb-4">
            <p className="text-xs">Company Website</p>
            <div className="border-edenGray-500 bg-edenGray-100 flex w-full items-center rounded-md border text-xs">
              <input
                type="url"
                id="Url"
                className="h-[34px] w-full bg-transparent p-2"
                required
                {...register("companyUrl")}
              />
            </div>
          </div> */}
          <div className="mb-4">
            <p className="text-xs">Tagline</p>
            <p className="text-edenGray-700 text-xs">
              Tell talent what your company is all about
            </p>
            <div>
              <textarea
                className="border-edenGray-500 bg-edenGray-100 w-full rounded-md border p-2 text-xs"
                rows={6}
                id="Description"
                required
                {...register("companyDescription")}
              />
            </div>
          </div>

          <Button
            disabled={buttonDisabled}
            type="submit"
            variant="secondary"
            className="mx-auto block"
          >
            Submit
          </Button>
        </form>
        <EdenAiProcessingModal
          title="Creating your company"
          open={submitting}
        />
      </div>
    </>
  );
};

CompanySetup.getLayout = (page: any) => (
  <BrandedAppUserLayout>{page}</BrandedAppUserLayout>
);

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = getCookieFromContext(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}

export default CompanySetup;
