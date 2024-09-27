const calculatePaginationData = ({
    count,
    perPage,
    page
  }) => {
  const totalPages = Math.ceil(count / perPage); // round up to get full pages
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    totalPages,
    hasPreviousPage,
    hasNextPage
  }
}

export default calculatePaginationData;
