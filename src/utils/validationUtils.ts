export const isValidAmount = (amount: string) => {
  return /^\d+(\.\d{1,2})?$/.test(amount);
};
