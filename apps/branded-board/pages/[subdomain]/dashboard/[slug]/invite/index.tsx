// import { UserContext } from "@eden/package-context";
import { gql, useMutation } from "@apollo/client";
import { CompanyContext, UserContext } from "@eden/package-context";
import { EmployeeTypeInput } from "@eden/package-graphql/generated";
import { Button } from "@eden/package-ui";
import { getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

// import { useContext } from "react";

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

const PendingRequestsPage = () => {
  const router = useRouter();
  const { company } = useContext(CompanyContext);
  const { currentUser } = useContext(UserContext);
  const [redirecting, setRedirecting] = useState(false);

  const [addEmployeesCompany] = useMutation(ADD_EMPLOYEES_COMPANY, {
    onCompleted() {
      router.push(`/dashboard/${company?.slug}`);
    },
    onError() {
      toast.error("An error occurred while updating user");
    },
  });

  const handleAcceptEmployee = () => {
    if (
      currentUser?.conduct?.email &&
      company?.approvedEmails?.includes(currentUser?.conduct?.email)
    ) {
      setRedirecting(true);
      addEmployeesCompany({
        variables: {
          fields: {
            companyID: company?._id,
            employees: [
              { typeT: "EMPLOYEE", status: "ACTIVE", userID: currentUser?._id },
            ] as EmployeeTypeInput[],
          },
        },
      });
    }
  };

  if (!currentUser) return <></>;

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {currentUser?.conduct?.email &&
      company?.approvedEmails?.includes(currentUser?.conduct?.email) ? (
        <section className="text-center">
          <h2 className="text-edenGreen-600 mb-4">
            {`You've been invited to join ${company?.name}`}
          </h2>
          <Button
            loading={redirecting}
            onClick={handleAcceptEmployee}
            disabled={!currentUser || redirecting}
          >
            Join
          </Button>
        </section>
      ) : (
        <section>
          <h2 className="text-edenGreen-600 mb-4">
            {`Your mail is not approved to join ${company?.name}`}
          </h2>
        </section>
      )}
    </div>
  );
};

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
      props: { key: url },
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
    redirect: {
      destination: `/dashboard/${ctx.query.slug}`,
      permanent: false,
    },
  };
}

export default PendingRequestsPage;
