
export const AdsenseTotal = (inputData) => {

  const headerNames = inputData?.headers?.map(header => header?.name);
  const extractValues = (cells) => cells?.reduce((obj, cell, index) => ({ ...obj, [headerNames?.[index]]: cell?.value }), {});

  return { total: extractValues(inputData?.totals?.cells) };
}
