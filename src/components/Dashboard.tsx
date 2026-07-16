import React from "react";
import { Users, GraduationCap, Award, FileText, Clock, ArrowUpRight, TrendingUp, AlertCircle, BookOpen } from "lucide-react";
import { DashboardStats, Siswa, Guru, Nilai, Mapel } from "../types";

interface DashboardProps {
  stats: DashboardStats;
  siswa: Siswa[];
  guru: Guru[];
  nilai: Nilai[];
  mapel: Mapel[];
  onNavigate: (view: string) => void;
}

export default function Dashboard({ stats, siswa, guru, nilai, mapel, onNavigate }: DashboardProps) {
  // Calculate average per subject
  const subjectAverages = mapel.map(m => {
    const scores = nilai.filter(n => n.mapelId === m.id);
    const avg = scores.length > 0 
      ? Number((scores.reduce((sum, current) => sum + current.nilaiSimulasi, 0) / scores.length).toFixed(1))
      : 0;
    return {
      nama: m.nama,
      kode: m.kode,
      avg,
      count: scores.length
    };
  });

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden" id="welcome-banner">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="relative z-10 space-y-2">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Arsitektur Senior & Production-Ready
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Selamat Datang di Portal PKBM Armilla</h1>
          <p className="text-emerald-50/90 text-sm max-w-xl leading-relaxed">
            Sistem Informasi Manajemen Institusi Pendidikan yang andal, aman, dan modular. Kelola data akademis, 
            guru, pendaftaran PPDB, serta rekapitulasi nilai simulasi UNBK secara tersentralisasi.
          </p>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        {/* KPI: Siswa */}
        <div 
          onClick={() => onNavigate("siswa")}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-200 cursor-pointer group"
          id="kpi-siswa"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Total Siswa Aktif</span>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition duration-200">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{stats.totalSiswa}</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-medium">Terverifikasi</span> di database lokal
            </p>
          </div>
        </div>

        {/* KPI: Guru */}
        <div 
          onClick={() => onNavigate("guru")}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-200 cursor-pointer group"
          id="kpi-guru"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Tenga Pengajar (Guru)</span>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition duration-200">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{stats.totalGuru}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Menangani {stats.totalKelas} Program Kelas Paket
            </p>
          </div>
        </div>

        {/* KPI: Rata-Rata UNBK */}
        <div 
          onClick={() => onNavigate("nilai")}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-200 cursor-pointer group"
          id="kpi-unbk"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Rata-Rata Nilai UNBK</span>
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition duration-200">
              <Award size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{stats.averageNilaiAkhir} <span className="text-xs text-slate-400 font-sans font-normal">/100</span></h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp size={12} className="text-amber-500" />
              <span>Tertinggi: </span>
              <span className="font-mono font-semibold text-slate-700">{stats.unbkHigh}</span>
            </p>
          </div>
        </div>

        {/* KPI: PPDB */}
        <div 
          onClick={() => onNavigate("ppdb")}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-200 cursor-pointer group"
          id="kpi-ppdb"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Pendaftar PPDB</span>
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition duration-200">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 font-mono">{stats.totalPPDB}</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded font-semibold text-[10px]">{stats.ppdbStatus.pending} Pending</span>
              <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded font-semibold text-[10px]">{stats.ppdbStatus.diterima} Diterima</span>
            </p>
          </div>
        </div>
      </div>

      {/* Charts & Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-statistics">
        {/* Performance Chart per Subject */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2 space-y-4" id="performance-chart-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Statistik Nilai Rata-rata Mapel</h2>
              <p className="text-xs text-slate-500">Nilai rata-rata simulasi ujian UNBK siswa terdaftar</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">
              Simulasi UNBK 2026
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {subjectAverages.map((m, index) => {
              const kkm = mapel.find(item => item.nama === m.nama)?.kkm || 70;
              const isAboveKKM = m.avg >= kkm;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      {m.nama} ({m.kode})
                    </span>
                    <span className="text-slate-500 text-xs flex items-center gap-2">
                      Rata-rata: <strong className="text-slate-800 font-mono text-sm">{m.avg || "0.0"}</strong>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">KKM: {kkm}</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isAboveKKM ? 'bg-emerald-500' : 'bg-red-400'}`}
                      style={{ width: `${Math.min(100, Math.max(5, m.avg))}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {subjectAverages.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <BookOpen size={36} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Belum ada data mata pelajaran atau nilai.</p>
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 text-xs text-slate-600 border border-slate-100">
            <AlertCircle size={16} className="text-emerald-600 shrink-0" />
            <p>
              Garis hijau menunjukkan nilai rata-rata kelas di atas atau sama dengan KKM. Warna merah mengindikasikan 
              bahwa rata-rata siswa di mata pelajaran tersebut masih berada di bawah target kelulusan (KKM).
            </p>
          </div>
        </div>

        {/* PPDB Funnel & Action Container */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between" id="ppdb-summary-card">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Aliran Pendaftar PPDB</h2>
              <p className="text-xs text-slate-500">Status calon peserta didik tahun ajaran baru</p>
            </div>

            {/* Circle Pipeline Visualizer */}
            <div className="py-2 flex items-center justify-center">
              <div className="relative flex items-center justify-center w-36 h-36">
                {/* Simulated donut chart using simple border trick */}
                <div className="absolute inset-0 rounded-full border-8 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent border-r-transparent" style={{ transform: 'rotate(45deg)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-yellow-500 border-b-transparent border-l-transparent" style={{ transform: 'rotate(180deg)' }}></div>
                <div className="z-10 text-center">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">
                    {stats.totalPPDB}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">Total Calon</p>
                </div>
              </div>
            </div>

            {/* Pipeline list */}
            <div className="space-y-2 text-sm pt-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  Pemeriksaan Berkas (Pending)
                </span>
                <span className="font-bold text-slate-800 font-mono">{stats.ppdbStatus.pending}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  Dinyatakan Diterima
                </span>
                <span className="font-bold text-slate-800 font-mono">{stats.ppdbStatus.diterima}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  Berkas Ditolak
                </span>
                <span className="font-bold text-slate-800 font-mono">{stats.ppdbStatus.ditolak}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("ppdb")}
            className="w-full mt-4 bg-slate-950 hover:bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            Selesaikan Seleksi PPDB <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Activities & System Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-system">
        {/* Recent Platform Activities */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2 space-y-4" id="recent-activities-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              Aktivitas Sistem Terkini
            </h2>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-mono">Live Logs</span>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentActivities.map((act, i) => (
              <div key={i} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm text-slate-700">{act.message}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Senior DevOps Specs */}
        <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between" id="devops-specs-card">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-emerald-400">Arsitektur DevOps</h2>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] border border-emerald-500/20 font-semibold uppercase tracking-wider">
                Production-Ready
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Platform PKBM Armilla dirancang menggunakan prinsip **Separation of Concerns** (SoC):
              </p>
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Frontend Port</span>
                  <span className="text-white">3000 (React/Vite App)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Backend Port</span>
                  <span className="text-white">3000 (/api/* endpoints)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Format Data</span>
                  <span className="text-white">RESTful JSON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Persistence</span>
                  <span className="text-teal-400">data/db.json file-store</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>CORS Handled Automatically</span>
            <span className="text-emerald-400 font-bold">● Running OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
