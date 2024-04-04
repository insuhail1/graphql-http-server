const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require("graphql");
const expressPlayground = require("graphql-playground-middleware-express");

const dotenv = require("dotenv");

const graphQLPlayground = expressPlayground.default;

dotenv.config();

const users = [
  {
    id: 1,
    name: "Mohit",
  },
  {
    id: 2,
    name: "Mohit",
  },
];

const phones = [
  {
    name: "iphone13",
    id: 1,
    userId: 1,
  },
  {
    name: "iphone14",
    id: 2,
    userId: 2,
  },
  {
    name: "iphone15",
    id: 3,
    userId: 1,
  },
];

const PhoneType = new GraphQLObjectType({
  name: "phone",
  description: "phone data",
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      resolve: (phone: any) => {
        return users.find((user) => phone.userId === user.id);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "user",
  description: "user data",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    phones: {
      type: new GraphQLList(PhoneType),
      resolve: (user: any) => {
        return phones.filter((phone) => phone.userId === user.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve: () => users,
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (_parent: any, args: any) =>
        users.find((user) => args.id === user.id),
    },
    phones: {
      type: new GraphQLList(PhoneType),
      resolve: () => phones,
    },
    phone: {
      type: PhoneType,
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (_parent: any, args: any) =>
        phones.find((phone) => args.id === phone.id),
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

const app = express();

app.all(
  "/graphql",
  createHandler({
    schema,
  })
);

app.get("/playground", graphQLPlayground({ endpoint: "/graphql" }));

const port = process.env.PORT;

app.listen(port, () => console.log(`Server is listening on PORT: ${port}`));
