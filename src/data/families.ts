export type VitalStatus = "normal" | "warning" | "critical";
export type AlertGroup = "vital" | "activity";
export type AlertSeverity = "critical" | "warning" | "info";

export type FamilyAlert = {
  id: string;
  group: AlertGroup;
  title: string;
  value: string;
  condition: string;
  occurredAt: string;
  severity: AlertSeverity;
  camera?: string;
  video?: string;
  initialStatus: "open" | "resolved";
};

export type Family = {
  id: string;
  name: string;
  cameraSubject: string;
  member: {
    name: string;
    gender: string;
    birthDate: string;
    age: number;
    height: number;
    weight: number;
    bloodType: string;
    conditions: string[];
    medications: string[];
    emergencyContact: string;
    note: string;
  };
  vitals: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    spo2: number;
    temperature: number;
    respiratoryRate: number;
    updatedAt: string;
  };
  alerts: FamilyAlert[];
};

export const accounts = [
  { username: "admin1", password: "123", familyId: "family-01" },
  { username: "admin2", password: "123", familyId: "family-02" },
  { username: "admin3", password: "123", familyId: "family-03" },
  { username: "admin4", password: "123", familyId: "family-04" },
  { username: "admin5", password: "123", familyId: "family-05" },
] as const;

export const families: Family[] = [
  {
    id: "family-01",
    name: "Family 01",
    cameraSubject: "02",
    member: {
      name: "Phạm Văn An",
      gender: "Nam",
      birthDate: "12/04/1957",
      age: 69,
      height: 165,
      weight: 68,
      bloodType: "O+",
      conditions: ["Thoái hóa khớp gối"],
      medications: ["Vitamin D3 · buổi sáng"],
      emergencyContact: "Phạm Minh Tuấn · Con trai · 0903 100 201",
      note: "Duy trì theo dõi định kỳ tại nhà. Dữ liệu sinh tồn đang ổn định.",
    },
    vitals: { systolic: 126, diastolic: 78, heartRate: 74, spo2: 98, temperature: 36.6, respiratoryRate: 17, updatedAt: "09:42" },
    alerts: [],
  },
  {
    id: "family-02",
    name: "Family 02",
    cameraSubject: "01",
    member: {
      name: "Nguyễn Thị Bình",
      gender: "Nữ",
      birthDate: "08/11/1951",
      age: 75,
      height: 158,
      weight: 56,
      bloodType: "A+",
      conditions: ["Tăng huyết áp", "Rối loạn mỡ máu"],
      medications: ["Amlodipine 5 mg · buổi sáng", "Atorvastatin 10 mg · buổi tối"],
      emergencyContact: "Nguyễn Hoàng Long · Con trai · 0903 100 202",
      note: "Huyết áp hiện cao hơn ngưỡng theo dõi. Nên nghỉ ngơi và đo lại theo hướng dẫn của nhân viên y tế.",
    },
    vitals: { systolic: 151, diastolic: 94, heartRate: 82, spo2: 97, temperature: 36.7, respiratoryRate: 18, updatedAt: "09:40" },
    alerts: [
      { id: "f2-bp-high", group: "vital", title: "Huyết áp cao", value: "151/94 mmHg", condition: "Tâm thu ≥ 140 hoặc tâm trương ≥ 90 mmHg", occurredAt: "09:40", severity: "warning", initialStatus: "open" },
      { id: "f2-bp-low-history", group: "vital", title: "Huyết áp thấp · đã xử lý", value: "92/58 mmHg", condition: "Tâm thu < 90 hoặc tâm trương < 60 mmHg", occurredAt: "Hôm qua, 18:12", severity: "info", initialStatus: "resolved" },
    ],
  },
  {
    id: "family-03",
    name: "Family 03",
    cameraSubject: "03",
    member: {
      name: "Trần Minh Châu",
      gender: "Nam",
      birthDate: "24/02/1948",
      age: 78,
      height: 170,
      weight: 72,
      bloodType: "B+",
      conditions: ["Đái tháo đường type 2"],
      medications: ["Metformin 500 mg · theo đơn"],
      emergencyContact: "Trần Thu Hà · Con gái · 0903 100 203",
      note: "Có sự kiện phát hiện té ngã trong phòng khách. Hãy kiểm tra tình trạng người thân.",
    },
    vitals: { systolic: 132, diastolic: 80, heartRate: 79, spo2: 97, temperature: 36.8, respiratoryRate: 18, updatedAt: "09:39" },
    alerts: [
      { id: "f3-fall", group: "activity", title: "Phát hiện sự kiện té ngã", value: "Phòng khách · Camera hồng ngoại", condition: "Phát hiện tư thế nằm bất thường", occurredAt: "09:36", severity: "critical", camera: "Camera hồng ngoại · Phòng khách", video: "/media/fall-recording.mp4", initialStatus: "open" },
    ],
  },
  {
    id: "family-04",
    name: "Family 04",
    cameraSubject: "05",
    member: {
      name: "Lê Thu Dung",
      gender: "Nữ",
      birthDate: "19/07/1960",
      age: 66,
      height: 160,
      weight: 61,
      bloodType: "AB+",
      conditions: ["Hen phế quản", "Rối loạn nhịp tim"],
      medications: ["Thuốc xịt duy trì · theo đơn", "Bisoprolol 2.5 mg · buổi sáng"],
      emergencyContact: "Lê Quốc Bảo · Chồng · 0903 100 204",
      note: "SpO₂ thấp, cần liên hệ người thân và theo dõi sát tình trạng.",
    },
    vitals: { systolic: 118, diastolic: 72, heartRate: 112, spo2: 89, temperature: 36.9, respiratoryRate: 24, updatedAt: "09:41" },
    alerts: [
      { id: "f4-spo2", group: "vital", title: "SpO₂ thấp", value: "89%", condition: "Dưới ngưỡng theo dõi 92%", occurredAt: "09:41", severity: "critical", initialStatus: "open" },
      { id: "f4-hr", group: "vital", title: "Nhịp tim cao", value: "112 nhịp/phút", condition: "Vượt ngưỡng theo dõi 100 nhịp/phút", occurredAt: "09:39", severity: "warning", initialStatus: "open" },
    ],
  },
  {
    id: "family-05",
    name: "Family 05",
    cameraSubject: "04",
    member: {
      name: "Hoàng Văn Em",
      gender: "Nam",
      birthDate: "02/09/1944",
      age: 82,
      height: 168,
      weight: 79,
      bloodType: "O-",
      conditions: ["Tăng huyết áp", "Bệnh mạch vành"],
      medications: ["Losartan 50 mg · buổi sáng", "Aspirin 81 mg · theo đơn"],
      emergencyContact: "Hoàng Minh Đức · Con trai · 0903 100 205",
      note: "Có cảnh báo huyết áp và sự kiện té ngã trong ngày. Ưu tiên kiểm tra trực tiếp người thân.",
    },
    vitals: { systolic: 146, diastolic: 92, heartRate: 98, spo2: 94, temperature: 37.1, respiratoryRate: 20, updatedAt: "09:38" },
    alerts: [
      { id: "f5-bp", group: "vital", title: "Huyết áp cao", value: "146/92 mmHg", condition: "Tâm thu ≥ 140 hoặc tâm trương ≥ 90 mmHg", occurredAt: "09:38", severity: "warning", initialStatus: "open" },
      { id: "f5-fall", group: "activity", title: "Phát hiện sự kiện té ngã", value: "Phòng ngủ · Camera nhiệt", condition: "Phát hiện tư thế nằm bất thường", occurredAt: "09:34", severity: "critical", camera: "Camera nhiệt · Phòng ngủ", initialStatus: "open" },
    ],
  },
];

export const getFamilyById = (id: string) => families.find((family) => family.id === id);
