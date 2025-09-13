
const staticSiteTableHeader = [
  "Date",
  "Site",
  "Estimated earnings (USD)",
  "Page views",
  "Page RPM (USD)",
  "Impressions",
  "Impression RPM (USD)",
  "Active View Viewable",
  "Clicks"
]

export const ValidExcel = (excelHeader, staticHeader) => { return excelHeader.every((element) => staticHeader.includes(element)) }
