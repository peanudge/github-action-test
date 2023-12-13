import * as core from "@actions/core";
import { initialize } from "./initialize.js";
import { getPRList, addLabels, removeLabel } from "./api.js";

const D_N_PATTERN = /^D-(\d+)$/;

const getNextLabel = (name) => {
  const [, day] = name.match(D_N_PATTERN);
  const currentDDay = parseInt(day);
  const nextDDay = currentDDay <= 0 ? 0 : currentDDay - 1;

  return `D-${nextDDay}`;
};

const extractLabelChanges = (prList) => {
  return prList
    .map(({ number, labels }) => ({
      number,
      dLabel: labels.find(({ name }) => D_N_PATTERN.test(name))?.name,
    }))
    .filter(({ dLabel }) => !!dLabel)
    .map(({ number, dLabel }) => ({
      prNumber: number,
      currentLabel: dLabel,
      nextLabel: getNextLabel(dLabel),
    }));
};

const updateLabel = async ({ prNumber, currentLabel, nextLabel }) => {
  if (prNumber === nextLabel) {
    return false;
  }

  return Promise.all([
    removeLabel(prNumber, currentLabel),
    addLabels(prNumber, [nextLabel]),
  ]).then(
    () => {
      core.info(
        `Successfully updated label for PR #${prNumber} from "${currentLabel}" to "${nextLabel}"`
      );

      return true;
    },
    (error) => {
      core.warning(
        `Failed to update label for PR #${prNumber}: ${error.message}`
      );

      throw error;
    }
  );
};

// Step1: Get Octokit object;
initialize();

// Step2. Get PRs
getPRList()
  // Step3. Get PR number, current d-day label, next d-day label
  .then((prList) => extractLabelChanges(prList))
  // Step4. Get label change info about each PR
  .then((changes) => {
    // changes => { prNumber, currentLabel, nextLabel } []
    return Promise.all(changes.map(updateLabel));
  })
  .then((results) => {
    core.info(
      `Successfully updated labels for all ${
        results.filter(Boolean).length
      } PRs.`
    );
  })
  .catch((error) => {
    core.setFailed(error.message);
  });
