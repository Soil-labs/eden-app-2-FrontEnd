import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { EmployeeTypeInput } from "@eden/package-graphql/generated";
import {
  Button,
  EdenAiProcessingModal,
  SaasUserLayout,
} from "@eden/package-ui";
import { getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
const CreateCompany: NextPageWithLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState<FormData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { currentUser } = useContext(UserContext);

  const router = useRouter();

  const [addEmployeesCompany] = useMutation(ADD_EMPLOYEES_COMPANY, {
    onCompleted(data) {
      if (data.addEmployeesCompany) {
        router.push(`/${data.addEmployeesCompany.slug}/dashboard`);
      }
    },
    onError() {
      setSubmitting(false);
    },
  });

  const [updateCompany, { data: updateCompanyData }] = useMutation(
    UPDATE_COMPANY,
    {
      // eslint-disable-next-line no-unused-vars
      onCompleted({ data }) {
        console.log("completed add company");
      },
      onError() {
        toast.error("An error occurred while submitting");
        setSubmitting(false);
      },
    }
  );

  useEffect(() => {
    if (updateCompanyData)
      addEmployeesCompany({
        variables: {
          fields: {
            companyID: updateCompanyData.updateCompany._id,
            employees: [
              { typeT: "ADMIN", status: "ACTIVE", userID: currentUser!._id },
            ] as EmployeeTypeInput[],
          },
        },
      });
  }, [updateCompanyData]);

  const submitHandler = (data: any) => {
    setFormData(data);
    // console.log("data from handler:", data);
    setSubmitting(true);
    updateCompany({
      variables: {
        fields: {
          name: data.companyName,
          slug: data.companyAbbreviation,
          type: "COMPANY",
          description: data.companyDescription,
        },
      },
    });
  };

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center">
        <form
          className="w-full max-w-2xl"
          onSubmit={handleSubmit(submitHandler)}
        >
          <section className="mb-4 inline-block w-full space-y-6 p-4 pr-12">
            <div className="space-y-1">
              <p className="text-xs">Company Name</p>
              <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
                <input
                  type="text"
                  id="Name"
                  className="h-[34px] w-full bg-transparent p-2"
                  required
                  {...register("companyName")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className=" text-xs">Company Abbreviation</p>
              <div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    id="Abbreviation"
                    className="border-EdenGray-100 flex h-[34px] w-full items-center rounded-md  border bg-transparent bg-white p-2 text-xs"
                    required
                    {...register("companyAbbreviation", {
                      pattern: /^[a-z0-9-]+$/,
                    })}
                  />
                  {errors.companyAbbreviation && (
                    <span className="ml-1 text-sm font-bold text-red-400">
                      Invalid Input: Please ensure your input contains only
                      lowercase letters (a-z), numbers (0-9), and the hyphen (-)
                      character.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs">Description of the Company</p>
              <div>
                <textarea
                  className="border-EdenGray-100 w-full border p-2 text-xs"
                  rows={6}
                  id="Description"
                  required
                  {...register("companyDescription")}
                />
              </div>
            </div>

            <Button type="submit" variant="secondary" className="mx-auto block">
              Submit
            </Button>
          </section>
        </form>
        <EdenAiProcessingModal
          title="Creating your company"
          open={submitting}
        />
      </div>
    </>
  );
};

CreateCompany.getLayout = (page: any) => (
  <SaasUserLayout>{page}</SaasUserLayout>
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

export default CreateCompany;
