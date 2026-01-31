import { NextResponse } from 'next/server';

// In-memory stores for reminders/schedules for dev/testing
const tdsReminders: Array<any> = [];
const burnoutSchedules: Array<any> = [];

function safeNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = (body.action || '').toString();
    const payload = body.payload || {};

    switch (action) {
      case 'compute-itc': {
        const invoices = Array.isArray(payload.invoices) ? payload.invoices : [];
        const now = Date.now();
        const oneYear = 1000 * 60 * 60 * 24 * 365;
        const eligible = invoices.filter((i: any) => {
          const date = i.invoiceDate ? new Date(i.invoiceDate).getTime() : now;
          return (now - date) <= oneYear && safeNumber(i.itcEligibleAmount) > 0 && !!i.vendorGst;
        });
        const suggestedClaim = eligible.reduce((s: number, i: any) => s + safeNumber(i.itcEligibleAmount), 0);
        const issues = invoices.filter((i: any) => !i.vendorGst || !i.invoiceDate).map((i: any) => `Missing fields on invoice ${i.id}`);
        return Response.json({ data: { suggestedClaim, issues, eligibleCount: eligible.length } });
      }

      case 'schedule-tds': {
        const id = `tds-${Date.now()}`;
        const rec = { id, vendor: payload.vendor || 'unknown', amount: safeNumber(payload.amount), dueDate: payload.dueDate || null };
        tdsReminders.push(rec);
        return Response.json({ data: { scheduled: true, id: rec.id } });
      }

      case 'list-tds': {
        return Response.json({ data: tdsReminders });
      }

      case 'invoice-discount': {
        const amt = safeNumber(payload.amount);
        const tenor = safeNumber(payload.tenorDays) || 30;
        const factor = tenor <= 30 ? 0.01 : tenor <= 90 ? 0.03 : 0.06;
        const discountFee = Math.round(amt * factor);
        const netProceeds = Math.round(amt - discountFee);
        return Response.json({ data: { amount: amt, tenorDays: tenor, discountFee, netProceeds } });
      }

      case 'angel-esop-sim': {
        const raised = safeNumber(payload.raised);
        const premium = safeNumber(payload.premium);
        // Very rough rules: tax ~10% of premium + 1% of raised
        const estimatedAngelTax = Math.round(premium * 0.1 + raised * 0.01);
        return Response.json({ data: { raised, premium, estimatedAngelTax } });
      }

      case 'delayed-payment-predictor': {
        const buyer = payload.buyer || 'unknown';
        const overdue = safeNumber(payload.overdueAmount);
        const score = Math.min(100, Math.round((overdue / Math.max(1, (payload.averageInvoice || 1))) * 2));
        const risk = score > 80 ? 'high' : score > 30 ? 'medium' : 'low';
        const predictedDelayDays = risk === 'high' ? 45 : risk === 'medium' ? 18 : 5;
        return Response.json({ data: { buyer, overdue, score, predictedDelayDays, risk } });
      }

      case 'schedule-burnout': {
        const id = `burn-${Date.now()}`;
        const rec = { id, owner: payload.owner || 'founder', cadenceDays: payload.cadenceDays || 7, next: new Date(Date.now() + (payload.cadenceDays || 7) * 24 * 3600 * 1000) };
        burnoutSchedules.push(rec);
        return Response.json({ data: rec });
      }

      default:
        return Response.json({ error: 'unknown action', action }, { status: 400 });
    }
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
