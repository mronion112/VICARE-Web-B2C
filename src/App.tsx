import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { accounts, Family, FamilyAlert, families, getFamilyById, VitalStatus } from "./data/families";

type Page = "monitoring" | "alerts" | "profile" | "settings";
type IconName = "monitor" | "bell" | "person" | "settings" | "logout" | "heart" | "thermometer" | "oxygen" | "lungs" | "camera" | "shield" | "clock" | "check" | "alert" | "arrow" | "back" | "home" | "filter" | "family" | "activity" | "close";

const iconPaths: Record<IconName, string[]> = {
  monitor: ["M3 4.75A1.75 1.75 0 0 1 4.75 3h14.5A1.75 1.75 0 0 1 21 4.75v10.5A1.75 1.75 0 0 1 19.25 17H4.75A1.75 1.75 0 0 1 3 15.25z", "M8 21h8M12 17v4M7 10h2l1.2-2.5 2.2 5 1.4-2.5H17"],
  bell: ["M18 8a6 6 0 0 0-12 0c0 7-3 8-3 10h18c0-2-3-3-3-10M10 21h4"],
  person: ["M20 21a8 8 0 0 0-16 0", "M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10"],
  settings: ["M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7", "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 3.1-.2-.1a1.7 1.7 0 0 0-1.9.2l-.2.1h-3.6l-.1-.2a1.7 1.7 0 0 0-1.7-1l-.2.1-3.1-1.8.1-.2a1.7 1.7 0 0 0-.2-1.9l-.1-.2v-3.6l.2-.1a1.7 1.7 0 0 0 1-1.7l-.1-.2 1.8-3.1.2.1a1.7 1.7 0 0 0 1.9-.2l.2-.1h3.6l.1.2a1.7 1.7 0 0 0 1.7 1l.2-.1 3.1 1.8-.1.2a1.7 1.7 0 0 0 .2 1.9l.1.2v3.6z"],
  logout: ["M10 17l5-5-5-5M15 12H3", "M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"],
  heart: ["M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z", "M3 12h4l2-3 3 6 2-3h7"],
  thermometer: ["M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0z", "M11 12v5"],
  oxygen: ["M12 3v18", "M12 12H8a4 4 0 0 1 0-8h4", "M12 12h4a4 4 0 0 1 0 8h-4"],
  lungs: ["M12 11V4", "M12 11c-2-4-4-5-5-2-1 2-4 3-4 7 0 3 2 5 5 5 2 0 4-2 4-5", "M12 11c2-4 4-5 5-2 1 2 4 3 4 7 0 3-2 5-5 5-2 0-4-2-4-5"],
  camera: ["M14 5l1.5 2H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4.5L10 5z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8"],
  shield: ["M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z", "M9 12l2 2 4-4"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  check: ["M20 6 9 17l-5-5"],
  alert: ["m10.3 3.9-8.4 14.5A1.8 1.8 0 0 0 3.5 21h17a1.8 1.8 0 0 0 1.6-2.6L13.7 3.9a2 2 0 0 0-3.4 0z", "M12 9v4M12 17h.01"],
  arrow: ["M5 12h14", "m13 6 6 6-6 6"],
  back: ["M19 12H5", "m12 19-7-7 7-7"],
  home: ["m3 10 9-7 9 7", "M5 9v11h14V9", "M9 20v-6h6v6"],
  filter: ["M4 6h16M7 12h10m-7 6h4"],
  family: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"],
  activity: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  close: ["m18 6-12 12M6 6l12 12"],
};

function Icon({ name, size = 19 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name].map((d, i) => <path d={d} key={i} />)}</svg>;
}

const familyAvatar = (id: string) => `/avatars/member-${id.slice(-2)}.svg`;

function Login({ onLogin }: { onLogin: (username: string, password: string) => string | null }) {
  const [username, setUsername] = useState("admin1");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = onLogin(username.trim(), password);
    setError(result ?? "");
  };

  return (
    <main className="login-screen">
      <section className="login-story">
        <Brand light />
        <div className="story-copy">
          <span className="eyebrow light-eyebrow">CHĂM SÓC TỪ ĐIỀU GẦN GŨI NHẤT</span>
          <h1>An tâm chăm sóc<br />người thân mỗi ngày.</h1>
          <p>Theo dõi sức khỏe tại nhà, để gia đình luôn biết khi nào người thân cần được quan tâm.</p>
          <div className="story-points">
            <span><i><Icon name="monitor" size={17} /></i> Theo dõi sức khỏe tại nhà</span>
            <span><i><Icon name="bell" size={17} /></i> Cập nhật cảnh báo kịp thời</span>
            <span><i><Icon name="family" size={17} /></i> Dành riêng cho gia đình bạn</span>
          </div>
        </div>
        <div className="story-orbit orbit-one" /><div className="story-orbit orbit-two" />
      </section>

      <section className="login-form-side">
        <form className="login-form" onSubmit={submit}>
          <div className="mobile-brand"><Brand /></div>
          <div className="login-heading">
            <span className="eyebrow">TÀI KHOẢN GIA ĐÌNH</span>
            <h2>Chào mừng trở lại</h2>
            <p>Đăng nhập để xem tình hình sức khỏe gia đình bạn.</p>
          </div>
          <label className="field-label" htmlFor="username">Tên đăng nhập</label>
          <input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Tên đăng nhập" />
          <label className="field-label" htmlFor="password">Mật khẩu</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" />
          {error && <div className="form-error" role="alert"><Icon name="alert" size={16} />{error}</div>}
          <button className="primary-button login-submit" type="submit">Đăng nhập <Icon name="arrow" size={18} /></button>
        </form>
      </section>
    </main>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return <div className={`brand ${light ? "brand-light" : ""}`}>
    <span className="brand-logo"><img src="/brand/y-nhan-mark.png" alt="Y Nhãn" /></span>
    <span className="brand-title"><strong>Y NHÃN</strong><small>by VICARE</small></span>
  </div>;
}

const navigation: { id: Page; label: string; icon: IconName }[] = [
  { id: "monitoring", label: "Giám sát sức khỏe", icon: "monitor" },
  { id: "alerts", label: "Cảnh báo", icon: "bell" },
  { id: "profile", label: "Thông tin gia đình", icon: "family" },
  { id: "settings", label: "Cài đặt", icon: "settings" },
];

function currentAlertStatus(alert: FamilyAlert, overrides: Record<string, "open" | "resolved"> = {}) {
  return overrides[alert.id] ?? alert.initialStatus;
}

function AppShell({ family, page, resolutionOverrides, canGoBack, onNavigate, onBack, onLogout, children }: { family: Family; page: Page; resolutionOverrides: Record<string, "open" | "resolved">; canGoBack: boolean; onNavigate: (page: Page) => void; onBack: () => void; onLogout: () => void; children: ReactNode }) {
  const openAlerts = family.alerts.filter((alert) => currentAlertStatus(alert, resolutionOverrides) === "open").length;
  const heading = navigation.find((item) => item.id === page)?.label ?? "Giám sát sức khỏe";
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="family-switcher"><div className="family-icon"><Icon name="home" size={18} /></div><span><small>HỘ GIA ĐÌNH</small><strong>{family.name}</strong></span><span className="switch-chevron">⌄</span></div>
        <nav className="side-nav" aria-label="Điều hướng chính">
          <p className="nav-caption">SỨC KHỎE GIA ĐÌNH</p>
          {navigation.map((item) => <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => onNavigate(item.id)}><Icon name={item.icon} /><span>{item.label}</span>{item.id === "alerts" && openAlerts > 0 && <b>{openAlerts}</b>}</button>)}
        </nav>
        <div className="account-row"><img src={familyAvatar(family.id)} alt="" /><span><strong>{family.member.name}</strong><small>Quản lý gia đình</small></span><button title="Đăng xuất" aria-label="Đăng xuất" onClick={onLogout}><Icon name="logout" size={18} /></button></div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="topbar-leading">
            {canGoBack && <button className="back-button" onClick={onBack} title="Quay lại (Alt + ←)" aria-label="Quay lại"><Icon name="back" size={18} /><span>Quay lại</span></button>}
            <div className="mobile-top-brand"><Brand /></div>
            <div className="topbar-title"><span>Y NHÃN</span><b>{heading}</b></div>
          </div>
          <div className="topbar-right"><button className="top-alert-button" onClick={() => onNavigate("alerts")} aria-label="Mở cảnh báo"><Icon name="bell" size={19} />{openAlerts > 0 && <i>{openAlerts}</i>}</button><div className="top-avatar"><img src={familyAvatar(family.id)} alt={family.member.name} /></div></div>
        </header>
        <main className="page-content">{children}</main>
        <nav className="mobile-nav" aria-label="Điều hướng di động">{navigation.map((item) => <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => onNavigate(item.id)}><Icon name={item.icon} size={20} /><span>{item.id === "monitoring" ? "Theo dõi" : item.id === "profile" ? "Gia đình" : item.label}</span>{item.id === "alerts" && openAlerts > 0 && <i>{openAlerts}</i>}</button>)}</nav>
      </div>
    </div>
  );
}

function healthStatus(family: Family, resolutionOverrides: Record<string, "open" | "resolved"> = {}): VitalStatus {
  if (family.vitals.spo2 < 92 || family.vitals.systolic >= 180 || family.vitals.diastolic >= 120) return "critical";
  if (family.vitals.systolic >= 140 || family.vitals.diastolic >= 90 || family.vitals.heartRate > 100 || family.vitals.heartRate < 50 || family.alerts.some((alert) => alert.group === "activity" && currentAlertStatus(alert, resolutionOverrides) === "open")) return "warning";
  return "normal";
}

const statusLabel: Record<VitalStatus, string> = { normal: "Đang ổn định", warning: "Cần chú ý", critical: "Cần hỗ trợ ngay" };

function StatusPill({ status, children }: { status: VitalStatus; children?: ReactNode }) {
  return <span className={`status-pill ${status}`}><i />{children ?? statusLabel[status]}</span>;
}

function SectionHeading({ eyebrow, title, aside }: { eyebrow?: string; title: string; aside?: ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{aside}</div>;
}

function MemberSummary({ family, resolutionOverrides }: { family: Family; resolutionOverrides: Record<string, "open" | "resolved"> }) {
  const status = healthStatus(family, resolutionOverrides);
  return <section className="member-summary surface">
    <div className="member-main"><div className="member-avatar"><img src={familyAvatar(family.id)} alt={`Ảnh đại diện ${family.member.name}`} /><span className="avatar-presence" /></div><div className="member-details"><div className="member-name-row"><div><span className="eyebrow">THÀNH VIÊN ĐANG THEO DÕI</span><h2>{family.member.name}</h2></div><StatusPill status={status} /></div><p>{family.member.gender} <i /> {family.member.age} tuổi <i /> Sinh ngày {family.member.birthDate}</p></div></div>
    <div className="member-stats"><div><span>Chiều cao</span><strong>{family.member.height}<small> cm</small></strong></div><div><span>Cân nặng</span><strong>{family.member.weight}<small> kg</small></strong></div><div><span>Nhóm máu</span><strong>{family.member.bloodType}</strong></div></div>
  </section>;
}

function CameraCard({ title, subtitle, src, mode }: { title: string; subtitle: string; src: string; mode: "infrared" | "thermal" }) {
  return <section className={`camera-card ${mode}`}>
    <div className="camera-heading"><div><span className="camera-icon"><Icon name="camera" size={17} /></span><div><h3>{title}</h3><p>{subtitle}</p></div></div><span className="recording-badge"><i /> Đang phát lại</span></div>
    <div className="video-wrap"><video src={src} muted loop autoPlay playsInline controls preload="metadata" aria-label={`${title}, bản ghi 30 giây`} /><span className="video-label">{mode === "infrared" ? "IMVIA-NIR" : "NIR · FALSE-COLOR"}</span><span className="video-timestamp"><Icon name="clock" size={12} /> Bản ghi · 30 giây</span></div>
    <div className="camera-foot"><span><i />{mode === "infrared" ? "IMVIA-NIR · Hồng ngoại gần" : "Ảnh false-color xử lý từ NIR"}</span></div>
  </section>;
}

function MemberCard({ family, resolutionOverrides, onOpenProfile }: { family: Family; resolutionOverrides: Record<string, "open" | "resolved">; onOpenProfile: () => void }) {
  const alertCount = family.alerts.filter((alert) => currentAlertStatus(alert, resolutionOverrides) === "open").length;
  return <section className="member-card surface">
    <div className="member-card-head"><div><span className="eyebrow">HỒ SƠ THÀNH VIÊN</span><h3>Thông tin sức khỏe</h3></div><button className="icon-button" title="Xem hồ sơ" aria-label="Xem hồ sơ" onClick={onOpenProfile}><Icon name="arrow" size={17} /></button></div>
    <div className="profile-mini"><img src={familyAvatar(family.id)} alt="" /><div><strong>{family.member.name}</strong><span>{family.member.age} tuổi · {family.member.gender}</span></div></div>
    <div className="member-card-line"><span>Tiền sử sức khỏe</span><strong>{family.member.conditions[0] ?? "Chưa ghi nhận"}</strong></div>
    <div className="member-card-line"><span>Người liên hệ khẩn cấp</span><strong>{family.member.emergencyContact.split(" · ")[0]}</strong></div>
    <div className={`attention-summary ${alertCount ? "has-alerts" : ""}`}><span className="attention-icon"><Icon name={alertCount ? "bell" : "shield"} size={17} /></span><span><strong>{alertCount ? `${alertCount} cảnh báo cần xem` : "Chưa có cảnh báo mới"}</strong><small>{alertCount ? "Vui lòng kiểm tra trung tâm cảnh báo" : "Các chỉ số đang được theo dõi"}</small></span></div>
  </section>;
}

function statusForMetric(key: string, value: number): VitalStatus {
  if (key === "bp") return value >= 180 ? "critical" : value >= 140 ? "warning" : "normal";
  if (key === "spo2") return value < 90 ? "critical" : value < 92 ? "warning" : "normal";
  if (key === "heart") return value > 120 || value < 40 ? "critical" : value > 100 || value < 50 ? "warning" : "normal";
  if (key === "temperature") return value >= 39 || value < 35 ? "critical" : value >= 37.5 || value < 36 ? "warning" : "normal";
  if (key === "respiration") return value > 30 || value < 8 ? "critical" : value > 22 || value < 12 ? "warning" : "normal";
  return "normal";
}

function useLiveVitals(family: Family): Family["vitals"] {
  const [tick, setTick] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(() => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

  useEffect(() => {
    setTick(0);
    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
      setUpdatedAt(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 2200);
    return () => window.clearInterval(timer);
  }, [family.id]);

  const familyPhase = Number(family.id.slice(-2)) * 0.53;
  const drift = (sensorPhase: number) => (Math.sin(tick * 0.78 + familyPhase + sensorPhase) - Math.sin(familyPhase + sensorPhase)) / 2;
  const vary = (value: number, range: number, sensorPhase: number) => Math.round(value + drift(sensorPhase) * range);
  const temperature = Math.round((family.vitals.temperature + drift(1.8) * 0.1) * 10) / 10;

  return {
    ...family.vitals,
    systolic: vary(family.vitals.systolic, 2, 0.1),
    diastolic: vary(family.vitals.diastolic, 1, 0.4),
    heartRate: vary(family.vitals.heartRate, 2, 0.8),
    spo2: vary(family.vitals.spo2, 1, 1.3),
    temperature,
    respiratoryRate: vary(family.vitals.respiratoryRate, 1, 2.3),
    updatedAt,
  };
}

function VitalCard({ icon, label, value, unit, status, note, special }: { icon: IconName; label: string; value: ReactNode; unit?: string; status: VitalStatus; note: string; special?: boolean }) {
  return <article className={`vital-card ${status} ${special ? "blood-pressure" : ""}`}><div className="vital-top"><span className={`vital-icon ${status}`}><Icon name={icon} size={18} /></span><span className={`metric-state ${status}`}><i />{status === "normal" ? "Ổn định" : status === "warning" ? "Theo dõi" : "Khẩn cấp"}</span></div><div className="vital-label">{label}</div><div className="vital-value">{value}{unit && <small>{unit}</small>}</div><div className="vital-note"><span>{note}</span><span>{status === "normal" ? "Trong ngưỡng" : "Cần kiểm tra"}</span></div></article>;
}

function Vitals({ family }: { family: Family }) {
  const { vitals } = family;
  const bpStatus: VitalStatus = vitals.systolic >= 180 || vitals.diastolic >= 120 ? "critical" : vitals.systolic >= 140 || vitals.diastolic >= 90 ? "warning" : "normal";
  const metrics: { icon: IconName; label: string; value: number; unit: string; key: string; note: string }[] = [
    { icon: "heart", label: "Nhịp tim", value: vitals.heartRate, unit: "nhịp/phút", key: "heart", note: "Ngưỡng theo dõi: 50–100" },
    { icon: "oxygen", label: "SpO₂", value: vitals.spo2, unit: "%", key: "spo2", note: "Mục tiêu: từ 92%" },
    { icon: "thermometer", label: "Nhiệt độ", value: vitals.temperature, unit: "°C", key: "temperature", note: "Khoảng theo dõi: 36–37,5°C" },
    { icon: "lungs", label: "Nhịp thở", value: vitals.respiratoryRate, unit: "lần/phút", key: "respiration", note: "Khoảng theo dõi: 12–22" },
  ];
  return <section className="vitals-section"><SectionHeading eyebrow={`CẬP NHẬT LÚC ${vitals.updatedAt}`} title="Chỉ số sinh tồn" aside={<span className="update-time"><Icon name="clock" size={15} /> Hôm nay</span>} />
    <div className="vital-grid"><VitalCard special icon="activity" label="Huyết áp" value={<>{vitals.systolic}<em>/</em>{vitals.diastolic}</>} unit="mmHg" status={bpStatus} note="Ngưỡng theo dõi: 140/90" />{metrics.map((metric) => <VitalCard key={metric.key} icon={metric.icon} label={metric.label} value={metric.key === "temperature" ? metric.value.toFixed(1).replace(".", ",") : metric.value} unit={metric.unit} status={statusForMetric(metric.key, metric.value)} note={metric.note} />)}</div>
  </section>;
}

function Monitoring({ family, resolutionOverrides, onProfile, onAlerts }: { family: Family; resolutionOverrides: Record<string, "open" | "resolved">; onProfile: () => void; onAlerts: () => void }) {
  const liveVitals = useLiveVitals(family);
  const monitoredFamily = { ...family, vitals: liveVitals };
  const status = healthStatus(monitoredFamily, resolutionOverrides);
  const openAlerts = family.alerts.filter((alert) => currentAlertStatus(alert, resolutionOverrides) === "open").length;
  return <div className="page-stack fade-in">
    <section className={`welcome-banner ${status}`}><div><span className="eyebrow">HÔM NAY CÙNG GIA ĐÌNH</span><h1>Sức khỏe người thân, trong tầm mắt.</h1><p>{openAlerts ? `Có ${openAlerts} thông tin cần gia đình lưu ý hôm nay.` : "Chưa có cảnh báo mới. Các chỉ số gần nhất đang ổn định."}</p></div><div className="welcome-status"><StatusPill status={status} /><small><Icon name="clock" size={14} /> Cập nhật lúc {liveVitals.updatedAt}</small></div><div className="banner-ornament"><Icon name="heart" size={92} /></div></section>
    <MemberSummary family={monitoredFamily} resolutionOverrides={resolutionOverrides} />
    <div className="monitoring-layout">
      <section className="camera-section"><SectionHeading eyebrow="KHÔNG GIAN SỐNG" title="Camera giám sát" /><div className="camera-grid"><CameraCard title="Camera hồng ngoại" subtitle="IMVIA-NIR · hồng ngoại gần" src={`/media/imvia/${family.cameraSubject}/video.mp4`} mode="infrared" /><CameraCard title="Camera nhiệt" subtitle="Ảnh NIR hiển thị false-color" src={`/media/imvia-thermal-fake/${family.cameraSubject}/video.mp4`} mode="thermal" /></div></section>
      <MemberCard family={family} resolutionOverrides={resolutionOverrides} onOpenProfile={onProfile} />
    </div>
    <Vitals family={monitoredFamily} />
    {openAlerts > 0 && <button className="dashboard-alert-link" onClick={onAlerts}><span className="alert-link-icon"><Icon name="alert" size={18} /></span><span><strong>Trung tâm cảnh báo</strong><small>Xem chi tiết và cập nhật trạng thái xử lý</small></span><span className="alert-link-count">{openAlerts} mới <Icon name="arrow" size={16} /></span></button>}
  </div>;
}

function AlertCard({ alert, status, onToggle }: { alert: FamilyAlert; status: "open" | "resolved"; onToggle: () => void }) {
  const groupLabel = alert.group === "vital" ? "CHỈ SỐ SINH TỒN" : "HOẠT ĐỘNG";
  return <article className={`alert-card ${alert.severity} ${status === "resolved" ? "resolved" : ""}`}>
    <div className="alert-card-icon"><Icon name={alert.group === "vital" ? "activity" : "alert"} size={20} /></div>
    <div className="alert-card-content"><div className="alert-card-meta"><span>{groupLabel}</span><span className={`severity ${alert.severity}`}>{alert.severity === "critical" ? "Khẩn cấp" : alert.severity === "warning" ? "Cần chú ý" : "Đã ghi nhận"}</span></div><h3>{alert.title}</h3><p className="alert-value">{alert.value}</p><p className="alert-condition">{alert.condition}</p>{alert.camera && <p className="alert-camera"><Icon name="camera" size={14} /> {alert.camera}</p>}
      {alert.video && <div className="alert-video"><video src={alert.video} controls muted playsInline preload="metadata" /><span><Icon name="activity" size={14} /> Video sự kiện</span></div>}
      <div className="alert-card-foot"><span><Icon name="clock" size={14} /> {alert.occurredAt}</span><span className={`processing-state ${status}`}><i />{status === "open" ? "Chưa xử lý" : "Đã xử lý"}</span></div>
    </div>
    <button className={`resolve-button ${status === "resolved" ? "done" : ""}`} onClick={onToggle}>{status === "resolved" ? <><Icon name="check" size={15} /> Đã xử lý</> : "Đánh dấu đã xử lý"}</button>
  </article>;
}

function AlertsPage({ family, resolutionOverrides, onToggle }: { family: Family; resolutionOverrides: Record<string, "open" | "resolved">; onToggle: (id: string, current: "open" | "resolved") => void }) {
  const [group, setGroup] = useState<"all" | "vital" | "activity">("all");
  const [severity, setSeverity] = useState("all");
  const [processing, setProcessing] = useState("all");
  const alertStatus = (alert: FamilyAlert) => resolutionOverrides[alert.id] ?? alert.initialStatus;
  const filtered = useMemo(() => family.alerts.filter((alert) => (group === "all" || alert.group === group) && (severity === "all" || alert.severity === severity) && (processing === "all" || alertStatus(alert) === processing)), [family, group, severity, processing, resolutionOverrides]);
  const openCount = family.alerts.filter((alert) => alertStatus(alert) === "open").length;
  return <div className="page-stack fade-in alerts-page">
    <section className="page-intro"><div><span className="eyebrow">THEO DÕI AN TOÀN</span><h1>Trung tâm cảnh báo</h1><p>Những thay đổi sức khỏe và hoạt động cần gia đình lưu ý.</p></div><div className="alerts-summary"><span className="summary-alert-icon"><Icon name="bell" size={20} /></span><span><strong>{openCount}</strong><small>chưa xử lý</small></span></div></section>
    <section className="alert-overview surface"><div><div className="overview-icon"><Icon name="shield" size={20} /></div><span><strong>{openCount ? `${openCount} cảnh báo đang chờ gia đình` : "Gia đình đang an toàn"}</strong><small>{openCount ? "Hãy xem từng cảnh báo và cập nhật khi đã kiểm tra." : "Hiện không có cảnh báo cần xử lý."}</small></span></div><span className="overview-family">{family.name}</span></section>
    <section className="alerts-controls"><div className="filter-tabs" role="tablist" aria-label="Loại cảnh báo">{[{ id: "all", label: "Tất cả" }, { id: "vital", label: "Chỉ số sinh tồn" }, { id: "activity", label: "Hoạt động" }].map((tab) => <button key={tab.id} role="tab" aria-selected={group === tab.id} className={group === tab.id ? "active" : ""} onClick={() => setGroup(tab.id as typeof group)}>{tab.label}<small>{tab.id === "all" ? family.alerts.length : family.alerts.filter((alert) => alert.group === tab.id).length}</small></button>)}</div>
      <div className="filter-selects"><label><Icon name="filter" size={15} /><span className="sr-only">Mức độ nghiêm trọng</span><select value={severity} onChange={(event) => setSeverity(event.target.value)}><option value="all">Mọi mức độ</option><option value="critical">Khẩn cấp</option><option value="warning">Cần chú ý</option><option value="info">Đã ghi nhận</option></select></label><label><Icon name="check" size={15} /><span className="sr-only">Trạng thái xử lý</span><select value={processing} onChange={(event) => setProcessing(event.target.value)}><option value="all">Mọi trạng thái</option><option value="open">Chưa xử lý</option><option value="resolved">Đã xử lý</option></select></label></div>
    </section>
    {filtered.length ? <section className="alert-list">{filtered.map((alert) => <AlertCard key={alert.id} alert={alert} status={alertStatus(alert)} onToggle={() => onToggle(alert.id, alertStatus(alert))} />)}</section> : <section className="empty-state surface"><span><Icon name="shield" size={27} /></span><h2>{family.alerts.length ? "Không có cảnh báo phù hợp" : "Chưa có cảnh báo mới"}</h2><p>{family.alerts.length ? "Thử thay đổi bộ lọc để xem các sự kiện khác." : "Nếu có thay đổi về sức khỏe hoặc hoạt động, thông tin sẽ xuất hiện ở đây."}</p></section>}
  </div>;
}

function ProfilePage({ family, resolutionOverrides }: { family: Family; resolutionOverrides: Record<string, "open" | "resolved"> }) {
  return <div className="page-stack fade-in profile-page">
    <section className="page-intro"><div><span className="eyebrow">THÔNG TIN SỨC KHỎE CƠ BẢN</span><h1>Thông tin gia đình</h1><p>Hồ sơ người thân đang được theo dõi trong {family.name}.</p></div></section>
    <section className="profile-hero surface"><img src={familyAvatar(family.id)} alt={`Ảnh đại diện ${family.member.name}`} /><div className="profile-hero-name"><span className="eyebrow">THÀNH VIÊN CHÍNH</span><h2>{family.member.name}</h2><p>{family.member.gender} · {family.member.age} tuổi</p></div><StatusPill status={healthStatus(family, resolutionOverrides)} /></section>
    <div className="profile-grid"><section className="profile-section surface"><SectionHeading eyebrow="NHÂN KHẨU HỌC" title="Thông tin cá nhân" /><div className="profile-fields"><div><span>Ngày sinh</span><strong>{family.member.birthDate}</strong></div><div><span>Tuổi</span><strong>{family.member.age} tuổi</strong></div><div><span>Giới tính</span><strong>{family.member.gender}</strong></div><div><span>Nhóm máu</span><strong>{family.member.bloodType}</strong></div><div><span>Chiều cao</span><strong>{family.member.height} cm</strong></div><div><span>Cân nặng</span><strong>{family.member.weight} kg</strong></div></div></section>
      <section className="profile-section surface"><SectionHeading eyebrow="SỨC KHỎE CƠ BẢN" title="Tiền sử & chăm sóc" /><div className="profile-info-block"><span>Tiền sử sức khỏe</span><div className="tag-list">{family.member.conditions.length ? family.member.conditions.map((condition) => <span key={condition}>{condition}</span>) : <em>Chưa ghi nhận</em>}</div></div><div className="profile-info-block"><span>Thuốc đang dùng</span><ul>{family.member.medications.map((medication) => <li key={medication}>{medication}</li>)}</ul></div><div className="profile-info-block"><span>Ghi chú gia đình</span><p>{family.member.note}</p></div></section>
      <section className="profile-section surface contact-section"><div className="contact-icon"><Icon name="person" size={19} /></div><div><span className="eyebrow">LIÊN HỆ KHI CẦN</span><h3>Người liên hệ khẩn cấp</h3><p>{family.member.emergencyContact}</p></div></section>
    </div>
  </div>;
}

function SettingsPage({ family, username, onLogout }: { family: Family; username: string; onLogout: () => void }) {
  return <div className="page-stack fade-in settings-page">
    <section className="page-intro"><div><span className="eyebrow">TÀI KHOẢN & QUYỀN RIÊNG TƯ</span><h1>Cài đặt</h1><p>Quản lý thông tin tài khoản gia đình.</p></div></section>
    <section className="settings-card surface"><div className="settings-card-head"><span className="settings-icon"><Icon name="person" size={20} /></span><div><span className="eyebrow">TÀI KHOẢN HIỆN TẠI</span><h2>Quản lý gia đình</h2></div></div><div className="settings-row"><span>Tên đăng nhập</span><strong>{username}</strong></div><div className="settings-row"><span>Phạm vi dữ liệu</span><strong>{family.name}</strong></div><div className="settings-row"><span>Thành viên theo dõi</span><strong>{family.member.name}</strong></div><div className="settings-row"><span>Phiên đăng nhập</span><strong className="session-status"><i /> Đang hoạt động</strong></div><button className="logout-button" onClick={onLogout}><Icon name="logout" size={17} /> Đăng xuất khỏi tài khoản</button></section>
  </div>;
}

export default function App() {
  const [session, setSession] = useState<{ username: string; familyId: string } | null>(null);
  const [page, setPage] = useState<Page>("monitoring");
  const [resolutionOverrides, setResolutionOverrides] = useState<Record<string, "open" | "resolved">>({});
  const [canGoBack, setCanGoBack] = useState(false);
  const pageHistory = useRef<Page[]>([]);
  const family = session ? getFamilyById(session.familyId) : undefined;

  const navigate = useCallback((nextPage: Page) => {
    if (page === nextPage) return;
    pageHistory.current.push(page);
    setCanGoBack(true);
    setPage(nextPage);
  }, [page]);

  const goBack = useCallback(() => {
    const previousPage = pageHistory.current.pop();
    if (!previousPage) return;
    setPage(previousPage);
    setCanGoBack(pageHistory.current.length > 0);
  }, []);

  useEffect(() => {
    if (!session) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "ArrowLeft" && pageHistory.current.length > 0) {
        event.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [session, canGoBack, goBack]);

  const login = (username: string, password: string) => {
    const account = accounts.find((candidate) => candidate.username === username && candidate.password === password);
    if (!account) return "Tên đăng nhập hoặc mật khẩu chưa đúng.";
    pageHistory.current = [];
    setCanGoBack(false);
    setSession({ username: account.username, familyId: account.familyId });
    setPage("monitoring");
    return null;
  };
  const logout = () => { pageHistory.current = []; setCanGoBack(false); setSession(null); setPage("monitoring"); setResolutionOverrides({}); };
  const toggleAlert = (id: string, current: "open" | "resolved") => setResolutionOverrides((previous) => ({ ...previous, [id]: current === "open" ? "resolved" : "open" }));

  if (!session || !family) return <Login onLogin={login} />;
  return <AppShell family={family} page={page} resolutionOverrides={resolutionOverrides} canGoBack={canGoBack} onNavigate={navigate} onBack={goBack} onLogout={logout}>
    {page === "monitoring" && <Monitoring family={family} resolutionOverrides={resolutionOverrides} onProfile={() => setPage("profile")} onAlerts={() => setPage("alerts")} />}
    {page === "alerts" && <AlertsPage family={family} resolutionOverrides={resolutionOverrides} onToggle={toggleAlert} />}
    {page === "profile" && <ProfilePage family={family} resolutionOverrides={resolutionOverrides} />}
    {page === "settings" && <SettingsPage family={family} username={session.username} onLogout={logout} />}
  </AppShell>;
}
