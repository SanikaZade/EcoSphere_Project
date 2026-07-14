import { useState } from 'react'
import { useEco } from '../context/EcoContext'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

// ---------- Export helpers ----------

function exportCSV(filename, rows) {
  if (!rows || rows.length === 0) { alert('No data to export.'); return }
  const headers = Object.keys(rows[0]).join(',')
  const body = rows.map((r) =>
    Object.values(r).map((v) => (typeof v === 'string' && v.includes(',') ? `"${v}"` : v)).join(',')
  ).join('\n')
  const csv = headers + '\n' + body
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function exportExcel(filename, sheetName, rows) {
  if (!rows || rows.length === 0) { alert('No data to export.'); return }
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, filename)
}

function exportPDF(title, headers, rows) {
  if (!rows || rows.length === 0) { alert('No data to export.'); return }
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 14, 20)

  // Date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)
  doc.setTextColor(0, 0, 0)

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.line(14, 32, pageWidth - 14, 32)

  // Table header
  const colW = Math.floor((pageWidth - 28) / headers.length)
  let y = 40
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(47, 107, 79)
  doc.setTextColor(255, 255, 255)
  doc.rect(14, y - 5, pageWidth - 28, 8, 'F')
  headers.forEach((h, i) => doc.text(String(h), 15 + i * colW, y))
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  y += 8

  // Table rows
  rows.forEach((row, ri) => {
    if (y > 270) { doc.addPage(); y = 20 }
    if (ri % 2 === 0) {
      doc.setFillColor(246, 244, 238)
      doc.rect(14, y - 5, pageWidth - 28, 8, 'F')
    }
    const vals = Array.isArray(row) ? row : Object.values(row)
    vals.forEach((v, i) => {
      const text = String(v ?? '').substring(0, 25)
      doc.text(text, 15 + i * colW, y)
    })
    y += 8
  })

  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`)
}

// ---------- Reports page ----------

const REPORTS = ['Environmental Report', 'Social Report', 'Governance Report', 'ESG Summary Report']

export default function Reports() {
  const {
    departments, employees, challenges,
    carbonTransactions, employeeParticipation, trainingCompletions,
    complianceIssues, acknowledgements, scores,
    csrActivities,
  } = useEco()
  const [filters, setFilters] = useState({ department: '', dateFrom: '', dateTo: '', module: '', employee: '', challenge: '', esgCategory: '' })
  const [generated, setGenerated] = useState(null)

  // ---------- Per-report data ----------
  const reportData = {
    'Environmental Report': carbonTransactions.map((t) => ({
      id: t.id,
      department: departments.find((d) => d.id === t.departmentId)?.name || t.departmentId,
      source: t.source,
      quantity: t.quantity,
      emissions_kgCO2e: t.emissions.toFixed(2),
      date: t.date,
    })),
    'Social Report': [
      ...employeeParticipation.map((ep) => ({
        type: 'CSR Participation',
        employee: employees.find((e) => e.id === ep.employeeId)?.name || ep.employeeId,
        activity: ep.activityId,
        status: ep.approvalStatus,
        points: ep.pointsEarned,
        date: ep.completionDate || '',
      })),
      ...trainingCompletions.map((t) => ({
        type: 'Training',
        employee: employees.find((e) => e.id === t.employeeId)?.name || t.employeeId,
        activity: t.trainingName,
        status: 'Completed',
        points: t.hours,
        date: t.completedDate,
      })),
    ],
    'Governance Report': [
      ...complianceIssues.map((ci) => ({
        type: 'Compliance Issue',
        id: ci.id,
        severity: ci.severity,
        description: ci.description,
        owner: ci.owner,
        dueDate: ci.dueDate,
        status: ci.status,
      })),
      ...acknowledgements.map((a) => ({
        type: 'Acknowledgement',
        id: a.id,
        policyId: a.policyId,
        employee: employees.find((e) => e.id === a.employeeId)?.name || a.employeeId,
        acknowledgedAt: a.acknowledgedAt,
        status: 'Acknowledged',
      })),
    ],
    'ESG Summary Report': scores.byDept.map((d) => ({
      department: d.departmentName,
      environmental: d.environmental,
      social: d.social,
      governance: d.governance,
      total: d.total,
    })),
  }

  // ---------- Custom report filtered data ----------
  const buildCustomData = () => {
    let rows = [
      ...carbonTransactions.map((t) => ({ module: 'Environmental', department: t.departmentId, employee: '', challenge: '', date: t.date, value: t.emissions.toFixed(2), label: `${t.source} emission` })),
      ...employeeParticipation.map((ep) => ({ module: 'Social', department: '', employee: ep.employeeId, challenge: '', date: ep.completionDate || '', value: ep.pointsEarned, label: 'CSR Participation' })),
      ...trainingCompletions.map((t) => ({ module: 'Social', department: '', employee: t.employeeId, challenge: '', date: t.completedDate, value: t.hours, label: `Training: ${t.trainingName}` })),
      ...complianceIssues.map((ci) => ({ module: 'Governance', department: '', employee: '', challenge: '', date: ci.dueDate, value: ci.severity, label: ci.description })),
    ]
    if (filters.department) rows = rows.filter((r) => r.department === filters.department)
    if (filters.employee) rows = rows.filter((r) => r.employee === filters.employee)
    if (filters.challenge) rows = rows.filter((r) => r.challenge === filters.challenge)
    if (filters.module) rows = rows.filter((r) => r.module === filters.module)
    if (filters.dateFrom) rows = rows.filter((r) => r.date >= filters.dateFrom)
    if (filters.dateTo) rows = rows.filter((r) => r.date <= filters.dateTo)
    return rows
  }

  const handleExport = (reportName, format) => {
    const data = reportData[reportName]
    const safeFilename = reportName.replace(/\s+/g, '_')
    if (format === 'CSV') exportCSV(`${safeFilename}.csv`, data)
    else if (format === 'Excel') exportExcel(`${safeFilename}.xlsx`, reportName, data)
    else if (format === 'PDF') {
      const headers = data.length ? Object.keys(data[0]) : []
      exportPDF(reportName, headers, data)
    }
    setGenerated({ format, reportName, at: new Date().toISOString() })
    setTimeout(() => setGenerated(null), 3000)
  }

  const handleCustomExport = (format) => {
    const data = buildCustomData()
    if (format === 'CSV') exportCSV('Custom_Report.csv', data)
    else if (format === 'Excel') exportExcel('Custom_Report.xlsx', 'Custom', data)
    else if (format === 'PDF') {
      const headers = data.length ? Object.keys(data[0]) : ['module', 'date', 'label', 'value']
      exportPDF('Custom ESG Report', headers, data)
    }
    setGenerated({ format, reportName: 'Custom Report', at: new Date().toISOString() })
    setTimeout(() => setGenerated(null), 3000)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Reporting</span>
          <h1 className="page-title">Reports</h1>
          <p className="page-desc">Standard reports and a custom report builder. Exports as PDF, Excel or CSV.</p>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        {REPORTS.map((r) => (
          <div className="card" key={r}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{r}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 12 }}>
              {r === 'Environmental Report' && `${reportData[r].length} transactions`}
              {r === 'Social Report' && `${reportData[r].length} records`}
              {r === 'Governance Report' && `${reportData[r].length} records`}
              {r === 'ESG Summary Report' && `${reportData[r].length} departments`}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-outline btn-sm" onClick={() => handleExport(r, 'PDF')}>PDF</button>
              <button className="btn btn-outline btn-sm" onClick={() => handleExport(r, 'Excel')}>Excel</button>
              <button className="btn btn-outline btn-sm" onClick={() => handleExport(r, 'CSV')}>CSV</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-title">Custom Report Builder</div>
        <div className="grid grid-3">
          <div className="form-row">
            <label>Department</label>
            <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
              <option value="">All</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Date From</label>
            <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Date To</label>
            <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Module</label>
            <select value={filters.module} onChange={(e) => setFilters({ ...filters, module: e.target.value })}>
              <option value="">All</option>
              {['Environmental', 'Social', 'Governance', 'Gamification'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Employee</label>
            <select value={filters.employee} onChange={(e) => setFilters({ ...filters, employee: e.target.value })}>
              <option value="">All</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Challenge</label>
            <select value={filters.challenge} onChange={(e) => setFilters({ ...filters, challenge: e.target.value })}>
              <option value="">All</option>
              {challenges.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>ESG Category</label>
            <select value={filters.esgCategory} onChange={(e) => setFilters({ ...filters, esgCategory: e.target.value })}>
              <option value="">All</option>
              {['Environmental', 'Social', 'Governance'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button className="btn btn-primary" onClick={() => handleCustomExport('PDF')}>Export PDF</button>
          <button className="btn btn-outline" onClick={() => handleCustomExport('Excel')}>Export Excel</button>
          <button className="btn btn-outline" onClick={() => handleCustomExport('CSV')}>Export CSV</button>
        </div>
        {generated && (
          <div className="note-callout" style={{ marginTop: 16, marginBottom: 0 }}>
            ✓ {generated.reportName} exported as {generated.format} — check your downloads folder.
          </div>
        )}
      </div>
    </div>
  )
}
