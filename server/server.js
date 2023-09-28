const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

await server.start();

//apply apollo server with express app
server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
}

startApolloServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/build");

app.use(express.static(buildPath));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

//get all
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});