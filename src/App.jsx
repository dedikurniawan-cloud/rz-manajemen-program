import { useState, useEffect, useRef } from "react";
import { sheetsStorage } from "./lib/sheetsStorage";

const STAGES = ["Perencanaan", "Persiapan", "Eksekusi", "Laporan"];
const VOL_STATUS = ["Aktif", "Tidak Aktif", "Baru"];
const KATEGORI = ["Pendidikan", "Kesehatan", "Ekonomi", "Kemanusiaan & Bencana", "Dakwah", "Infrastruktur & Lingkungan"];
const STORAGE_KEY = "rz-pm-data-v3";
const MANAGER_CODE = "RZPalembang";

const uid = () => Math.random().toString(36).slice(2, 9);
const numOf = (v) => parseInt(String(v || "0").replace(/[^0-9]/g, ""), 10) || 0;

const emptyStageData = () => ({
  0: {
    kategori: "",
    lokasiDetail: "",
    latarBelakang: "",
    tujuanProgram: "",
    targetPM: "",
    targetOutput: "",
    dampakDiharapkan: "",
    indikatorKeberhasilan: "",
    estimasiAnggaran: "",
    sumberDana: "",
    risikoMitigasi: "",
  },
  1: { danaTerkumpul: "", timPelaksana: "", mitraKerja: "", perizinan: "", logistik: "", jadwalDetail: "" },
  2: { tanggalPelaksanaan: "", realisasiPM: "", realisasiOutput: "", danaTerpakai: "", dokumentasi: "", kendala: "", solusiKendala: "" },
  3: { dampakTercapai: "", testimoni: "", rekomendasi: "", catatanAkhir: "" },
});

const seedData = () => ({
  projects: [
    {
      id: uid(),
      name: "Pipanisasi PDAM Ujung Tanjung",
      pic: "Dedi",
      location: "Ds. Ujung Tanjung, Banyuasin III",
      startDate: "2026-07-01",
      targetDate: "2026-08-30",
      stage: 1,
      approval: { status: "belum", note: "" },
      tasks: [
        { id: uid(), title: "Survey lokasi & kebutuhan pipa", done: true, assignee: "" },
        { id: uid(), title: "Susun proposal & RAB", done: true, assignee: "" },
        { id: uid(), title: "Galang dana ke donor", done: false, assignee: "" },
      ],
      stageData: {
        0: {
          kategori: "Infrastruktur & Lingkungan",
          lokasiDetail: "Kompleks Pondok Pesantren, Dusun II Ujung Tanjung",
          latarBelakang: "Pondok pesantren belum memiliki akses PDAM, santri mengandalkan sumur yang mulai tercemar.",
          tujuanProgram: "Menyediakan akses air bersih layak konsumsi bagi seluruh santri dan pengurus pesantren.",
          targetPM: "150 santri",
          targetOutput: "1 unit jaringan pipanisasi + sambungan PDAM",
          dampakDiharapkan: "Akses air bersih layak untuk MCK, wudhu, dan kebutuhan harian pesantren.",
          indikatorKeberhasilan: "Air mengalir lancar ke seluruh titik MCK & tidak ada lagi keluhan air keruh.",
          estimasiAnggaran: "45000000",
          sumberDana: "Donatur Individu & Program Air Bersih RZ",
          risikoMitigasi: "Keterlambatan galian akibat cuaca — dimitigasi dengan penjadwalan bertahap per blok.",
        },
        1: {
          danaTerkumpul: "20000000",
          timPelaksana: "Tim Teknik RZ + kontraktor lokal",
          mitraKerja: "Pengurus pesantren, PDAM Tirta Musi",
          perizinan: "Izin sambungan dari PDAM & persetujuan pengurus pesantren sudah diperoleh.",
          logistik: "Pipa PVC 3 inci, pompa dorong, material sambungan",
          jadwalDetail: "Pemasangan bertahap selama 3 minggu",
        },
        2: { tanggalPelaksanaan: "", realisasiPM: "", realisasiOutput: "", danaTerpakai: "", dokumentasi: "", kendala: "", solusiKendala: "" },
        3: { dampakTercapai: "", testimoni: "", rekomendasi: "", catatanAkhir: "" },
      },
    },
    {
      id: uid(),
      name: "Generasi Tani Berdaya",
      pic: "Dedi",
      location: "Ds. Talang Buluh",
      startDate: "2026-06-10",
      targetDate: "2026-07-20",
      stage: 2,
      approval: { status: "disetujui", note: "Disetujui, anggaran sesuai." },
      tasks: [
        { id: uid(), title: "Rekrut peserta (7 pemuda)", done: true, assignee: "" },
        { id: uid(), title: "Pelatihan dasar pertanian", done: true, assignee: "" },
        { id: uid(), title: "Pendampingan lahan", done: false, assignee: "" },
      ],
      stageData: {
        0: {
          kategori: "Ekonomi",
          lokasiDetail: "Lahan percontohan RQ Eco-Farming Center, Talang Buluh",
          latarBelakang: "Tingkat pengangguran pemuda desa tinggi, potensi lahan pertanian belum dimanfaatkan optimal.",
          tujuanProgram: "Membekali pemuda desa dengan keterampilan pertanian modern yang bisa dijadikan sumber penghasilan.",
          targetPM: "7 pemuda",
          targetOutput: "1 kelompok tani binaan + 1 lahan percontohan aktif",
          dampakDiharapkan: "Pemuda desa memiliki keterampilan bertani modern dan penghasilan mandiri.",
          indikatorKeberhasilan: "Minimal 5 dari 7 peserta menghasilkan panen pertama dan berpenghasilan tambahan.",
          estimasiAnggaran: "15000000",
          sumberDana: "Program Ekonomi Berdaya RZ",
          risikoMitigasi: "Risiko gagal panen akibat cuaca — dimitigasi dengan pelatihan irigasi sederhana.",
        },
        1: {
          danaTerkumpul: "15000000",
          timPelaksana: "Penyuluh pertanian + staf RZ",
          mitraKerja: "Dinas Pertanian setempat, Kepala Desa Talang Buluh",
          perizinan: "Izin pemakaian lahan desa telah disetujui Kepala Desa.",
          logistik: "Bibit, pupuk, alat tani dasar",
          jadwalDetail: "Pelatihan 2 minggu, pendampingan lanjutan 2 bulan",
        },
        2: {
          tanggalPelaksanaan: "2026-06-25",
          realisasiPM: "7",
          realisasiOutput: "1 kelompok tani terbentuk, lahan 2000 m² siap tanam",
          danaTerpakai: "14200000",
          dokumentasi: "Album foto pelatihan tersimpan di Drive RZ Palembang",
          kendala: "Cuaca kemarau sempat menghambat jadwal tanam awal",
          solusiKendala: "Jadwal tanam digeser 1 minggu & ditambah penyiraman manual.",
        },
        3: { dampakTercapai: "", testimoni: "", rekomendasi: "", catatanAkhir: "" },
      },
    },
  ],
  volunteers: [
    { id: uid(), name: "Rina Marlina", phone: "0812xxxxxx1", domicile: "Palembang", skills: "Dokumentasi, Fotografi", status: "Aktif" },
    { id: uid(), name: "Agus Salim", phone: "0813xxxxxx2", domicile: "Banyuasin", skills: "Mengajar, Pertanian", status: "Aktif" },
    { id: uid(), name: "Putri Wulandari", phone: "0857xxxxxx3", domicile: "Palembang", skills: "Admin, Kendaraan", status: "Tidak Aktif" },
  ],
  activityLog: [],
});

function useStore() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [saveError, setSaveError] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await sheetsStorage.get(STORAGE_KEY);
        setData(JSON.parse(res.value));
      } catch {
        const seed = seedData();
        setData(seed);
        try {
          await sheetsStorage.set(STORAGE_KEY, JSON.stringify(seed));
        } catch {}
      }
      setStatus("ready");
    })();
  }, []);

  useEffect(() => {
    if (status !== "ready" || !data) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await sheetsStorage.set(STORAGE_KEY, JSON.stringify(data));
        setSaveError(false);
      } catch {
        setSaveError(true);
      }
    }, 300);
  }, [data, status]);

  return [data, setData, status, saveError];
}

const fmtDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtDateTime = (iso) => {
  if (!iso) return "-";
  const dt = new Date(iso);
  return dt.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const isOverdue = (p) => {
  if (p.stage >= 3) return false;
  const t = new Date(p.targetDate + "T00:00:00");
  return t < new Date();
};

const taskProgress = (tasks) => {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
};

const getPM = (p) => numOf(p.stageData?.[2]?.realisasiPM) || numOf(p.stageData?.[0]?.targetPM);
const getBudget = (p) => numOf(p.stageData?.[2]?.danaTerpakai) || numOf(p.stageData?.[1]?.danaTerkumpul) || numOf(p.stageData?.[0]?.estimasiAnggaran);

function Stepper({ stage }) {
  return (
    <div className="stepper">
      {STAGES.map((s, i) => (
        <div className="stepper-node" key={s}>
          <div className={`node-dot ${i < stage ? "done" : i === stage ? "current" : ""}`}>
            {i < stage ? "✓" : i + 1}
          </div>
          <div className={`node-label ${i === stage ? "current" : ""}`}>{s}</div>
          {i < STAGES.length - 1 && <div className={`node-line ${i < stage ? "filled" : ""}`} />}
        </div>
      ))}
    </div>
  );
}

function Badge({ children, tone = "default" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function ManagerCodeModal({ error, onClose, onSubmit }) {
  const [code, setCode] = useState("");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Masuk sebagai Manajer</h2>
        <div className="muted" style={{ marginBottom: 14 }}>
          Masukkan kode akses Manajer. Kode hanya perlu dimasukkan sekali per sesi.
        </div>
        <label className="field">
          <span>Kode Akses</span>
          <input
            type="password"
            value={code}
            autoFocus
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit(code)}
            placeholder="Masukkan kode…"
          />
        </label>
        {error && <div className="code-error">Kode salah. Silakan coba lagi.</div>}
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" onClick={() => onSubmit(code)}>Masuk</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [data, setData, status, saveError] = useStore();
  const [tab, setTab] = useState("dashboard");
  const [role, setRole] = useState("Staf");
  const [managerUnlocked, setManagerUnlocked] = useState(false);
  const [showManagerCode, setShowManagerCode] = useState(false);
  const [managerCodeError, setManagerCodeError] = useState(false);

  const requestRoleSwitch = (r) => {
    if (r === "Staf") {
      setRole("Staf");
      return;
    }
    if (managerUnlocked) {
      setRole("Manajer");
      return;
    }
    setManagerCodeError(false);
    setShowManagerCode(true);
  };

  const confirmManagerCode = (code) => {
    if (code === MANAGER_CODE) {
      setManagerUnlocked(true);
      setRole("Manajer");
      setShowManagerCode(false);
      setManagerCodeError(false);
    } else {
      setManagerCodeError(true);
    }
  };
  const [openProject, setOpenProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewVolunteer, setShowNewVolunteer] = useState(false);
  const [period, setPeriod] = useState("all");

  if (status !== "ready" || !data) {
    return (
      <div className="app-shell loading-shell">
        <Style />
        <div className="loading-text">Memuat data…</div>
      </div>
    );
  }

  const updateProject = (id, patch) => {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  };

  const updateStageField = (id, stageIdx, key, value) => {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) =>
        p.id === id
          ? { ...p, stageData: { ...p.stageData, [stageIdx]: { ...p.stageData[stageIdx], [key]: value } } }
          : p
      ),
    }));
  };

  const pushLog = (log, entry) =>
    [{ id: uid(), timestamp: new Date().toISOString(), ...entry }, ...(log || [])].slice(0, 200);

  const addProject = (proj) => {
    setData((d) => ({
      ...d,
      projects: [...d.projects, proj],
      activityLog: pushLog(d.activityLog, { role, action: "Menambahkan", entityType: "Program", entityName: proj.name }),
    }));
  };

  const editProjectInfo = (id, patch) => {
    setData((d) => {
      const target = d.projects.find((p) => p.id === id);
      return {
        ...d,
        projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        activityLog: pushLog(d.activityLog, {
          role,
          action: "Mengedit info",
          entityType: "Program",
          entityName: patch.name || target?.name || "",
        }),
      };
    });
  };

  const deleteProject = (id) => {
    setData((d) => {
      const target = d.projects.find((p) => p.id === id);
      return {
        ...d,
        projects: d.projects.filter((p) => p.id !== id),
        activityLog: pushLog(d.activityLog, { role, action: "Menghapus", entityType: "Program", entityName: target?.name || "" }),
      };
    });
  };

  const addVolunteer = (vol) => {
    setData((d) => ({
      ...d,
      volunteers: [...d.volunteers, vol],
      activityLog: pushLog(d.activityLog, { role, action: "Menambahkan", entityType: "Relawan", entityName: vol.name }),
    }));
  };

  const editVolunteer = (id, patch) => {
    setData((d) => {
      const target = d.volunteers.find((v) => v.id === id);
      return {
        ...d,
        volunteers: d.volunteers.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        activityLog: pushLog(d.activityLog, {
          role,
          action: "Mengedit",
          entityType: "Relawan",
          entityName: patch.name || target?.name || "",
        }),
      };
    });
  };

  const deleteVolunteer = (id) => {
    setData((d) => {
      const target = d.volunteers.find((v) => v.id === id);
      return {
        ...d,
        volunteers: d.volunteers.filter((v) => v.id !== id),
        activityLog: pushLog(d.activityLog, { role, action: "Menghapus", entityType: "Relawan", entityName: target?.name || "" }),
      };
    });
  };

  const filteredProjects = data.projects.filter((p) => {
    if (period === "all") return true;
    const start = new Date(p.startDate + "T00:00:00");
    const now = new Date();
    if (period === "month") return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear();
    if (period === "quarter") {
      const q = (d) => Math.floor(d.getMonth() / 3);
      return q(start) === q(now) && start.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const pendingApprovals = data.projects.filter((p) => p.approval.status === "menunggu");
  const overdue = data.projects.filter(isOverdue);
  const totalBeneficiaries = filteredProjects.reduce((s, p) => s + getPM(p), 0);
  const totalBudget = filteredProjects.reduce((s, p) => s + getBudget(p), 0);
  const activeVolunteers = data.volunteers.filter((v) => v.status === "Aktif").length;

  return (
    <div className="app-shell">
      <Style />
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">RZ</div>
          <div>
            <div className="brand-title">Manajemen Program</div>
            <div className="brand-sub">RZ Sumatera Selatan</div>
          </div>
        </div>
        <nav className="nav">
          {[
            ["dashboard", "Dashboard"],
            ["program", "Program"],
            ["relawan", "Relawan"],
          ].map(([key, label]) => (
            <button key={key} className={`nav-item ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </nav>
        {saveError && (
          <div className="sync-warning">Gagal menyimpan ke Google Sheets. Periksa koneksi.</div>
        )}
        <div className="role-switch">
          <div className="role-label">Peran (demo)</div>
          <div className="role-toggle">
            {["Staf", "Manajer"].map((r) => (
              <button key={r} className={`role-btn ${role === r ? "active" : ""}`} onClick={() => requestRoleSwitch(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main">
        {tab === "dashboard" && (
          <Dashboard
            pendingApprovals={pendingApprovals}
            overdue={overdue}
            totalBeneficiaries={totalBeneficiaries}
            totalBudget={totalBudget}
            activeVolunteers={activeVolunteers}
            projectsCount={filteredProjects.length}
            period={period}
            setPeriod={setPeriod}
            activityLog={data.activityLog}
            openProject={(p) => {
              setTab("program");
              setOpenProject(p.id);
            }}
          />
        )}

        {tab === "program" && (
          <ProgramTab
            projects={data.projects}
            volunteers={data.volunteers}
            role={role}
            updateProject={updateProject}
            editProjectInfo={editProjectInfo}
            updateStageField={updateStageField}
            openProject={openProject}
            setOpenProject={setOpenProject}
            showNewProject={showNewProject}
            setShowNewProject={setShowNewProject}
            addProject={addProject}
            deleteProject={deleteProject}
          />
        )}

        {tab === "relawan" && (
          <VolunteerTab
            volunteers={data.volunteers}
            projects={data.projects}
            role={role}
            showNewVolunteer={showNewVolunteer}
            setShowNewVolunteer={setShowNewVolunteer}
            addVolunteer={addVolunteer}
            editVolunteer={editVolunteer}
            deleteVolunteer={deleteVolunteer}
          />
        )}
      </main>

      {showManagerCode && (
        <ManagerCodeModal
          error={managerCodeError}
          onClose={() => { setShowManagerCode(false); setManagerCodeError(false); }}
          onSubmit={confirmManagerCode}
        />
      )}
    </div>
  );
}

function Dashboard({ pendingApprovals, overdue, totalBeneficiaries, totalBudget, activeVolunteers, projectsCount, period, setPeriod, activityLog, openProject }) {
  const recentActivity = (activityLog || []).slice(0, 8);
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Ringkasan</div>
          <h1>Dashboard</h1>
        </div>
        <select className="select" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="all">Semua Waktu</option>
          <option value="month">Bulan Ini</option>
          <option value="quarter">Kuartal Ini</option>
        </select>
      </div>

      <div className="section-label">Perlu Tindakan</div>
      <div className="action-grid">
        <div className="action-card">
          <div className="action-count">{pendingApprovals.length}</div>
          <div className="action-title">Menunggu Approval</div>
          <div className="action-list">
            {pendingApprovals.length === 0 && <div className="muted">Tidak ada yang menunggu.</div>}
            {pendingApprovals.map((p) => (
              <button key={p.id} className="action-row" onClick={() => openProject(p)}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div className="action-card">
          <div className="action-count danger">{overdue.length}</div>
          <div className="action-title">Program Terlambat</div>
          <div className="action-list">
            {overdue.length === 0 && <div className="muted">Tidak ada yang terlambat.</div>}
            {overdue.map((p) => (
              <button key={p.id} className="action-row" onClick={() => openProject(p)}>
                {p.name} <span className="muted-inline">target {fmtDate(p.targetDate)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-label">Agregat Periode</div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{projectsCount}</div>
          <div className="stat-label">Program</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalBeneficiaries}</div>
          <div className="stat-label">Penerima Manfaat</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Rp {totalBudget.toLocaleString("id-ID")}</div>
          <div className="stat-label">Dana Tersalurkan</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeVolunteers}</div>
          <div className="stat-label">Relawan Aktif</div>
        </div>
      </div>

      <div className="section-label">Riwayat Aktivitas Terbaru</div>
      <div className="card">
        {recentActivity.length === 0 && <div className="muted">Belum ada aktivitas edit/hapus yang tercatat.</div>}
        {recentActivity.map((entry) => (
          <div key={entry.id} className="activity-row">
            <div>
              <strong>{entry.role}</strong> {entry.action.toLowerCase()} {entry.entityType.toLowerCase()}
              {entry.entityName ? <>: <strong>{entry.entityName}</strong></> : null}
            </div>
            <span className="muted-inline">{fmtDateTime(entry.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramTab({ projects, volunteers, role, updateProject, editProjectInfo, updateStageField, openProject, setOpenProject, showNewProject, setShowNewProject, addProject, deleteProject }) {
  const active = projects.find((p) => p.id === openProject);
  const isManajer = role === "Manajer";
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const editTarget = projects.find((p) => p.id === editingId);
  const deleteTarget = projects.find((p) => p.id === deleteConfirmId);

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteProject(deleteConfirmId);
    if (openProject === deleteConfirmId) setOpenProject(null);
    setDeleteConfirmId(null);
  };

  return (
    <>
      {active ? (
        <ProjectDetail
          project={active}
          volunteers={volunteers}
          role={role}
          onBack={() => setOpenProject(null)}
          onUpdate={(patch) => updateProject(active.id, patch)}
          onStageField={(stageIdx, key, value) => updateStageField(active.id, stageIdx, key, value)}
          onEdit={isManajer ? () => setEditingId(active.id) : null}
          onRequestDelete={isManajer ? () => setDeleteConfirmId(active.id) : null}
        />
      ) : (
        <div className="page">
          <div className="page-head">
            <div>
              <div className="eyebrow">Program</div>
              <h1>Semua Program</h1>
            </div>
            <button className="btn-primary" onClick={() => setShowNewProject(true)}>+ Program Baru</button>
          </div>

          <div className="project-grid">
            {projects.map((p) => (
              <div
                key={p.id}
                className="project-card"
                role="button"
                tabIndex={0}
                onClick={() => setOpenProject(p.id)}
                onKeyDown={(e) => e.key === "Enter" && setOpenProject(p.id)}
              >
                <div className="project-card-top">
                  <div>
                    <div className="project-name">{p.name}</div>
                    {p.stageData?.[0]?.kategori && <div className="kategori-tag">{p.stageData[0].kategori}</div>}
                  </div>
                  <div className="card-actions">
                    {isOverdue(p) && <Badge tone="danger">Terlambat</Badge>}
                    {isManajer && (
                      <>
                        <button
                          className="icon-btn"
                          title="Edit info program"
                          onClick={(e) => { e.stopPropagation(); setEditingId(p.id); }}
                        >
                          ✎
                        </button>
                        <button
                          className="icon-btn icon-btn-danger"
                          title="Hapus program"
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(p.id); }}
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="project-meta">PIC: {p.pic} · {p.location}</div>
                {p.stageData?.[0]?.targetPM && <div className="project-meta">Target PM: {p.stageData[0].targetPM}</div>}
                <Stepper stage={p.stage} />
                <div className="progress-row">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${taskProgress(p.tasks)}%` }} />
                  </div>
                  <span className="progress-pct">{taskProgress(p.tasks)}%</span>
                </div>
                <div className="project-card-bottom">
                  <ApprovalBadge status={p.approval.status} />
                  <span className="muted-inline">target {fmtDate(p.targetDate)}</span>
                </div>
              </div>
            ))}
          </div>

          {showNewProject && (
            <NewProjectModal onClose={() => setShowNewProject(false)} onSave={(proj) => { addProject(proj); setShowNewProject(false); }} />
          )}
        </div>
      )}

      {editTarget && (
        <EditProjectModal
          project={editTarget}
          onClose={() => setEditingId(null)}
          onSave={(patch) => { editProjectInfo(editTarget.id, patch); setEditingId(null); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal name={deleteTarget.name} onClose={() => setDeleteConfirmId(null)} onConfirm={confirmDelete} />
      )}
    </>
  );
}

function ApprovalBadge({ status }) {
  if (status === "disetujui") return <Badge tone="gold">Disetujui</Badge>;
  if (status === "menunggu") return <Badge tone="warn">Menunggu Approval</Badge>;
  if (status === "ditolak") return <Badge tone="danger">Ditolak</Badge>;
  return <Badge>Belum Diajukan</Badge>;
}

function EditProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    name: project.name,
    pic: project.pic,
    location: project.location,
    startDate: project.startDate,
    targetDate: project.targetDate,
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Info Program</h2>
        <label className="field">
          <span>Nama Program</span>
          <input value={form.name} onChange={set("name")} />
        </label>
        <div className="field-row">
          <label className="field">
            <span>PIC</span>
            <input value={form.pic} onChange={set("pic")} />
          </label>
          <label className="field">
            <span>Lokasi</span>
            <input value={form.location} onChange={set("location")} />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Tanggal Mulai</span>
            <input type="date" value={form.startDate} onChange={set("startDate")} />
          </label>
          <label className="field">
            <span>Target Selesai</span>
            <input type="date" value={form.targetDate} onChange={set("targetDate")} />
          </label>
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={!form.name} onClick={() => onSave(form)}>Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ name, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Hapus Program?</h2>
        <div className="muted" style={{ marginBottom: 18 }}>
          Program <strong>"{name}"</strong> beserta seluruh tugas, breakdown tahap, dan riwayatnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-danger" onClick={onConfirm}>Ya, Hapus Program</button>
        </div>
      </div>
    </div>
  );
}

function NewProjectModal({ onClose, onSave }) {

  const [form, setForm] = useState({ name: "", pic: "", location: "", startDate: "", targetDate: "" });
  const [plan, setPlan] = useState({
    kategori: KATEGORI[0],
    lokasiDetail: "",
    latarBelakang: "",
    tujuanProgram: "",
    targetPM: "",
    targetOutput: "",
    dampakDiharapkan: "",
    indikatorKeberhasilan: "",
    estimasiAnggaran: "",
    sumberDana: "",
    risikoMitigasi: "",
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setP = (k) => (e) => setPlan({ ...plan, [k]: e.target.value });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Program Baru</h2>

        <label className="field">
          <span>Nama Program</span>
          <input value={form.name} onChange={set("name")} placeholder="mis. Bantu UKT Mahasiswa Dhuafa" />
        </label>
        <div className="field-row">
          <label className="field">
            <span>PIC</span>
            <input value={form.pic} onChange={set("pic")} />
          </label>
          <label className="field">
            <span>Lokasi</span>
            <input value={form.location} onChange={set("location")} />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Tanggal Mulai</span>
            <input type="date" value={form.startDate} onChange={set("startDate")} />
          </label>
          <label className="field">
            <span>Target Selesai</span>
            <input type="date" value={form.targetDate} onChange={set("targetDate")} />
          </label>
        </div>

        <div className="modal-subhead">Data Perencanaan</div>
        <label className="field">
          <span>Kategori Program</span>
          <select className="select" value={plan.kategori} onChange={setP("kategori")}>
            {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Lokasi Pelaksanaan (Detail)</span>
          <input value={plan.lokasiDetail} onChange={setP("lokasiDetail")} placeholder="mis. Dusun II RT 05, dekat Masjid Al-Ikhlas" />
        </label>
        <label className="field">
          <span>Latar Belakang / Justifikasi</span>
          <textarea rows={2} value={plan.latarBelakang} onChange={setP("latarBelakang")} placeholder="Masalah apa yang ingin diselesaikan?" />
        </label>
        <label className="field">
          <span>Tujuan Program</span>
          <textarea rows={2} value={plan.tujuanProgram} onChange={setP("tujuanProgram")} placeholder="Apa yang ingin dicapai program ini?" />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Target Penerima Manfaat</span>
            <input value={plan.targetPM} onChange={setP("targetPM")} placeholder="mis. 150 santri" />
          </label>
          <label className="field">
            <span>Target Output / Keluaran</span>
            <input value={plan.targetOutput} onChange={setP("targetOutput")} placeholder="mis. 1 unit instalasi pipa" />
          </label>
        </div>
        <label className="field">
          <span>Dampak (Outcome) yang Diharapkan</span>
          <textarea rows={2} value={plan.dampakDiharapkan} onChange={setP("dampakDiharapkan")} placeholder="Perubahan apa yang diharapkan terjadi?" />
        </label>
        <label className="field">
          <span>Indikator Keberhasilan</span>
          <textarea rows={2} value={plan.indikatorKeberhasilan} onChange={setP("indikatorKeberhasilan")} placeholder="Bagaimana keberhasilan diukur?" />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Estimasi Anggaran (Rp)</span>
            <input type="number" value={plan.estimasiAnggaran} onChange={setP("estimasiAnggaran")} />
          </label>
          <label className="field">
            <span>Sumber Pendanaan</span>
            <input value={plan.sumberDana} onChange={setP("sumberDana")} placeholder="mis. Donatur Individu, CSR Medco" />
          </label>
        </div>
        <label className="field">
          <span>Risiko & Rencana Mitigasi</span>
          <textarea rows={2} value={plan.risikoMitigasi} onChange={setP("risikoMitigasi")} placeholder="Risiko apa yang mungkin muncul, dan bagaimana mengatasinya?" />
        </label>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button
            className="btn-primary"
            disabled={!form.name}
            onClick={() => {
              const sd = emptyStageData();
              sd[0] = { ...plan, lokasiDetail: plan.lokasiDetail || form.location };
              onSave({
                id: uid(),
                ...form,
                stage: 0,
                approval: { status: "belum", note: "" },
                tasks: [],
                stageData: sd,
              });
            }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

const STAGE_FIELDS = {
  0: [
    { key: "kategori", label: "Kategori Program", type: "select" },
    { key: "lokasiDetail", label: "Lokasi Pelaksanaan (Detail)", type: "text" },
    { key: "latarBelakang", label: "Latar Belakang / Justifikasi", type: "textarea" },
    { key: "tujuanProgram", label: "Tujuan Program", type: "textarea" },
    { key: "targetPM", label: "Target Penerima Manfaat", type: "text" },
    { key: "targetOutput", label: "Target Output / Keluaran", type: "text" },
    { key: "dampakDiharapkan", label: "Dampak (Outcome) yang Diharapkan", type: "textarea" },
    { key: "indikatorKeberhasilan", label: "Indikator Keberhasilan", type: "textarea" },
    { key: "estimasiAnggaran", label: "Estimasi Anggaran (Rp)", type: "number" },
    { key: "sumberDana", label: "Sumber Pendanaan", type: "text" },
    { key: "risikoMitigasi", label: "Risiko & Rencana Mitigasi", type: "textarea" },
  ],
  1: [
    { key: "danaTerkumpul", label: "Dana Terkumpul (Rp)", type: "number" },
    { key: "timPelaksana", label: "Tim Pelaksana / PIC Lapangan", type: "text" },
    { key: "mitraKerja", label: "Mitra Kerja / Stakeholder Terkait", type: "text" },
    { key: "perizinan", label: "Perizinan & Sosialisasi", type: "textarea" },
    { key: "logistik", label: "Logistik & Perlengkapan", type: "textarea" },
    { key: "jadwalDetail", label: "Jadwal Detail Pelaksanaan", type: "textarea" },
  ],
  2: [
    { key: "tanggalPelaksanaan", label: "Tanggal Pelaksanaan Aktual", type: "date" },
    { key: "realisasiPM", label: "Realisasi Penerima Manfaat", type: "text" },
    { key: "realisasiOutput", label: "Realisasi Output / Keluaran", type: "text" },
    { key: "danaTerpakai", label: "Dana Terpakai Aktual (Rp)", type: "number" },
    { key: "dokumentasi", label: "Dokumentasi Kegiatan (link/keterangan)", type: "text" },
    { key: "kendala", label: "Kendala / Catatan Lapangan", type: "textarea" },
    { key: "solusiKendala", label: "Solusi atas Kendala", type: "textarea" },
  ],
  3: [
    { key: "dampakTercapai", label: "Dampak (Outcome) yang Tercapai", type: "textarea" },
    { key: "testimoni", label: "Testimoni Penerima Manfaat", type: "textarea" },
    { key: "rekomendasi", label: "Rekomendasi Tindak Lanjut", type: "textarea" },
    { key: "catatanAkhir", label: "Catatan Akhir", type: "textarea" },
  ],
};

function StageDetailCard({ project, stageIdx, onStageField }) {
  const [expanded, setExpanded] = useState(stageIdx === project.stage);
  const reached = stageIdx <= project.stage;
  const fields = STAGE_FIELDS[stageIdx];
  const values = project.stageData?.[stageIdx] || {};

  return (
    <div className={`stage-card ${reached ? "" : "locked"}`}>
      <button className="stage-card-head" onClick={() => reached && setExpanded((e) => !e)}>
        <div className="stage-card-title">
          <span className={`stage-num ${stageIdx < project.stage ? "done" : stageIdx === project.stage ? "current" : ""}`}>
            {stageIdx < project.stage ? "✓" : stageIdx + 1}
          </span>
          {STAGES[stageIdx]}
        </div>
        {reached ? <span className="chevron">{expanded ? "−" : "+"}</span> : <span className="lock-icon">🔒</span>}
      </button>
      {!reached && <div className="muted stage-locked-note">Akan tersedia saat program mencapai tahap ini.</div>}
      {reached && expanded && (
        <div className="stage-card-body">
          {fields.map((f) => (
            <label className="field" key={f.key}>
              <span>{f.label}</span>
              {f.type === "textarea" ? (
                <textarea rows={2} value={values[f.key] || ""} onChange={(e) => onStageField(stageIdx, f.key, e.target.value)} />
              ) : f.type === "select" ? (
                <select className="select" value={values[f.key] || ""} onChange={(e) => onStageField(stageIdx, f.key, e.target.value)}>
                  <option value="">Pilih kategori…</option>
                  {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              ) : (
                <input type={f.type} value={values[f.key] || ""} onChange={(e) => onStageField(stageIdx, f.key, e.target.value)} />
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectDetail({ project, volunteers, role, onBack, onUpdate, onStageField, onEdit, onRequestDelete }) {
  const [newTask, setNewTask] = useState("");
  const [approvalNote, setApprovalNote] = useState(project.approval.note || "");
  const [reportDraft, setReportDraft] = useState(null);

  const addTask = () => {
    if (!newTask.trim()) return;
    onUpdate({ tasks: [...project.tasks, { id: uid(), title: newTask.trim(), done: false, assignee: "" }] });
    setNewTask("");
  };

  const toggleTask = (id) => {
    onUpdate({ tasks: project.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) });
  };

  const assignTask = (id, assignee) => {
    onUpdate({ tasks: project.tasks.map((t) => (t.id === id ? { ...t, assignee } : t)) });
  };

  const nextStageBlocked = project.stage === 1 && project.approval.status !== "disetujui";

  const advanceStage = () => {
    if (project.stage === 1 && project.approval.status !== "disetujui") return;
    onUpdate({ stage: Math.min(project.stage + 1, STAGES.length - 1) });
  };

  const requestApproval = () => onUpdate({ approval: { status: "menunggu", note: "" } });
  const decideApproval = (decision) => onUpdate({ approval: { status: decision, note: approvalNote } });

  const generateReport = () => {
    const doneT = project.tasks.filter((t) => t.done).length;
    const sd = project.stageData;
    const text = `Laporan Program: ${project.name}
Kategori: ${sd[0].kategori || "-"}
Lokasi: ${project.location}${sd[0].lokasiDetail ? ` (${sd[0].lokasiDetail})` : ""}
Periode: ${fmtDate(project.startDate)} – ${fmtDate(project.targetDate)}
PIC: ${project.pic}
Sumber Pendanaan: ${sd[0].sumberDana || "-"}

Latar Belakang:
${sd[0].latarBelakang || "-"}

Tujuan Program:
${sd[0].tujuanProgram || "-"}

Realisasi Tugas: ${doneT} dari ${project.tasks.length} tugas selesai (${taskProgress(project.tasks)}%)

Penerima Manfaat — Target vs Realisasi: ${sd[0].targetPM || "-"} vs ${sd[2].realisasiPM || "-"}
Output — Target vs Realisasi: ${sd[0].targetOutput || "-"} vs ${sd[2].realisasiOutput || "-"}
Anggaran — Estimasi vs Terpakai: Rp ${sd[0].estimasiAnggaran ? numOf(sd[0].estimasiAnggaran).toLocaleString("id-ID") : "-"} vs Rp ${sd[2].danaTerpakai ? numOf(sd[2].danaTerpakai).toLocaleString("id-ID") : "-"}

Indikator Keberhasilan:
${sd[0].indikatorKeberhasilan || "-"}

Dampak Diharapkan:
${sd[0].dampakDiharapkan || "-"}

Dampak Tercapai:
${sd[3].dampakTercapai || "-"}

Risiko & Mitigasi (Perencanaan):
${sd[0].risikoMitigasi || "-"}

Kendala Lapangan:
${sd[2].kendala || "-"}

Solusi atas Kendala:
${sd[2].solusiKendala || "-"}

Dokumentasi Kegiatan:
${sd[2].dokumentasi || "-"}

Testimoni Penerima Manfaat:
${sd[3].testimoni || "-"}

Rekomendasi Tindak Lanjut:
${sd[3].rekomendasi || "-"}

Catatan Akhir:
${sd[3].catatanAkhir || "-"}`;
    setReportDraft(text);
  };

  return (
    <div className="page">
      <button className="back-link" onClick={onBack}>← Kembali ke Semua Program</button>

      <div className="page-head">
        <div>
          <div className="eyebrow">{project.location}</div>
          <h1>{project.name}</h1>
          <div className="muted">PIC: {project.pic} · {fmtDate(project.startDate)} – {fmtDate(project.targetDate)}</div>
        </div>
        {onEdit && <button className="btn-ghost" onClick={onEdit}>Edit Info Program</button>}
      </div>

      <Stepper stage={project.stage} />

      <div className="detail-grid">
        <div className="detail-col">
          <div className="card">
            <div className="card-title">Tugas</div>
            {project.tasks.map((t) => (
              <div key={t.id} className="task-row">
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                <span className={`task-title ${t.done ? "done" : ""}`}>{t.title}</span>
                <select className="select-small" value={t.assignee} onChange={(e) => assignTask(t.id, e.target.value)}>
                  <option value="">Belum ditugaskan</option>
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="add-task-row">
              <input placeholder="Tambah tugas baru…" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
              <button className="btn-ghost" onClick={addTask}>Tambah</button>
            </div>
          </div>

          <div className="card-title" style={{ margin: "20px 0 10px" }}>Breakdown per Tahap</div>
          {STAGES.map((_, idx) => (
            <StageDetailCard key={idx} project={project} stageIdx={idx} onStageField={onStageField} />
          ))}

          {project.stage === 3 && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-title">Draft Laporan</div>
              <button className="btn-primary" onClick={generateReport}>Buat Draft Laporan</button>
              {reportDraft && <pre className="report-draft">{reportDraft}</pre>}
            </div>
          )}
        </div>

        <div className="detail-col">
          <div className="card">
            <div className="card-title">Approval</div>
            <ApprovalBadge status={project.approval.status} />
            {project.approval.note && <div className="muted note-box">"{project.approval.note}"</div>}

            {role === "Staf" && project.approval.status !== "disetujui" && (
              <button className="btn-ghost full-width" onClick={requestApproval}>Ajukan Approval</button>
            )}

            {role === "Manajer" && project.approval.status === "menunggu" && (
              <div className="approval-box">
                <textarea rows={2} placeholder="Catatan approval (opsional)" value={approvalNote} onChange={(e) => setApprovalNote(e.target.value)} />
                <div className="modal-actions">
                  <button className="btn-danger" onClick={() => decideApproval("ditolak")}>Tolak</button>
                  <button className="btn-primary" onClick={() => decideApproval("disetujui")}>Setujui</button>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Tahapan</div>
            <div className="muted" style={{ marginBottom: 10 }}>
              Tahap saat ini: <strong>{STAGES[project.stage]}</strong>
            </div>
            <button className="btn-primary full-width" disabled={project.stage >= 3 || nextStageBlocked} onClick={advanceStage}>
              {project.stage >= 3 ? "Tahap Terakhir" : nextStageBlocked ? "Menunggu Approval untuk Lanjut" : `Lanjut ke ${STAGES[project.stage + 1]}`}
            </button>
          </div>

          <div className="card">
            <div className="card-title">Ringkasan Cepat</div>
            <div className="quick-row"><span>Target PM</span><strong>{project.stageData[0].targetPM || "-"}</strong></div>
            <div className="quick-row"><span>Realisasi PM</span><strong>{project.stageData[2].realisasiPM || "-"}</strong></div>
            <div className="quick-row"><span>Target Output</span><strong>{project.stageData[0].targetOutput || "-"}</strong></div>
            <div className="quick-row"><span>Realisasi Output</span><strong>{project.stageData[2].realisasiOutput || "-"}</strong></div>
            <div className="quick-row"><span>Estimasi Anggaran</span><strong>Rp {project.stageData[0].estimasiAnggaran ? numOf(project.stageData[0].estimasiAnggaran).toLocaleString("id-ID") : "-"}</strong></div>
            <div className="quick-row"><span>Dana Terpakai</span><strong>Rp {project.stageData[2].danaTerpakai ? numOf(project.stageData[2].danaTerpakai).toLocaleString("id-ID") : "-"}</strong></div>
            <div className="quick-row"><span>Sumber Dana</span><strong>{project.stageData[0].sumberDana || "-"}</strong></div>
          </div>

          {onRequestDelete && (
            <div className="card danger-zone">
              <div className="card-title">Zona Berbahaya</div>
              <div className="muted" style={{ marginBottom: 10 }}>Menghapus program akan menghilangkan seluruh data tugas, breakdown tahap, dan riwayatnya secara permanen.</div>
              <button className="btn-danger full-width" onClick={onRequestDelete}>Hapus Program Ini</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VolunteerTab({ volunteers, projects, role, showNewVolunteer, setShowNewVolunteer, addVolunteer, editVolunteer, deleteVolunteer }) {
  const [openId, setOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const isManajer = role === "Manajer";
  const open = volunteers.find((v) => v.id === openId);
  const editTarget = volunteers.find((v) => v.id === editingId);
  const deleteTarget = volunteers.find((v) => v.id === deleteConfirmId);

  const history = (name) =>
    projects.flatMap((p) => p.tasks.filter((t) => t.assignee === name).map((t) => ({ project: p.name, task: t.title, done: t.done })));

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteVolunteer(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Relawan</div>
          <h1>Database Relawan</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowNewVolunteer(true)}>+ Relawan Baru</button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kontak</th>
              <th>Domisili</th>
              <th>Keahlian</th>
              <th>Status</th>
              {isManajer && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v) => (
              <tr key={v.id} className="table-row" onClick={() => setOpenId(v.id)}>
                <td>{v.name}</td>
                <td>{v.phone}</td>
                <td>{v.domicile}</td>
                <td>{v.skills}</td>
                <td><Badge tone={v.status === "Aktif" ? "gold" : v.status === "Baru" ? "warn" : "default"}>{v.status}</Badge></td>
                {isManajer && (
                  <td>
                    <div className="card-actions">
                      <button className="icon-btn" title="Edit relawan" onClick={(e) => { e.stopPropagation(); setEditingId(v.id); }}>✎</button>
                      <button className="icon-btn icon-btn-danger" title="Hapus relawan" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(v.id); }}>🗑</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpenId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{open.name}</h2>
            <div className="muted">{open.phone} · {open.domicile}</div>
            <div className="muted" style={{ marginBottom: 14 }}>Keahlian: {open.skills}</div>
            <div className="card-title">Riwayat Keterlibatan</div>
            {history(open.name).length === 0 && <div className="muted">Belum ada riwayat tugas.</div>}
            {history(open.name).map((h, i) => (
              <div key={i} className="history-row">
                <span>{h.project}</span>
                <span className="muted-inline">{h.task}</span>
                {h.done && <Badge tone="gold">Selesai</Badge>}
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setOpenId(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {showNewVolunteer && (
        <NewVolunteerModal onClose={() => setShowNewVolunteer(false)} onSave={(v) => { addVolunteer(v); setShowNewVolunteer(false); }} />
      )}

      {editTarget && (
        <EditVolunteerModal
          volunteer={editTarget}
          onClose={() => setEditingId(null)}
          onSave={(patch) => { editVolunteer(editTarget.id, patch); setEditingId(null); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal name={deleteTarget.name} onClose={() => setDeleteConfirmId(null)} onConfirm={confirmDelete} />
      )}
    </div>
  );
}

function EditVolunteerModal({ volunteer, onClose, onSave }) {
  const [form, setForm] = useState({
    name: volunteer.name,
    phone: volunteer.phone,
    domicile: volunteer.domicile,
    skills: volunteer.skills,
    status: volunteer.status,
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Relawan</h2>
        <label className="field"><span>Nama</span><input value={form.name} onChange={set("name")} /></label>
        <div className="field-row">
          <label className="field"><span>No. HP</span><input value={form.phone} onChange={set("phone")} /></label>
          <label className="field"><span>Domisili</span><input value={form.domicile} onChange={set("domicile")} /></label>
        </div>
        <label className="field"><span>Keahlian / Minat</span><input value={form.skills} onChange={set("skills")} /></label>
        <label className="field">
          <span>Status</span>
          <select className="select" value={form.status} onChange={set("status")}>
            {VOL_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={!form.name} onClick={() => onSave(form)}>Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}

function NewVolunteerModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", phone: "", domicile: "", skills: "", status: "Baru" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Relawan Baru</h2>
        <label className="field"><span>Nama</span><input value={form.name} onChange={set("name")} /></label>
        <div className="field-row">
          <label className="field"><span>No. HP</span><input value={form.phone} onChange={set("phone")} /></label>
          <label className="field"><span>Domisili</span><input value={form.domicile} onChange={set("domicile")} /></label>
        </div>
        <label className="field"><span>Keahlian / Minat</span><input value={form.skills} onChange={set("skills")} placeholder="mis. Mengajar, Dokumentasi" /></label>
        <label className="field">
          <span>Status</span>
          <select className="select" value={form.status} onChange={set("status")}>
            {VOL_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn-primary" disabled={!form.name} onClick={() => onSave({ id: uid(), ...form })}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

      * { box-sizing: border-box; }
      .app-shell {
        display: flex;
        min-height: 100%;
        background: #F7F4EC;
        color: #2B1B12;
        font-family: 'Inter', sans-serif;
      }
      .loading-shell { align-items: center; justify-content: center; }
      .loading-text { font-family: 'IBM Plex Mono', monospace; color: #D98B3F; }

      .sidebar {
        width: 220px;
        flex-shrink: 0;
        background: #E8631A;
        color: #F7F4EC;
        padding: 24px 16px;
        display: flex;
        flex-direction: column;
        gap: 28px;
      }
      .brand { display: flex; align-items: center; gap: 10px; }
      .brand-mark {
        width: 36px; height: 36px; border-radius: 8px;
        background: #F2A65A; color: #7A2E0A;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Fraunces', serif; font-weight: 700; font-size: 15px;
      }
      .brand-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 14.5px; line-height: 1.2; }
      .brand-sub { font-size: 11px; color: #F0BE93; margin-top: 2px; }

      .nav { display: flex; flex-direction: column; gap: 4px; }
      .nav-item {
        text-align: left; background: none; border: none; color: #F6D9C0;
        padding: 10px 12px; border-radius: 8px; font-size: 14px; cursor: pointer;
        font-family: 'Inter', sans-serif; font-weight: 500;
      }
      .nav-item:hover { background: rgba(255,255,255,0.06); }
      .nav-item.active { background: #F2A65A; color: #7A2E0A; font-weight: 600; }

      .role-switch { margin-top: auto; }
      .sync-warning { background: rgba(195,58,40,0.25); color: #F6D9C0; font-size: 11px; padding: 8px 10px; border-radius: 8px; font-family: 'IBM Plex Mono', monospace; line-height: 1.4; }
      .role-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #E8A874; margin-bottom: 6px; font-family: 'IBM Plex Mono', monospace; }
      .role-toggle { display: flex; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 3px; }
      .role-btn { flex: 1; background: none; border: none; color: #F6D9C0; padding: 6px 0; border-radius: 6px; font-size: 12.5px; cursor: pointer; font-family: 'Inter', sans-serif; }
      .role-btn.active { background: #F7F4EC; color: #E8631A; font-weight: 600; }

      .main { flex: 1; padding: 32px 40px; overflow-y: auto; }
      .page { max-width: 980px; }
      .page-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 16px; }
      .eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #F2A65A; margin-bottom: 4px; }
      h1 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 28px; margin: 0; color: #7A2E0A; }
      .muted { color: #7A6A60; font-size: 13.5px; }
      .muted-inline { color: #9C8577; font-size: 12px; margin-left: 6px; }

      .section-label { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.07em; color: #6B4A38; margin: 28px 0 12px; }
      .section-label:first-of-type { margin-top: 0; }

      .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .action-card { background: #fff; border: 1px solid #E4DFD1; border-radius: 12px; padding: 18px; }
      .action-count { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 700; color: #E8631A; }
      .action-count.danger { color: #C33A28; }
      .action-title { font-size: 13px; color: #6B4A38; margin-bottom: 10px; font-weight: 600; }
      .action-list { display: flex; flex-direction: column; gap: 4px; }
      .action-row { text-align: left; background: #F7F4EC; border: none; border-radius: 8px; padding: 8px 10px; font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; }
      .action-row:hover { background: #EFE9D8; }

      .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
      .stat-card { background: #fff; border: 1px solid #E4DFD1; border-radius: 12px; padding: 16px; }
      .stat-value { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: #7A2E0A; }
      .stat-label { font-size: 12px; color: #7A6A60; margin-top: 4px; }

      .project-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .project-card { text-align: left; background: #fff; border: 1px solid #E4DFD1; border-radius: 14px; padding: 18px; cursor: pointer; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; gap: 8px; }
      .project-card:hover { border-color: #F2A65A; }
      .project-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
      .card-actions { display: flex; align-items: center; gap: 6px; }
      .icon-btn { background: none; border: 1px solid #E4DFD1; border-radius: 6px; width: 26px; height: 26px; font-size: 12.5px; cursor: pointer; color: #6B4A38; display: flex; align-items: center; justify-content: center; }
      .icon-btn:hover { border-color: #F2A65A; color: #7A2E0A; }
      .icon-btn-danger:hover { border-color: #C33A28; color: #C33A28; }
      .danger-zone { border-color: #F0C7BE; }
      .project-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; color: #7A2E0A; }
      .kategori-tag { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: #F2A65A; margin-top: 2px; }
      .project-meta { font-size: 12.5px; color: #7A6A60; }
      .project-card-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }

      .stepper { display: flex; align-items: flex-start; margin: 8px 0 4px; }
      .stepper-node { display: flex; align-items: center; flex: 1; position: relative; }
      .stepper-node:last-child { flex: 0; }
      .node-dot { width: 24px; height: 24px; border-radius: 50%; background: #E4DFD1; color: #7A6A60; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
      .node-dot.done { background: #F2A65A; color: #7A2E0A; }
      .node-dot.current { background: #E8631A; color: #fff; }
      .node-label { position: absolute; top: 28px; left: 0; font-size: 9.5px; color: #9C8577; width: 70px; font-family: 'IBM Plex Mono', monospace; }
      .node-label.current { color: #E8631A; font-weight: 600; }
      .node-line { flex: 1; height: 2px; background: #E4DFD1; margin: 0 4px; }
      .node-line.filled { background: #F2A65A; }

      .progress-row { display: flex; align-items: center; gap: 8px; margin-top: 22px; }
      .progress-track { flex: 1; height: 6px; background: #EFEBDD; border-radius: 4px; overflow: hidden; }
      .progress-fill { height: 100%; background: #D98B3F; }
      .progress-pct { font-size: 11px; color: #7A6A60; font-family: 'IBM Plex Mono', monospace; }

      .badge { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; }
      .badge-default { background: #EFEBDD; color: #7A6A60; }
      .badge-gold { background: #F1E3BE; color: #7A5B10; }
      .badge-warn { background: #F3DCC9; color: #8A4A1E; }
      .badge-danger { background: #F3D4C9; color: #C33A28; }

      .btn-primary { background: #E8631A; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 13.5px; cursor: pointer; font-family: 'Inter', sans-serif; }
      .btn-primary:disabled { background: #D9C7BC; cursor: not-allowed; }
      .btn-ghost { background: none; border: 1px solid #D8D2BF; padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 13.5px; cursor: pointer; color: #6B4A38; font-family: 'Inter', sans-serif; }
      .btn-danger { background: #C33A28; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 13.5px; cursor: pointer; font-family: 'Inter', sans-serif; }
      .full-width { width: 100%; margin-top: 10px; }

      .back-link { background: none; border: none; color: #7A6A60; font-size: 13px; cursor: pointer; padding: 0; margin-bottom: 16px; font-family: 'Inter', sans-serif; }
      .back-link:hover { color: #E8631A; }

      .detail-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-top: 20px; align-items: start; }
      .card { background: #fff; border: 1px solid #E4DFD1; border-radius: 14px; padding: 18px; margin-bottom: 16px; }
      .card-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 15px; color: #7A2E0A; margin-bottom: 12px; }

      .task-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid #F0ECE0; }
      .task-title { flex: 1; font-size: 13.5px; }
      .task-title.done { text-decoration: line-through; color: #A6ABA8; }
      .select-small { font-size: 11.5px; border: 1px solid #E4DFD1; border-radius: 6px; padding: 4px 6px; font-family: 'Inter', sans-serif; color: #6B4A38; background: #FAF8F1; }
      .add-task-row { display: flex; gap: 8px; margin-top: 10px; }
      .add-task-row input { flex: 1; padding: 8px 10px; border: 1px solid #E4DFD1; border-radius: 8px; font-size: 13px; font-family: 'Inter', sans-serif; }

      .field { display: flex; flex-direction: column; gap: 5px; font-size: 12.5px; color: #6B4A38; font-weight: 600; margin-bottom: 12px; flex: 1; }
      .field input, .field textarea, .select {
        border: 1px solid #E4DFD1; border-radius: 8px; padding: 9px 11px; font-size: 13.5px;
        font-family: 'Inter', sans-serif; color: #2B1B12; background: #FAF8F1; font-weight: 400;
      }
      .field-row { display: flex; gap: 12px; }
      .modal-subhead { font-family: 'IBM Plex Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #F2A65A; margin: 18px 0 10px; border-top: 1px solid #F0ECE0; padding-top: 14px; }

      .note-box { margin: 8px 0; padding: 8px 10px; background: #F7F4EC; border-radius: 8px; font-style: italic; }
      .approval-box { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
      .approval-box textarea { border: 1px solid #E4DFD1; border-radius: 8px; padding: 8px 10px; font-family: 'Inter', sans-serif; font-size: 13px; }

      .report-draft { background: #F7F4EC; border: 1px dashed #F2A65A; border-radius: 10px; padding: 14px; font-size: 12.5px; white-space: pre-wrap; margin-top: 12px; font-family: 'IBM Plex Mono', monospace; color: #4A2A12; }

      .stage-card { background: #fff; border: 1px solid #E4DFD1; border-radius: 12px; margin-bottom: 10px; overflow: hidden; }
      .stage-card.locked { background: #FAF8F1; }
      .stage-card-head { width: 100%; display: flex; align-items: center; justify-content: space-between; background: none; border: none; padding: 13px 16px; cursor: pointer; font-family: 'Inter', sans-serif; }
      .stage-card.locked .stage-card-head { cursor: default; }
      .stage-card-title { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 13.5px; color: #7A2E0A; }
      .stage-num { width: 20px; height: 20px; border-radius: 50%; background: #E4DFD1; color: #7A6A60; font-size: 10.5px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
      .stage-num.done { background: #F2A65A; color: #7A2E0A; }
      .stage-num.current { background: #E8631A; color: #fff; }
      .chevron { color: #9C8577; font-size: 16px; }
      .lock-icon { font-size: 12px; opacity: 0.5; }
      .stage-locked-note { padding: 0 16px 14px; }
      .stage-card-body { padding: 0 16px 16px; }

      .quick-row { display: flex; justify-content: space-between; font-size: 12.5px; padding: 6px 0; border-bottom: 1px solid #F0ECE0; }
      .quick-row span { color: #7A6A60; }

      .table-wrap { background: #fff; border: 1px solid #E4DFD1; border-radius: 14px; overflow: hidden; }
      .table { width: 100%; border-collapse: collapse; }
      .table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9C8577; padding: 12px 16px; border-bottom: 1px solid #E4DFD1; font-family: 'IBM Plex Mono', monospace; }
      .table td { padding: 12px 16px; font-size: 13.5px; border-bottom: 1px solid #F0ECE0; }
      .table-row { cursor: pointer; }
      .table-row:hover { background: #F7F4EC; }

      .history-row { display: flex; gap: 10px; align-items: center; padding: 7px 0; border-bottom: 1px solid #F0ECE0; font-size: 13px; }
      .activity-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #F0ECE0; font-size: 13px; }
      .activity-row:last-child { border-bottom: none; }

      .modal-backdrop { position: fixed; inset: 0; background: rgba(11,79,74,0.35); display: flex; align-items: center; justify-content: center; z-index: 50; }
      .modal { background: #fff; border-radius: 16px; padding: 26px; width: 440px; max-height: 84vh; overflow-y: auto; }
      .modal h2 { font-family: 'Fraunces', serif; font-size: 19px; margin: 0 0 16px; color: #7A2E0A; }
      .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
      .code-error { color: #C33A28; font-size: 12.5px; margin: -6px 0 4px; font-weight: 600; }
    `}</style>
  );
}

export default App;
