import React, { useState, useMemo } from 'react'
import {
  Search,
  MessageCircle,
  Triangle,
  HelpCircle,
  Bell,
  X,
  Filter,
  Grid3X3,
  Plus,
  Shield,
  Calendar,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PieChart
} from 'lucide-react'
import { TeamMember, teamData } from './data'

interface Column {
  id: string
  label: string
  key: keyof TeamMember | 'actions'
}

function App() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'NAME', key: 'name' },
    { id: 'certificate', label: 'CERTIFICATE', key: 'certificate' },
    { id: 'expiryDate', label: 'EXPIRY DATE', key: 'expiryDate' },
    { id: 'issuedDate', label: 'ISSUED DATE', key: 'issuedDate' },
    { id: 'status', label: 'STATUS', key: 'status' },
    { id: 'manager', label: 'MANAGER', key: 'manager' },
  ])

  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TeamMember | null
    direction: 'asc' | 'desc' | null
  }>({ key: null, direction: null })

  const totalRows = teamData.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return [...teamData]
    return [...teamData].sort((a, b) => {
      const aVal = a[sortConfig.key!]
      const bVal = b[sortConfig.key!]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc'
          ? aVal - bVal
          : bVal - aVal
      }
      return 0
    })
  }, [sortConfig])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return sortedData.slice(start, start + rowsPerPage)
  }, [currentPage, rowsPerPage, sortedData])

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedColumn(id)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedColumn || draggedColumn === targetId) return setDraggedColumn(null)
    const from = columns.findIndex(c => c.id === draggedColumn)
    const to = columns.findIndex(c => c.id === targetId)
    const cols = [...columns]
    const [moved] = cols.splice(from, 1)
    cols.splice(to, 0, moved)
    setColumns(cols)
    setDraggedColumn(null)
  }

  const handleSort = (key: keyof TeamMember | 'actions') => {
    if (key === 'actions') return
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const goToPage = (n: number) => {
    if (n < 1 || n > totalPages) return
    setCurrentPage(n)
  }
  const handlePrev = () => goToPage(currentPage - 1)
  const handleNext = () => goToPage(currentPage + 1)

  const getStatusBadge = (status: TeamMember['status']) => {
    const base = 'px-3 py-1 rounded-full text-sm font-medium'
    if (status === 'Active') return `${base} bg-green-100 text-green-700`
    if (status === 'Expiring Soon') return `${base} bg-orange-100 text-orange-700`
    if (status === 'Expired') return `${base} bg-red-100 text-red-700`
    return base
  }

  const renderCellContent = (m: TeamMember, col: Column) => {
    switch (col.key) {
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
            <span className="font-medium text-gray-900">{m.name}</span>
          </div>
        )
      case 'certificate':
        return (
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{m.certificate}</span>
          </div>
        )
      case 'expiryDate':
      case 'issuedDate':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">
              {col.key === 'expiryDate' ? m.expiryDate : m.issuedDate}
            </span>
          </div>
        )
      case 'status':
        return <span className={getStatusBadge(m.status)}>{m.status}</span>
      case 'manager':
        return (
          <div className="flex items-center space-x-3">
            {m.managerInitials ? (
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm text-white">
                {m.managerInitials}
              </div>
            ) : (
              <img src={m.managerAvatar} alt={m.manager} className="w-8 h-8 rounded-full object-cover" />
            )}
            <span className="text-gray-900">{m.manager}</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <Triangle className="w-5 h-5 text-gray-600" />
          <HelpCircle className="w-5 h-5 text-gray-600" />
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm text-white">
              YD
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Yaroslav Donchuk</div>
              <div className="text-gray-500">First test</div>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage and view general details, certificates, and skills for your team members
            </p>
          </div>
          <div className="flex flex-wrap xl:flex-nowrap items-center justify-center sm:justify-start gap-3">
            <button className="flex items-center space-x-2 h-10 px-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-600">Share</span>
              <div className="flex -space-x-2">
                <img
                  className="w-6 h-6 rounded-full border-2 border-white"
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                  alt="User 1"
                />
                <img
                  className="w-6 h-6 rounded-full border-2 border-white"
                  src="https://images.pexels.com/photos/3866549/pexels-photo-3866549.jpeg"
                  alt="User 2"
                />
                <img
                  className="w-6 h-6 rounded-full border-2 border-white"
                  src="https://images.pexels.com/photos/2474307/pexels-photo-2474307.jpeg"
                  alt="User 3"
                />
                <div className="w-6 h-6 rounded-full bg-[#81BC70] border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-medium">+2</span>
                </div>
              </div>
            </button>

            <button className="flex items-center justify-center space-x-2 h-10 px-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
              <span className="bg-[#60a465] text-xs text-white px-2 py-0.5 rounded-full">1</span>
            </button>

            <button className="flex items-center justify-center space-x-2 h-10 px-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Grid3X3 className="w-4 h-4" />
              <span className="text-sm">Column Views</span>
            </button>

            <button className="flex items-center justify-center space-x-2 h-10 px-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Column</span>
            </button>

            <button className="flex items-center justify-center space-x-2 h-10 px-3 bg-[#81BC70] text-white rounded-lg hover:bg-green-700">
              <PieChart className="w-4 h-4" />
              <span className="text-sm">Export to Excel</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-start mt-4">
          <div className="flex items-center space-x-2 bg-[#f9f9e5] border border-[#669900] text-gray-600 px-3 py-1 rounded-lg">
            <span className="text-sm text-gray-500">Certificate : GCP</span>
            <button className="hover:bg-green-100 rounded-full p-1 flex items-center justify-center">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="xl:w-full max-w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 w-12">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  {columns.map(col => (
                    <th
                      key={col.id}
                      onClick={() => handleSort(col.key)}
                      draggable={col.id !== 'actions'}
                      onDragStart={e => handleDragStart(e, col.id)}
                      onDragOver={handleDragOver}
                      onDrop={e => handleDrop(e, col.id)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col.label}</span>
                        {col.key !== 'actions' && sortConfig.key === col.key && (
                          sortConfig.direction === 'asc'
                            ? <ChevronUp className="w-3 h-3" />
                            : <ChevronDown className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 w-12">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    {columns.map(col => (
                      <td key={col.id} className="px-6 py-4 whitespace-nowrap">
                        {renderCellContent(row, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            {/* Rows‑per‑page */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Rows per page:</span>

              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={e => {
                    setRowsPerPage(+e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-8 w-12 border border-gray-300 rounded pl-2 pr-4 text-sm bg-white appearance-none focus:outline-none"
                >
                  {[5, 10, 20, 50, 100].map(n => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              <span className="ml-4 text-sm text-gray-700">{totalRows} total</span>
            </div>

            {/* Page controls */}
            <div className="flex items-center space-x-1">
  {/* Prev arrow */}
  <button
    onClick={handlePrev}
    disabled={currentPage === 1}
    className={`w-8 h-8 flex items-center justify-center rounded ${
      currentPage === 1
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    <ChevronLeft className="w-4 h-4" />
  </button>

  {/* Page numbers + ellipsis */}
  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
    if (page === 4) {
      return (
        <span key="ellipsis" className="px-2 text-gray-500">
          …
        </span>
      )
    }
    if (page <= 3 || page > totalPages - 1) {
      return (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded-full ${
            page === currentPage
              ? 'border border-green-500 text-green-500'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      )
    }
    return null
  })}

  {/* Next arrow */}
  <button
    onClick={handleNext}
    disabled={currentPage === totalPages}
    className={`w-8 h-8 flex items-center justify-center rounded ${
      currentPage === totalPages
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    <ChevronRight className="w-4 h-4" />
  </button>
</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
