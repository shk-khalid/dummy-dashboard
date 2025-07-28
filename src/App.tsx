import React, { useState } from 'react';
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
  Download,
  Shield,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { TeamMember, teamData } from './data';

interface Column {
  id: string;
  label: string;
  key: keyof TeamMember | 'actions';
}

function App() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'NAME', key: 'name' },
    { id: 'certificate', label: 'CERTIFICATE', key: 'certificate' },
    { id: 'expiryDate', label: 'EXPIRY DATE', key: 'expiryDate' },
    { id: 'issuedDate', label: 'ISSUED DATE', key: 'issuedDate' },
    { id: 'status', label: 'STATUS', key: 'status' },
    { id: 'manager', label: 'MANAGER', key: 'manager' },
    { id: 'actions', label: '', key: 'actions' }
  ]);

  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(3);

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      return;
    }

    const draggedIndex = columns.findIndex(col => col.id === draggedColumn);
    const targetIndex = columns.findIndex(col => col.id === targetColumnId);

    const newColumns = [...columns];
    const draggedItem = newColumns.splice(draggedIndex, 1)[0];
    newColumns.splice(targetIndex, 0, draggedItem);

    setColumns(newColumns);
    setDraggedColumn(null);
  };

  const getStatusBadge = (status: TeamMember['status']) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'Expiring Soon':
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case 'Expired':
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return baseClasses;
    }
  };

  const renderCellContent = (member: TeamMember, column: Column) => {
    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <img 
              src={member.avatar} 
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">{member.name}</span>
          </div>
        );
      case 'certificate':
        return (
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{member.certificate}</span>
          </div>
        );
      case 'expiryDate':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{member.expiryDate}</span>
          </div>
        );
      case 'issuedDate':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{member.issuedDate}</span>
          </div>
        );
      case 'status':
        return (
          <span className={getStatusBadge(member.status)}>
            {member.status}
          </span>
        );
      case 'manager':
        return (
          <div className="flex items-center space-x-3">
            {member.managerInitials ? (
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-medium text-white">
                {member.managerInitials}
              </div>
            ) : (
              <img 
                src={member.managerAvatar} 
                alt={member.manager}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="text-gray-900">{member.manager}</span>
          </div>
        );
      case 'actions':
        return (
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search"
                className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <Triangle className="w-5 h-5 text-gray-600" />
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-medium text-white">
                YD
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Yaroslav Donchuk</div>
                <div className="text-gray-500">First test</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Dashboard Header */}
<div className="p-6 border-b border-gray-200">
  {/* Make this a column by default, row on lg */}
  <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
    
    {/* Title stays full-width on md↓, left on lg↑ */}
    <div className="text-center sm:text-left">
      <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
      <p className="text-gray-600 mt-1">
        Manage and view general details, certificates, and skills for your team members
      </p>
    </div>

    {/* Buttons: wrap on md↓, no-wrap on lg↑ */}
    <div className="flex flex-wrap lg:flex-nowrap items-center justify-center sm:justify-start gap-3">
      <div className="flex items-center space-x-2">
  <span className="text-sm text-gray-600">Share</span>
  <div className="flex -space-x-2">
    <img
      className="w-6 h-6 rounded-full border-2 border-white"
      src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
      alt="User 1"
    />
    <img
      className="w-6 h-6 rounded-full border-2 border-white"
      src="https://images.pexels.com/photos/3866549/pexels-photo-3866549.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop"
      alt="User 2"
    />
    <img
      className="w-6 h-6 rounded-full border-2 border-white"
      src="https://images.pexels.com/photos/2474307/pexels-photo-2474307.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
      alt="User 3"
    />
    <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
      <span className="text-xs text-white font-medium">+2</span>
    </div>
  </div>
</div>

      <button className="flex items-center justify-center space-x-2 h-10 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
        <Filter className="w-4 h-4" />
        <span className="text-sm">Filters</span>
        <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-full">1</span>
      </button>
      <button className="flex items-center justify-center space-x-2 h-10 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
        <Grid3X3 className="w-4 h-4" />
        <span className="text-sm">Column Views</span>
      </button>
      <button className="flex items-center justify-center space-x-2 h-10 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
        <Plus className="w-4 h-4" />
        <span className="text-sm">Add Column</span>
      </button>
      <button className="flex items-center justify-center space-x-2 h-10 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap">
        <Download className="w-4 h-4" />
        <span className="text-sm">Export to Excel</span>
      </button>
    </div>
  </div>

  {/* Filter Tag stays as-is */}
  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-4">
    <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
      <span className="text-sm">Certificate : CCP</span>
      <button className="hover:bg-yellow-200 rounded-full p-1 flex items-center justify-center">
        <X className="w-3 h-3" />
      </button>
    </div>
  </div>
</div>


          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-move select-none"
                      draggable={column.id !== 'actions'}
                      onDragStart={(e) => handleDragStart(e, column.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, column.id)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.id !== 'actions' && <ChevronDown className="w-3 h-3" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamData.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    </td>
                    {columns.map((column) => (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                        {renderCellContent(member, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Rows per page:</span>
              <select 
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="h-8 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700 ml-4">92 total</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-sm">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-sm">3</button>
              <span className="text-sm text-gray-500">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-sm">12</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-sm">13</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-sm">14</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;