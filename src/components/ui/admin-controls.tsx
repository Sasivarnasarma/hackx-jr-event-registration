"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Search,
  Download,
  UserCheck,
  UserX,
  Users,
  GraduationCap,
  HelpCircle,
  FileText,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Lock,
  ArrowUpDown,
} from "lucide-react";
import { LogoutButton } from "./logout-button";

interface Registration {
  id: number;
  fullName: string;
  mobileNumber: string;
  email: string | null;
  participantType: string;
  school: string;
  grade: string | null;
  awarenessSource: string;
  createdAt: string;
}

interface AdminUser {
  id: number;
  fullName: string;
  username: string;
  status: string;
  role: string;
  createdAt: string;
}

interface AdminControlsProps {
  initialRegistrations: Registration[];
  initialAdmins: AdminUser[];
  currentAdmin: {
    id: number;
    fullName: string;
    username: string;
    role: string;
  };
}

export function AdminControls({
  initialRegistrations,
  initialAdmins,
  currentAdmin,
}: AdminControlsProps) {
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [activeTab, setActiveTab] = useState<"registrations" | "admins">("registrations");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [schoolFilter, setSchoolFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<string>("date_desc");

  // Reset Password state
  const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  // Action loading states
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Compute Statistics
  const totalRegistrations = registrations.length;
  const studentCount = registrations.filter((r) => r.participantType === "STUDENT").length;
  const teacherCount = registrations.filter((r) => r.participantType === "TEACHER").length;
  const principalCount = registrations.filter((r) => r.participantType === "PRINCIPAL").length;

  const studentPercentage =
    totalRegistrations > 0 ? Math.round((studentCount / totalRegistrations) * 100) : 0;
  const teacherPercentage =
    totalRegistrations > 0 ? Math.round((teacherCount / totalRegistrations) * 100) : 0;
  const principalPercentage =
    totalRegistrations > 0 ? Math.round((principalCount / totalRegistrations) * 100) : 0;

  // Extract unique schools
  const uniqueSchools = Array.from(new Set(registrations.map((r) => r.school))).sort();

  // Search & Filter handler
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.mobileNumber.includes(searchQuery) ||
      (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === "ALL" || r.participantType === typeFilter;
    const matchesSchool = schoolFilter === "ALL" || r.school === schoolFilter;

    return matchesSearch && matchesType && matchesSchool;
  });

  // Sorting logic
  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    if (sortBy === "date_desc")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "date_asc")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "name_asc") return a.fullName.localeCompare(b.fullName);
    if (sortBy === "name_desc") return b.fullName.localeCompare(a.fullName);
    if (sortBy === "school_asc") return a.school.localeCompare(b.school);
    if (sortBy === "school_desc") return b.school.localeCompare(a.school);
    return 0;
  });

  // Admin Status Update Handler
  const handleStatusChange = async (userId: number, status: string) => {
    setActionUserId(userId);
    setActionError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status }),
      });

      const result = await res.json();

      if (!res.ok) {
        setActionError(result.message || "Failed to update administrator status.");
        setActionUserId(null);
        return;
      }

      // Update local state immediately
      setAdmins((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: result.data.status } : u))
      );
    } catch (err) {
      console.error(err);
      setActionError("Connection failed. Please check your internet connection.");
    } finally {
      setActionUserId(null);
    }
  };

  // Password Reset Handler
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordId) return;

    if (newPassword.trim().length < 8) {
      setActionError("Password must be at least 8 characters long.");
      return;
    }

    setResetLoading(true);
    setActionError(null);
    setResetSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: resetPasswordId, newPassword }),
      });

      const result = await res.json();

      if (!res.ok) {
        setActionError(result.message || "Failed to reset password.");
      } else {
        setResetSuccessMsg("Password reset successfully. Active sessions revoked.");
        setNewPassword("");
        // Close inline editor after delay
        setTimeout(() => {
          setResetPasswordId(null);
          setResetSuccessMsg(null);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setActionError("Connection failed. Please check your connection.");
    } finally {
      setResetLoading(false);
    }
  };

  // CSV Trigger Handler
  const handleExportCSV = () => {
    setExporting(true);
    window.location.href = "/api/admin/export";
    setTimeout(() => setExporting(false), 2000);
  };

  const isSuperAdmin = currentAdmin.role === "SUPER_ADMIN";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 z-10 relative">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-[#5BB8FF] to-[#72E5F8] drop-shadow-[0_0_15px_rgba(114,229,248,0.2)]">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-2 text-xs font-light flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Active Session: <span className="text-white font-medium">@{currentAdmin.username}</span>
            <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#72E5F8]/10 text-[#72E5F8] border border-[#72E5F8]/20 ml-1">
              {currentAdmin.role.replace("_", " ")}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LogoutButton />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Registrations */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[120px] transition-all hover:border-[#72E5F8]/30 group"
        >
          <div className="absolute right-4 top-4 opacity-10 text-[#72E5F8] group-hover:opacity-20 transition-all duration-300">
            <Users className="w-12 h-12" />
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Total Registrations
            </div>
            <div className="text-3xl font-black text-white mt-1 font-heading tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              {totalRegistrations}
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 border-t border-white/5 pt-2">
            island-wide participants
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#72E5F8] to-transparent opacity-50" />
        </motion.div>

        {/* Student Registrations */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[120px] transition-all hover:border-cyan-500/30 group"
        >
          <div className="absolute right-4 top-4 opacity-10 text-cyan-400 group-hover:opacity-20 transition-all duration-300">
            <GraduationCap className="w-12 h-12" />
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Students
            </div>
            <div className="text-3xl font-black text-white mt-1 font-heading tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.1)]">
              {studentCount}
            </div>
          </div>
          <div className="text-[10px] text-cyan-400 font-semibold mt-2 border-t border-white/5 pt-2 flex items-center justify-between">
            <span>{studentPercentage}% of total</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        </motion.div>

        {/* Teacher Registrations */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[120px] transition-all hover:border-amber-500/30 group"
        >
          <div className="absolute right-4 top-4 opacity-10 text-amber-400 group-hover:opacity-20 transition-all duration-300">
            <UserCheck className="w-12 h-12" />
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Teachers
            </div>
            <div className="text-3xl font-black text-white mt-1 font-heading tracking-tight drop-shadow-[0_0_10px_rgba(245,158,11,0.1)]">
              {teacherCount}
            </div>
          </div>
          <div className="text-[10px] text-amber-400 font-semibold mt-2 border-t border-white/5 pt-2 flex items-center justify-between">
            <span>{teacherPercentage}% of total</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
        </motion.div>

        {/* Principal Registrations */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[120px] transition-all hover:border-indigo-500/30 group"
        >
          <div className="absolute right-4 top-4 opacity-10 text-indigo-400 group-hover:opacity-20 transition-all duration-300">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Principals
            </div>
            <div className="text-3xl font-black text-white mt-1 font-heading tracking-tight drop-shadow-[0_0_10px_rgba(99,102,241,0.1)]">
              {principalCount}
            </div>
          </div>
          <div className="text-[10px] text-indigo-400 font-semibold mt-2 border-t border-white/5 pt-2 flex items-center justify-between">
            <span>{principalPercentage}% of total</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        </motion.div>
      </div>

      {/* Tabs Switcher - Only shown to Super Admins to toggle panels */}
      {isSuperAdmin && (
        <div className="flex bg-[#052E3F]/40 p-1.5 rounded-2xl border border-white/5 mb-8 max-w-md backdrop-blur-md">
          <button
            onClick={() => setActiveTab("registrations")}
            className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "registrations"
                ? "bg-[#72E5F8] text-[#010E13] shadow-lg shadow-[#72E5F8]/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            Registrations ({registrations.length})
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "admins"
                ? "bg-[#72E5F8] text-[#010E13] shadow-lg shadow-[#72E5F8]/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Admins Portal ({admins.length})
          </button>
        </div>
      )}

      {/* Registrations View */}
      {activeTab === "registrations" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-slate-900/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
            {/* Search Input */}
            <div className="relative col-span-1 lg:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, school, email, or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs outline-none focus:border-[#72E5F8]/50 focus:ring-1 focus:ring-[#72E5F8]/20"
              />
            </div>

            {/* Filters selectors */}
            <div className="grid grid-cols-2 gap-2 col-span-1">
              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl glass-select text-xs outline-none w-full focus:border-[#72E5F8]/50 focus:ring-1 focus:ring-[#72E5F8]/20"
              >
                <option value="ALL">All Types</option>
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="PRINCIPAL">Principal</option>
              </select>

              {/* School Filter */}
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl glass-select text-xs outline-none w-full focus:border-[#72E5F8]/50 focus:ring-1 focus:ring-[#72E5F8]/20"
              >
                <option value="ALL">All Schools</option>
                {uniqueSchools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort & Export Actions */}
            <div className="flex gap-2 justify-end w-full">
              {/* Sort selector */}
              <div className="relative w-1/2 lg:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-3 pr-8 py-2.5 rounded-xl glass-select text-xs outline-none w-full focus:border-[#72E5F8]/50 focus:ring-1 focus:ring-[#72E5F8]/20"
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="school_asc">School (A-Z)</option>
                  <option value="school_desc">School (Z-A)</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExportCSV}
                disabled={exporting || registrations.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer bg-[#72E5F8]/10 text-[#72E5F8] border border-[#72E5F8]/20 hover:bg-[#72E5F8]/20 disabled:opacity-40 disabled:cursor-not-allowed w-1/2 lg:w-auto"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Export
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto relative">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-[#052E3F]/95 backdrop-blur-md z-10 border-b border-white/5">
                  <tr className="border-b border-white/5 bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Full Name</th>
                    <th className="px-6 py-4">Mobile</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">School</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Reg. Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-light">
                  {sortedRegistrations.length > 0 ? (
                    sortedRegistrations.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-[#72E5F8]/5 border-b border-white/5 last:border-0 transition-all duration-200"
                      >
                        <td className="px-6 py-4 font-mono font-semibold text-slate-400">{r.id}</td>
                        <td className="px-6 py-4 font-semibold text-white">{r.fullName}</td>
                        <td className="px-6 py-4 font-mono">{r.mobileNumber}</td>
                        <td className="px-6 py-4">
                          {r.email || <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                              r.participantType === "STUDENT"
                                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                : r.participantType === "TEACHER"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                r.participantType === "STUDENT"
                                  ? "bg-cyan-400 animate-pulse"
                                  : r.participantType === "TEACHER"
                                    ? "bg-amber-400"
                                    : "bg-indigo-400"
                              }`}
                            />
                            {r.participantType}
                          </span>
                        </td>
                        <td className="px-6 py-4">{r.school}</td>
                        <td className="px-6 py-4 font-semibold">
                          {r.grade ? (
                            r.grade.replace("Grade ", "")
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{r.awarenessSource}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                        <FileText className="w-10 h-10 mx-auto opacity-30 mb-2" />
                        No registrations match the query criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pending Admins Audits View */}
      {activeTab === "admins" && isSuperAdmin && (
        <div className="space-y-6">
          {actionError && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {resetSuccessMsg && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{resetSuccessMsg}</span>
            </div>
          )}

          <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto relative">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-[#052E3F]/95 backdrop-blur-md z-10 border-b border-white/5">
                  <tr className="border-b border-white/5 bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Full Name</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-light">
                  {admins.length > 0 ? (
                    admins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="hover:bg-[#72E5F8]/5 border-b border-white/5 last:border-0 transition-all duration-200"
                      >
                        <td className="px-6 py-4 font-semibold text-white">{admin.fullName}</td>
                        <td className="px-6 py-4 font-mono text-[#72E5F8]">@{admin.username}</td>
                        <td className="px-6 py-4 font-medium uppercase tracking-wider text-[10px] text-slate-400">
                          {admin.role.replace("_", " ")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              admin.status === "APPROVED"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : admin.status === "REJECTED"
                                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                admin.status === "APPROVED"
                                  ? "bg-green-400"
                                  : admin.status === "REJECTED"
                                    ? "bg-red-400 animate-pulse"
                                    : "bg-amber-400"
                              }`}
                            />
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            {/* Reset Password Form Section */}
                            {resetPasswordId === admin.id ? (
                              <form
                                onSubmit={handlePasswordReset}
                                className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5"
                              >
                                <input
                                  type="password"
                                  placeholder="New Password (min 8)"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="px-2.5 py-1 rounded bg-[#010E13] border border-white/10 outline-none text-[10px] w-32 focus:border-[#72E5F8]/40"
                                  autoFocus
                                />
                                <button
                                  type="submit"
                                  disabled={resetLoading}
                                  className="px-2.5 py-1 rounded bg-[#72E5F8] text-[#010E13] font-bold text-[9px] cursor-pointer hover:bg-white transition-all disabled:opacity-50"
                                >
                                  {resetLoading ? "..." : "Save"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setResetPasswordId(null);
                                    setNewPassword("");
                                  }}
                                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-bold text-[9px] cursor-pointer hover:bg-slate-700 transition-all"
                                >
                                  Cancel
                                </button>
                              </form>
                            ) : (
                              <>
                                {/* Status Toggle Dropdown */}
                                <select
                                  value={admin.status}
                                  onChange={(e) => handleStatusChange(admin.id, e.target.value)}
                                  disabled={actionUserId !== null}
                                  className="px-2 py-1.5 rounded bg-[#010E13] border border-white/10 text-slate-300 text-[10px] outline-none cursor-pointer focus:border-[#72E5F8]/40"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="APPROVED">APPROVED</option>
                                  <option value="REJECTED">REJECTED</option>
                                </select>

                                {/* Reset Password Button */}
                                <button
                                  onClick={() => setResetPasswordId(admin.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all border border-white/5 bg-[#72E5F8]/10 text-white hover:bg-[#72E5F8]/20"
                                >
                                  <Lock className="w-3 h-3 text-[#72E5F8]" />
                                  Reset Pass
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        <FileText className="w-10 h-10 mx-auto opacity-30 mb-2" />
                        No other administrators registered on this portal.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
