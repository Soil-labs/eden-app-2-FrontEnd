import { gql, useMutation } from "@apollo/client";
import { Maybe, NodesType } from "@eden/package-graphql/generated";
import {
  AdminLayout,
  Button,
  Card,
  SelectNodes,
  SEO,
  ServerSelector,
  TextInputLabel,
  ToggleElement,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type GrantInputs = {
  name: string;
  smallDescription: string;
  description: string;
  avatar: string;
  tags: string[];
  applicationProcess: string[];
  requirments: string[];
  resources: {
    name: string;
    url: string;
  }[];
  difficulty: string;
  amount: string;
  serverID: string[];
  server: {
    _id: string;
    serverAvatar: string;
  };
  nodes: Maybe<NodesType>[];
};

import type { NextPageWithLayout } from "../../_app";

const UPDATE_GRANT = gql`
  mutation ($fields: updateGrantInput) {
    updateGrant(fields: $fields) {
      _id
    }
  }
`;

const UPDATE_NODES = gql`
  mutation ($fields: updateNodesToGrantInput) {
    updateNodesToGrant(fields: $fields) {
      _id
    }
  }
`;

const GrantsAdminPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { register, handleSubmit, control, reset, watch } =
    useForm<GrantInputs>({});
  const onSubmit: SubmitHandler<GrantInputs> = (data) => {
    // console.log("data", data);
    updateGrant({
      variables: {
        fields: {
          name: data.name,
          smallDescription: data.smallDescription,
          description: data.description,
          avatar: data.server.serverAvatar,
          tags: data.tags,
          applicationProcess: data.applicationProcess,
          requirments: data.requirments,
          resources: data.resources,
          difficulty: data.difficulty,
          amount: data.amount,
          serverID: data.server._id,
        },
      },
      context: { serviceName: "soilservice" },
    });
  };

  const numInList = ["", "", "", ""];

  const [updateGrant, {}] = useMutation(UPDATE_GRANT, {
    onCompleted({ updateGrant }) {
      if (!updateGrant) console.log("updateGrant is null");
      //   console.log("updateGrant", updateGrant);
      const nodes = watch("nodes");

      //   console.log("nodes", nodes);
      updateNodesToGrant({
        variables: {
          fields: {
            grantID: updateGrant._id,
            nodesID: nodes.map((node) => node?.nodeData?._id),
            nodeType: `sub_expertise`,
          },
        },
      });
      router.push(`/grants/${updateGrant._id}`);
    },
  });

  const [updateNodesToGrant, {}] = useMutation(UPDATE_NODES, {
    onCompleted({ updateNodesToGrant }) {
      if (!updateNodesToGrant) console.log("updateNodesToGrant is null");
      //   console.log("updateNodesToGrant", updateNodesToGrant);
      reset();
    },
  });

  return (
    <>
      <SEO />
      <Card
        shadow
        className={`scrollbar-hide h-85 m-4 w-full overflow-y-scroll bg-white p-4`}
      >
        <div className={`text-center text-xl font-medium text-gray-600`}>
          Create Grant
        </div>
        <div className={``}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}

            <TextInputLabel
              htmlFor={`grant-name`}
            >{`Name your Grant`}</TextInputLabel>
            <input
              id={`grant-name`}
              className={`input-primary`}
              required
              {...register("name")}
            />

            <TextInputLabel
              htmlFor={`grant-smallDescription`}
            >{`smallDescription`}</TextInputLabel>
            <input
              id={`grant-smallDescription`}
              className={`input-primary`}
              required
              {...register("smallDescription")}
            />

            <TextInputLabel
              htmlFor={`grant-description`}
            >{`description`}</TextInputLabel>
            <textarea
              id={`grant-description`}
              className={`input-primary`}
              rows={4}
              required
              {...register("description")}
            />

            <div>
              <TextInputLabel>
                {`Please Choose a Discord Server to get Applicants from`}
              </TextInputLabel>
              <Controller
                name={`server`}
                control={control}
                render={({ field: { onChange, ref } }) => (
                  <ServerSelector onChangeServer={onChange} inputRef={ref} />
                )}
              />
            </div>

            {/* Select Nodes for Role */}
            <div className="mt-3">
              <TextInputLabel>{`Select the Role: 🤖`}</TextInputLabel>
              <Controller
                control={control}
                name={`nodes`}
                render={({ field: { onChange, value } }) => (
                  <SelectNodes
                    nodeType={"expertise"}
                    selectedNodes={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>

            {/* Grant tags */}
            <ToggleElement
              htmlFor={`grant-tags`}
              className="my-4"
              title="Grant Tags"
            >
              {numInList.map((v, i) => (
                <div key={i} className={`mx-4 flex py-1`}>
                  <li className={`my-auto`} />
                  <input
                    className={`input-primary`}
                    {...register(`tags.${i}` as const)}
                  />
                </div>
              ))}
            </ToggleElement>

            {/* Grant applicationProcess */}
            <ToggleElement
              htmlFor={`grant-applicationProcess`}
              className="my-4"
              title="Grant applicationProcess"
            >
              {numInList.map((v, i) => (
                <div key={i} className={`mx-4 flex py-1`}>
                  <li className={`my-auto`} />
                  <input
                    className={`input-primary`}
                    {...register(`applicationProcess.${i}` as const)}
                  />
                </div>
              ))}
            </ToggleElement>

            {/* Grant requirments */}
            <ToggleElement
              htmlFor={`grant-requirments`}
              className="my-4"
              title="Grant requirments"
            >
              {numInList.map((v, i) => (
                <div key={i} className={`mx-4 flex py-1`}>
                  <li className={`my-auto`} />
                  <input
                    className={`input-primary`}
                    {...register(`requirments.${i}` as const)}
                  />
                </div>
              ))}
            </ToggleElement>

            {/* Grant resources */}
            <ToggleElement
              htmlFor={`grant-resources`}
              className="my-4"
              title="Grant resources"
            >
              {numInList.map((v, i) => (
                <div key={i} className={`mx-4 flex py-1`}>
                  <li className={`my-auto`} />
                  <div className={`w-full`}>
                    <TextInputLabel>{`Resource Name`}</TextInputLabel>
                    <input
                      className={`input-primary`}
                      {...register(`resources.${i}.name` as const)}
                    />
                    <TextInputLabel>{`Resource url`}</TextInputLabel>
                    <input
                      className={`input-primary`}
                      {...register(`resources.${i}.url` as const)}
                    />
                  </div>
                </div>
              ))}
            </ToggleElement>

            <TextInputLabel
              htmlFor={`grant-difficulty`}
            >{`difficulty`}</TextInputLabel>
            <input
              id={`grant-difficulty`}
              className={`input-primary`}
              required
              {...register("difficulty")}
            />

            <TextInputLabel htmlFor={`grant-amount`}>{`amount`}</TextInputLabel>
            <input
              id={`grant-amount`}
              className={`input-primary`}
              required
              {...register("amount")}
            />

            <Button type={`submit`}>Submit</Button>
          </form>
        </div>
      </Card>
    </>
  );
};

GrantsAdminPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default GrantsAdminPage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session || session.error === "RefreshAccessTokenError") {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel && session.accessLevel > 5) {
    return {
      redirect: {
        destination: `/home`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
