import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-boost";

const headers = { "x-hasura-admin-secret": "darthvader" };

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: "wss://instagram-lane.herokuapp.com/v1/graphql",
    options: {
      reconnect: true,
      connectionParams: {
        headers,
      },
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
