export const formatAmount = (amount: number) => {
  const formattedAmount = Math.abs(amount).toLocaleString();
  return `₦${formattedAmount}`;
};

