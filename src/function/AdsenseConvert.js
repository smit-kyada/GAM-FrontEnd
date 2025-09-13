
// export const AdsenseConvert = (inputData) => {

//   const headerNames = inputData?.headers?.map(header => header?.name);
//   const extractValues = (cells) => cells?.reduce((obj, cell, index) => ({ ...obj, [headerNames?.[index]]: cell?.value }), {});

//   return { total: extractValues(inputData?.totals?.cells), report: inputData?.rows?.map(row => extractValues(row?.cells)) };
// }



export const AdsenseConvert = (inputData) => {
  const headerNames = inputData?.headers?.map(header => header?.name);
  const extractValues = (cells) => cells?.reduce((obj, cell, index) => ({ ...obj, [headerNames?.[index]]: cell?.value }), {});

  return {
    total: extractValues(inputData?.totals?.cells),
    report: inputData?.rows?.map((row, rowIndex) => ({
      id: `row-${rowIndex}`,
      ...extractValues(row?.cells),
    })),
  };
}
