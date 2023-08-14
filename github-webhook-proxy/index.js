import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const { REST_API, TOKEN, REPO, PORT = 3000 } = process.env;

function getStatus(build) {
  switch (build.status) {
    case "CANCELLED":
    case "FAILED":
      return {
        state: "error",
        description: `Build ${build.number} has suffered a system error. Please try again.`,
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
    case "PUBLISHED":
    case "PREPARED":
    case "IN_PROGRESS":
      return {
        state: "pending",
        description: `Build ${build.number} is being processed.`,
      };
    default:
      return {
        state: "error",
        description: `Build ${build.number} has exceptional status.`,
      };
  }
}

async function setCommitStatus(build) {
  const status = getStatus(build);

  const body = JSON.stringify({
    context: "UI Tests",
    target_url: build.webUrl,
    ...status,
  });

  const endPoint = `${REST_API}repos/${REPO}/statuses/${build.commit}`;

  console.log(`POSTING to ${endPoint}`);

  const result = await fetch(endPoint, {
    method: "POST",
    body,
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  // console.log(result);
  // console.log(await result.text());
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

  console.log("status", build.status);

  if (event === "build") {
    await setCommitStatus(build);
  }

  res.end("OK");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
