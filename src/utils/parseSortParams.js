import { SORT_ORDER } from "../constants/index.js";

const parseSortParams = ({ sortBy, sortFields, sortOrder }) => {
  const paresedSortBy = sortFields.includes(sortBy) ? sortBy : '_id';
  const parsedSortOrder = SORT_ORDER.includes(sortOrder) ? sortOrder : SORT_ORDER[0];

  return {
    sortBy: paresedSortBy,
    sortOrder: parsedSortOrder
  };
};

export default parseSortParams;
