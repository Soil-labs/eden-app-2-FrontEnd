// import { UserContext } from "@eden/package-context";
import { gql, useMutation } from "@apollo/client";
import { CompanyContext } from "@eden/package-context";
import { EmployeeTypeInput } from "@eden/package-graphql/generated";
import { Avatar, Button, SaasUserLayout } from "@eden/package-ui";
import useAuthGate from "@eden/package-ui/src/hooks/useAuthGate/useAuthGate";
import { getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";
import { useContext } from "react";
import { toast } from "react-toastify";

// import { useContext } from "react";
import type { NextPageWithLayout } from "../../../../_app";

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

const PendingRequestsPage: NextPageWithLayout = () => {
  useAuthGate();

  const { company } = useContext(CompanyContext);

  const [addEmployeesCompany] = useMutation(ADD_EMPLOYEES_COMPANY, {
    onError() {
      toast.error("An error occurred while updating user");
    },
  });

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
          <div className="mb-4 mr-2 flex">
            <input
              className="border-edenGray-500 rounded-md border-2"
              type="text"
            />
            <Button className="ml-2 flex h-8 items-center justify-center">
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
