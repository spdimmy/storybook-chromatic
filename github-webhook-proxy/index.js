const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const options = {
  key: fs.readFileSync(path.resolve("private.key")),
  cert: fs.readFileSync(path.resolve("certificate.crt")),
};

const { REST_API, TOKEN } = process.env;

function getStatus(build) {
  switch (build.status) {
    case "FAILED":
      return {
        state: "error",
        description:
          "Build ${build.number} has suffered a system error. Please try again.",
      };

    case "BROKEN":
      return {
        state: "failure",
        description: `Build ${build.number} failed to render.`,
      };
    case "DENIED":
      return {
        state: "failure",
        description: `Build ${build.number} denied.`,
      };
    case "PENDING":
      return {
        state: "pending",
        description: `Build ${build.number} has ${build.changeCount} changes that must be accepted`,
      };
    case "ACCEPTED":
      return {
        state: "success",
        description: `Build ${build.number} accepted.`,
      };
    case "PASSED":
      return {
        state: "success",
        description: `Build ${build.number} passed unchanged.`,
      };
  }

  return {
    context: "UI Tests",
  };
}

async function setCommitStatus(build, { repoId, name }) {
  const status = getStatus(build);

  const body = JSON.stringify({
    context: name ? `UI Tests (${name})` : "UI Tests",
    target_url: build.webUrl,
    ...status,
  });

  console.log(
    `POSTING to ${REST_API}repositories/${repoId}/statuses/${build.commit}`
  );

  const result = await fetch(
    `${REST_API}repositories/${repoId}/statuses/${build.commit}`,
    {
      method: "POST",
      body,
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );

  console.log(result);
  console.log(await result.text());
}

const app = express();
app.use(bodyParser.json()).use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/webhook", async (req, res) => {
  console.log(1111);
  res.end("Hello");
});

app.post("/webhook", async (req, res) => {
  const { event, build } = req.body;
  const { repoId, name } = req.query;

  console.log("req happend", req.body);

  if (event === "build-status-changed") {
    await setCommitStatus(build, { repoId, name });
  }

  res.end("OK");
});

const { PORT = 3000 } = process.env;

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS server is running on port ${PORT}`);
});
