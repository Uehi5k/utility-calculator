import { ExcelData, HeaderIndex } from '../models/file-upload.model';

/**
 * Get header indices
 * @param descriptions (string[]) - array of header descriptions to find
 * @param data (ExcelData)
 * @returns { headerIndices: HeaderIndex[]; headerRowIndex: number }
 */
export const getHeaderIndices = (
  descriptions: string[],
  data: ExcelData
): { headerIndices: HeaderIndex[]; headerRowIndex: number } => {
  const headerIndices: HeaderIndex[] = descriptions.reduce(
    (accumulator, currentValue) => {
      accumulator.push({
        description: currentValue,
        arrayIndex: 0,
      });
      return accumulator;
    },
    [] as HeaderIndex[]
  );

  let headerRowIndex = 0;
  for (const row of data.data) {
    if (row.length > 0 && row.find((r) => r === headerIndices[0].description)) {
      for (const headerIndex of headerIndices) {
        headerIndex.arrayIndex = row.indexOf(headerIndex.description);
      }
      break;
    }
    headerRowIndex++;
  }

  return { headerIndices, headerRowIndex };
};
