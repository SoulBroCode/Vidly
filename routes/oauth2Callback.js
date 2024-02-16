import express from "express";
import oauth2Client from "../config/oauthClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  // Check if the authorization code exists in the query parameters
  if (!req.query.code) {
    return res.status(400).send("Authorization code is missing.");
  }

  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    res.send("Authentication successful! You can close this window.");
  } catch (error) {
    console.error(
      "Failed to exchange the authorization code for tokens",
      error
    );
    res.status(500).send("Failed to authenticate.");
  }
});

export default router;
