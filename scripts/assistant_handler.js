module.exports = async function handle(action, payload){
  try{
    switch(action){
      case 'compute-itc':{
        const invoices = (payload?.invoices || [])
        const suggested = invoices.filter(i=>i.itcEligibleAmount && i.itcEligibleAmount>0).map(i=>({invoice:i.id,amount:i.itcEligibleAmount}))
        return {suggested, note:'Local test ITC suggestions'}
      }
      case 'invoice-discount':{
        const amount = Number(payload?.amount||0)
        const tenor = Number(payload?.tenorDays||30)
        const feeFactor = tenor>60?0.02: tenor>30?0.015:0.01
        const discount = Math.round(amount*feeFactor)
        return {amount, tenor, discount}
      }
      case 'angel-esop-sim':{
        const raised = Number(payload?.raised||0)
        const premium = Number(payload?.premium||0)
        const dilution = Math.round((premium/ (raised+premium))*10000)/100
        return {raised, premium, dilution}
      }
      case 'delayed-payment-predictor':{
        const score = Math.min(1, (payload.overdueAmount||0)/(Math.max(1,payload.averageInvoice||1))*0.5)
        return {score, risk: score>0.3? 'high':'low'}
      }
      case 'schedule-tds':{
        return {ok:true, scheduled: payload}
      }
      case 'list-tds':{
        return {list:[]}
      }
      case 'schedule-burnout':{
        return {ok:true, cadence: payload.cadenceDays}
      }
      default:
        return {ok:false, message:'unknown action'}
    }
  }catch(e){
    return {ok:false,error:String(e)}
  }
}
