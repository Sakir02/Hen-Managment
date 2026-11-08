export function calculateCustomerFinancials(customer) {
  if (!customer) return null;

  const hens = customer.hens || [];
  const payments = customer.payments || [];

  const margaHens = hens.filter(h => h.type === 'MARGA');
  const margeeHens = hens.filter(h => h.type === 'MARGEE');

  const margaWeight = margaHens.reduce((sum, h) => sum + (parseFloat(h.weight) || 0), 0);
  const margeeWeight = margeeHens.reduce((sum, h) => sum + (parseFloat(h.weight) || 0), 0);

  const margaAmount = margaHens.reduce((sum, h) => {
    const w = parseFloat(h.weight) || 0;
    const r = parseFloat(h.rateApplied) || 0;
    return sum + (w * r);
  }, 0);

  const margeeAmount = margeeHens.reduce((sum, h) => {
    const w = parseFloat(h.weight) || 0;
    const r = parseFloat(h.rateApplied) || 0;
    return sum + (w * r);
  }, 0);

  const customerTotal = Math.round((margaAmount + margeeAmount) * 100) / 100;
  const totalPaid = Math.round(payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) * 100) / 100;
  const payableAmount = Math.max(0, Math.round((customerTotal - totalPaid) * 100) / 100);

  return {
    margaCount: margaHens.length,
    margaWeight: Math.round(margaWeight * 1000) / 1000,
    margaAmount: Math.round(margaAmount * 100) / 100,
    margeeCount: margeeHens.length,
    margeeWeight: Math.round(margeeWeight * 1000) / 1000,
    margeeAmount: Math.round(margeeAmount * 100) / 100,
    totalHens: hens.length,
    totalWeight: Math.round((margaWeight + margeeWeight) * 1000) / 1000,
    customerTotal,
    totalPaid,
    payableAmount,
    isSettled: payableAmount === 0 && customerTotal > 0
  };
}

export function formatCurrency(amount) {
  const val = parseFloat(amount) || 0;
  return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
