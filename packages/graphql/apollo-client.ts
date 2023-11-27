import fetch from "cross-fetch";
import {
  ApolloClient,
  InMemoryCache,
  from,
  fromPromise,
  toPromise,
  HttpLink,
  ApolloLink,
  split,
  gql,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

import jwt_decode from "jwt-decode";

type decodedType = {
  exp: number;
  iat: number;
  _id: string;
  discordName: string;
  accessLevel: number;
};
let decoded: decodedType;

// Eden API endpoint
const EDEN_API_WSS = process.env.NEXT_PUBLIC_GRAPHQL_WSS || "";
const EDEN_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const httpLinkEden = new HttpLink({ uri: EDEN_API_URL, fetch });

console.log("EDEN_API_WSS", EDEN_API_WSS);

const edenLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("eden_access_token");

  if (token) decoded = jwt_decode(token as string);

  if (token && decoded.exp > Math.floor(Date.now() / 1000)) {
    if (process.env.NODE_ENV === "development")
      console.log("EDEN TOKEN IS GOOD -> making request");
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return forward(operation);
  }

  return fromPromise(
    fetch(`/api/auth/fetchToken`)
      .then((res) => res.json())
      .then((data: any) => {
        // console.log("DATA", data);
        // console.log("ERROR", data.error);
        if (data.error) return toPromise(forward(operation));

        // console.log("client.ts");
        // console.log(auth.getToken());

        const edenToken = data.edenToken;
        if (edenToken) {
          operation.setContext({
            headers: {
              authorization: `Bearer ${edenToken}`,
            },
          });
          localStorage.setItem("eden_access_token", edenToken);
          return toPromise(forward(operation));
        } else return toPromise(forward(operation));
      })

      .catch(() => {
        return toPromise(forward(operation));
      })
  );
});

const CREATE_ERROR = gql`
  mutation ($fields: createErrorInput!) {
    createError(fields: $fields) {
      _id
    }
  }
`;

const errorLink = onError(({ graphQLErrors }) => {
  let errorToken: decodedType;
  const token = localStorage.getItem("eden_access_token");

  if (token) errorToken = jwt_decode(token as string);

  // if (graphQLErrors) console.log("graphQLErrors", graphQLErrors);

  if (graphQLErrors && process.env.NODE_ENV === "development")
    graphQLErrors.map(({ message, path }) =>
      console.log(
        `%c[GraphQL ERROR]: Message: ${message}. Path: ${path}. `,
        `color: red; background: yellow;`
      )
    );
  if (graphQLErrors)
    graphQLErrors.map(({ message, path, extensions }) => {
      apolloClient.mutate({
        mutation: CREATE_ERROR,
        variables: {
          fields: {
            memberID: errorToken && errorToken?._id,
            errorType: "FRONTEND",
            message: message,
            code: extensions.code,
            url: window.location.href,
            path: path,
          },
        },
      });
    });
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `${EDEN_API_WSS}`,
        })
      )
    : null;

const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        edenLink.concat(httpLinkEden)
      )
    : edenLink.concat(httpLinkEden);

export const apolloClient = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {},
      },
    },
  }),
});

// const cacheMerge = (keyArgs: any) => {
//   return {
//     keyArgs: [keyArgs],
//     merge(existing: any, incoming: any) {
//       if (!existing) {
//         return incoming;
//       }
//       const existingItems = existing.items;
//       const incomingItems = incoming.items;

//       return {
//         items: existingItems.concat(incomingItems),
//         // pageInfo: incoming.pageInfo,
//       };
//     },
//   };
// };
