import { NextResponse } from 'next/server'

export async function POST(req: Request){
  try{
    const body = await req.json()
    const { action, payload } = body || {}

    switch(action){
      case 'compute-itc':{
        // simple heuristic: return items with gstEligible true
        const invoices = (payload?.invoices || [])
        const suggested = invoices.filter((i:any)=>i.gstEligible).map((i:any)=>({invoice:i.id,amount:i.amount}))
        return Response.json({suggested, note:'Heuristic ITC suggestions'})
      }
      case 'tds-calc':{
        const amount = Number(payload?.amount || 0)
        const rate = payload?.type==='professional'?0.1:0.02
        const tds = Math.round(amount*rate)
        return Response.json({amount, tds, rate})
      }
      case 'pitfalls':{
        const turnover = Number(payload?.turnover || 0)
        const alerts:string[] = []
        if(turnover>500000 && turnover<1000000) alerts.push('Consider GST registration soon')
        if(turnover>=1000000) alerts.push('GST registration required; file returns')
        if(turnover>2000000) alerts.push('Annual audit might be required')
        return Response.json({alerts})
      }
      case 'search-links':{
        const role = payload?.role || 'Software Engineer'
        const location = payload?.location || 'Bengaluru'
        const naukri = `https://www.naukri.com/job-listings?keyword=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`
        const linkedin = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(role)}%20${encodeURIComponent(location)}`
        const upwork = `https://www.upwork.com/search/profiles/?q=${encodeURIComponent(role)}`
        return Response.json({naukri, linkedin, upwork})
      }
      case 'delayed-predict':{
        const vendors = payload?.vendors || []
        const scored = vendors.map((v:any)=>({vendor:v.name||v, score: Math.min(1, (v.historyLate||0)/Math.max(1,v.total||1) + (v.sizeRisk||0)), risk: ((v.historyLate||0)/(Math.max(1,v.total||1)))>0.4 ? 'high' : 'low'}))
        return Response.json({scored})
      }
      case 'funding-sim':{
        const runway = Number(payload?.runwayMonths || 0)
        const burn = Number(payload?.monthlyBurn || 0)
        const receivables = Number(payload?.receivables || 0)
        const need = Math.max(0, Math.round((3 - runway)*burn - receivables))
        return Response.json({runway, burn, receivables, recommendedBridge: need})
      }
      case 'burnout-checkin':{
        // accept mood score 1-10 and return trajectory
        const score = Number(payload?.score||5)
        const trajectory = Array.from({length:7}, (_,i)=>Math.max(0, score - i*0.3))
        return Response.json({score, trajectory})
      }
      case 'export-check':{
        const iec = !!payload?.iec
        const gst = payload?.exportEligible? true:false
        return Response.json({iec, gst, note:'Check IEC and GST status for exports'})
      }
      case 'cyber-risk':{
        const score = 100 - ((payload?.openPorts||0)*5 + (payload?.emailRisk||0)*10)
        return Response.json({score: Math.max(0, Math.min(100, Math.round(score))), suggestions:['Enable MFA','Use Cloudflare','Train employees on phishing']})
      }
      case 'recover-overdue':{
        const amount = payload?.amount||0
        const days = payload?.daysOverdue||0
        const template = `Dear Customer, your invoice of ₹${amount} is overdue by ${days} days. Please pay within 7 days or we will initiate recovery.`
        return Response.json({template, links:{msmeSamadhaan:'https://samadhaan.msme.gov.in/'}})
      }
      case 'skill-gap':{
        const team = payload?.teamSize||1
        const benchmark = payload?.benchmark||10
        const need = Math.max(0, benchmark - team)
        return Response.json({team, benchmark, need, recommendations: need>0?['Hire digital marketer','Upskill via Skill India']:['Team size ok']})
      }
      default:
        return Response.json({ok:false, message:'unknown action'})
    }
  }catch(e:any){
    return Response.json({ok:false,error:String(e)})
  }
}
