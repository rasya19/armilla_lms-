import React, { useState } from "react";
import { Plus, UserCheck, UserX, Trash2, ClipboardList, CheckCircle, XCircle, AlertCircle, Send, Search } from "lucide-react";
import { PPDB } from "../types";

interface DataPPDBProps {
  ppdbList: PPDB[];
  onAdd: (data: Omit<PPDB, "id" | "noDaftar" | "status" | "tanggalDaftar">) => Promise<void>;
  onUpdateStatus: (id: string, status: "Diterima" | "Ditolak") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function DataPPDB({ ppdbList, onAdd, onUpdateStatus, onDelete }: DataPPDBProps) {
  const [search, setSearch] = useState("");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState("");

  // Form registration state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jenjang, setJenjang] = useState<"Paket A" | "Paket B" | "Paket C">("Paket C");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!nama || !email || !telepon || !alamat) {
      setFormError("Semua bidang form pendaftaran wajib diisi.");
      return;
    }

    try {
      await onAdd({ nama, email, telepon, alamat, jenjang });
      setFormSuccess("Formulir pendaftaran PPDB berhasil diajukan! Berkas pendaftar segera diverifikasi.");
      // Reset form
      setNama("");
      setEmail("");
      setTelepon("");
      setAlamat("");
      setJenjang("Paket C");
      setTimeout(() => {
        setIsFormOpen(false);
        setFormSuccess("");
      }, 3000);
    } catch (err: any) {
      setFormError(err.message || "Gagal mengirim formulir pendaftaran.");
    }
  };

  const handleApprove = async (id: string, namaSiswa: string) => {
    if (confirm(`Apakah Anda yakin ingin MENERIMA pendaftar "${namaSiswa}" di PKBM Armilla?`)) {
      try {
        await onUpdateStatus(id, "Diterima");
      } catch (err: any) {
        alert("Gagal merubah status: " + err.message);
      }
    }
  };

  const handleReject = async (id: string, namaSiswa: string) => {
    if (confirm(`Apakah Anda yakin ingin MENOLAK berkas pendaftaran dari "${namaSiswa}"?`)) {
      try {
        await onUpdateStatus(id, "Ditolak");
      } catch (err: any) {
        alert("Gagal merubah status: " + err.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus arsip pendaftaran PPDB ini secara permanen?")) {
      try {
        await onDelete(id);
      } catch (err: any) {
        alert("Gagal menghapus data: " + err.message);
      }
    }
  };

  const filteredPPDB = ppdbList.filter(p => {
    const matchesSearch = p.nama.toLowerCase().includes(search.toLowerCase()) || p.noDaftar.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedFilterStatus ? p.status === selectedFilterStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="ppdb-container">
      {/* Header and Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Penerimaan Peserta Didik Baru (PPDB)</h1>
          <p className="text-sm text-slate-500">Kelola berkas calon pendaftar, seleksi administrasi, dan registrasi siswa</p>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setFormError("");
            setFormSuccess("");
          }}
          className={`text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 self-start sm:self-auto shadow-xs ${
            isFormOpen 
              ? "bg-slate-800 hover:bg-slate-700 text-white" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
          id="btn-toggle-ppdb-form"
        >
          {isFormOpen ? "Tutup Form Pendaftaran" : "Buka Form Pendaftaran Baru"}
        </button>
      </div>

      {/* Slide down form registration */}
      {isFormOpen && (
        <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl space-y-4 animate-in slide-in-from-top-4 duration-200" id="ppdb-form-card">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <ClipboardList className="text-emerald-600" size={20} />
            <h3 className="font-bold text-slate-900">Formulir Pendaftaran Siswa Baru (PPDB Online)</h3>
          </div>

          <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs col-span-1 sm:col-span-2 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 col-span-1 sm:col-span-2 rounded-xl text-xs flex items-center gap-2 font-medium">
                <CheckCircle size={16} className="text-green-600 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Nama */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Nama Lengkap Calon Siswa *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Rendi Pangestu"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Program Jenjang */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Jenjang Program Kesetaraan *</label>
              <select
                value={jenjang}
                onChange={(e) => setJenjang(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Paket A">Paket A (Setara SD)</option>
                <option value="Paket B">Paket B (Setara SMP)</option>
                <option value="Paket C">Paket C (Setara SMA)</option>
              </select>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Alamat Email Aktif *</label>
              <input
                type="email"
                required
                placeholder="rendi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Telepon */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">No. WhatsApp Calon Siswa *</label>
              <input
                type="text"
                required
                placeholder="Contoh: 0852XXXXXXXX"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Alamat Rumah */}
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Alamat Domisili Lengkap *</label>
              <textarea
                required
                rows={2}
                placeholder="Isi alamat rumah lengkap calon peserta didik..."
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              ></textarea>
            </div>

            <div className="col-span-1 sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                Kirim Formulir <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-4" id="filters-ppdb">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari berdasarkan nomor pendaftaran atau nama calon siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filter Status */}
        <div className="w-full sm:w-52">
          <select
            value={selectedFilterStatus}
            onChange={(e) => setSelectedFilterStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="">Semua Status Seleksi</option>
            <option value="Pending">Pending (Verifikasi)</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Applicants Table List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden" id="ppdb-table-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm" id="table-ppdb">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">No. Pendaftaran</th>
                <th className="py-4 px-6">Calon Siswa</th>
                <th className="py-4 px-6">Pilihan Program</th>
                <th className="py-4 px-6">Tanggal Pengajuan</th>
                <th className="py-4 px-6">Status Seleksi</th>
                <th className="py-4 px-6 text-right">Aksi Administrator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPPDB.map((ppdb) => (
                <tr key={ppdb.id} className="hover:bg-slate-50 transition duration-150">
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs font-extrabold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                      {ppdb.noDaftar}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900">{ppdb.nama}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{ppdb.email} • {ppdb.telepon}</div>
                    <div className="text-[11px] text-slate-500 italic mt-1 line-clamp-1 max-w-sm">Alamat: {ppdb.alamat}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1 rounded-md">
                      {ppdb.jenjang}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs text-slate-500">{ppdb.tanggalDaftar}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      ppdb.status === "Pending" ? "bg-yellow-50 text-yellow-700" :
                      ppdb.status === "Diterima" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      {ppdb.status === "Pending" && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>}
                      {ppdb.status === "Diterima" && <CheckCircle size={12} className="text-green-600" />}
                      {ppdb.status === "Ditolak" && <XCircle size={12} className="text-red-600" />}
                      {ppdb.status === "Pending" ? "Verifikasi Berkas" : ppdb.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ppdb.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(ppdb.id, ppdb.nama)}
                            className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-lg transition flex items-center gap-1 text-[11px] font-bold px-2.5"
                            title="Terima Siswa"
                          >
                            <UserCheck size={14} /> Terima
                          </button>
                          <button
                            onClick={() => handleReject(ppdb.id, ppdb.nama)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg transition flex items-center gap-1 text-[11px] font-bold px-2.5"
                            title="Tolak Berkas"
                          >
                            <UserX size={14} /> Tolak
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(ppdb.id)}
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition"
                        title="Hapus Arsip"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPPDB.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertCircle size={36} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Tidak ada berkas calon siswa ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
