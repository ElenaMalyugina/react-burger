export const priceToCurrency = (rawPrice: number): string => {
  if (!rawPrice) {
    return '0';
  }

  const price = Math.ceil(rawPrice).toString();
  return price;
};
