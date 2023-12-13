import { initialize } from "./initialize";
import { getPRList } from "./api";

// Step1: Get Octokit object;
initialize();

// Step2. Get PRs
getPRList().then((prs) => {
  console.log(prs);
});

// TODO: Getting input of Git Action

// TODO: USE Github API
// TODO: Getting PR created date

// TODO: Update Labels

// TODO:
// Merge, Labeling, Pull Request, etc.
