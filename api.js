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
