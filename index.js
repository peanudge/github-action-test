import * as core from "@actions/core";
import * as github from "@actions/github";

// Step1: Get Octokit object;
const githubToken = core.getInput("GH_TOKEN", { required: true });
if (!githubToken) {
  throw new Error("Missing GH_TOKEN environment variable");
}

const octokit = github.getOctokit(token);
console.log($`Octokit object created ${JSON.stringify(octokit)}`);

// TODO: Getting input of Git Action

// TODO: USE Github API
// TODO: Getting PR created date

// TODO: Update Labels

// TODO:
// Merge, Labeling, Pull Request, etc.
