export const priceToCurrency = (rawPrice: number): string => {
  if (!rawPrice) {
    return '0';
  }

  const price = Math.ceil(rawPrice * 0.01).toString();
  return price;
};
