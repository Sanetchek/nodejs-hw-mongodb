const parseContactFilterParams = ({
  type,
  isFavourite
}) => {
  // Add filters if they are provided, else use defaults
  const parsedType = type !== undefined ? type : undefined;
  const parsedIsFavourite = isFavourite !== undefined ? isFavourite : undefined;

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite
  };
}

export default parseContactFilterParams;
