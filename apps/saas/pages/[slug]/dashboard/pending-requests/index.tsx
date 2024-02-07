// import { UserContext } from "@eden/package-context";
import { gql, useMutation } from "@apollo/client";
import { CompanyContext } from "@eden/package-context";
import { EmployeeTypeInput } from "@eden/package-graphql/generated";
import { Avatar, Button, SaasUserLayout } from "@eden/package-ui";
import useAuthGate from "@eden/package-ui/src/hooks/useAuthGate/useAuthGate";
import { getCookieFromContext } from "@eden/package-ui/utils";
import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { useContext, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

// import { useContext } from "react";
import type { NextPageWithLayout } from "../../../_app";

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

const sendInviteEmail = async (
  email: string,
  companySlug: string,
  companyName: string
) => {
  axios.post(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/mail-service/send-mail-invite-employee` as string,
    {
      mailTo: email,
      companyName: companyName,
      inviteUrl: `https://edenprotocol.app/${companySlug}/dashboard/invite`,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};

const PendingRequestsPage: NextPageWithLayout = () => {
  useAuthGate();

  const { company, getCompanyFunc } = useContext(CompanyContext);

  const [inviteEmail, setInviteEmail] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const [addEmployeesCompany] = useMutation(ADD_EMPLOYEES_COMPANY, {
    onError() {
      toast.error("An error occurred while updating user");
    },
  });

  const [updateCompany, { loading: loadingUpdate }] = useMutation(
    UPDATE_COMPANY,
    {
      // eslint-disable-next-line no-unused-vars
      onCompleted({ data }) {
        getCompanyFunc();
        inputRef.current?.value && (inputRef.current.value = "");
      },
      onError() {
        toast.error("An error occurred while submitting");
      },
    }
  );

  const handleAcceptEmployee = (employeeID: string) => {
    addEmployeesCompany({
      variables: {
        fields: {
          companyID: company?._id,
          employees: [
            { typeT: "EMPLOYEE", status: "ACTIVE", userID: employeeID },
          ] as EmployeeTypeInput[],
        },
      },
    });
  };

  const handleRejectEmployee = (employeeID: string) => {
    addEmployeesCompany({
      variables: {
        fields: {
          companyID: company?._id,
          employees: [
            { typeT: "EMPLOYEE", status: "REJECTED", userID: employeeID },
          ] as EmployeeTypeInput[],
        },
      },
    });
  };

  const _newApproveEmails = (email: string) => {
    if (company?.approvedEmails) {
      if (company?.approvedEmails.includes(email)) {
        return company?.approvedEmails;
      }
      return [...company?.approvedEmails, email];
    } else {
      return [email];
    }
  };

  const _newDeleteApproveEmails = (email: string) => {
    if (company?.approvedEmails) {
      return company?.approvedEmails.filter(
        (approvedEmail) => approvedEmail !== email
      );
    }
    return [];
  };

  const handleInvite = () => {
    sendInviteEmail(
      inviteEmail as string,
      company?.slug as string,
      company?.name as string
    );
    if (inviteEmail)
      updateCompany({
        variables: {
          fields: {
            _id: company?._id,
            approvedEmails: _newApproveEmails(inviteEmail),
          },
        },
      });
  };

  const handleDeleteInvite = (email: string) => {
    if (email)
      updateCompany({
        variables: {
          fields: {
            _id: company?._id,
            approvedEmails: _newDeleteApproveEmails(email),
          },
        },
      });
  };

  return (
    <div className="grid grid-cols-12 p-8">
      <section className="md:col-span-6">
        <h2 className="text-edenGreen-600 mb-4">{company?.name} employees</h2>
        <div className="mb-4 flex flex-col">
          {company?.employees?.map((employee, index) => (
            <div key={index} className="mb-3 flex items-center">
              <Avatar src={employee?.user?.discordAvatar as string} size="xs" />
              <span className="ml-2">{employee?.user?.discordName}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="md:col-span-6">
        <div>
          <h2 className="text-edenGreen-600 mb-4">
            Invite employees to {company?.name}
          </h2>
          <div className="mb-8">
            {company?.approvedEmails?.map((email, index) => (
              <div
                key={index}
                className="hover:bg-edenGray-50 mb-2 flex max-w-sm items-center justify-between rounded-md px-3 py-0.5"
              >
                <span>{email}</span>
                <FaTrash
                  onClick={() => {
                    if (email) handleDeleteInvite(email);
                  }}
                  className="text-utilityRed ml-2 cursor-pointer text-sm hover:text-black"
                />
              </div>
            ))}
          </div>
          <div className="mb-4 mr-2 flex">
            <input
              ref={inputRef}
              className="border-edenGray-500 rounded-md border-2 px-2"
              type="text"
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Button
              onClick={handleInvite}
              className="ml-2 flex h-8 items-center justify-center"
              loading={loadingUpdate}
            >
              Invite
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-edenGreen-600 mb-4">
            {company?.name} pending employee access requests:
          </h2>
          {company &&
            company?.employees &&
            company?.employees
              .filter((employee) => employee?.status === "PENDING")
              .map((employee, index) => (
                <div
                  key={index}
                  className="bg-edenPink-300 mb-2 flex w-[20rem] items-center rounded-md px-4 py-2"
                >
                  <div className="h-8">
                    <Avatar
                      src={employee?.user?.discordAvatar as string}
                      size="xs"
                    />
                  </div>
                  <h3 className="ml-2">{employee?.user?.discordName}</h3>
                  <Button
                    onClick={() => handleAcceptEmployee(employee?.user?._id!)}
                    className="ml-auto mr-2 !px-2 !py-1 text-sm"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleRejectEmployee(employee?.user?._id!)}
                    className="text-utilityRed border-utilityRed hover:bg-utilityRed hover:border-utilityRed !px-2 !py-1 text-sm hover:text-white"
                  >
                    Reject
                  </Button>
                </div>
              ))}
        </div>
      </section>
    </div>
  );
};

PendingRequestsPage.getLayout = (page) => (
  <SaasUserLayout>{page}</SaasUserLayout>
);

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
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

  if (session.accessLevel === 5 && session._id !== "113589215262737174259") {
    return {
      props: { key: url },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session._id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

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

  return {
    props: { key: url },
  };
}

export default PendingRequestsPage;
