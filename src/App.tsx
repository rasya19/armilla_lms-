import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardList, Award, 
  Menu, X, RefreshCw, AlertCircle, Sparkles, LogOut, CheckCircle2
} from "lucide-react";

import { Siswa, Guru, Mapel, Kelas, PPDB, Nilai, DashboardStats } from "./types";
import Dashboard from "./components/Dashboard";
import MasterSiswa from "./components/MasterSiswa";
import MasterGuru from "./components/MasterGuru";
import MasterMapelKelas from "./components/MasterMapelKelas";
import DataPPDB from "./components/DataPPDB";
import RekapNilai from "./components/RekapNilai";

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Collections State
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [guru, setGuru] = useState<Guru[]>([]);
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [ppdb, setPpdb] = useState<PPDB[]>([]);
  const [nilai, setNilai] = useState<Nilai[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Sync / Loader status
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Concurrent Fetch Data
  const refreshAllData = async () => {
    setIsLoading(true);
    setGlobalError("");
    try {
      const [
        resStats, resSiswa, resGuru, resMapel, resKelas, resPpdb, resNilai
      ] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/siswa"),
        fetch("/api/guru"),
        fetch("/api/mapel"),
        fetch("/api/kelas"),
        fetch("/api/ppdb"),
        fetch("/api/nilai")
      ]);

      if (!resStats.ok || !resSiswa.ok || !resGuru.ok || !resMapel.ok || !resKelas.ok || !resPpdb.ok || !resNilai.ok) {
        throw new Error("Gagal mengambil data sinkronisasi dari server.");
      }

      const [dataStats, dataSiswa, dataGuru, dataMapel, dataKelas, dataPpdb, dataNilai] = await Promise.all([
        resStats.json(),
        resSiswa.json(),
        resGuru.json(),
        resMapel.json(),
        resKelas.json(),
        resPpdb.json(),
        resNilai.json()
      ]);

      setStats(dataStats);
      setSiswa(dataSiswa);
      setGuru(dataGuru);
      setMapel(dataMapel);
      setKelas(dataKelas);
      setPpdb(dataPpdb);
      setNilai(dataNilai);
    } catch (err: any) {
      setGlobalError(err.message || "Gagal menghubungi API Express.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Show dynamic toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  // Mutator Helpers
  const handleMutate = async (url: string, method: "POST" | "PUT" | "DELETE", body?: any) => {
    setIsMutating(true);
    setGlobalError("");
    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" }
      };
      if (body) {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(url, options);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error ${res.status}`);
      }

      const responseData = await res.json();
      
      // Instantly refresh states to trigger reactive dashboard metrics
      await refreshAllData();
      return responseData;
    } catch (err: any) {
      setGlobalError(err.message || "Gagal melakukan aksi mutasi data.");
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  // Siswa Actions
  const handleAddSiswa = async (data: Omit<Siswa, "id">) => {
    await handleMutate("/api/siswa", "POST", data);
    triggerToast(`Siswa "${data.nama}" berhasil didaftarkan.`);
  };

  const handleUpdateSiswa = async (id: string, data: Partial<Siswa>) => {
    await handleMutate(`/api/siswa/${id}`, "PUT", data);
    triggerToast("Informasi siswa berhasil diperbarui.");
  };

  const handleDeleteSiswa = async (id: string) => {
    await handleMutate(`/api/siswa/${id}`, "DELETE");
    triggerToast("Data siswa berhasil dihapus.");
  };

  // Guru Actions
  const handleAddGuru = async (data: Omit<Guru, "id">) => {
    await handleMutate("/api/guru", "POST", data);
    triggerToast(`Tenaga pengajar "${data.nama}" berhasil ditambahkan.`);
  };

  const handleUpdateGuru = async (id: string, data: Partial<Guru>) => {
    await handleMutate(`/api/guru/${id}`, "PUT", data);
    triggerToast("Data tenaga pengajar berhasil diperbarui.");
  };

  const handleDeleteGuru = async (id: string) => {
    await handleMutate(`/api/guru/${id}`, "DELETE");
    triggerToast("Data tenaga pengajar berhasil dihapus.");
  };

  // Mapel Actions
  const handleAddMapel = async (data: Omit<Mapel, "id">) => {
    await handleMutate("/api/mapel", "POST", data);
    triggerToast(`Mata pelajaran "${data.nama}" berhasil ditambahkan.`);
  };

  const handleUpdateMapel = async (id: string, data: Partial<Mapel>) => {
    await handleMutate(`/api/mapel/${id}`, "PUT", data);
    triggerToast("Data mata pelajaran berhasil diperbarui.");
  };

  const handleDeleteMapel = async (id: string) => {
    await handleMutate(`/api/mapel/${id}`, "DELETE");
    triggerToast("Mata pelajaran berhasil dihapus dari kurikulum.");
  };

  // Kelas Actions
  const handleAddKelas = async (data: Omit<Kelas, "id">) => {
    await handleMutate("/api/kelas", "POST", data);
    triggerToast(`Rombongan belajar "${data.nama}" berhasil dibuat.`);
  };

  const handleUpdateKelas = async (id: string, data: Partial<Kelas>) => {
    await handleMutate(`/api/kelas/${id}`, "PUT", data);
    triggerToast("Informasi rombongan belajar diperbarui.");
  };

  const handleDeleteKelas = async (id: string) => {
    await handleMutate(`/api/kelas/${id}`, "DELETE");
    triggerToast("Kelas berhasil dihapus.");
  };

  // PPDB Actions
  const handleAddPPDB = async (data: Omit<PPDB, "id" | "noDaftar" | "status" | "tanggalDaftar">) => {
    await handleMutate("/api/ppdb", "POST", data);
  };

  const handleUpdatePPDBStatus = async (id: string, status: "Diterima" | "Ditolak") => {
    const candidate = ppdb.find(p => p.id === id);
    await handleMutate(`/api/ppdb/${id}`, "PUT", { status });
    triggerToast(`Pendaftar "${candidate?.nama}" dinyatakan ${status.toUpperCase()}.`);
  };

  const handleDeletePPDB = async (id: string) => {
    await handleMutate(`/api/ppdb/${id}`, "DELETE");
    triggerToast("Arsip pendaftaran PPDB dihapus.");
  };

  // Nilai Actions
  const handleAddNilai = async (data: Omit<Nilai, "id" | "nilaiAkhir">) => {
    await handleMutate("/api/nilai", "POST", data);
    triggerToast("Nilai simulasi berhasil dimasukkan.");
  };

  const handleUpdateNilai = async (id: string, data: Partial<Nilai>) => {
    await handleMutate(`/api/nilai/${id}`, "PUT", data);
    triggerToast("Nilai simulasi berhasil diperbarui.");
  };

  const handleDeleteNilai = async (id: string) => {
    await handleMutate(`/api/nilai/${id}`, "DELETE");
    triggerToast("Data rekap nilai dihapus.");
  };

  const handleBulkImportNilai = async (data: Array<{
    nisn: string;
    kodeMapel: string;
    nilaiMandiri: number;
    nilaiSimulasi: number;
    tanggalSimulasi: string;
  }>) => {
    const res = await handleMutate("/api/nilai/import", "POST", { data });
    return res; // contains successCount and errors
  };

  // Navigation Config
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "siswa", label: "Master Siswa", icon: Users },
    { id: "guru", label: "Master Guru", icon: GraduationCap },
    { id: "mapelkelas", label: "Kurikulum & Kelas", icon: BookOpen },
    { id: "ppdb", label: "PPDB Online", icon: ClipboardList },
    { id: "nilai", label: "Nilai Simulasi UNBK", icon: Award },
  ];

  const handleNavigate = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="pkbm-armilla-app">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 relative">
        
        {/* SIDEBAR NAVIGATION - DESKTOP */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 p-5 justify-between">
          <div className="space-y-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800">
              <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-extrabold text-lg shadow-sm">
                A
              </div>
              <div>
                <h1 className="text-sm font-black text-white leading-tight tracking-wider uppercase">PKBM Armilla</h1>
                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Portal Manajemen</p>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition duration-200 ${
                      isActive 
                        ? "bg-emerald-600 text-white" 
                        : "hover:bg-slate-800/80 hover:text-white text-slate-400"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Brand Info */}
          <div className="border-t border-slate-800/80 pt-4 space-y-2">
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-[10px] font-semibold text-slate-400">Senior Architect Panel</span>
            </div>
            <div className="text-[9px] text-slate-500 text-center">
              © 2026 PKBM Armilla v2.0
            </div>
          </div>
        </aside>

        {/* MOBILE SLIDE-OVER DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}></div>
            
            {/* Drawer */}
            <div className="relative w-64 bg-slate-900 text-slate-300 p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-extrabold text-sm">
                      A
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">PKBM Armilla</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
                    <X size={18} />
                  </button>
                </div>

                {/* Nav items */}
                <nav className="space-y-1.5">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                          isActive 
                            ? "bg-emerald-600 text-white" 
                            : "hover:bg-slate-800 hover:text-white text-slate-400"
                        }`}
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="text-[9px] text-slate-500 text-center">
                © 2026 PKBM Armilla
              </div>
            </div>
          </div>
        )}

        {/* BODY CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* TOP BAR / NAVIGATION HEADER */}
          <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs" id="app-header">
            <div className="flex items-center gap-3">
              {/* Menu Button for Mobile */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200"
              >
                <Menu size={20} />
              </button>

              <div className="hidden sm:block">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Pendidikan Kesetaraan</span>
                <h2 className="text-xs font-bold text-slate-700">Bandung, Jawa Barat</h2>
              </div>
            </div>

            {/* Sync actions status */}
            <div className="flex items-center gap-3">
              {isMutating && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-md animate-pulse">
                  Sinkronisasi database...
                </span>
              )}
              
              <button
                onClick={refreshAllData}
                disabled={isLoading}
                className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
                title="Penyelarasan Data"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                <span className="hidden md:inline">Sync Data</span>
              </button>

              <div className="w-px h-6 bg-slate-200"></div>

              {/* User Identity Profile */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-mono font-bold text-xs">
                  SA
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">Ismanto (Admin)</div>
                  <div className="text-[9px] text-slate-400 font-semibold">Senior Developer</div>
                </div>
              </div>
            </div>
          </header>

          {/* MAIN PAGE VIEW CONTENT */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto" id="main-content">
            {globalError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0 text-red-500" />
                <div className="space-y-0.5">
                  <div className="font-bold">Sambungan Server Terganggu</div>
                  <div>{globalError}</div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4" id="app-loading">
                <RefreshCw size={40} className="text-emerald-600 animate-spin" />
                <div className="text-slate-500 text-sm font-semibold">Sinkronisasi Database PKBM Armilla...</div>
              </div>
            )}

            {!isLoading && (
              <div className="animate-in fade-in duration-200">
                {currentView === "dashboard" && stats && (
                  <Dashboard 
                    stats={stats} 
                    siswa={siswa}
                    guru={guru}
                    nilai={nilai}
                    mapel={mapel}
                    onNavigate={handleNavigate} 
                  />
                )}
                {currentView === "siswa" && (
                  <MasterSiswa 
                    siswaList={siswa}
                    kelasList={kelas}
                    onAdd={handleAddSiswa}
                    onUpdate={handleUpdateSiswa}
                    onDelete={handleDeleteSiswa}
                  />
                )}
                {currentView === "guru" && (
                  <MasterGuru 
                    guruList={guru}
                    mapelList={mapel}
                    onAdd={handleAddGuru}
                    onUpdate={handleUpdateGuru}
                    onDelete={handleDeleteGuru}
                  />
                )}
                {currentView === "mapelkelas" && (
                  <MasterMapelKelas 
                    mapelList={mapel}
                    kelasList={kelas}
                    guruList={guru}
                    onAddMapel={handleAddMapel}
                    onUpdateMapel={handleUpdateMapel}
                    onDeleteMapel={handleDeleteMapel}
                    onAddKelas={handleAddKelas}
                    onUpdateKelas={handleUpdateKelas}
                    onDeleteKelas={handleDeleteKelas}
                  />
                )}
                {currentView === "ppdb" && (
                  <DataPPDB 
                    ppdbList={ppdb}
                    onAdd={handleAddPPDB}
                    onUpdateStatus={handleUpdatePPDBStatus}
                    onDelete={handleDeletePPDB}
                  />
                )}
                {currentView === "nilai" && (
                  <RekapNilai 
                    nilaiList={nilai}
                    siswaList={siswa}
                    mapelList={mapel}
                    onAdd={handleAddNilai}
                    onUpdate={handleUpdateNilai}
                    onDelete={handleDeleteNilai}
                    onBulkImport={handleBulkImportNilai}
                  />
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
