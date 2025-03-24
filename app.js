// server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');
const connectDB = require('./mongodb');
const typeDefs = require('./schema');
const resolvers = require('./resolver');

// Initialize environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Connect to MongoDB
connectDB();

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
    // Start Apollo server before applying middleware
    await server.start();
  
    // Apply Apollo middleware to Express app
    server.applyMiddleware({ app });
  
    // Start Express server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });
  };

  startServer();