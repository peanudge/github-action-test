const MAX_PER_PAGE = 100;

const fetchAllPages = async (
  request,
  params,
  maxCount = Number.POSITIVE_INFINITY
) => {
  let [page, len, count] = [1, 0, 0];
  const result = [];

  do {
    const { data } = await request({ ...params, per_page: MAX_PER_PAGE, page });

    result.push(...data);

    [page, len, count] = [page + 1, data.length, count + data.length];
  } while (len === MAX_PER_PAGE && count < maxCount);

  return result.slice(0, maxCount);
};

export const getPRList = async () => {
  return fetchAllPages(global.octokit.rest.pulls.list, {
    owner: global.owner,
    repo: global.repo,
    state: "open",
  });
};

export const removeLabel = async (number, name) => {
  const { data: labels } = await global.octokit.rest.issues.removeLabel({
    owner: global.owner,
    repo: global.repo,
    issue_number: number,
    name,
  });

  return labels;
};

export const addLabels = async (number, names) => {
  const { data: labels } = await global.octokit.rest.issues.addLabels({
    owner: global.owner,
    repo: global.repo,
    issue_number: number,
    labels: names,
  });

  return labels;
};
