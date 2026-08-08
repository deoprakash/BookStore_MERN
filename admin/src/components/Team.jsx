import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Users, UserPlus, Search, X, Edit2, Trash2, Mail, Phone,
  Linkedin, Building2, Calendar, CheckCircle, XCircle,
  ChevronUp, ChevronDown, Upload, AlertCircle, ArrowUp, ArrowDown, Save
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith('http') ? import.meta.env.VITE_BACKEND_URL : `https://${import.meta.env.VITE_BACKEND_URL}`) : 'http://localhost:4000';

const DEPARTMENTS = ["Editorial", "Design", "Marketing", "Operations", "Technology", "Management", "Finance", "Sales"];

const DEPT_COLORS = {
  Editorial:   'bg-violet-100 text-violet-800',
  Design:      'bg-pink-100 text-pink-800',
  Marketing:   'bg-orange-100 text-orange-800',
  Operations:  'bg-yellow-100 text-yellow-800',
  Technology:  'bg-blue-100 text-blue-800',
  Management:  'bg-indigo-100 text-indigo-800',
  Finance:     'bg-green-100 text-green-800',
  Sales:       'bg-teal-100 text-teal-800',
};

const EMPTY_FORM = {
  name: '', role: '', department: 'Editorial', email: '',
  phone: '', bio: '', linkedin: '', isActive: true, joinedAt: '',
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const Avatar = ({ photo, name, size = 'md' }) => {
  const sz = size === 'lg' ? 'w-24 h-24 text-2xl' : size === 'sm' ? 'w-9 h-9 text-sm' : 'w-12 h-12 text-base';
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  if (photo) {
    return <img src={`${API_BASE}${photo}`} alt={name} className={`${sz} rounded-full object-cover ring-2 ring-white shadow`} />;
  }
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-[#43C6AC] to-[#2B5876] flex items-center justify-center text-white font-bold ring-2 ring-white shadow`}>
      {initials}
    </div>
  );
};

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'joinedAt', direction: 'desc' });

  // Modal state
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | 'view'
  const [selectedMember, setSelectedMember] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Reorder mode
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderList, setReorderList] = useState([]);
  const [savingOrder, setSavingOrder] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(deptFilter !== 'all' && { department: deptFilter }),
        ...(statusFilter !== 'all' && { isActive: statusFilter }),
      };
      const { data } = await axios.get(`${API_BASE}/api/team`, { params });
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchMembers, 300);
    return () => clearTimeout(t);
  }, [searchTerm, deptFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter(m => m.isActive).length,
    inactive: members.filter(m => !m.isActive).length,
    depts: new Set(members.map(m => m.department)).size,
  }), [members]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortConfig.key) return members;
    return [...members].sort((a, b) => {
      const av = a[sortConfig.key] ?? '';
      const bv = b[sortConfig.key] ?? '';
      if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
      if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [members, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <ChevronUp className="w-3 h-3 ml-1 opacity-30" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-3 h-3 ml-1" />
      : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  const toggleReorderMode = () => {
    if (!isReorderMode) {
      setSearchTerm('');
      setDeptFilter('all');
      setStatusFilter('all');
      const initialList = [...members].sort((a, b) => {
          if (a.displayOrder !== b.displayOrder) return (a.displayOrder || 0) - (b.displayOrder || 0);
          return new Date(b.joinedAt) - new Date(a.joinedAt);
      });
      setReorderList(initialList);
      setIsReorderMode(true);
    } else {
      setIsReorderMode(false);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newList = [...reorderList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setReorderList(newList);
  };

  const moveDown = (index) => {
    if (index === reorderList.length - 1) return;
    const newList = [...reorderList];
    [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
    setReorderList(newList);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      const mapped = reorderList.map((m, i) => ({ _id: m._id, displayOrder: i }));
      await axios.put(`${API_BASE}/api/team/reorder`, { members: mapped });
      setIsReorderMode(false);
      fetchMembers();
    } catch(err) {
      console.error("Failed to save order", err);
    } finally {
      setSavingOrder(false);
    }
  };

  const displayList = isReorderMode ? reorderList : sorted;

  // ── Open modals ──
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormError('');
    setModalMode('add');
  };

  const openEdit = (member) => {
    setSelectedMember(member);
    setForm({
      name: member.name || '',
      role: member.role || '',
      department: member.department || 'Editorial',
      email: member.email || '',
      phone: member.phone || '',
      bio: member.bio || '',
      linkedin: member.linkedin || '',
      isActive: member.isActive ?? true,
      joinedAt: member.joinedAt ? member.joinedAt.slice(0, 10) : '',
    });
    setPhotoFile(null);
    setPhotoPreview(member.photo ? (member.photo.startsWith('http') ? member.photo : `${API_BASE}${ member.photo.startsWith('/') ? '' : '/' }${member.photo}`) : null);
    setFormError('');
    setModalMode('edit');
  };

  const openView = (member) => {
    setSelectedMember(member);
    setModalMode('view');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedMember(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // ── Photo picker ──
  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ── Save (add / edit) ──
  const handleSave = async () => {
    setFormError('');
    if (!form.name.trim() || !form.role.trim() || !form.email.trim()) {
      setFormError('Name, Role and Email are required.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append('photo', photoFile);

      if (modalMode === 'add') {
        await axios.post(`${API_BASE}/api/team`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.put(`${API_BASE}/api/team/${selectedMember._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      closeModal();
      fetchMembers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/api/team/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchMembers();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // ── Toggle active from table ──
  const toggleActive = async (member) => {
    try {
      const fd = new FormData();
      fd.append('isActive', String(!member.isActive));
      await axios.put(`${API_BASE}/api/team/${member._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchMembers();
    } catch (err) {
      console.error('Toggle active failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto pb-24">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage BookHub's team members</p>
          </div>
          <div className="flex items-center gap-3">
            {isReorderMode ? (
              <>
                <button
                  onClick={() => setIsReorderMode(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveOrder}
                  disabled={savingOrder}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#43C6AC] text-white text-sm font-semibold rounded-xl shadow hover:bg-[#3bb59b] transition-all"
                >
                  <Save className="w-4 h-4" />
                  {savingOrder ? 'Saving...' : 'Save Order'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleReorderMode}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  Reorder
                </button>
                <button
                  id="add-team-member-btn"
                  onClick={openAdd}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2B5876] to-[#43C6AC] text-white text-sm font-semibold rounded-xl shadow hover:opacity-90 active:scale-95 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Members', value: stats.total, color: 'bg-indigo-100 text-indigo-700', icon: Users },
            { label: 'Active', value: stats.active, color: 'bg-green-100 text-green-700', icon: CheckCircle },
            { label: 'Inactive', value: stats.inactive, color: 'bg-red-100 text-red-700', icon: XCircle },
            { label: 'Departments', value: stats.depts, color: 'bg-orange-100 text-orange-700', icon: Building2 },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        {!isReorderMode && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="team-search"
                type="text"
                placeholder="Search name, role, email…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#43C6AC] focus:border-transparent"
              />
            </div>

            {/* Department Filter */}
            <select
              id="dept-filter"
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#43C6AC] focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Status Filter */}
            <select
              id="status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#43C6AC] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <p className="text-center py-16 text-gray-400">Loading team…</p>
          ) : displayList.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No team members found</p>
              <p className="text-gray-400 text-sm mt-1">Add your first member using the button above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {isReorderMode && <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>}
                    {[
                      { key: 'name', label: 'Member' },
                      { key: 'department', label: 'Department' },
                      { key: 'email', label: 'Contact' },
                      { key: 'joinedAt', label: 'Joined' },
                      { key: 'isActive', label: 'Status' },
                      { key: null, label: 'Actions' },
                    ].map(col => (
                      <th
                        key={col.label}
                        onClick={() => !isReorderMode && col.key && handleSort(col.key)}
                        className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${!isReorderMode && col.key ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                      >
                        <div className="flex items-center">
                          {col.label}
                          {!isReorderMode && col.key && <SortIcon col={col.key} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayList.map((m, index) => (
                    <tr key={m._id} className={`hover:bg-gray-50 transition-colors ${isReorderMode ? 'bg-white' : ''}`}>
                      {/* Order Controls */}
                      {isReorderMode && (
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-[#43C6AC] hover:bg-teal-50 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveDown(index)}
                              disabled={index === displayList.length - 1}
                              className="p-1 text-gray-400 hover:text-[#43C6AC] hover:bg-teal-50 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                      {/* Member */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar photo={m.photo} name={m.name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                            <p className="text-xs text-gray-500">{m.role}</p>
                          </div>
                        </div>
                      </td>
                      {/* Department */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${DEPT_COLORS[m.department] || 'bg-gray-100 text-gray-700'}`}>
                          {m.department}
                        </span>
                      </td>
                      {/* Contact */}
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-700">{m.email}</p>
                        {m.phone && <p className="text-xs text-gray-400 mt-0.5">{m.phone}</p>}
                      </td>
                      {/* Joined */}
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(m.joinedAt)}
                      </td>
                      {/* Status toggle */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(m)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            m.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {m.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {m.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            id={`view-member-${m._id}`}
                            onClick={() => openView(m)}
                            disabled={isReorderMode}
                            className="px-2.5 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            View
                          </button>
                          <button
                            id={`edit-member-${m._id}`}
                            onClick={() => openEdit(m)}
                            disabled={isReorderMode}
                            className="p-1.5 text-gray-400 hover:text-[#43C6AC] hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-member-${m._id}`}
                            onClick={() => setDeleteTarget(m)}
                            disabled={isReorderMode}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                Showing {displayList.length} member{displayList.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ──────────── Add / Edit Modal ──────────── */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center px-7 py-5 border-b">
              <h2 className="text-lg font-bold text-gray-900">
                {modalMode === 'add' ? 'Add Team Member' : 'Edit Team Member'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-7 py-6 space-y-5">
              {/* Photo Upload */}
              <div className="flex items-center gap-5">
                {photoPreview
                  ? <img src={photoPreview} alt="preview" className="w-20 h-20 rounded-full object-cover ring-2 ring-[#43C6AC]" />
                  : <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 ring-2 ring-dashed ring-gray-300">
                      <Upload className="w-6 h-6" />
                    </div>
                }
                <div>
                  <label htmlFor="photo-upload" className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg text-gray-700 transition-colors">
                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>

              {/* Fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name *', key: 'name', placeholder: 'e.g. Ananya Sharma', type: 'text' },
                  { label: 'Role / Designation *', key: 'role', placeholder: 'e.g. Senior Editor', type: 'text' },
                  { label: 'Email Address *', key: 'email', placeholder: 'name@example.com', type: 'email' },
                  { label: 'Phone', key: 'phone', placeholder: '+91 99999 00000', type: 'tel' },
                  { label: 'LinkedIn URL', key: 'linkedin', placeholder: 'https://linkedin.com/in/…', type: 'url' },
                  { label: 'Joined Date', key: 'joinedAt', placeholder: '', type: 'date' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#43C6AC] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#43C6AC] focus:border-transparent"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Active Member</label>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-[#43C6AC]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className={`text-xs font-medium ${form.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  placeholder="Short bio about this team member…"
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#43C6AC] focus:border-transparent resize-none"
                />
              </div>

              {/* Error */}
              {formError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-7 py-5 border-t flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                id="save-member-btn"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-[#2B5876] to-[#43C6AC] text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all active:scale-95"
              >
                {saving ? 'Saving…' : modalMode === 'add' ? 'Add Member' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────── View Modal ──────────── */}
      {modalMode === 'view' && selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Top banner */}
            <div className="relative h-24 bg-gradient-to-r from-[#2B5876] to-[#43C6AC] rounded-t-2xl">
              <button onClick={closeModal} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-7 pb-7">
              {/* Avatar positioned over banner */}
              <div className="-mt-12 mb-4 flex items-end gap-4">
                <Avatar photo={selectedMember.photo} name={selectedMember.name} size="lg" />
                <div className="mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{selectedMember.name}</h2>
                  <p className="text-sm text-gray-500">{selectedMember.role}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${DEPT_COLORS[selectedMember.department] || 'bg-gray-100 text-gray-700'}`}>
                  {selectedMember.department}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${selectedMember.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {selectedMember.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {selectedMember.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Contact info */}
              <div className="space-y-3 mb-5">
                {[
                  { icon: Mail, value: selectedMember.email },
                  { icon: Phone, value: selectedMember.phone },
                  { icon: Calendar, value: formatDate(selectedMember.joinedAt), label: 'Joined' },
                  { icon: Linkedin, value: selectedMember.linkedin, link: true },
                ].filter(i => i.value).map(({ icon: Icon, value, link, label }, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-[#43C6AC] mt-0.5 flex-shrink-0" />
                    {link
                      ? <a href={value} target="_blank" rel="noreferrer" className="text-sm text-[#43C6AC] underline break-all">{value}</a>
                      : <span className="text-sm text-gray-700">{label ? `${label}: ${value}` : value}</span>
                    }
                  </div>
                ))}
              </div>

              {/* Bio */}
              {selectedMember.bio && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wide">About</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedMember.bio}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { closeModal(); openEdit(selectedMember); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#2B5876] to-[#43C6AC] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => { closeModal(); setDeleteTarget(selectedMember); }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────── Delete Confirm ──────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Remove Member?</h3>
            <p className="text-gray-500 text-sm mb-6">
              <span className="font-medium text-gray-800">{deleteTarget.name}</span> will be permanently removed from the team list.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
