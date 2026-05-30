export const normalizeNumber = (val) => {
  if (!val) return 0;
  // Remove commas, spaces, currency symbols, etc.
  const cleaned = val.toString().replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

// For input fields (returns a cleaned string)
export const sanitizeNumberInput = (val) => {
  if (!val) return "";
  const cleaned = val.toString().replace(/[^0-9.]/g, "");
  return cleaned; // keep as string for controlled inputs
};

// For display formatting (commas, friendly UI)
export const formatNumber = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const num = normalizeNumber(val);
  return num.toLocaleString("en-US"); // e.g. 2,000 or 1,500.75
};
