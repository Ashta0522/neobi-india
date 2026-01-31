import React, {useState} from 'react'
import { useNeoBIStore } from '@/lib/store'

export default function CompliancePanel(){
  const [gstTurnover, setGstTurnover] = useState<number>(0)
  const [alerts, setAlerts] = useState<string[]>([])
  const [itcJson, setItcJson] = useState('')

  const checkPitfalls = ()=>{
    const a:string[] = []
    if(gstTurnover > 500000 && gstTurnover < 1000000) a.push('Consider GST registration if turnover crosses threshold soon.')
    if(gstTurnover >= 1000000) a.push('You must be GST registered; ensure returns filed in time.')
    setAlerts(a)
  }

  const generateITC = ()=>{
    // lightweight mock: produce CSV/JSON with suggested claims
    const data = {
      suggestedClaims: [
        {invoice: 'INV-001', vendor: 'Vendor A', amount: 12500, eligible: true},
        {invoice: 'INV-002', vendor: 'Vendor B', amount: 4300, eligible: false}
      ],
      note: 'This is a heuristic suggestion. Verify with your accountant.'
    }
    setItcJson(JSON.stringify(data, null, 2))
  }

  const downloadExport = ()=>{
    const blob = new Blob([itcJson || '{}'], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'itc-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const scheduleTDS = ()=>{
    const vendor = (document.getElementById('tds-vendor') as HTMLInputElement)?.value || 'Vendor A'
    const amount = Number((document.getElementById('tds-amount') as HTMLInputElement)?.value || 0)
    const due = (document.getElementById('tds-due') as HTMLInputElement)?.value || new Date().toISOString().slice(0,10)
    if(amount>0){
      useNeoBIStore.getState().scheduleTDSReminder({vendor, amount, dueDate: due})
      alert('TDS reminder scheduled')
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">Compliance & Tax</h3>
      <div className="mt-3">
        <label className="block text-sm">Estimated annual turnover (₹)</label>
        <input className="border p-2 mt-1 w-full" type="number" value={gstTurnover} onChange={e=>setGstTurnover(Number(e.target.value))} />
        <div className="flex gap-2 mt-2">
          <button onClick={checkPitfalls} className="px-3 py-1 bg-blue-600 text-white rounded">Check Pitfalls</button>
          <button onClick={generateITC} className="px-3 py-1 bg-green-600 text-white rounded">Run ITC Optimizer</button>
          <button onClick={downloadExport} className="px-3 py-1 bg-gray-600 text-white rounded">Export JSON</button>
        </div>
      </div>
      <div className="mt-3">
        <h4 className="font-medium">Alerts</h4>
        {alerts.length===0 ? <p className="text-sm text-gray-500">No immediate alerts</p> : <ul className="list-disc ml-5">{alerts.map((a,i)=><li key={i}>{a}</li>)}</ul>}
      </div>
      <div className="mt-3">
        <h4 className="font-medium">ITC Suggestion (preview)</h4>
        <pre className="text-xs bg-slate-50 p-2 rounded max-h-48 overflow-auto">{itcJson || 'No ITC generated yet'}</pre>
      </div>
      <div className="mt-3">
        <h4 className="font-medium">TDS Reminder</h4>
        <div className="flex gap-2 mt-2 text-sm">
          <input id="tds-vendor" placeholder="Vendor" className="p-2 w-1/3 border rounded" />
          <input id="tds-amount" placeholder="Amount" type="number" className="p-2 w-1/3 border rounded" />
          <input id="tds-due" placeholder="Due" type="date" className="p-2 w-1/3 border rounded" />
        </div>
        <div className="mt-2"><button onClick={scheduleTDS} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs">Schedule TDS Reminder</button></div>
      </div>
    </div>
  )
}
