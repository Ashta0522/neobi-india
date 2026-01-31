(async () => {
  const base = 'http://localhost:3000/api/finance';
  const LOCAL = !!process.env.LOCAL_TEST;
  const handler = LOCAL ? require('./assistant_handler') : null;
  const calls = [
    { action: 'compute-itc', payload: { invoices: [ { id: 'a', itcEligibleAmount: 10000, vendorGst: '27ABCDE', invoiceDate: new Date().toISOString() }, { id: 'b', itcEligibleAmount: 0, vendorGst: null } ] } },
    { action: 'invoice-discount', payload: { amount: 100000, tenorDays: 45 } },
    { action: 'angel-esop-sim', payload: { raised: 5000000, premium: 800000 } },
    { action: 'delayed-payment-predictor', payload: { buyer: 'Big Co', overdueAmount: 800000, averageInvoice: 200000 } },
    { action: 'schedule-tds', payload: { vendor: 'Vendor A', amount: 50000, dueDate: '2026-02-15' } },
    { action: 'list-tds', payload: {} },
    { action: 'schedule-burnout', payload: { owner: 'founder', cadenceDays: 7 } },
  ];

  for (const c of calls) {
    try {
      if(LOCAL){
        const j = await handler(c.action, c.payload)
        console.log(c.action, '=>', JSON.stringify(j))
      } else {
        const res = await fetch(base, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(c) });
        const j = await res.json();
        console.log(c.action, '=>', JSON.stringify(j));
      }
    } catch (err) {
      console.error('call failed', c.action, err);
    }
  }
})();
