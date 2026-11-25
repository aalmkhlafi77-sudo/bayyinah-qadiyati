import {useEffect, useMemo, useRef, useState} from 'react';
import {
  AlertTriangle,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Download,
  FileCheck2,
  FileDown,
  FilePlus2,
  FileText,
  Home,
  Hourglass,
  Laptop,
  Link as LinkIcon,
  LockKeyhole,
  Timer,
  Wrench,
  Calculator,
  Copy,
  Archive,
  FileArchive,
  Scissors,
  RotateCcw,
  Scale,
  WalletCards,
  ClipboardList,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UsersRound,
} from 'lucide-react';

type Page = 'login' | 'dashboard' | 'cases' | 'new' | 'details' | 'agencies' | 'sessions' | 'tasks' | 'monitoring' | 'tools' | 'settings' | 'reports';
type DraftMode = 'create' | 'edit';
type CalendarMode = 'gregorian' | 'hijri';
type CaseStatus =
  | 'جديدة'
  | 'قيد الدراسة'
  | 'منظورة'
  | 'مؤجلة'
  | 'بانتظار مستندات'
  | 'صدر حكم'
  | 'استئناف'
  | 'تنفيذ'
  | 'مغلقة';
type CaseCategory =
  | 'تجارية'
  | 'عمالية'
  | 'أحوال شخصية'
  | 'عقارية'
  | 'مالية'
  | 'تنفيذ'
  | 'جزائية'
  | 'إدارية'
  | 'تعويضات'
  | 'عقود'
  | 'إرث'
  | 'نزاعات شركات';
type CourtType =
  | 'المحكمة العامة'
  | 'محكمة الأحوال الشخصية'
  | 'المحكمة التجارية'
  | 'المحكمة العمالية'
  | 'المحكمة الجزائية'
  | 'محكمة التنفيذ'
  | 'محكمة الاستئناف'
  | 'المحكمة الإدارية';
type PartyRole =
  | 'مدعٍ'
  | 'مدعى عليه'
  | 'مستأنف'
  | 'مستأنف ضده'
  | 'طالب تنفيذ'
  | 'مطلوب تنفيذ ضده';
type HearingStatus = 'قادمة' | 'تمت' | 'مؤجلة' | 'ملغاة';
type AgencyStatus = 'سارية' | 'تنتهي قريبًا' | 'منتهية';
type TaskPriority = 'منخفضة' | 'متوسطة' | 'عالية' | 'عاجلة';
type TaskStatus = 'مفتوحة' | 'قيد التنفيذ' | 'مكتملة' | 'متأخرة';

type CaseParty = {
  id: string;
  name: string;
  identityNumber: string;
  mobile: string;
  role: PartyRole;
};

type Hearing = {
  id: string;
  date: string;
  time: string;
  court: string;
  chamber: string;
  description: string;
  decision: string;
  status: HearingStatus;
};

type AttachmentRecord = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  dataUrl: string;
};

type CaseTask = {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
};

type CaseRecord = {
  id: string;
  title: string;
  number: string;
  year: string;
  category: CaseCategory;
  court: CourtType;
  chamber: string;
  city: string;
  status: CaseStatus;
  registrationDate: string;
  responsibleLawyer: string;
  notes: string;
  amountClaimed: string;
  parties: CaseParty[];
  hearings: Hearing[];
  tasks: CaseTask[];
  attachments: AttachmentRecord[];
  reminders: string[];
  nextTask: string;
  createdAt: string;
};

type AgencyRecord = {
  id: string;
  principal: string;
  attorney: string;
  type: string;
  startDate: string;
  endDate: string;
  status: AgencyStatus;
  notes: string;
  attachments: AttachmentRecord[];
};

type DelegationRecord = {
  id: string;
  principal: string;
  delegate: string;
  powers: string;
  startDate: string;
  endDate: string;
  notes: string;
  attachments: AttachmentRecord[];
};

type NewCaseDraft = {
  title: string;
  number: string;
  year: string;
  category: CaseCategory;
  court: CourtType;
  chamber: string;
  city: string;
  status: CaseStatus;
  registrationDate: string;
  responsibleLawyer: string;
  notes: string;
  amountClaimed: string;
  parties: CaseParty[];
  hearingDate: string;
  hearingTime: string;
  hearingDescription: string;
  hearingDecision: string;
  hearingStatus: HearingStatus;
  attachments: AttachmentRecord[];
};

type AppSettings = {
  calendarMode: CalendarMode;
  remindersEnabled: boolean;
  desktopNotificationsEnabled: boolean;
  defaultReminderOffsets: string[];
  userName: string;
  organizationName: string;
  appName: string;
  appTagline: string;
  logoDataUrl: string;
};

type MonitorItemType =
  | 'عقود الإيجار'
  | 'مستحقات الإيجار'
  | 'الإقامات'
  | 'تأمين الموظفين'
  | 'تأمين السيارات'
  | 'استمارة السيارات'
  | 'كرت تشغيل السيارات'
  | 'تفويضات السيارات'
  | 'سجلات ورخص واشتراكات'
  | 'مهام عامة';
type MonitorPaymentStatus = 'غير مسدد' | 'مسدد' | 'متأخر' | '';
type MonitorRecurrence = 'مرة واحدة' | 'شهري' | 'ربع سنوي' | 'نصف سنوي' | 'سنوي';
type MonitorRenewal = {id: string; previousEndDate: string; newEndDate: string; notes: string; createdAt: string};
type MonitorItem = {
  id: string;
  type: MonitorItemType;
  name: string;
  referenceNumber: string;
  startDate: string;
  endDate: string;
  amount: string;
  notes: string;
  alertOffsets: number[];
  attachments: AttachmentRecord[];
  completed: boolean;
  paymentStatus: MonitorPaymentStatus;
  recurrence: MonitorRecurrence;
  priority: TaskPriority;
  identityNumber: string;
  policyNumber: string;
  vehiclePlate: string;
  delegatedBy: string;
  delegatedTo: string;
  renewals: MonitorRenewal[];
  createdAt: string;
};

const categories: CaseCategory[] = [
  'تجارية',
  'عمالية',
  'أحوال شخصية',
  'عقارية',
  'مالية',
  'تنفيذ',
  'جزائية',
  'إدارية',
  'تعويضات',
  'عقود',
  'إرث',
  'نزاعات شركات',
];

const caseStatuses: CaseStatus[] = [
  'جديدة',
  'قيد الدراسة',
  'منظورة',
  'مؤجلة',
  'بانتظار مستندات',
  'صدر حكم',
  'استئناف',
  'تنفيذ',
  'مغلقة',
];

const courts: CourtType[] = [
  'المحكمة العامة',
  'محكمة الأحوال الشخصية',
  'المحكمة التجارية',
  'المحكمة العمالية',
  'المحكمة الجزائية',
  'محكمة التنفيذ',
  'محكمة الاستئناف',
  'المحكمة الإدارية',
];

const partyRoles: PartyRole[] = [
  'مدعٍ',
  'مدعى عليه',
  'مستأنف',
  'مستأنف ضده',
  'طالب تنفيذ',
  'مطلوب تنفيذ ضده',
];

const hearingStatuses: HearingStatus[] = ['قادمة', 'تمت', 'مؤجلة', 'ملغاة'];
const agencyStatuses: AgencyStatus[] = ['سارية', 'تنتهي قريبًا', 'منتهية'];
const taskPriorities: TaskPriority[] = ['منخفضة', 'متوسطة', 'عالية', 'عاجلة'];
const taskStatuses: TaskStatus[] = ['مفتوحة', 'قيد التنفيذ', 'مكتملة', 'متأخرة'];
const monitorItemTypes: MonitorItemType[] = [
  'عقود الإيجار', 'مستحقات الإيجار', 'الإقامات', 'تأمين الموظفين', 'تأمين السيارات',
  'استمارة السيارات', 'كرت تشغيل السيارات', 'تفويضات السيارات', 'سجلات ورخص واشتراكات', 'مهام عامة',
];
const monitorAlertOffsets = [60, 30, 15, 7, 3, 1, 0];
const reminderOffsetOptions = ['30 يوم', '14 يوم', '7 أيام', '3 أيام', 'يوم واحد', 'ساعة'];
const emptySettings = (): AppSettings => ({
  calendarMode: 'gregorian',
  remindersEnabled: true,
  desktopNotificationsEnabled: false,
  defaultReminderOffsets: reminderOffsetOptions,
  userName: 'مستخدم النظام',
  organizationName: 'مكتب المحاماة',
  appName: 'بيّنة',
  appTagline: 'قضيتي بوضوح',
  logoDataUrl: '',
});
const emptyMonitorItem = (): MonitorItem => ({
  id: '',
  type: 'عقود الإيجار',
  name: '',
  referenceNumber: '',
  startDate: todayIsoDate(),
  endDate: todayIsoDate(),
  amount: '',
  notes: '',
  alertOffsets: [30, 7, 1, 0],
  attachments: [],
  completed: false,
  paymentStatus: '',
  recurrence: 'مرة واحدة',
  priority: 'متوسطة',
  identityNumber: '',
  policyNumber: '',
  vehiclePlate: '',
  delegatedBy: '',
  delegatedTo: '',
  renewals: [],
  createdAt: new Date().toISOString(),
});
let currentCalendarMode: CalendarMode = 'gregorian';
let currentUserName = 'ريان عبدالله المخلافي';
let currentOrganizationName = 'مكتب ريان عبدالله المخلافي';
let currentAppName = 'بيّنة';
let currentAppTagline = 'قضيتي بوضوح';
let currentLogoDataUrl = '';
let successAudioContext: AudioContext | null = null;

const emptyParty = (): CaseParty => ({
  id: `party-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: '',
  identityNumber: '',
  mobile: '',
  role: 'مدعٍ',
});

const emptyDraft = (): NewCaseDraft => ({
  title: '',
  number: '',
  year: '2026',
  category: 'تجارية',
  court: 'المحكمة العامة',
  chamber: '',
  city: 'الرياض',
  status: 'جديدة',
  registrationDate: todayIsoDate(),
  responsibleLawyer: 'ريان عبدالله المخلافي',
  notes: '',
  amountClaimed: '',
  parties: [emptyParty(), {...emptyParty(), role: 'مدعى عليه'}],
  hearingDate: todayIsoDate(),
  hearingTime: '10:00',
  hearingDescription: '',
  hearingDecision: '',
  hearingStatus: 'قادمة',
  attachments: [],
});

const emptyAgency = (): AgencyRecord => ({
  id: '',
  principal: '',
  attorney: '',
  type: '',
  startDate: todayIsoDate(),
  endDate: todayIsoDate(),
  status: 'سارية',
  notes: '',
  attachments: [],
});

const emptyDelegation = (): DelegationRecord => ({
  id: '',
  principal: '',
  delegate: '',
  powers: '',
  startDate: todayIsoDate(),
  endDate: todayIsoDate(),
  notes: '',
  attachments: [],
});

const seedCases: CaseRecord[] = [];









































































































const seedAgencies: AgencyRecord[] = [];



































const seedDelegations: DelegationRecord[] = [];












function usePersistentState<T>(key: string, initialValue: T) {
  const localStorageHadValue = useRef(typeof window !== 'undefined' && window.localStorage.getItem(key) !== null);
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    const saved = window.localStorage.getItem(key);
    if (!saved) return initialValue;
    try {
      return JSON.parse(saved) as T;
    } catch {
      return initialValue;
    }
  });
  const initialState = useRef(state);
  const desktopLoaded = useRef(!window.bayyinahDesktop);
  const [loaded, setLoaded] = useState(!window.bayyinahDesktop);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const desktop = window.bayyinahDesktop;
    if (!desktop) return;
    let cancelled = false;
    desktopLoaded.current = false;
    setLoaded(false);
    setLoadError(false);

    void desktop.storage.get<T>(key).then(async (stored) => {
      if (cancelled) return;
      if (stored === null) {
        await desktop.storage.set(key, initialState.current);
      } else {
        setState(stored);
      }
      desktopLoaded.current = true;
      setLoaded(true);
    }).catch(() => {
      if (cancelled) return;
      if (key === 'bayyinah-users' && localStorageHadValue.current) {
        void desktop.storage.set(key, initialState.current);
        desktopLoaded.current = true;
        setLoaded(true);
        return;
      }
      desktopLoaded.current = true;
      setLoadError(true);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    const desktop = window.bayyinahDesktop;
    if (desktop) {
      if (desktopLoaded.current) void desktop.storage.set(key, state);
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState, loaded, loadError] as const;
}

type StickyNoteColor = 'gold' | 'green' | 'blue' | 'pink' | 'purple';

type StickyNoteRecord = {
  id: string;
  title: string;
  body: string;
  color: StickyNoteColor;
  left: number;
  top: number;
  width: number;
  height: number;
  updatedAt: string;
};

const stickyNoteColors: {key: StickyNoteColor; label: string}[] = [
  {key: 'gold', label: 'ذهبي'},
  {key: 'green', label: 'أخضر'},
  {key: 'blue', label: 'أزرق'},
  {key: 'pink', label: 'وردي'},
  {key: 'purple', label: 'بنفسجي'},
];

function createStickyNote(index: number): StickyNoteRecord {
  const offset = (index % 5) * 28;
  return {
    id: `sticky-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: 'تذكير سريع',
    body: '',
    color: 'gold',
    left: 88 + offset,
    top: 118 + offset,
    width: 290,
    height: 220,
    updatedAt: new Date().toISOString(),
  };
}

function StickyNotesBoard({
  notes,
  setNotes,
}: {
  notes: StickyNoteRecord[];
  setNotes: (value: StickyNoteRecord[] | ((current: StickyNoteRecord[]) => StickyNoteRecord[])) => void;
}) {
  const [open, setOpen] = useState(notes.length > 0);

  function addNote() {
    const note = createStickyNote(notes.length);
    setNotes((current) => [note, ...current]);
    setOpen(true);
  }

  function updateNote(id: string, patch: Partial<StickyNoteRecord>) {
    setNotes((current) => current.map((note) => note.id === id ? {...note, ...patch, updatedAt: new Date().toISOString()} : note));
  }

  function deleteNote(id: string) {
    setNotes((current) => current.filter((note) => note.id !== id));
  }

  function startDrag(event: React.PointerEvent<HTMLElement>, note: StickyNoteRecord) {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = note.left;
    const startTop = note.top;
    const move = (moveEvent: PointerEvent) => {
      updateNote(note.id, {
        left: Math.max(12, startLeft + moveEvent.clientX - startX),
        top: Math.max(78, startTop + moveEvent.clientY - startY),
      });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', () => window.removeEventListener('pointermove', move), {once: true});
  }

  function saveSize(id: string, element: HTMLElement | null) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    updateNote(id, {width: Math.round(rect.width), height: Math.round(rect.height)});
  }

  return (
    <div className="sticky-notes-layer" dir="rtl">
      <div className="sticky-notes-launcher">
        <button onClick={() => setOpen((value) => !value)} type="button">
          <FileText />
          <span>الملصقات</span>
          {notes.length ? <b>{notes.length}</b> : null}
        </button>
        <button onClick={addNote} type="button">
          <Plus />
          <span>إضافة</span>
        </button>
      </div>
      {open ? notes.map((note) => (
        <article
          className={`sticky-note sticky-${note.color}`}
          key={note.id}
          onMouseUp={(event) => saveSize(note.id, event.currentTarget)}
          style={{left: note.left, top: note.top, width: note.width, height: note.height}}
        >
          <header onPointerDown={(event) => startDrag(event, note)}>
            <input
              aria-label="عنوان الملصق"
              onChange={(event) => updateNote(note.id, {title: event.target.value})}
              onPointerDown={(event) => event.stopPropagation()}
              value={note.title}
            />
            <button onClick={() => deleteNote(note.id)} title="حذف الملصق" type="button">
              <Trash2 />
            </button>
          </header>
          <textarea
            aria-label="نص الملصق"
            onChange={(event) => updateNote(note.id, {body: event.target.value})}
            placeholder="اكتب تذكيراً سريعاً..."
            value={note.body}
          />
          <footer>
            <div>
              {stickyNoteColors.map((color) => (
                <button
                  aria-label={`لون ${color.label}`}
                  className={note.color === color.key ? 'active' : ''}
                  key={color.key}
                  onClick={() => updateNote(note.id, {color: color.key})}
                  type="button"
                />
              ))}
            </div>
            <small>اسحب من العنوان · غيّر الحجم من الزاوية</small>
          </footer>
        </article>
      )) : null}
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return 'لم يحدد';
  return new Intl.DateTimeFormat(currentCalendarMode === 'hijri' ? 'ar-SA-u-ca-islamic-umalqura' : 'ar-SA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

function formatShortDate(date: string) {
  if (!date) return 'بدون موعد';
  return new Intl.DateTimeFormat(currentCalendarMode === 'hijri' ? 'ar-SA-u-ca-islamic-umalqura' : 'ar-SA', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

type HijriParts = {year: number; month: number; day: number};
const hijriFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
});
const hijriDateCache = new Map<string, string>();

function gregorianToHijri(date: string): HijriParts | null {
  if (!date) return null;
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  const parts = hijriFormatter.formatToParts(parsed);
  const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return {year: read('year'), month: read('month'), day: read('day')};
}

function hijriToGregorian(year: number, month: number, day: number) {
  const key = `${year}-${month}-${day}`;
  const cached = hijriDateCache.get(key);
  if (cached) return cached;
  const estimatedYear = Math.floor((year - 1) * 0.970224 + 622);
  const center = Date.UTC(estimatedYear, 0, 1) + Math.round(((month - 1) * 29.53 + day - 1) * 86400000);
  for (let offset = -390; offset <= 390; offset += 1) {
    const candidate = new Date(center + offset * 86400000);
    const parts = hijriFormatter.formatToParts(candidate);
    const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
    if (read('year') === year && read('month') === month && read('day') === day) {
      const result = candidate.toISOString().slice(0, 10);
      hijriDateCache.set(key, result);
      return result;
    }
  }
  return '';
}

function formatCurrency(amount: string) {
  if (!amount) return 'غير محدد';
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return amount;
  return new Intl.NumberFormat('ar-SA').format(numeric) + ' ر.س';
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function playSuccessSound() {
  try {
    successAudioContext ??= new AudioContext();
    const context = successAudioContext;
    if (context.state === 'suspended') void context.resume();
    const startedAt = context.currentTime;

    [659.25, 783.99, 987.77].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const noteStart = startedAt + index * 0.075;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.055, noteStart + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + 0.17);
    });
  } catch {
    // Some browsers block audio until the first direct user interaction.
  }
}

function playReminderSound() {
  try {
    successAudioContext ??= new AudioContext();
    const context = successAudioContext;
    if (context.state === 'suspended') void context.resume();
    const startedAt = context.currentTime;
    [880, 659.25, 880].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const noteStart = startedAt + index * 0.18;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.075, noteStart + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.22);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + 0.24);
    });
  } catch {
    // Audio remains optional when the browser blocks background playback.
  }
}

function getDaysUntil(date: string) {
  if (!date) return Number.POSITIVE_INFINITY;
  const target = new Date(date);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayIsoDate() {
  return toIsoDate(new Date());
}

function getCaseTone(status: CaseStatus) {
  if (status === 'مغلقة') return 'danger';
  if (status === 'بانتظار مستندات' || status === 'مؤجلة') return 'warn';
  if (status === 'جديدة' || status === 'قيد الدراسة') return 'info';
  return 'ok';
}

function getAgencyTone(status: AgencyStatus) {
  if (status === 'منتهية') return 'danger';
  if (status === 'تنتهي قريبًا') return 'warn';
  return 'ok';
}

function getExpiryStatus(endDate: string): AgencyStatus {
  const days = getDaysUntil(endDate);
  if (days < 0) return 'منتهية';
  if (days <= 7) return 'تنتهي قريبًا';
  return 'سارية';
}

function getMonitorStatus(item: MonitorItem) {
  if (item.completed || item.paymentStatus === 'مسدد') return 'مكتمل';
  const days = getDaysUntil(item.endDate);
  const isDueItem = item.type === 'مستحقات الإيجار' || item.type === 'مهام عامة';
  if (item.paymentStatus === 'متأخر' || days < 0) return isDueItem ? 'متأخر' : 'منتهي';
  if (days <= 7) return isDueItem ? 'مستحق قريبًا' : 'ينتهي قريبًا';
  return 'ساري';
}

function getMonitorTone(item: MonitorItem) {
  const status = getMonitorStatus(item);
  if (status === 'منتهي' || status === 'متأخر') return 'danger';
  if (status === 'ينتهي قريبًا' || status === 'مستحق قريبًا') return 'warn';
  if (status === 'مكتمل') return 'ok';
  return 'info';
}

function normalizeMonitorItem(record: Partial<MonitorItem>): MonitorItem {
  return {
    ...emptyMonitorItem(),
    ...record,
    id: record.id ?? `monitor-${Date.now()}`,
    type: (record.type as MonitorItemType) ?? 'عقود الإيجار',
    alertOffsets: Array.isArray(record.alertOffsets) ? record.alertOffsets : [30, 7, 1, 0],
    attachments: Array.isArray(record.attachments) ? record.attachments : [],
    renewals: Array.isArray(record.renewals) ? record.renewals : [],
  };
}

function getUpcomingHearing(record: CaseRecord) {
  return [...record.hearings]
    .filter((hearing) => hearing.status === 'قادمة' || hearing.status === 'مؤجلة')
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];
}

function getReminderDays(settings: AppSettings) {
  return settings.defaultReminderOffsets
    .map((item) => {
      const match = item.match(/\d+/);
      return match ? Number(match[0]) : item.includes('ساعة') ? 0 : null;
    })
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);
}

function getReminderMinutes(settings: AppSettings) {
  return settings.defaultReminderOffsets
    .map((item) => {
      if (item.includes('ساعة')) return 60;
      if (item.includes('يوم واحد')) return 1440;
      const match = item.match(/\d+/);
      return match ? Number(match[0]) * 1440 : null;
    })
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);
}

function getTaskTone(priority: TaskPriority) {
  if (priority === 'عاجلة') return 'danger';
  if (priority === 'عالية') return 'warn';
  if (priority === 'متوسطة') return 'info';
  return 'ok';
}

function getCaseSubtitle(record: CaseRecord) {
  return `${record.number} · ${record.court} · ${record.city}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadJson(data: unknown, filename: string) {
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}), filename);
}

function downloadText(text: string, filename: string) {
  downloadBlob(new Blob([text], {type: 'text/plain;charset=utf-8'}), filename);
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toCaseDraft(record: CaseRecord): NewCaseDraft {
  const firstHearing = record.hearings[0];
  return {
    title: record.title,
    number: record.number,
    year: record.year,
    category: record.category,
    court: record.court,
    chamber: record.chamber,
    city: record.city,
    status: record.status,
    registrationDate: record.registrationDate,
    responsibleLawyer: record.responsibleLawyer,
    notes: record.notes,
    amountClaimed: record.amountClaimed,
    parties: record.parties.length ? record.parties : [emptyParty()],
    hearingDate: firstHearing?.date ?? '',
    hearingTime: firstHearing?.time ?? '10:00',
    hearingDescription: firstHearing?.description ?? '',
    hearingDecision: firstHearing?.decision ?? '',
    hearingStatus: firstHearing?.status ?? 'قادمة',
    attachments: record.attachments,
  };
}

function normalizeCase(record: Partial<CaseRecord>): CaseRecord {
  return {
    id: record.id ?? `case-${Date.now()}`,
    title: record.title ?? 'قضية بدون عنوان',
    number: record.number ?? '',
    year: record.year ?? '2026',
    category: (record.category as CaseCategory) ?? 'تجارية',
    court: (record.court as CourtType) ?? 'المحكمة العامة',
    chamber: record.chamber ?? '',
    city: record.city ?? '',
    status: (record.status as CaseStatus) ?? 'جديدة',
    registrationDate: record.registrationDate ?? todayIsoDate(),
    responsibleLawyer: record.responsibleLawyer ?? '',
    notes: record.notes ?? '',
    amountClaimed: record.amountClaimed ?? '',
    parties: Array.isArray(record.parties) ? record.parties : [],
    hearings: Array.isArray(record.hearings) ? record.hearings : [],
    tasks: Array.isArray(record.tasks) ? record.tasks : [],
    attachments: Array.isArray(record.attachments) ? record.attachments : [],
    reminders: Array.isArray(record.reminders) ? record.reminders : [],
    nextTask: record.nextTask ?? 'مراجعة القضية',
    createdAt: record.createdAt ?? todayIsoDate(),
  };
}

function normalizeAgency(record: Partial<AgencyRecord>): AgencyRecord {
  return {
    id: record.id ?? '',
    principal: record.principal ?? '',
    attorney: record.attorney ?? '',
    type: record.type ?? '',
    startDate: record.startDate ?? todayIsoDate(),
    endDate: record.endDate ?? '',
    status: getExpiryStatus(record.endDate ?? ''),
    notes: record.notes ?? '',
    attachments: Array.isArray(record.attachments) ? record.attachments : [],
  };
}

function normalizeDelegation(record: Partial<DelegationRecord>): DelegationRecord {
  return {
    id: record.id ?? '',
    principal: record.principal ?? '',
    delegate: record.delegate ?? '',
    powers: record.powers ?? '',
    startDate: record.startDate ?? todayIsoDate(),
    endDate: record.endDate ?? '',
    notes: record.notes ?? '',
    attachments: Array.isArray(record.attachments) ? record.attachments : [],
  };
}

async function filesToAttachments(files: FileList | null) {
  if (!files?.length) return [];
  const list = Array.from(files);
  return Promise.all(
    list.map(
      (file) =>
        new Promise<AttachmentRecord>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: file.name,
              type: file.type || 'application/octet-stream',
              size: file.size,
              uploadedAt: new Date().toISOString(),
              dataUrl: String(reader.result),
            });
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    ),
  );
}

function Brand() {
  return (
    <div className="brand">
      <span>
        {currentLogoDataUrl ? <img alt={currentAppName} className="brand-logo" src={currentLogoDataUrl} /> : <FileCheck2 />}
      </span>
      <div>
        <b>بينة</b>
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  kind = 'primary',
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  kind?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button className={`btn ${kind}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

function Status({text, tone}: {text: string; tone: string}) {
  return (
    <span className={`status ${tone}`}>
      <i />
      {text}
    </span>
  );
}

function LicensePanel({
  status,
  onActivate,
  blocking = false,
}: {
  status: DesktopLicenseStatus;
  onActivate: (code: string) => Promise<DesktopLicenseStatus>;
  blocking?: boolean;
}) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  async function activate() {
    if (!code.trim()) return;
    const result = await onActivate(code.trim());
    setMessage(result.status === 'active' ? 'تم تفعيل الترخيص بنجاح.' : 'رمز التفعيل غير صالح لهذا الجهاز أو منتهي.');
    if (result.status === 'active') playSuccessSound();
  }

  const statusText = status.status === 'active'
    ? `مرخص لـ ${status.customer ?? 'العميل'} حتى ${status.expiresAt ?? 'غير محدد'}`
    : status.status === 'trial'
      ? `نسخة تجريبية حتى ${status.trialEndsAt ? formatDate(status.trialEndsAt.slice(0, 10)) : 'غير محدد'}`
      : status.status === 'loading' ? 'جارٍ فحص الترخيص...' : 'يلزم تفعيل البرنامج';

  return (
    <section className={blocking ? 'activation-screen' : 'panel settings-card full-width'}>
      <div className={blocking ? 'panel activation-card' : ''}>
        <Brand />
        <h2>ترخيص البرنامج</h2>
        <p>{statusText}</p>
        <div className="license-device">
          <small>رمز هذا الجهاز</small>
          <b>{status.deviceCode || 'غير متاح في نسخة المتصفح'}</b>
          {status.deviceCode ? <Btn kind="outline" onClick={() => void navigator.clipboard.writeText(status.deviceCode)}>نسخ الرمز</Btn> : null}
        </div>
        {status.status !== 'active' ? (
          <>
            <label className="license-code">رمز التفعيل<textarea onChange={(event) => setCode(event.target.value)} placeholder="ألصق رمز التفعيل هنا" value={code} /></label>
            <Btn onClick={() => void activate()}>تفعيل البرنامج</Btn>
          </>
        ) : null}
        {message ? <small className="date-preview">{message}</small> : null}
      </div>
    </section>
  );
}

type UserAccount = {
  id: string;
  name: string;
  identifier: string;
  passwordHash: string;
  role: 'admin' | 'user';
  permissions?: Page[];
  createdAt: string;
};

const permissionOptions: {page: Page; label: string}[] = [
  {page: 'dashboard', label: 'الرئيسية'}, {page: 'cases', label: 'القضايا'},
  {page: 'sessions', label: 'التقويم الشامل والجلسات'}, {page: 'tasks', label: 'المهام'},
  {page: 'agencies', label: 'الوكالات والتفويضات'}, {page: 'monitoring', label: 'الاستحقاقات'},
  {page: 'reports', label: 'التقارير'}, {page: 'tools', label: 'الأدوات المساعدة'}, {page: 'settings', label: 'الإعدادات'},
];
const allUserPermissions = permissionOptions.map((item) => item.page);

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(`bayyinah-local-v1:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function AuthShowcase() {
  const services = [
    {title: 'القضايا والمحاكم', text: 'إدارة القضايا والجلسات والتنبيهات والتقارير', icon: <BriefcaseBusiness />},
    {title: 'التقويم التفاعلي', text: 'جدولة المواعيد والتنبيهات بوضوح', icon: <CalendarDays />},
    {title: 'المهام القضائية', text: 'متابعة المهام والمراجعات والتكاليف', icon: <ClipboardList />},
    {title: 'الوكالات والتفويضات', text: 'إدارة الصلاحيات والتنبيهات', icon: <UsersRound />},
    {title: 'الخدمات والمتابعة', text: 'متابعة الانتهاءات والاستحقاقات الدورية', icon: <Hourglass />},
    {title: 'الأدوات المالية', text: 'ضريبة القيمة المضافة والرواتب وغيرها', icon: <Calculator />},
  ];
  return (
    <section className="auth-showcase">
      <Brand />
      <div className="auth-justice-art">
        <Scale />
      </div>
      <h3>خدمات بيّنة الشاملة</h3>
      <div className="auth-service-grid">
        {services.map((service) => (
          <article key={service.title}>
            {service.icon}
            <div>
              <b>{service.title}</b>
              <small>{service.text}</small>
            </div>
          </article>
        ))}
      </div>
      <div className="auth-safe-note">
        <ShieldCheck />
        <span>نظام آمن · بياناتك محفوظة محلياً · خصوصيتك أولويتنا</span>
      </div>
    </section>
  );
}

function AuthInfoPanel() {
  const reasons = [
    {text: 'إدارة متكاملة لأعمالك القانونية والإدارية', icon: <Wrench />},
    {text: 'تنبيهات ذكية لضمان عدم تفويت أي موعد', icon: <Bell />},
    {text: 'تقارير دقيقة تدعم اتخاذ القرار', icon: <FileText />},
    {text: 'واجهة عربية واضحة وسريعة الاستخدام', icon: <Sparkles />},
    {text: 'بياناتك في أمان وسرية تامة', icon: <ShieldCheck />},
  ];
  return (
    <aside className="auth-info-panel">
      <section>
        <h3>لماذا بيّنة؟</h3>
        {reasons.map((reason) => (
          <p key={reason.text}>
            {reason.icon}
            <span>{reason.text}</span>
          </p>
        ))}
      </section>
      <section className="auth-smart-tools">
        <ShieldCheck />
        <div>
          <h3>أدوات ذكية لإدارة أعمالك</h3>
          <small>روابط مهمة، ملاحظات مفاتيح، وتقارير قيمة مضافة ضمن بيئة واحدة.</small>
        </div>
      </section>
      <section className="auth-quote">
        <Sparkles />
        <p>النجاح في عملك القانوني يبدأ من تنظيم دقيق وإدارة ذكية.</p>
      </section>
    </aside>
  );
}

function Register({
  onRegister,
  onBackToLogin,
}: {
  onRegister: (name: string, identifier: string, password: string) => Promise<string>;
  onBackToLogin?: () => void;
}) {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  async function submit() {
    if (!name.trim() || !identifier.trim()) return setMessage('يرجى إدخال الاسم والبريد الإلكتروني أو رقم الجوال.');
    if (password.length < 6) return setMessage('يجب ألا تقل كلمة المرور عن 6 أحرف.');
    if (password !== confirmPassword) return setMessage('كلمتا المرور غير متطابقتين.');
    setMessage(await onRegister(name, identifier, password));
  }
  return (
    <main className="login">
      <AuthShowcase />
      <section className="loginbox panel auth-card">
        <h2>تسجيل مستخدم جديد</h2>
        <p>هذا هو الحساب الرئيسي لإدارة البرنامج على هذا الجهاز.</p>
        <label>الاسم الكامل<input autoComplete="name" onChange={(event) => setName(event.target.value)} value={name} /></label>
        <label>البريد الإلكتروني أو رقم الجوال<input autoComplete="username" onChange={(event) => setIdentifier(event.target.value)} value={identifier} /></label>
        <label>كلمة المرور<input autoComplete="new-password" onChange={(event) => setPassword(event.target.value)} type="password" value={password} /></label>
        <label>تأكيد كلمة المرور<input autoComplete="new-password" onChange={(event) => setConfirmPassword(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void submit(); }} type="password" value={confirmPassword} /></label>
        {message ? <small className="hint">{message}</small> : null}
        <Btn onClick={() => void submit()}>إنشاء الحساب والدخول</Btn>
        {onBackToLogin ? <Btn kind="outline" onClick={onBackToLogin}>العودة لتسجيل الدخول</Btn> : null}
        <div className="secure"><ShieldCheck /> كلمة المرور لا تُحفظ بصورتها الأصلية.</div>
      </section>
      <AuthInfoPanel />
      <footer className="login-copyright">
        جميع حقوق الملكية الفكرية محفوظة للأستاذ عبدالله المخلافي © {new Date().getFullYear()}
      </footer>
    </main>
  );
}

function Login({
  onLogin,
  onCreateAccount,
}: {
  onLogin: (identifier: string, password: string) => Promise<string>;
  onCreateAccount: () => void;
}) {
  const [message, setMessage] = useState('');
  async function go() {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('.loginbox input'));
    const identifier = inputs.find((input) => input.type !== 'password' && input.type !== 'checkbox')?.value ?? '';
    const password = inputs.find((input) => input.type === 'password')?.value ?? '';
    setMessage(await onLogin(identifier, password));
  }
  return (
    <main className="login">
      <AuthShowcase />
      <section className="loginbox panel auth-card">
        <h2>مرحباً بك في بيّنة</h2>
        <p>{currentOrganizationName} يدير قضاياه بوضوح في مكان واحد</p>
        <label>
          البريد الإلكتروني أو رقم الجوال
          <input placeholder="name@example.com" />
        </label>
        <label>
          كلمة المرور
          <input type="password" placeholder="••••••••" />
        </label>
        <div className="remember">
          <label>
            <input type="checkbox" /> تذكرني
          </label>
          <button type="button">نسيت كلمة المرور؟</button>
        </div>
        {message ? <small className="hint">{message}</small> : null}
        <Btn onClick={() => void go()}>تسجيل الدخول</Btn>
        <div className="or">أو</div>
        <Btn kind="outline" onClick={onCreateAccount}>إنشاء حساب</Btn>
        <button className="local" onClick={go} type="button">
          <Laptop />
          <span>
            <b>الدخول المحلي دون مزامنة</b>
            <small>مناسب للنسخة الحالية وحفظ القضايا والمستندات محليًا</small>
          </span>
        </button>
        <small className="hint">سنضيف لاحقًا قاعدة بيانات أقوى ونسخًا احتياطيًا واستعادة كاملة.</small>
      </section>
      <AuthInfoPanel />
      <footer className="login-copyright">
        جميع حقوق الملكية الفكرية محفوظة للأستاذ عبدالله المخلافي © {new Date().getFullYear()}
      </footer>
    </main>
  );
}

function Shell({
  page,
  setPage,
  onNewCase,
  cases,
  agencies,
  monitorItems,
  delegations,
  openCase,
  settings,
  allowedPages,
  onLogout,
  children,
}: {
  page: Page;
  setPage: (page: Page) => void;
  onNewCase: () => void;
  cases: CaseRecord[];
  agencies: AgencyRecord[];
  monitorItems: MonitorItem[];
  delegations: DelegationRecord[];
  openCase: (id: string) => void;
  settings: AppSettings;
  allowedPages: Page[];
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const [small, setSmall] = useState(false);
  const [headerQuery, setHeaderQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const items: [Page, string, React.ReactNode][] = ([
    ['dashboard', 'الرئيسية', <Home />],
    ['cases', 'القضايا', <BriefcaseBusiness />],
    ['sessions', 'التقويم الشامل والجلسات', <CalendarDays />],
    ['tasks', 'المهام', <Bell />],
    ['agencies', 'الوكالات والتفويضات', <UsersRound />],
    ['monitoring', 'الانتهاءات والاستحقاقات', <Hourglass />],
    ['reports', 'التقارير', <FileDown />],
    ['tools', 'الأدوات المساعدة', <Wrench />],
    ['settings', 'الإعدادات', <FileText />],
  ] as [Page, string, React.ReactNode][]).filter(([itemPage]) => allowedPages.includes(itemPage));

  const normalizedQuery = headerQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? [
        ...cases
          .filter((record) =>
            [record.title, record.number, record.court, record.city, record.responsibleLawyer, ...record.parties.map((party) => party.name)]
              .join(' ')
              .toLowerCase()
              .includes(normalizedQuery),
          )
          .map((record) => ({
            key: `case-${record.id}`,
            label: record.title,
            meta: `قضية ${record.number} · ${record.court}`,
            action: () => openCase(record.id),
          })),
        ...agencies
          .filter((record) =>
            [record.id, record.principal, record.attorney, record.type].join(' ').toLowerCase().includes(normalizedQuery),
          )
          .map((record) => ({
            key: `agency-${record.id}`,
            label: `وكالة ${record.id}`,
            meta: `${record.principal} · ${record.attorney}`,
            action: () => setPage('agencies'),
          })),
        ...delegations
          .filter((record) =>
            [record.id, record.principal, record.delegate, record.powers].join(' ').toLowerCase().includes(normalizedQuery),
          )
          .map((record) => ({
            key: `delegation-${record.id}`,
            label: `تفويض ${record.id}`,
            meta: `${record.principal} · ${record.delegate}`,
            action: () => setPage('agencies'),
          })),
        ...monitorItems
          .filter((record) =>
            [record.type, record.name, record.referenceNumber, record.identityNumber, record.policyNumber, record.vehiclePlate]
              .join(' ')
              .toLowerCase()
              .includes(normalizedQuery),
          )
          .map((record) => ({
            key: `monitor-${record.id}`,
            label: record.name,
            meta: `${record.type} · ${record.referenceNumber || record.vehiclePlate || 'بدون رقم'}`,
            action: () => setPage('monitoring'),
          })),
      ].slice(0, 8)
    : [];

  const notifications = settings.remindersEnabled
    ? [
        ...cases.flatMap((record) =>
          record.hearings
            .map((hearing) => ({hearing, days: getDaysUntil(hearing.date)}))
            .filter(({hearing, days}) => hearing.status === 'قادمة' && days >= 0 && days <= 30)
            .map(({hearing, days}) => ({
              key: `hearing-${record.id}-${hearing.id}`,
              days,
              tone: days <= 1 ? 'danger' : days <= 7 ? 'warn' : 'info',
              text: days === 0 ? `جلسة اليوم: ${record.title}` : `جلسة ${record.title} بعد ${days} يوم`,
              action: () => openCase(record.id),
            })),
        ),
        ...cases.flatMap((record) =>
          record.tasks
            .map((task) => ({task, days: getDaysUntil(task.dueDate)}))
            .filter(({task, days}) => task.status !== 'مكتملة' && days <= 7)
            .map(({task, days}) => ({
              key: `task-${record.id}-${task.id}`,
              days,
              tone: days < 0 || task.priority === 'عاجلة' ? 'danger' : 'warn',
              text: days < 0 ? `مهمة متأخرة: ${task.title}` : `مهمة قريبة: ${task.title}`,
              action: () => openCase(record.id),
            })),
        ),
        ...agencies
          .map((record) => ({record, days: getDaysUntil(record.endDate)}))
          .filter(({days}) => days <= 60)
          .map(({record, days}) => ({
            key: `agency-expiry-${record.id}`,
            days,
            tone: days < 0 ? 'danger' : days <= 7 ? 'warn' : 'info',
            text: days < 0 ? `وكالة منتهية: ${record.id}` : `وكالة ${record.id} تنتهي خلال ${days} يوم`,
            action: () => setPage('agencies'),
          })),
        ...delegations
          .map((record) => ({record, days: getDaysUntil(record.endDate)}))
          .filter(({days}) => days <= 60)
          .map(({record, days}) => ({
            key: `delegation-expiry-${record.id}`,
            days,
            tone: days < 0 ? 'danger' : days <= 7 ? 'warn' : 'info',
            text: days < 0 ? `تفويض منتهٍ: ${record.id}` : `تفويض ${record.id} ينتهي خلال ${days} يوم`,
            action: () => setPage('agencies'),
          })),
        ...monitorItems
          .filter((record) => !record.completed)
          .map((record) => ({record, days: getDaysUntil(record.endDate)}))
          .filter(({record, days}) => days < 0 || record.alertOffsets.includes(days))
          .map(({record, days}) => ({
            key: `monitor-alert-${record.id}`,
            days,
            tone: days < 0 || days === 0 ? 'danger' : days <= 7 ? 'warn' : 'info',
            text: days < 0 ? `${record.name} متأخر ${Math.abs(days)} يوم` : `${record.name} خلال ${days} يوم`,
            action: () => setPage('monitoring'),
          })),
      ]
        .sort((a, b) => a.days - b.days)
        .slice(0, 10)
    : [];

  return (
    <div className={`shell ${small ? 'small' : ''}`}>
      <aside>
        <Brand />
        <nav>
          {items.map(([itemPage, title, icon], index) => (
            <button
              className={page === itemPage && !(itemPage === 'dashboard' && index > 0) ? 'active' : ''}
              key={`${itemPage}-${title}`}
              onClick={() => setPage(itemPage)}
              type="button"
            >
              {icon}
              <span>{title}</span>
            </button>
          ))}
        </nav>
        <button type="button">
          <MoreHorizontal />
          <span>المزيد</span>
        </button>
        <button className="collapse" onClick={() => setSmall(!small)} type="button">
          <Menu />
          <span>تصغير القائمة</span>
        </button>
      </aside>
      <div className="work">
        <header>
          <div className="header-search-wrap">
            <div className="search">
              <Search />
              <input
                onChange={(event) => setHeaderQuery(event.target.value)}
                placeholder="ابحث عن قضية أو محامٍ أو وكالة أو انتهاء..."
                value={headerQuery}
              />
            </div>
            {normalizedQuery ? (
              <div className="header-popover search-results panel">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button
                      key={result.key}
                      onClick={() => {
                        result.action();
                        setHeaderQuery('');
                      }}
                      type="button"
                    >
                      <b>{result.label}</b>
                      <small>{result.meta}</small>
                    </button>
                  ))
                ) : (
                  <p className="popover-empty">لا توجد نتائج مطابقة</p>
                )}
              </div>
            ) : null}
          </div>
          <div className="top">
            <span className="synced">
              <CheckCircle2 /> حفظ محلي فعّال
            </span>
            <button
              aria-label="التنبيهات"
              className={`icon notification-button ${showNotifications ? 'active' : ''}`}
              onClick={() => setShowNotifications((value) => !value)}
              type="button"
            >
              <Bell />
              {notifications.length ? <span>{notifications.length}</span> : null}
            </button>
            {showNotifications ? (
              <div className="header-popover notifications-popover panel">
                <div className="popover-title">
                  <b>مركز التنبيهات</b>
                  <small>{notifications.length} تنبيهات مهمة</small>
                </div>
                {notifications.length ? (
                  notifications.map((item) => (
                    <button
                      className={`notification-item ${item.tone}`}
                      key={item.key}
                      onClick={() => {
                        item.action();
                        setShowNotifications(false);
                      }}
                      type="button"
                    >
                      <AlertTriangle />
                      <span>{item.text}</span>
                    </button>
                  ))
                ) : (
                  <p className="popover-empty">لا توجد تنبيهات حالياً</p>
                )}
              </div>
            ) : null}
            <button className="user" onClick={() => setPage('settings')} type="button">
              <CircleUserRound /> {currentUserName}
            </button>
            <button className="user" onClick={onLogout} type="button">تسجيل الخروج</button>
            {page === 'cases' ? (
              <Btn onClick={onNewCase}>
                <Plus /> إضافة قضية جديدة
              </Btn>
            ) : null}
          </div>
        </header>
        <main className={`content ${page === 'dashboard' ? 'dashboard-content' : ''}`}>
          {children}
          <p className="screen-credit">تصميم و تطوير : عبدالله المخلافي</p>
        </main>
      </div>
    </div>
  );
}

function Head({title, sub, action}: {title: string; sub?: string; action?: React.ReactNode}) {
  return (
    <div className="head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function CaseRow({
  record,
  onOpen,
  onEdit,
  onDelete,
}: {
  record: CaseRecord;
  onOpen: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const upcoming = getUpcomingHearing(record);

  return (
    <article className="case panel">
      <div>
        <h3>{record.title}</h3>
        <p>{getCaseSubtitle(record)}</p>
        <small>آخر تحديث: {formatShortDate(record.createdAt)}</small>
      </div>
      <div>
        <Status text={record.status} tone={getCaseTone(record.status)} />
        <small>الموعد القادم</small>
        <b>{upcoming ? `${formatDate(upcoming.date)} · ${upcoming.time}` : 'لم يحدد'}</b>
      </div>
      <div>
        <small>المطلوب الآن</small>
        <b>{record.nextTask || 'مراجعة القضية'}</b>
        <div className="card-actions">
          <Btn kind="outline" onClick={onOpen}>عرض القضية</Btn>
          {onEdit ? <Btn kind="outline" onClick={onEdit}><Pencil /> تعديل</Btn> : null}
          {onDelete ? <Btn kind="danger" onClick={onDelete}><Trash2 /> حذف</Btn> : null}
        </div>
      </div>
    </article>
  );
}

function Dashboard({
  cases,
  agencies,
  monitorItems,
  openCase,
  setPage,
  settings,
  userName,
}: {
  cases: CaseRecord[];
  agencies: AgencyRecord[];
  monitorItems: MonitorItem[];
  openCase: (id: string) => void;
  setPage: (page: Page) => void;
  settings: AppSettings;
  userName: string;
}) {
  const totalCases = cases.length;
  const activeCases = cases.filter((record) => record.status !== 'مغلقة').length;
  const closedCases = cases.filter((record) => record.status === 'مغلقة').length;
  const hearings = cases.flatMap((record) =>
    record.hearings.map((hearing) => ({
      caseId: record.id,
      caseTitle: record.title,
      ...hearing,
    })),
  );
  const upcomingHearings = hearings.filter((hearing) => hearing.status === 'قادمة');
  const todayHearings = upcomingHearings.filter((hearing) => getDaysUntil(hearing.date) === 0).length;
  const futureHearings = upcomingHearings.filter((hearing) => getDaysUntil(hearing.date) >= 0).length;
  const activeAgencies = agencies.filter((agency) => getExpiryStatus(agency.endDate) === 'سارية').length;
  const expiredAgencies = agencies.filter((agency) => getExpiryStatus(agency.endDate) === 'منتهية').length;
  const allTasks = cases.flatMap((record) => record.tasks.map((task) => ({...task, caseTitle: record.title})));
  const openTasks = allTasks.filter((task) => task.status !== 'مكتملة').length;
  const reminderDays = getReminderDays(settings);
  const endingWithin7 = monitorItems.filter((item) => { const days = getDaysUntil(item.endDate); return !item.completed && days >= 0 && days <= 7; }).length;
  const endingWithin30 = monitorItems.filter((item) => { const days = getDaysUntil(item.endDate); return !item.completed && days >= 0 && days <= 30; }).length;
  const expiredMonitorItems = monitorItems.filter((item) => getMonitorStatus(item) === 'منتهي').length;
  const upcomingDues = monitorItems.filter((item) => getMonitorStatus(item) === 'مستحق قريبًا').length;
  const overdueDues = monitorItems.filter((item) => getMonitorStatus(item) === 'متأخر').length;

  const cards = [
    ['إجمالي القضايا', totalCases],
    ['القضايا النشطة', activeCases],
    ['القضايا المغلقة', closedCases],
    ['جلسات اليوم', todayHearings],
    ['الجلسات القادمة', futureHearings],
    ['الوكالات السارية', activeAgencies],
    ['الوكالات المنتهية', expiredAgencies],
    ['المهام المفتوحة', openTasks],
    ['تنتهي خلال 7 أيام', endingWithin7],
    ['تنتهي خلال 30 يوم', endingWithin30],
    ['عناصر منتهية', expiredMonitorItems],
    ['مستحقات قريبة', upcomingDues],
    ['مستحقات متأخرة', overdueDues],
  ];

  const alerts = [
    ...upcomingHearings
      .map((hearing) => {
        const days = getDaysUntil(hearing.date);
        if (days < 0) return null;
        if (!settings.remindersEnabled || !reminderDays.includes(days)) return null;
        if (days === 0) return {tone: 'danger', text: `جلسة اليوم ${hearing.time} لقضية ${hearing.caseTitle}`};
        if (days === 1) return {tone: 'danger', text: `جلسة غدًا ${hearing.time} لقضية ${hearing.caseTitle}`};
        return {tone: days <= 3 ? 'warn' : 'info', text: `جلسة بعد ${days} أيام لقضية ${hearing.caseTitle}`};
        return null;
      })
      .filter(Boolean) as {tone: string; text: string}[],
    ...allTasks
      .map((task) => {
        const days = getDaysUntil(task.dueDate);
        if (task.status === 'مكتملة') return null;
        if (days < 0) return {tone: 'danger', text: `مهمة متأخرة: ${task.title}`};
        if (!settings.remindersEnabled || !reminderDays.includes(days)) return null;
        return {tone: task.priority === 'عاجلة' ? 'danger' : 'warn', text: `مهمة ${task.title} خلال ${days} يوم`};
      })
      .filter(Boolean) as {tone: string; text: string}[],
    ...agencies
      .map((agency) => {
        const status = getExpiryStatus(agency.endDate);
        if (status === 'تنتهي قريبًا') return {tone: 'warn', text: `وكالة ${agency.id} تنتهي قريبًا`};
        if (status === 'منتهية') return {tone: 'danger', text: `وكالة منتهية: ${agency.type}`};
        return null;
      })
      .filter(Boolean) as {tone: string; text: string}[],
    ...monitorItems
      .map((item) => {
        if (item.completed) return null;
        const status = getMonitorStatus(item);
        const days = getDaysUntil(item.endDate);
        if (status === 'منتهي' || status === 'متأخر') return {tone: 'danger', text: `${status}: ${item.name}`};
        if (item.alertOffsets.includes(days)) return {tone: days <= 3 ? 'warn' : 'info', text: `${item.name} خلال ${days} يوم`};
        return null;
      })
      .filter(Boolean) as {tone: string; text: string}[],
  ].slice(0, 5);

  const focusCase =
    cases
      .slice()
      .sort((a, b) => {
        const aDate = getUpcomingHearing(a)?.date ?? '9999-12-31';
        const bDate = getUpcomingHearing(b)?.date ?? '9999-12-31';
        return aDate.localeCompare(bDate);
      })[0] ?? cases[0];

  const focusHearing = focusCase ? getUpcomingHearing(focusCase) : undefined;

  return (
    <div className="luxury-dashboard">
      <Head title={`مرحبًا، ${userName}`} sub="هذه قراءة مباشرة لما هو مهم في ملفاتك اليوم" />
      <div className="stats-grid">
        {cards.map(([label, value]) => (
          <article className="panel statcard" key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <div className="dash">
        <section>
          {focusCase && (
            <article className="hero">
              <div>
                <small>خطوتك التالية</small>
                <h2>{focusCase.nextTask || 'مراجعة ملف القضية'}</h2>
                <p>
                  {focusCase.title}
                  {focusHearing ? ` · ${formatDate(focusHearing.date)} · ${focusHearing.time}` : ' · بدون جلسة قادمة'}
                </p>
              </div>
              <Btn kind="gold" onClick={() => openCase(focusCase.id)}>
                فتح القضية
              </Btn>
            </article>
          )}
          <div className="sectiontitle">
            <h2>قضاياك النشطة</h2>
            <button onClick={() => setPage('cases')} type="button">
              عرض الكل
            </button>
          </div>
          {cases.slice(0, 4).map((record) => (
            <CaseRow key={record.id} onOpen={() => openCase(record.id)} record={record} />
          ))}
        </section>
        <section className="side">
          <article className="panel info">
            <CalendarDays />
            <div>
              <small>الجلسة الأقرب</small>
              <h3>{focusHearing ? formatDate(focusHearing.date) : 'لا توجد جلسات قادمة'}</h3>
              <p>
                {focusHearing
                  ? `${focusHearing.time} · ${focusHearing.court} · ${focusCase?.title}`
                  : 'أضف جلسة للقضية لتظهر هنا تلقائيًا'}
              </p>
            </div>
          </article>
          <article className="panel alerts">
            <h3>مركز التنبيهات الذكي</h3>
            {alerts.length ? (
              alerts.map((alert, index) => (
                <p className={alert.tone} key={`${alert.text}-${index}`}>
                  <AlertTriangle /> {alert.text}
                </p>
              ))
            ) : (
              <p>
                <CheckCircle2 /> لا توجد تنبيهات عاجلة الآن
              </p>
            )}
          </article>
          <article className="panel updates">
            <h3>آخر التحديثات</h3>
            {cases.slice(0, 3).map((record) => (
              <p key={record.id}>
                <b>{record.title}</b>
                <small>{record.nextTask || 'تم تحديث بيانات القضية'}</small>
              </p>
            ))}
          </article>
        </section>
      </div>
    </div>
  );
}

function Cases({
  cases,
  openCase,
  editCase,
  deleteCase,
  exportCasesReport,
}: {
  cases: CaseRecord[];
  openCase: (id: string) => void;
  editCase: (id: string) => void;
  deleteCase: (id: string) => void;
  exportCasesReport: () => void;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'الكل' | 'نشطة' | 'بانتظار إجراء' | 'مغلقة'>('الكل');
  const [advanced, setAdvanced] = useState(false);
  const [courtFilter, setCourtFilter] = useState('الكل');
  const [cityFilter, setCityFilter] = useState('الكل');
  const [lawyerFilter, setLawyerFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState<'الكل' | CaseStatus>('الكل');

  const courtsList = ['الكل', ...new Set(cases.map((record) => record.court))];
  const citiesList = ['الكل', ...new Set(cases.map((record) => record.city).filter(Boolean))];
  const lawyersList = ['الكل', ...new Set(cases.map((record) => record.responsibleLawyer).filter(Boolean))];

  const shown = cases.filter((record) => {
    const haystack = [
      record.title,
      record.number,
      record.court,
      record.city,
      record.responsibleLawyer,
      record.amountClaimed,
      ...record.parties.map((party) => party.name),
    ]
      .join(' ')
      .toLowerCase();

    const matchQuery = haystack.includes(query.toLowerCase());
    const matchFilter =
      filter === 'الكل'
        ? true
        : filter === 'نشطة'
          ? record.status !== 'مغلقة'
          : filter === 'مغلقة'
            ? record.status === 'مغلقة'
            : record.status === 'بانتظار مستندات' || record.status === 'مؤجلة';
    const matchCourt = courtFilter === 'الكل' ? true : record.court === courtFilter;
    const matchCity = cityFilter === 'الكل' ? true : record.city === cityFilter;
    const matchLawyer = lawyerFilter === 'الكل' ? true : record.responsibleLawyer === lawyerFilter;
    const matchStatus = statusFilter === 'الكل' ? true : record.status === statusFilter;

    return matchQuery && matchFilter && matchCourt && matchCity && matchLawyer && matchStatus;
  });

  return (
    <>
      <Head
        title="القضايا"
        sub="يمكنك الآن البحث في أطراف القضية والمحامي والمحكمة والمبلغ المطلوب"
        action={
          <Btn kind="outline" onClick={exportCasesReport}>
            <FileDown /> تصدير تقرير القضايا
          </Btn>
        }
      />
      <div className="tools panel">
        <div className="search">
          <Search />
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث برقم القضية أو المحكمة أو المحامي أو أحد الأطراف"
            value={query}
          />
        </div>
        <div className="chips">
          {(['الكل', 'نشطة', 'بانتظار إجراء', 'مغلقة'] as const).map((item) => (
            <button
              className={filter === item ? 'active' : ''}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <Btn kind="outline" onClick={() => setAdvanced((current) => !current)}>
          {advanced ? 'إخفاء البحث المتقدم' : 'البحث المتقدم'}
        </Btn>
      </div>
      {advanced && (
        <section className="panel advanced-filters">
          <div className="form compact-form">
            <label>
              المحكمة
              <select onChange={(event) => setCourtFilter(event.target.value)} value={courtFilter}>
                {courtsList.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              المدينة
              <select onChange={(event) => setCityFilter(event.target.value)} value={cityFilter}>
                {citiesList.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              المحامي المسؤول
              <select onChange={(event) => setLawyerFilter(event.target.value)} value={lawyerFilter}>
                {lawyersList.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              حالة القضية
              <select onChange={(event) => setStatusFilter(event.target.value as 'الكل' | CaseStatus)} value={statusFilter}>
                <option>الكل</option>
                {caseStatuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
      )}
      {shown.length ? (
        shown.map((record) => (
          <CaseRow
            key={record.id}
            onDelete={() => deleteCase(record.id)}
            onEdit={() => editCase(record.id)}
            onOpen={() => openCase(record.id)}
            record={record}
          />
        ))
      ) : (
        <div className="empty panel">
          <Search />
          <h2>لا توجد قضايا مطابقة</h2>
          <p>جرّب البحث باسم الطرف أو رقم القضية أو اسم المحكمة.</p>
        </div>
      )}
    </>
  );
}

function Details({
  record,
  onEdit,
  onDelete,
  onRemind,
  onUpdateCase,
}: {
  record: CaseRecord | undefined;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRemind: (id: string) => void;
  onUpdateCase: (id: string, updater: (record: CaseRecord) => CaseRecord) => void;
}) {
  const [tab, setTab] = useState<'نظرة عامة' | 'الخط الزمني' | 'الجلسات' | 'الأطراف' | 'المستندات' | 'المهام'>('نظرة عامة');
  const [showHearingForm, setShowHearingForm] = useState(false);
  const [editingHearingId, setEditingHearingId] = useState<string | null>(null);
  const [hearingForm, setHearingForm] = useState<Hearing>({
    id: '',
    date: '',
    time: '10:00',
    court: '',
    chamber: '',
    description: '',
    decision: '',
    status: 'قادمة',
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState<CaseTask>({
    id: '',
    title: '',
    owner: '',
    dueDate: todayIsoDate(),
    priority: 'متوسطة',
    status: 'مفتوحة',
  });

  if (!record) {
    return (
      <div className="empty panel">
        <BriefcaseBusiness />
        <h2>لم يتم اختيار قضية بعد</h2>
        <p>اختر قضية من القائمة لعرض التفاصيل الكاملة.</p>
      </div>
    );
  }

  const selectedRecord = record;

  const upcoming = getUpcomingHearing(record);
  const openTasks = record.tasks.filter((task) => task.status !== 'مكتملة');

  function resetHearingForm() {
    setEditingHearingId(null);
    setHearingForm({
      id: '',
      date: '',
      time: '10:00',
      court: selectedRecord.court,
      chamber: selectedRecord.chamber,
      description: '',
      decision: '',
      status: 'قادمة',
    });
  }

  function saveHearing() {
    if (!hearingForm.date || !hearingForm.time) return;
    const built = {...hearingForm, id: editingHearingId ?? `hearing-${Date.now()}`};
    onUpdateCase(selectedRecord.id, (current) => ({
      ...current,
      hearings: editingHearingId
        ? current.hearings.map((item) => (item.id === editingHearingId ? built : item))
        : [...current.hearings, built],
      nextTask: built.description || current.nextTask,
    }));
    playSuccessSound();
    setShowHearingForm(false);
    resetHearingForm();
  }

  function editHearing(hearing: Hearing) {
    setEditingHearingId(hearing.id);
    setHearingForm(hearing);
    setShowHearingForm(true);
  }

  function deleteHearing(hearingId: string) {
    onUpdateCase(selectedRecord.id, (current) => ({
      ...current,
      hearings: current.hearings.filter((item) => item.id !== hearingId),
    }));
  }

  function saveTask() {
    if (!taskForm.title.trim()) return;
    const built = {...taskForm, id: taskForm.id || `task-${Date.now()}`};
    onUpdateCase(selectedRecord.id, (current) => ({
      ...current,
      tasks: taskForm.id
        ? current.tasks.map((item) => (item.id === taskForm.id ? built : item))
        : [...current.tasks, built],
      nextTask: built.status !== 'مكتملة' ? built.title : current.nextTask,
    }));
    playSuccessSound();
    setShowTaskForm(false);
    setTaskForm({id: '', title: '', owner: '', dueDate: todayIsoDate(), priority: 'متوسطة', status: 'مفتوحة'});
  }

  function editTask(task: CaseTask) {
    setTaskForm(task);
    setShowTaskForm(true);
  }

  function deleteTask(taskId: string) {
    onUpdateCase(selectedRecord.id, (current) => ({
      ...current,
      tasks: current.tasks.filter((item) => item.id !== taskId),
    }));
  }

  function exportCaseReportLegacy() {
    downloadText(
      [
        `اسم القضية: ${selectedRecord.title}`,
        `رقم القضية: ${selectedRecord.number}/${selectedRecord.year}`,
        `المحكمة: ${selectedRecord.court}`,
        `الدائرة: ${selectedRecord.chamber || 'غير محددة'}`,
        `المدينة: ${selectedRecord.city}`,
        `الحالة: ${selectedRecord.status}`,
        `المحامي المسؤول: ${selectedRecord.responsibleLawyer}`,
        `المبلغ المطلوب: ${formatCurrency(selectedRecord.amountClaimed)}`,
        `عدد الأطراف: ${selectedRecord.parties.length}`,
        `عدد الجلسات: ${selectedRecord.hearings.length}`,
        `عدد المستندات: ${selectedRecord.attachments.length}`,
        '',
        `ملاحظات: ${selectedRecord.notes || 'لا توجد'}`,
      ].join('\n'),
      `case-report-${selectedRecord.number}.txt`,
    );
  }

  async function exportCaseReport() {
    const reportDate = new Date().toLocaleDateString('ar-SA');
    const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
      body{font-family:Tahoma,Arial;padding:36px;color:#172033}h1{color:#0b162c;border-bottom:3px solid #d4af37;padding-bottom:12px}
      .meta{color:#667085;margin-bottom:22px}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.item{border:1px solid #d8dde6;border-radius:8px;padding:12px}.item small{display:block;color:#667085;margin-bottom:5px}
      table{width:100%;border-collapse:collapse;margin-top:18px}th,td{border:1px solid #d8dde6;padding:9px;text-align:right}th{background:#0b162c;color:#fff}.notes{margin-top:18px;border:1px solid #d8dde6;padding:14px;border-radius:8px}
    </style></head><body><h1>تقرير القضية: ${escapeHtml(selectedRecord.title)}</h1><div class="meta">تاريخ التقرير: ${escapeHtml(reportDate)}</div>
    <div class="grid">
      <div class="item"><small>رقم القضية</small><b>${escapeHtml(`${selectedRecord.number}/${selectedRecord.year}`)}</b></div>
      <div class="item"><small>الحالة</small><b>${escapeHtml(selectedRecord.status)}</b></div>
      <div class="item"><small>المحكمة والدائرة</small><b>${escapeHtml(`${selectedRecord.court} - ${selectedRecord.chamber || 'غير محددة'}`)}</b></div>
      <div class="item"><small>المدينة</small><b>${escapeHtml(selectedRecord.city)}</b></div>
      <div class="item"><small>المحامي المسؤول</small><b>${escapeHtml(selectedRecord.responsibleLawyer)}</b></div>
      <div class="item"><small>المبلغ المطلوب</small><b>${escapeHtml(formatCurrency(selectedRecord.amountClaimed))}</b></div>
    </div>
    <h2>الأطراف</h2><table><thead><tr><th>الاسم</th><th>الصفة</th><th>رقم الهوية</th><th>الجوال</th></tr></thead><tbody>${selectedRecord.parties.map((party) => `<tr><td>${escapeHtml(party.name)}</td><td>${escapeHtml(party.role)}</td><td>${escapeHtml(party.identityNumber || '')}</td><td>${escapeHtml(party.mobile || '')}</td></tr>`).join('')}</tbody></table>
    <h2>الجلسات</h2><table><thead><tr><th>التاريخ</th><th>الوقت</th><th>الوصف</th><th>الحالة</th><th>القرار</th></tr></thead><tbody>${selectedRecord.hearings.map((hearing) => `<tr><td>${escapeHtml(formatDate(hearing.date))}</td><td>${escapeHtml(hearing.time)}</td><td>${escapeHtml(hearing.description)}</td><td>${escapeHtml(hearing.status)}</td><td>${escapeHtml(hearing.decision || '')}</td></tr>`).join('')}</tbody></table>
    <div class="notes"><b>الملاحظات</b><p>${escapeHtml(selectedRecord.notes || 'لا توجد ملاحظات.')}</p></div></body></html>`;
    if (window.bayyinahDesktop) {
      await window.bayyinahDesktop.reports.savePdf({html, filename: `Case-${selectedRecord.number}-${selectedRecord.year}.pdf`});
    } else {
      const report = window.open('', '_blank'); report?.document.write(html); report?.document.close(); report?.print();
    }
  }

  function exportDocumentsIndex() {
    downloadJson(
      selectedRecord.attachments.map((attachment) => ({
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
        uploadedAt: attachment.uploadedAt,
      })),
      `case-documents-${selectedRecord.number}.json`,
    );
  }

  return (
    <>
      <div className="crumb">القضايا ← {record.title}</div>
      <div className="detailhead">
        <div>
          <h1>{record.title}</h1>
          <p>{getCaseSubtitle(record)}</p>
        </div>
        <Status text={record.status} tone={getCaseTone(record.status)} />
        <Btn kind="outline" onClick={() => onEdit(record.id)}>
          <Pencil /> تعديل
        </Btn>
        <Btn kind="danger" onClick={() => onDelete(record.id)}>
          <Trash2 /> حذف
        </Btn>
        <button className="icon" type="button">
          <MoreHorizontal />
        </button>
      </div>

      <article className="hero compact">
        <div>
          <small>المطلوب الآن</small>
          <h2>{record.nextTask || 'مراجعة ملف القضية'}</h2>
          <p>{upcoming ? `قبل ${formatDate(upcoming.date)} · ${upcoming.description}` : 'لا توجد جلسة مسجلة بعد'}</p>
        </div>
        <div className="hero-actions">
          <Btn kind="gold" onClick={() => onRemind(record.id)}>
            <Bell /> ذكّرني
          </Btn>
          <Btn kind="light" onClick={exportCaseReport}>
            <FileDown /> تصدير التقرير
          </Btn>
        </div>
      </article>

      <div className="detailgrid">
        <section className="panel timelinebox">
          <div className="tabs">
            {(['نظرة عامة', 'الخط الزمني', 'الجلسات', 'الأطراف', 'المستندات', 'المهام'] as const).map((item) => (
              <button
                className={tab === item ? 'active' : ''}
                key={item}
                onClick={() => setTab(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          {tab === 'نظرة عامة' && (
            <>
              <h2>ملخص القضية</h2>
              <div className="summary-grid">
                <div>
                  <small>نوع القضية</small>
                  <b>{record.category}</b>
                </div>
                <div>
                  <small>المحامي المسؤول</small>
                  <b>{record.responsibleLawyer}</b>
                </div>
                <div>
                  <small>الدائرة</small>
                  <b>{record.chamber || 'غير محددة'}</b>
                </div>
                <div>
                  <small>تاريخ التسجيل</small>
                  <b>{formatDate(record.registrationDate)}</b>
                </div>
                <div>
                  <small>المبلغ المطلوب</small>
                  <b>{formatCurrency(record.amountClaimed)}</b>
                </div>
                <div>
                  <small>التذكيرات المحفوظة</small>
                  <b>{record.reminders.length}</b>
                </div>
              </div>
              <p className="notes-box">{record.notes || 'لا توجد ملاحظات حتى الآن.'}</p>
            </>
          )}

          {tab === 'الخط الزمني' && (
            <>
              <h2>أحدث تطورات القضية</h2>
              {record.hearings.length ? (
                record.hearings.map((hearing) => (
                  <div className="event" key={hearing.id}>
                    <CheckCircle2 />
                    <div>
                      <small>
                        {formatDate(hearing.date)} · {hearing.time}
                      </small>
                      <h3>{hearing.description || 'جلسة قضائية'}</h3>
                      <p>{hearing.decision || 'لم يدوّن قرار للجلسة بعد.'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-lite">لا يوجد خط زمني بعد لهذه القضية.</div>
              )}
            </>
          )}

          {tab === 'الجلسات' && (
            <>
              <div className="sectiontitle">
                <h2>الجلسات المسجلة</h2>
                <button onClick={() => { resetHearingForm(); setShowHearingForm((v) => !v); }} type="button">إضافة جلسة</button>
              </div>
              {showHearingForm && (
                <section className="panel inline-form">
                  <div className="form">
                    <label>تاريخ الجلسة<CalendarDateInput value={hearingForm.date} onChange={(value)=>setHearingForm({...hearingForm,date:value})} /><DatePreview value={hearingForm.date} /></label>
                    <label>وقت الجلسة<input type="time" value={hearingForm.time} onChange={(e)=>setHearingForm({...hearingForm,time:e.target.value})} /></label>
                    <label>المحكمة<input value={hearingForm.court} onChange={(e)=>setHearingForm({...hearingForm,court:e.target.value})} /></label>
                    <label>الدائرة<input value={hearingForm.chamber} onChange={(e)=>setHearingForm({...hearingForm,chamber:e.target.value})} /></label>
                    <label>الحالة<select value={hearingForm.status} onChange={(e)=>setHearingForm({...hearingForm,status:e.target.value as HearingStatus})}>{hearingStatuses.map((item)=><option key={item}>{item}</option>)}</select></label>
                    <label className="full">وصف الجلسة<textarea value={hearingForm.description} onChange={(e)=>setHearingForm({...hearingForm,description:e.target.value})} /></label>
                    <label className="full">القرار<textarea value={hearingForm.decision} onChange={(e)=>setHearingForm({...hearingForm,decision:e.target.value})} /></label>
                  </div>
                  <div className="form-actions"><Btn kind="outline" onClick={()=>setShowHearingForm(false)}>إغلاق</Btn><Btn onClick={saveHearing}>{editingHearingId ? 'حفظ التعديل' : 'حفظ الجلسة'}</Btn></div>
                </section>
              )}
              {record.hearings.length ? (
                record.hearings.map((hearing) => (
                  <article className="session-card" key={hearing.id}>
                    <div>
                      <small>الموعد</small>
                      <b>
                        {formatDate(hearing.date)} · {hearing.time}
                      </b>
                    </div>
                    <div>
                      <small>المحكمة / الدائرة</small>
                      <b>
                        {hearing.court} · {hearing.chamber || 'غير محددة'}
                      </b>
                    </div>
                    <div>
                      <small>الحالة</small>
                      <Status
                        text={hearing.status}
                        tone={hearing.status === 'قادمة' ? 'info' : hearing.status === 'تمت' ? 'ok' : 'warn'}
                      />
                    </div>
                    <div className="card-actions">
                      <Btn kind="outline" onClick={() => editHearing(hearing)}>تعديل</Btn>
                      <Btn kind="outline" onClick={() => deleteHearing(hearing.id)}>حذف</Btn>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-lite">لا توجد جلسات محفوظة لهذه القضية بعد.</div>
              )}
            </>
          )}

          {tab === 'الأطراف' && (
            <>
              <h2>الأطراف</h2>
              {record.parties.map((party) => (
                <article className="party-card" key={party.id}>
                  <div>
                    <small>الاسم</small>
                    <b>{party.name || 'بدون اسم'}</b>
                  </div>
                  <div>
                    <small>الصفة</small>
                    <b>{party.role}</b>
                  </div>
                  <div>
                    <small>الهوية</small>
                    <b>{party.identityNumber || '—'}</b>
                  </div>
                  <div>
                    <small>الجوال</small>
                    <b>{party.mobile || '—'}</b>
                  </div>
                </article>
              ))}
            </>
          )}

          {tab === 'المستندات' && (
            <>
              <div className="sectiontitle">
                <h2>المستندات المرفقة</h2>
                <button onClick={exportDocumentsIndex} type="button">
                  تصدير فهرس المستندات
                </button>
              </div>
              {record.attachments.length ? (
                <div className="attachment-stack">
                  {record.attachments.map((attachment) => (
                    <article className="attachment-card" key={attachment.id}>
                      <div>
                        <small>الملف</small>
                        <b>{attachment.name}</b>
                        <p>
                          {formatBytes(attachment.size)} · {formatDate(attachment.uploadedAt)}
                        </p>
                      </div>
                      <div className="attachment-actions">
                        <Btn kind="outline" onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}>
                          <Download /> تنزيل المستند
                        </Btn>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-lite">لا توجد مستندات مرفقة لهذه القضية حتى الآن.</div>
              )}
            </>
          )}

          {tab === 'المهام' && (
            <>
              <div className="sectiontitle">
                <h2>المهام المرتبطة</h2>
                <button onClick={() => { setTaskForm({id: '', title: '', owner: '', dueDate: todayIsoDate(), priority: 'متوسطة', status: 'مفتوحة'}); setShowTaskForm((v)=>!v); }} type="button">إضافة مهمة</button>
              </div>
              {showTaskForm && (
                <section className="panel inline-form">
                  <div className="form">
                    <label>اسم المهمة<input value={taskForm.title} onChange={(e)=>setTaskForm({...taskForm,title:e.target.value})} /></label>
                    <label>المسؤول<input value={taskForm.owner} onChange={(e)=>setTaskForm({...taskForm,owner:e.target.value})} /></label>
                    <label>تاريخ الاستحقاق<CalendarDateInput value={taskForm.dueDate} onChange={(value)=>setTaskForm({...taskForm,dueDate:value})} /><DatePreview value={taskForm.dueDate} /></label>
                    <label>الأولوية<select value={taskForm.priority} onChange={(e)=>setTaskForm({...taskForm,priority:e.target.value as TaskPriority})}>{taskPriorities.map((item)=><option key={item}>{item}</option>)}</select></label>
                    <label>الحالة<select value={taskForm.status} onChange={(e)=>setTaskForm({...taskForm,status:e.target.value as TaskStatus})}>{taskStatuses.map((item)=><option key={item}>{item}</option>)}</select></label>
                  </div>
                  <div className="form-actions"><Btn kind="outline" onClick={()=>setShowTaskForm(false)}>إغلاق</Btn><Btn onClick={saveTask}>{taskForm.id ? 'حفظ التعديل' : 'حفظ المهمة'}</Btn></div>
                </section>
              )}
              {record.tasks.length ? record.tasks.map((task) => (
                <article className="session-card task-card" key={task.id}>
                  <div><small>المهمة</small><b>{task.title}</b><p>{task.owner || 'بدون مسؤول'}</p></div>
                  <div><small>الاستحقاق</small><b>{task.dueDate ? formatDate(task.dueDate) : 'غير محدد'}</b><p>{task.status}</p></div>
                  <div><small>الأولوية</small><Status text={task.priority} tone={getTaskTone(task.priority)} /></div>
                  <div className="card-actions"><Btn kind="outline" onClick={() => editTask(task)}>تعديل</Btn><Btn kind="outline" onClick={() => deleteTask(task.id)}>حذف</Btn></div>
                </article>
              )) : <div className="empty-lite">لا توجد مهام لهذه القضية بعد.</div>}
            </>
          )}
        </section>

        <section className="detailcards">
          <Info
            icon={<CalendarDays />}
            title="الجلسة القادمة"
            text={upcoming ? `${formatDate(upcoming.date)} · ${upcoming.time}` : 'لا توجد جلسة'}
          />
          <div className="twocol">
            <Info icon={<UsersRound />} title="عدد الأطراف" text={`${record.parties.length} أطراف`} />
            <Info icon={<FileText />} title="المرفقات" text={`${record.attachments.length} ملفات`} />
          </div>
          <Info icon={<Bell />} title="المهام المفتوحة" text={`${openTasks.length} مهام`} />
          <Info icon={<BriefcaseBusiness />} title="المحكمة" text={record.court} />
          <Info icon={<FileText />} title="المبلغ المطلوب" text={formatCurrency(record.amountClaimed)} />
        </section>
      </div>
    </>
  );
}

function Info({icon, title, text}: {icon: React.ReactNode; title: string; text: string}) {
  return (
    <article className="panel infocard">
      <span>{icon}</span>
      <div>
        <small>{title}</small>
        <b>{text}</b>
      </div>
    </article>
  );
}

function CalendarDateInput({value, onChange}: {value: string; onChange: (value: string) => void}) {
  const initial = gregorianToHijri(value);
  const [hijriParts, setHijriParts] = useState({
    year: initial?.year ? String(initial.year) : '',
    month: initial?.month ? String(initial.month) : '',
    day: initial?.day ? String(initial.day) : '',
  });

  useEffect(() => {
    const converted = gregorianToHijri(value);
    setHijriParts({
      year: converted?.year ? String(converted.year) : '',
      month: converted?.month ? String(converted.month) : '',
      day: converted?.day ? String(converted.day) : '',
    });
  }, [value]);

  if (currentCalendarMode === 'gregorian') {
    return <input onChange={(event) => onChange(event.target.value)} type="date" value={value} />;
  }

  function updateHijri(part: 'year' | 'month' | 'day', nextValue: string) {
    const next = {...hijriParts, [part]: nextValue};
    setHijriParts(next);
    if (!next.year || !next.month || !next.day) {
      if (!next.year && !next.month && !next.day) onChange('');
      return;
    }
    let day = Number(next.day);
    let converted = hijriToGregorian(Number(next.year), Number(next.month), day);
    if (!converted && day === 30) {
      day = 29;
      next.day = '29';
      setHijriParts(next);
      converted = hijriToGregorian(Number(next.year), Number(next.month), day);
    }
    if (converted) onChange(converted);
  }

  const currentHijriYear = gregorianToHijri(todayIsoDate())?.year ?? 1447;
  const years = Array.from({length: 101}, (_, index) => currentHijriYear - 50 + index);
  const months = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];

  return (
    <div className="hijri-date-input">
      <select aria-label="اليوم الهجري" onChange={(event) => updateHijri('day', event.target.value)} value={hijriParts.day}>
        <option value="">اليوم</option>
        {Array.from({length: 30}, (_, index) => index + 1).map((day) => <option key={day} value={day}>{day}</option>)}
      </select>
      <select aria-label="الشهر الهجري" onChange={(event) => updateHijri('month', event.target.value)} value={hijriParts.month}>
        <option value="">الشهر</option>
        {months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
      </select>
      <select aria-label="السنة الهجرية" onChange={(event) => updateHijri('year', event.target.value)} value={hijriParts.year}>
        <option value="">السنة</option>
        {years.map((year) => <option key={year} value={year}>{year} هـ</option>)}
      </select>
      <button aria-label="مسح التاريخ" onClick={() => { setHijriParts({year: '', month: '', day: ''}); onChange(''); }} type="button">مسح</button>
    </div>
  );
}

function DatePreview({value}: {value: string}) {
  if (!value) return <small className="date-preview">اختر التاريخ بالتقويم المحدد في الإعدادات.</small>;
  const alternate = new Intl.DateTimeFormat(currentCalendarMode === 'hijri' ? 'ar-SA' : 'ar-SA-u-ca-islamic-umalqura', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(value));
  return <small className="date-preview">الموافق {currentCalendarMode === 'hijri' ? 'ميلاديًا' : 'هجريًا'}: {alternate}</small>;
}

function NewCase({
  draft,
  setDraft,
  onSave,
  mode,
}: {
  draft: NewCaseDraft;
  setDraft: React.Dispatch<React.SetStateAction<NewCaseDraft>>;
  onSave: () => void;
  mode: DraftMode;
}) {
  const [step, setStep] = useState(1);
  const names = ['معلومات القضية', 'المحكمة والأطراف', 'الجلسة القادمة', 'المراجعة والمرفقات'];

  function updateDraft<K extends keyof NewCaseDraft>(key: K, value: NewCaseDraft[K]) {
    setDraft((current) => ({...current, [key]: value}));
  }

  function updateParty(partyId: string, field: keyof CaseParty, value: string) {
    setDraft((current) => ({
      ...current,
      parties: current.parties.map((party) => (party.id === partyId ? {...party, [field]: value} : party)),
    }));
  }

  function addParty() {
    setDraft((current) => ({...current, parties: [...current.parties, emptyParty()]}));
  }

  function removeParty(partyId: string) {
    setDraft((current) => ({
      ...current,
      parties: current.parties.length > 1 ? current.parties.filter((party) => party.id !== partyId) : current.parties,
    }));
  }

  async function onAttachFiles(fileList: FileList | null) {
    const attachments = await filesToAttachments(fileList);
    if (!attachments.length) return;
    setDraft((current) => ({...current, attachments: [...current.attachments, ...attachments]}));
  }

  function removeAttachment(attachmentId: string) {
    setDraft((current) => ({
      ...current,
      attachments: current.attachments.filter((attachment) => attachment.id !== attachmentId),
    }));
  }

  const canSave = draft.title.trim() && draft.number.trim() && draft.responsibleLawyer.trim();

  return (
    <>
      <Head
        title={mode === 'edit' ? 'تعديل القضية' : 'إضافة قضية جديدة'}
        sub="أصبح النموذج يدعم المبلغ المطلوب والمرفقات والحفظ الفعلي والتعديل"
        action={
          <span className="synced">
            <CheckCircle2 /> المسودة محفوظة محليًا
          </span>
        }
      />
      <div className="steps">
        {names.map((name, index) => (
          <div className={step === index + 1 ? 'active' : step > index + 1 ? 'done' : ''} key={name}>
            <span>{step > index + 1 ? 'âœ“' : index + 1}</span>
            <b>{name}</b>
          </div>
        ))}
      </div>
      <section className="wizard panel">
        <h2>{names[step - 1]}</h2>

        {step === 1 && (
          <div className="form">
            <label>
              اسم القضية
              <input onChange={(event) => updateDraft('title', event.target.value)} value={draft.title} />
            </label>
            <label>
              رقم القضية
              <input onChange={(event) => updateDraft('number', event.target.value)} value={draft.number} />
            </label>
            <label>
              سنة القضية
              <input onChange={(event) => updateDraft('year', event.target.value)} value={draft.year} />
            </label>
            <label>
              تصنيف القضية
              <select onChange={(event) => updateDraft('category', event.target.value as CaseCategory)} value={draft.category}>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              حالة القضية
              <select onChange={(event) => updateDraft('status', event.target.value as CaseStatus)} value={draft.status}>
                {caseStatuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              تاريخ تسجيل القضية
              <CalendarDateInput onChange={(value) => updateDraft('registrationDate', value)} value={draft.registrationDate} />
              <DatePreview value={draft.registrationDate} />
            </label>
            <label>
              المحامي المسؤول
              <input onChange={(event) => updateDraft('responsibleLawyer', event.target.value)} value={draft.responsibleLawyer} />
            </label>
            <label>
              المبلغ المطلوب
              <input onChange={(event) => updateDraft('amountClaimed', event.target.value)} value={draft.amountClaimed} />
            </label>
            <label className="full">
              ملاحظات
              <textarea onChange={(event) => updateDraft('notes', event.target.value)} value={draft.notes} />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="form">
            <label>
              المحكمة
              <select onChange={(event) => updateDraft('court', event.target.value as CourtType)} value={draft.court}>
                {courts.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              الدائرة
              <input onChange={(event) => updateDraft('chamber', event.target.value)} value={draft.chamber} />
            </label>
            <label>
              المدينة
              <input onChange={(event) => updateDraft('city', event.target.value)} value={draft.city} />
            </label>
            <div className="full party-section">
              <div className="sectiontitle">
                <h2>الأطراف</h2>
                <button onClick={addParty} type="button">
                  إضافة طرف
                </button>
              </div>
              <div className="party-stack">
                {draft.parties.map((party, index) => (
                  <article className="party-editor panel" key={party.id}>
                    <div className="party-editor-head">
                      <strong>الطرف {index + 1}</strong>
                      <button onClick={() => removeParty(party.id)} type="button">
                        حذف
                      </button>
                    </div>
                    <div className="party-editor-grid">
                      <label>
                        الاسم
                        <input onChange={(event) => updateParty(party.id, 'name', event.target.value)} value={party.name} />
                      </label>
                      <label>
                        الصفة
                        <select
                          onChange={(event) => updateParty(party.id, 'role', event.target.value)}
                          value={party.role}
                        >
                          {partyRoles.map((role) => (
                            <option key={role}>{role}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        الهوية / السجل
                        <input
                          onChange={(event) => updateParty(party.id, 'identityNumber', event.target.value)}
                          value={party.identityNumber}
                        />
                      </label>
                      <label>
                        الجوال
                        <input onChange={(event) => updateParty(party.id, 'mobile', event.target.value)} value={party.mobile} />
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form">
            <label>
              تاريخ الجلسة
              <CalendarDateInput onChange={(value) => updateDraft('hearingDate', value)} value={draft.hearingDate} />
              <DatePreview value={draft.hearingDate} />
            </label>
            <label>
              وقت الجلسة
              <input onChange={(event) => updateDraft('hearingTime', event.target.value)} type="time" value={draft.hearingTime} />
            </label>
            <label>
              حالة الجلسة
              <select
                onChange={(event) => updateDraft('hearingStatus', event.target.value as HearingStatus)}
                value={draft.hearingStatus}
              >
                {hearingStatuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="full">
              وصف الجلسة
              <textarea
                onChange={(event) => updateDraft('hearingDescription', event.target.value)}
                value={draft.hearingDescription}
              />
            </label>
            <label className="full">
              القرار أو الملاحظة
              <textarea onChange={(event) => updateDraft('hearingDecision', event.target.value)} value={draft.hearingDecision} />
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="review-grid">
            <article className="panel review-card">
              <small>القضية</small>
              <b>{draft.title || 'لم يكتب بعد'}</b>
              <p>
                {draft.number || '—'} / {draft.year}
              </p>
            </article>
            <article className="panel review-card">
              <small>المحكمة</small>
              <b>{draft.court}</b>
              <p>
                {draft.city} · {draft.chamber || 'بدون دائرة'}
              </p>
            </article>
            <article className="panel review-card">
              <small>المبلغ المطلوب</small>
              <b>{formatCurrency(draft.amountClaimed)}</b>
              <p>{draft.status}</p>
            </article>
            <article className="panel review-card">
              <small>الجلسة القادمة</small>
              <b>{draft.hearingDate ? `${formatDate(draft.hearingDate)} · ${draft.hearingTime}` : 'غير مضافة'}</b>
              <p>{draft.hearingDescription || 'بدون وصف للجلسة'}</p>
            </article>
            <article className="panel review-card full-review">
              <div className="sectiontitle">
                <h2>المستندات المرفقة</h2>
                <label className="upload-btn">
                  <FilePlus2 /> إرفاق مستند
                  <input multiple onChange={(event) => void onAttachFiles(event.target.files)} type="file" />
                </label>
              </div>
              {draft.attachments.length ? (
                <div className="attachment-stack">
                  {draft.attachments.map((attachment) => (
                    <article className="attachment-card" key={attachment.id}>
                      <div>
                        <small>الملف</small>
                        <b>{attachment.name}</b>
                        <p>{formatBytes(attachment.size)}</p>
                      </div>
                      <div className="attachment-actions">
                        <Btn kind="outline" onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}>
                          <Download /> تنزيل
                        </Btn>
                        <Btn kind="outline" onClick={() => removeAttachment(attachment.id)}>
                          حذف
                        </Btn>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-lite">لا توجد مرفقات بعد.</p>
              )}
            </article>
          </div>
        )}

        <footer>
          <small>يمكنك الرجوع لأي خطوة وتعديلها قبل الحفظ النهائي.</small>
          <div>
            {step > 1 && (
              <Btn kind="outline" onClick={() => setStep(step - 1)}>
                السابق
              </Btn>
            )}{' '}
            {step < 4 ? (
              <Btn onClick={() => setStep(step + 1)}>التالي: {names[step]}</Btn>
            ) : (
              <Btn onClick={onSave} kind={canSave ? 'primary' : 'outline'}>
                {mode === 'edit' ? 'حفظ التعديلات' : 'حفظ القضية'}
              </Btn>
            )}
          </div>
        </footer>
      </section>
    </>
  );
}

function Sessions({
  cases,
  monitorItems,
  openCase,
  onUpdateCase,
}: {
  cases: CaseRecord[];
  monitorItems: MonitorItem[];
  openCase: (id: string) => void;
  onUpdateCase: (id: string, updater: (record: CaseRecord) => CaseRecord) => void;
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'الكل' | HearingStatus>('الكل');
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [showForm, setShowForm] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id ?? '');
  const [editingSession, setEditingSession] = useState<{caseId: string; hearingId: string} | null>(null);
  const [form, setForm] = useState<Hearing>({
    id: '',
    date: '',
    time: '10:00',
    court: '',
    chamber: '',
    description: '',
    decision: '',
    status: 'قادمة',
  });
  const sessions = cases.flatMap((record) =>
    record.hearings.map((hearing) => ({
      caseId: record.id,
      caseTitle: record.title,
      city: record.city,
      ...hearing,
    })),
  );

  const shown = sessions
    .filter((session) => {
      const haystack = [session.caseTitle, session.court, session.chamber, session.description, session.city, session.date]
        .join(' ')
        .toLowerCase();
      const matchQuery = haystack.includes(query.toLowerCase());
      const matchStatus = status === 'الكل' ? true : session.status === status;
      return matchQuery && matchStatus;
    })
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));


  const monthSessions = shown.filter((session) => {
    const date = new Date(`${session.date}T12:00:00`);
    return date.getFullYear() === visibleMonth.getFullYear() && date.getMonth() === visibleMonth.getMonth();
  });
  const calendarEvents = [
    ...sessions.map((session) => ({
      id: `hearing-${session.caseId}-${session.id}`,
      date: session.date,
      time: session.time,
      title: session.description || session.caseTitle,
      subtitle: session.caseTitle,
      kind: 'جلسة',
      tone: session.status === hearingStatuses[1] ? 'ok' : session.status === hearingStatuses[0] ? 'info' : 'warn',
      session,
    })),
    ...cases.flatMap((record) => record.tasks.map((task) => ({
      id: `task-${record.id}-${task.id}`,
      date: task.dueDate,
      time: '',
      title: task.title,
      subtitle: record.title,
      kind: 'مهمة',
      tone: task.status === taskStatuses[2] ? 'ok' : getDaysUntil(task.dueDate) < 0 || task.priority === taskPriorities[3] ? 'danger' : 'task',
      session: null,
    }))).filter((event) => event.date),
    ...monitorItems.map((item) => ({
      id: `monitor-${item.id}`,
      date: item.endDate,
      time: '',
      title: item.name,
      subtitle: item.type,
      kind: getMonitorStatus(item),
      tone: item.completed ? 'ok' : getMonitorTone(item),
      session: null,
    })).filter((event) => event.date),
  ].filter((event) => {
    const haystack = [event.title, event.subtitle, event.kind, event.date].join(' ').toLowerCase();
    const matchQuery = haystack.includes(query.toLowerCase());
    const matchStatus = status === 'الكل' ? true : event.session ? event.session.status === status : true;
    return matchQuery && matchStatus;
  });
  const monthEvents = calendarEvents.filter((event) => {
    const date = new Date(`${event.date}T12:00:00`);
    return date.getFullYear() === visibleMonth.getFullYear() && date.getMonth() === visibleMonth.getMonth();
  });
  const monthTaskEvents = monthEvents.filter((event) => event.kind === 'مهمة').length;
  const monthMonitorEvents = monthEvents.filter((event) => event.id.startsWith('monitor-')).length;
  const todayEvents = calendarEvents.filter((event) => event.date === toIsoDate(new Date())).length;
  const calendarStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1 - visibleMonth.getDay());
  const calendarDays = Array.from({length: 42}, (_, index) => {
    const date = new Date(calendarStart.getFullYear(), calendarStart.getMonth(), calendarStart.getDate() + index);
    const iso = toIsoDate(date);
    return {
      date,
      iso,
      currentMonth: date.getMonth() === visibleMonth.getMonth(),
      today: iso === toIsoDate(new Date()),
      sessions: shown.filter((session) => session.date === iso),
      events: calendarEvents.filter((event) => event.date === iso),
    };
  });
  const upcomingMonthSessions = monthSessions.filter((session) => session.status === hearingStatuses[0]).length;
  const completedMonthSessions = monthSessions.filter((session) => session.status === hearingStatuses[1]).length;
  const otherMonthSessions = monthSessions.length - upcomingMonthSessions - completedMonthSessions;
  const todaySessions = shown.filter((session) => session.date === toIsoDate(new Date())).length;

  const gregorianMonthTitle = new Intl.DateTimeFormat('ar-SA', {month: 'long', year: 'numeric'}).format(visibleMonth);
  const hijriMonthTitle = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {month: 'long', year: 'numeric'}).format(
    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 15),
  );

  function resetForm(date = '') {
    const baseCase = cases.find((record) => record.id === selectedCaseId) ?? cases[0];
    setEditingSession(null);
    setForm({
      id: '',
      date,
      time: '10:00',
      court: baseCase?.court ?? '',
      chamber: baseCase?.chamber ?? '',
      description: '',
      decision: '',
      status: 'قادمة',
    });
  }

  function saveSession() {
    if (!selectedCaseId || !form.date || !form.time) return;
    const built = {...form, id: editingSession?.hearingId ?? `hearing-${Date.now()}`};
    onUpdateCase(selectedCaseId, (current) => ({
      ...current,
      hearings: editingSession
        ? current.hearings.map((item) => (item.id === editingSession.hearingId ? built : item))
        : [...current.hearings, built],
      nextTask: built.description || current.nextTask,
    }));
    playSuccessSound();
    setShowForm(false);
    resetForm();
  }

  function editSession(caseId: string, hearing: Hearing) {
    setSelectedCaseId(caseId);
    setEditingSession({caseId, hearingId: hearing.id});
    setForm(hearing);
    setShowForm(true);
  }

  function deleteSession(caseId: string, hearingId: string) {
    if (!window.confirm('هل تريد حذف هذه الجلسة نهائيًا؟')) return;
    onUpdateCase(caseId, (current) => ({
      ...current,
      hearings: current.hearings.filter((item) => item.id !== hearingId),
    }));
  }

  return (
    <>
      <Head
        title="الجلسات"
        sub="عرض مركزي لكل الجلسات القادمة والمنتهية والمؤجلة مع إدارة مباشرة من نفس الصفحة"
        action={<Btn onClick={() => { resetForm(); setShowForm((value) => !value); }}>إضافة جلسة</Btn>}
      />
      {showForm && (
        <section className="panel inline-form">
          <h2>{editingSession ? 'تعديل الجلسة' : 'إضافة جلسة جديدة'}</h2>
          <div className="form">
            <label>
              القضية
              <select onChange={(event) => setSelectedCaseId(event.target.value)} value={selectedCaseId}>
                {cases.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              تاريخ الجلسة
              <CalendarDateInput onChange={(value) => setForm({...form, date: value})} value={form.date} />
              <DatePreview value={form.date} />
            </label>
            <label>
              وقت الجلسة
              <input onChange={(event) => setForm({...form, time: event.target.value})} type="time" value={form.time} />
            </label>
            <label>
              المحكمة
              <input onChange={(event) => setForm({...form, court: event.target.value})} value={form.court} />
            </label>
            <label>
              الدائرة
              <input onChange={(event) => setForm({...form, chamber: event.target.value})} value={form.chamber} />
            </label>
            <label>
              الحالة
              <select onChange={(event) => setForm({...form, status: event.target.value as HearingStatus})} value={form.status}>
                {hearingStatuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="full">
              الوصف
              <textarea onChange={(event) => setForm({...form, description: event.target.value})} value={form.description} />
            </label>
            <label className="full">
              القرار
              <textarea onChange={(event) => setForm({...form, decision: event.target.value})} value={form.decision} />
            </label>
          </div>
          <div className="form-actions">
            <Btn kind="outline" onClick={() => setShowForm(false)}>
              إغلاق
            </Btn>
            <Btn onClick={saveSession}>{editingSession ? 'حفظ التعديل' : 'حفظ الجلسة'}</Btn>
          </div>
        </section>
      )}
      <div className="tools panel">
        <div className="search">
          <Search />
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث بالمحكمة أو القضية أو وصف الجلسة"
            value={query}
          />
        </div>
        <div className="chips">
          {(['الكل', ...hearingStatuses] as const).map((item) => (
            <button className={status === item ? 'active' : ''} key={item} onClick={() => setStatus(item)} type="button">
              {item}
            </button>
          ))}
        </div>
        <div className="chips view-switcher">
          <button className={view === 'calendar' ? 'active' : ''} onClick={() => setView('calendar')} type="button">تقويم شهري</button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} type="button">قائمة</button>
        </div>
      </div>
      {view === 'calendar' ? (
        <section className="panel sessions-calendar">
          <header className="calendar-toolbar calendar-toolbar-rich">
            <div>
              <small className="calendar-kicker">التقويم الشامل</small>
              <h2>{currentCalendarMode === 'hijri' ? hijriMonthTitle : gregorianMonthTitle}</h2>
              <small>{currentCalendarMode === 'hijri' ? gregorianMonthTitle : hijriMonthTitle}</small>
            </div>
            <div className="calendar-mini-stats" aria-label="ملخص أحداث التقويم">
              <span><b>{monthEvents.length}</b>أحداث الشهر</span><span><b>{monthSessions.length}</b>جلسات</span><span><b>{monthTaskEvents}</b>مهام</span><span><b>{monthMonitorEvents}</b>انتهاءات</span>
              <span><b>{upcomingMonthSessions}</b>قادمة</span>
              <span><b>{todayEvents}</b>اليوم</span>
            </div>
            <div className="calendar-nav">
              <Btn kind="outline" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}>الشهر السابق</Btn>
              <Btn kind="outline" onClick={() => setVisibleMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>اليوم</Btn>
              <Btn kind="outline" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}>الشهر التالي</Btn>
            </div>
          </header>
          <div className="calendar-weekdays">
            {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => <b key={day}>{day}</b>)}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((day) => (
              <div
                className={`calendar-day ${day.currentMonth ? '' : 'muted'} ${day.today ? 'today' : ''} ${day.events.length ? 'has-sessions' : ''} ${day.events.some((event) => event.tone === 'info') ? 'has-upcoming' : ''} ${day.events.some((event) => event.tone === 'ok') ? 'has-completed' : ''} ${day.events.some((event) => event.tone === 'warn' || event.tone === 'danger' || event.tone === 'task') ? 'has-warn' : ''}`}
                key={day.iso}
                onClick={() => { resetForm(day.iso); setShowForm(true); }}
                onKeyDown={(event) => { if (event.key === 'Enter') { resetForm(day.iso); setShowForm(true); } }}
                role="button"
                tabIndex={0}
              >
                <span>{new Intl.DateTimeFormat(currentCalendarMode === 'hijri' ? 'ar-SA-u-ca-islamic-umalqura' : 'ar-SA', {day: 'numeric'}).format(day.date)}</span>
                <div>
                  {day.events.slice(0, 3).map((calendarEvent) => (
                    <button
                      className={`calendar-event ${calendarEvent.tone === 'ok' ? 'ok' : calendarEvent.tone === 'info' ? 'info' : calendarEvent.tone === 'task' ? 'task' : calendarEvent.tone === 'danger' ? 'danger' : 'warn'}`}
                      key={calendarEvent.id}
                      onClick={(event) => { event.stopPropagation(); if (calendarEvent.session) editSession(calendarEvent.session.caseId, calendarEvent.session); }}
                      type="button"
                    >
                      <b>{calendarEvent.time || calendarEvent.kind}</b>
                      <span>{calendarEvent.title}</span>
                      <small>{calendarEvent.subtitle}</small>
                    </button>
                  ))}
                  {day.events.length > 3 ? <small>+{day.events.length - 3} أحداث</small> : null}
                </div>
              </div>
            ))}
          </div>
          <footer className="calendar-legend" aria-label="دليل ألوان التقويم">
            <b>دليل الألوان</b>
            <span className="legend-info">جلسة قادمة</span>
            <span className="legend-ok">مكتمل</span>
            <span className="legend-warn">انتهاء أو استحقاق</span><span className="legend-task">مهمة</span>
            <span className="legend-gold">اليوم</span>
          </footer>
        </section>
      ) : shown.length ? (
        <div className="session-list">
          {shown.map((session) => (
            <article className="panel session-row" key={session.id}>
              <div>
                <small>القضية</small>
                <b>{session.caseTitle}</b>
                <p>{session.description || 'جلسة قضائية'}</p>
              </div>
              <div>
                <small>الموعد</small>
                <b>
                  {formatDate(session.date)} · {session.time}
                </b>
                <p>{session.status}</p>
              </div>
              <div>
                <small>المحكمة</small>
                <b>{session.court}</b>
                <p>{session.chamber || session.city || 'بدون دائرة'}</p>
              </div>
              <div className="session-row-actions">
                <Status
                  text={session.status}
                  tone={session.status === 'قادمة' ? 'info' : session.status === 'تمت' ? 'ok' : 'warn'}
                />
                <Btn kind="outline" onClick={() => editSession(session.caseId, session)}>
                  تعديل
                </Btn>
                <Btn kind="outline" onClick={() => deleteSession(session.caseId, session.id)}>
                  حذف
                </Btn>
                <Btn kind="outline" onClick={() => openCase(session.caseId)}>
                  فتح القضية
                </Btn>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty panel">
          <CalendarDays />
          <h2>لا توجد جلسات مطابقة</h2>
          <p>جرّب تغيير حالة الجلسة أو كلمات البحث.</p>
        </div>
      )}
    </>
  );
}

function TasksPage({
  cases,
  openCase,
  onUpdateCase,
}: {
  cases: CaseRecord[];
  openCase: (id: string) => void;
  onUpdateCase: (id: string, updater: (record: CaseRecord) => CaseRecord) => void;
}) {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<'الكل' | TaskPriority>('الكل');
  const [status, setStatus] = useState<'الكل' | TaskStatus>('الكل');
  const [showForm, setShowForm] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id ?? '');
  const [editingTask, setEditingTask] = useState<{caseId: string; taskId: string} | null>(null);
  const [taskForm, setTaskForm] = useState<CaseTask>({
    id: '', title: '', owner: '', dueDate: todayIsoDate(), priority: 'متوسطة', status: 'مفتوحة',
  });
  const tasks = cases.flatMap((record) =>
    record.tasks.map((task) => ({
      caseId: record.id,
      caseTitle: record.title,
      ...task,
    })),
  );

  const openTasks = tasks.filter((task) => task.status !== 'مكتملة');
  const overdueTasks = openTasks.filter((task) => task.dueDate && getDaysUntil(task.dueDate) < 0);
  const urgentTasks = openTasks.filter((task) => task.priority === 'عاجلة' || task.priority === 'عالية');
  const completedTasks = tasks.filter((task) => task.status === 'مكتملة');

  const shown = tasks
    .filter((task) => {
      const haystack = [task.title, task.owner, task.caseTitle, task.dueDate].join(' ').toLowerCase();
      const matchQuery = haystack.includes(query.toLowerCase());
      const matchPriority = priority === 'الكل' ? true : task.priority === priority;
      const matchStatus = status === 'الكل' ? true : task.status === status;
      return matchQuery && matchPriority && matchStatus;
    })
    .sort((a, b) => {
      const aDate = a.dueDate || '9999-12-31';
      const bDate = b.dueDate || '9999-12-31';
      const dateOrder = aDate.localeCompare(bDate);
      if (dateOrder !== 0) return dateOrder;
      return taskPriorities.indexOf(b.priority) - taskPriorities.indexOf(a.priority);
    });

  function resetTaskForm() {
    setEditingTask(null);
    setTaskForm({id: '', title: '', owner: '', dueDate: todayIsoDate(), priority: 'متوسطة', status: 'مفتوحة'});
  }

  function startNewTask() {
    resetTaskForm();
    setSelectedCaseId(cases[0]?.id ?? '');
    setShowForm(true);
  }

  function editTask(task: CaseTask & {caseId: string}) {
    setSelectedCaseId(task.caseId);
    setEditingTask({caseId: task.caseId, taskId: task.id});
    setTaskForm({
      id: task.id,
      title: task.title,
      owner: task.owner,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
    setShowForm(true);
  }

  function saveTask() {
    if (!selectedCaseId || !taskForm.title.trim()) return;
    const built = {...taskForm, id: editingTask?.taskId ?? `task-${Date.now()}`, title: taskForm.title.trim()};
    onUpdateCase(selectedCaseId, (record) => ({
      ...record,
      tasks: editingTask
        ? record.tasks.map((task) => (task.id === editingTask.taskId ? built : task))
        : [...record.tasks, built],
      nextTask: built.status === 'مكتملة' ? record.nextTask : built.title,
    }));
    playSuccessSound();
    setShowForm(false);
    resetTaskForm();
  }

  function deleteTask(caseId: string, taskId: string, title: string) {
    if (!window.confirm(`هل تريد حذف المهمة «${title}آ» نهائيًا؟`)) return;
    onUpdateCase(caseId, (record) => ({...record, tasks: record.tasks.filter((task) => task.id !== taskId)}));
    if (editingTask?.taskId === taskId) {
      setShowForm(false);
      resetTaskForm();
    }
  }

  function toggleTaskDone(task: CaseTask & {caseId: string}) {
    const nextStatus: TaskStatus = task.status === 'مكتملة' ? 'مفتوحة' : 'مكتملة';
    onUpdateCase(task.caseId, (record) => ({
      ...record,
      tasks: record.tasks.map((item) => (item.id === task.id ? {...item, status: nextStatus} : item)),
      nextTask: nextStatus === 'مكتملة' && record.nextTask === task.title ? 'مراجعة القضية' : record.nextTask,
    }));
    playSuccessSound();
  }

  return (
    <>
      <Head
        action={<Btn onClick={startNewTask}><Plus /> إضافة مهمة</Btn>}
        title="المهام"
        sub="لوحة مركزية لإضافة المهام وتعديلها وحذفها حسب التاريخ والأولوية والحالة"
      />
      <section className="task-summary-grid">
        <article className="panel task-summary-card">
          <small>المهام المفتوحة</small>
          <b>{openTasks.length}</b>
        </article>
        <article className="panel task-summary-card danger">
          <small>المهام المتأخرة</small>
          <b>{overdueTasks.length}</b>
        </article>
        <article className="panel task-summary-card warn">
          <small>عالية أو عاجلة</small>
          <b>{urgentTasks.length}</b>
        </article>
        <article className="panel task-summary-card ok">
          <small>المهام المكتملة</small>
          <b>{completedTasks.length}</b>
        </article>
      </section>
      {showForm ? (
        <section className="panel inline-form">
          <h2>{editingTask ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}</h2>
          <div className="form">
            <label>
              القضية المرتبطة
              <select disabled={Boolean(editingTask)} onChange={(event) => setSelectedCaseId(event.target.value)} value={selectedCaseId}>
                {cases.map((record) => <option key={record.id} value={record.id}>{record.title}</option>)}
              </select>
            </label>
            <label>
              اسم المهمة
              <input onChange={(event) => setTaskForm({...taskForm, title: event.target.value})} value={taskForm.title} />
            </label>
            <label>
              المسؤول
              <input onChange={(event) => setTaskForm({...taskForm, owner: event.target.value})} value={taskForm.owner} />
            </label>
            <label>
              تاريخ الاستحقاق
              <CalendarDateInput onChange={(value) => setTaskForm({...taskForm, dueDate: value})} value={taskForm.dueDate} />
              <DatePreview value={taskForm.dueDate} />
            </label>
            <label>
              الأولوية
              <select onChange={(event) => setTaskForm({...taskForm, priority: event.target.value as TaskPriority})} value={taskForm.priority}>
                {taskPriorities.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              الحالة
              <select onChange={(event) => setTaskForm({...taskForm, status: event.target.value as TaskStatus})} value={taskForm.status}>
                {taskStatuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="form-actions">
            <Btn kind="outline" onClick={() => { setShowForm(false); resetTaskForm(); }}>إغلاق</Btn>
            <Btn onClick={saveTask}>{editingTask ? 'حفظ التعديلات' : 'حفظ المهمة'}</Btn>
          </div>
        </section>
      ) : null}
      <div className="tools panel">
        <div className="search">
          <Search />
          <input onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم المهمة أو المسؤول أو القضية" value={query} />
        </div>
        <div className="chips">
          {(['الكل', ...taskPriorities] as const).map((item) => (
            <button className={priority === item ? 'active' : ''} key={item} onClick={() => setPriority(item)} type="button">
              {item}
            </button>
          ))}
        </div>
        <div className="chips">
          {(['الكل', ...taskStatuses] as const).map((item) => (
            <button className={status === item ? 'active' : ''} key={item} onClick={() => setStatus(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </div>
      {shown.length ? (
        <div className="session-list">
          {shown.map((task) => (
            <article className={`panel session-row task-row ${task.status !== 'مكتملة' && task.dueDate && getDaysUntil(task.dueDate) < 0 ? 'task-overdue' : ''}`} key={task.id}>
              <div>
                <small>المهمة</small>
                <b>{task.title}</b>
                <p>{task.caseTitle}</p>
              </div>
              <div>
                <small>المسؤول / الاستحقاق</small>
                <b>{task.owner || 'غير محدد'}</b>
                <p>{task.dueDate ? formatDate(task.dueDate) : 'بلا تاريخ'}</p>
              </div>
              <div>
                <small>الأولوية / الحالة</small>
                <Status text={task.priority} tone={getTaskTone(task.priority)} />
                <p>{task.status}</p>
              </div>
              <div className="session-row-actions">
                <Btn kind={task.status === 'مكتملة' ? 'outline' : 'gold'} onClick={() => toggleTaskDone(task)}>
                  {task.status === 'مكتملة' ? 'إعادة فتح' : 'إنجاز'}
                </Btn>
                <Btn kind="outline" onClick={() => editTask(task)}><Pencil /> تعديل</Btn>
                <Btn kind="danger" onClick={() => deleteTask(task.caseId, task.id, task.title)}><Trash2 /> حذف</Btn>
                <Btn kind="outline" onClick={() => openCase(task.caseId)}>
                  فتح القضية
                </Btn>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty panel">
          <Bell />
          <h2>لا توجد مهام مطابقة</h2>
          <p>جرّب تغيير الحالة أو الأولوية أو عبارة البحث.</p>
        </div>
      )}
    </>
  );
}

function MonitoringPage({
  items,
  setItems,
  onNotice,
}: {
  items: MonitorItem[];
  setItems: React.Dispatch<React.SetStateAction<MonitorItem[]>>;
  onNotice: (message: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'الكل' | MonitorItemType>('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [dueFilter, setDueFilter] = useState<'الكل' | '7' | '30' | 'منتهي' | 'متأخر'>('الكل');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renewingFrom, setRenewingFrom] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<MonitorItem>(emptyMonitorItem());

  const shown = items
    .filter((item) => {
      const status = getMonitorStatus(item);
      const days = getDaysUntil(item.endDate);
      const haystack = [item.type, item.name, item.referenceNumber, item.identityNumber, item.policyNumber, item.vehiclePlate, item.notes]
        .join(' ')
        .toLowerCase();
      const matchQuery = haystack.includes(query.toLowerCase());
      const matchType = typeFilter === 'الكل' || item.type === typeFilter;
      const matchStatus = statusFilter === 'الكل' || status === statusFilter;
      const matchDue =
        dueFilter === 'الكل' ||
        (dueFilter === '7' && days >= 0 && days <= 7) ||
        (dueFilter === '30' && days >= 0 && days <= 30) ||
        (dueFilter === 'منتهي' && status === 'منتهي') ||
        (dueFilter === 'متأخر' && status === 'متأخر');
      return matchQuery && matchType && matchStatus && matchDue;
    })
    .sort((a, b) => a.endDate.localeCompare(b.endDate));

  function startNew() {
    setEditingId(null);
    setRenewingFrom('');
    setForm(emptyMonitorItem());
    setShowForm(true);
  }

  function startEdit(item: MonitorItem) {
    setEditingId(item.id);
    setRenewingFrom('');
    setForm(normalizeMonitorItem(item));
    setShowForm(true);
  }

  function startRenewal(item: MonitorItem) {
    setEditingId(item.id);
    setRenewingFrom(item.endDate);
    setForm(normalizeMonitorItem(item));
    setShowForm(true);
  }

  async function addFiles(fileList: FileList | null) {
    const attachments = await filesToAttachments(fileList);
    if (!attachments.length) return;
    setForm((current) => ({...current, attachments: [...current.attachments, ...attachments]}));
  }

  function saveItem() {
    if (!form.name.trim() || !form.endDate) return;
    const built: MonitorItem = {
      ...form,
      id: editingId ?? `monitor-${Date.now()}`,
      name: form.name.trim(),
      renewals:
        renewingFrom && renewingFrom !== form.endDate
          ? [
              ...form.renewals,
              {
                id: `renewal-${Date.now()}`,
                previousEndDate: renewingFrom,
                newEndDate: form.endDate,
                notes: form.notes,
                createdAt: new Date().toISOString(),
              },
            ]
          : form.renewals,
    };
    setItems((current) => (editingId ? current.map((item) => (item.id === editingId ? built : item)) : [built, ...current]));
    playSuccessSound();
    onNotice(renewingFrom ? 'تم تجديد العنصر وحفظ سجل التجديد.' : editingId ? 'تم حفظ التعديلات.' : 'تمت إضافة العنصر.');
    setSelectedId(built.id);
    setShowForm(false);
    setEditingId(null);
    setRenewingFrom('');
    setForm(emptyMonitorItem());
  }

  function deleteItem(item: MonitorItem) {
    if (!window.confirm(`هل تريد حذف «${item.name}آ» نهائيًا؟`)) return;
    setItems((current) => current.filter((record) => record.id !== item.id));
    if (selectedId === item.id) setSelectedId(null);
    onNotice('تم حذف العنصر.');
  }

  function toggleCompleted(item: MonitorItem) {
    setItems((current) => current.map((record) => (record.id === item.id ? {...record, completed: !record.completed} : record)));
    onNotice(item.completed ? 'تمت إعادة العنصر إلى المتابعة.' : 'تم وضع العنصر كمكتمل.');
  }

  const vehicleType = ['تأمين السيارات', 'استمارة السيارات', 'كرت تشغيل السيارات', 'تفويضات السيارات'].includes(form.type);
  const insuranceType = form.type === 'تأمين الموظفين' || form.type === 'تأمين السيارات';
  const amountType = form.type === 'عقود الإيجار' || form.type === 'مستحقات الإيجار' || form.type === 'سجلات ورخص واشتراكات';

  return (
    <>
      <Head
        action={<Btn onClick={startNew}><Plus /> إضافة جديد</Btn>}
        title="مراقبة الانتهاءات والاستحقاقات"
        sub="متابعة العقود والإقامات والتأمينات والمركبات والرخص والمستحقات من مكان واحد"
      />

      {showForm ? (
        <section className="panel inline-form monitor-form">
          <h2>{renewingFrom ? 'تجديد العنصر' : editingId ? 'تعديل العنصر' : 'إضافة عنصر جديد'}</h2>
          <div className="form">
            <label>
              نوع العنصر
              <select onChange={(event) => setForm({...form, type: event.target.value as MonitorItemType})} value={form.type}>
                {monitorItemTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label>
              الاسم أو الوصف
              <input onChange={(event) => setForm({...form, name: event.target.value})} value={form.name} />
            </label>
            <label>
              الرقم المرجعي
              <input onChange={(event) => setForm({...form, referenceNumber: event.target.value})} value={form.referenceNumber} />
            </label>
            <label>
              تاريخ البداية
              <CalendarDateInput onChange={(value) => setForm({...form, startDate: value})} value={form.startDate} />
              <DatePreview value={form.startDate} />
            </label>
            <label>
              تاريخ الانتهاء / الاستحقاق
              <CalendarDateInput onChange={(value) => setForm({...form, endDate: value})} value={form.endDate} />
              <DatePreview value={form.endDate} />
            </label>
            {amountType ? <label>المبلغ<input onChange={(event) => setForm({...form, amount: event.target.value})} value={form.amount} /></label> : null}
            {form.type === 'مستحقات الإيجار' ? (
              <>
                <label>حالة السداد<select onChange={(event) => setForm({...form, paymentStatus: event.target.value as MonitorPaymentStatus})} value={form.paymentStatus}><option value="">غير محدد</option><option>غير مسدد</option><option>مسدد</option><option>متأخر</option></select></label>
                <label>دورية الاستحقاق<select onChange={(event) => setForm({...form, recurrence: event.target.value as MonitorRecurrence})} value={form.recurrence}>{(['مرة واحدة', 'شهري', 'ربع سنوي', 'نصف سنوي', 'سنوي'] as const).map((item) => <option key={item}>{item}</option>)}</select></label>
              </>
            ) : null}
            {form.type === 'الإقامات' ? <label>رقم الهوية / الإقامة<input onChange={(event) => setForm({...form, identityNumber: event.target.value})} value={form.identityNumber} /></label> : null}
            {insuranceType ? <label>رقم البوليصة<input onChange={(event) => setForm({...form, policyNumber: event.target.value})} value={form.policyNumber} /></label> : null}
            {vehicleType ? <label>رقم السيارة حروف وأرقام<input onChange={(event) => setForm({...form, vehiclePlate: event.target.value})} value={form.vehiclePlate} /></label> : null}
            {form.type === 'تفويضات السيارات' ? (
              <><label>اسم المفوض<input onChange={(event) => setForm({...form, delegatedBy: event.target.value})} value={form.delegatedBy} /></label><label>اسم المفوض إليه<input onChange={(event) => setForm({...form, delegatedTo: event.target.value})} value={form.delegatedTo} /></label></>
            ) : null}
            {form.type === 'مهام عامة' ? <label>الأولوية<select onChange={(event) => setForm({...form, priority: event.target.value as TaskPriority})} value={form.priority}>{taskPriorities.map((item) => <option key={item}>{item}</option>)}</select></label> : null}
            <label className="full">
              مواعيد التنبيه
              <div className="chips reminder-chips">
                {monitorAlertOffsets.map((offset) => {
                  const active = form.alertOffsets.includes(offset);
                  return <button className={active ? 'active' : ''} key={offset} onClick={() => setForm({...form, alertOffsets: active ? form.alertOffsets.filter((item) => item !== offset) : [...form.alertOffsets, offset].sort((a, b) => b - a)})} type="button">{offset === 0 ? 'نفس اليوم' : `قبل ${offset} يوم`}</button>;
                })}
              </div>
            </label>
            <label className="full">ملاحظات<textarea onChange={(event) => setForm({...form, notes: event.target.value})} value={form.notes} /></label>
            <label className="full">مرفقات اختيارية<input multiple onChange={(event) => void addFiles(event.target.files)} type="file" /></label>
          </div>
          {form.attachments.length ? <div className="attachment-stack">{form.attachments.map((attachment) => <article className="attachment-card" key={attachment.id}><div><b>{attachment.name}</b><small>{formatBytes(attachment.size)}</small></div><Btn kind="outline" onClick={() => setForm({...form, attachments: form.attachments.filter((item) => item.id !== attachment.id)})}>حذف</Btn></article>)}</div> : null}
          <div className="form-actions"><Btn kind="outline" onClick={() => { setShowForm(false); setEditingId(null); setRenewingFrom(''); }}>إغلاق</Btn><Btn onClick={saveItem}>{renewingFrom ? 'حفظ التجديد' : editingId ? 'حفظ التعديلات' : 'حفظ العنصر'}</Btn></div>
        </section>
      ) : null}

      <div className="tools panel monitor-tools">
        <div className="search"><Search /><input onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو الرقم أو اللوحة" value={query} /></div>
        <select onChange={(event) => setTypeFilter(event.target.value as 'الكل' | MonitorItemType)} value={typeFilter}><option>الكل</option>{monitorItemTypes.map((type) => <option key={type}>{type}</option>)}</select>
        <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option>الكل</option>{['ساري', 'ينتهي قريبًا', 'منتهي', 'مستحق قريبًا', 'متأخر', 'مكتمل'].map((status) => <option key={status}>{status}</option>)}</select>
        <div className="chips">{([['الكل', 'الكل'], ['7 أيام', '7'], ['30 يوم', '30'], ['منتهي', 'منتهي'], ['متأخر', 'متأخر']] as const).map(([label, value]) => <button className={dueFilter === value ? 'active' : ''} key={value} onClick={() => setDueFilter(value)} type="button">{label}</button>)}</div>
      </div>

      {shown.length ? (
        <div className="monitor-list">
          <div className="monitor-table monitor-table-head"><b>النوع</b><b>الاسم / الرقم</b><b>الانتهاء</b><b>المبلغ</b><b>الحالة</b><b>المتبقي</b><b>الإجراءات</b></div>
          {shown.map((item) => {
            const days = getDaysUntil(item.endDate);
            const open = selectedId === item.id;
            return <div key={item.id}>
              <article className="panel monitor-table"><span>{item.type}</span><div><b>{item.name}</b><small>{item.referenceNumber || item.vehiclePlate || item.identityNumber || 'بدون رقم'}</small></div><span>{formatDate(item.endDate)}</span><span>{item.amount ? formatCurrency(item.amount) : '—'}</span><Status text={getMonitorStatus(item)} tone={getMonitorTone(item)} /><b className={days < 0 ? 'text-danger' : ''}>{Number.isFinite(days) ? (days < 0 ? `متأخر ${Math.abs(days)} يوم` : `${days} يوم`) : '—'}</b><div className="card-actions"><Btn kind="outline" onClick={() => setSelectedId(open ? null : item.id)}>{open ? 'إغلاق' : 'عرض'}</Btn><Btn kind="outline" onClick={() => startEdit(item)}><Pencil /> تعديل</Btn><Btn kind="outline" onClick={() => startRenewal(item)}>تجديد</Btn><Btn kind={item.completed ? 'outline' : 'gold'} onClick={() => toggleCompleted(item)}>{item.completed ? 'إعادة للمتابعة' : 'مكتمل'}</Btn><Btn kind="danger" onClick={() => deleteItem(item)}><Trash2 /> حذف</Btn></div></article>
              {open ? <section className="panel inline-detail"><div className="summary-grid"><div><small>تاريخ البداية</small><b>{formatDate(item.startDate)}</b></div><div><small>تاريخ الانتهاء</small><b>{formatDate(item.endDate)}</b></div><div><small>التنبيهات</small><b>{item.alertOffsets.map((offset) => offset === 0 ? 'نفس اليوم' : `${offset} يوم`).join('، ')}</b></div><div><small>التجديدات السابقة</small><b>{item.renewals.length}</b></div></div><p className="notes-box">{item.notes || 'لا توجد ملاحظات.'}</p>{item.attachments.length ? <div className="attachment-stack">{item.attachments.map((attachment) => <article className="attachment-card" key={attachment.id}><div><b>{attachment.name}</b><small>{formatBytes(attachment.size)}</small></div><Btn kind="outline" onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}><Download /> تنزيل</Btn></article>)}</div> : <p className="empty-lite">لا توجد مرفقات.</p>}</section> : null}
            </div>;
          })}
        </div>
      ) : <div className="empty panel"><Hourglass /><h2>لا توجد عناصر مطابقة</h2><p>أضف أول عنصر أو غيّر الفلاتر.</p><Btn onClick={startNew}><Plus /> إضافة جديد</Btn></div>}
    </>
  );
}

function UsersPanel({users, setUsers, currentUserId, maxUsers}: {
  users: UserAccount[];
  setUsers: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  currentUserId: string;
  maxUsers: number;
}) {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState<Page[]>(['dashboard', 'cases', 'sessions', 'tasks']);
  const [message, setMessage] = useState('');
  const [editingUserId, setEditingUserId] = useState('');
  const [editName, setEditName] = useState('');
  const [editIdentifier, setEditIdentifier] = useState('');
  const [editPassword, setEditPassword] = useState('');

  async function addUser() {
    if (users.length >= maxUsers) return setMessage(`الترخيص الحالي يسمح بعدد ${maxUsers} مستخدم فقط.`);
    const normalized = identifier.trim().toLowerCase();
    if (!name.trim() || !normalized || password.length < 6) return setMessage('أدخل الاسم والبريد/الجوال وكلمة مرور من 6 أحرف على الأقل.');
    if (users.some((user) => user.identifier === normalized)) return setMessage('هذا البريد أو الجوال مسجل مسبقاً.');
    const account: UserAccount = {id: crypto.randomUUID(), name: name.trim(), identifier: normalized, passwordHash: await hashPassword(password), role: 'user', permissions, createdAt: new Date().toISOString()};
    setUsers((current) => [...current, account]);
    setName(''); setIdentifier(''); setPassword(''); setMessage('تم إنشاء المستخدم بنجاح.');
  }

  function togglePermission(userId: string, page: Page) {
    setUsers((current) => current.map((user) => {
      if (user.id !== userId || user.role === 'admin') return user;
      const currentPermissions = user.permissions ?? [];
      return {...user, permissions: currentPermissions.includes(page) ? currentPermissions.filter((item) => item !== page) : [...currentPermissions, page]};
    }));
  }

  function startEditUser(user: UserAccount) {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditIdentifier(user.identifier);
    setEditPassword('');
    setMessage('');
  }

  async function saveUserEdit(userId: string) {
    const normalized = editIdentifier.trim().toLowerCase();
    if (!editName.trim() || !normalized) return setMessage('أدخل اسم المستخدم والبريد أو الجوال.');
    if (editPassword && editPassword.length < 6) return setMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.');
    if (users.some((user) => user.id !== userId && user.identifier === normalized)) return setMessage('هذا البريد أو الجوال مسجل لمستخدم آخر.');
    const nextPasswordHash = editPassword ? await hashPassword(editPassword) : '';
    setUsers((current) => current.map((user) => user.id === userId ? {
      ...user,
      name: editName.trim(),
      identifier: normalized,
      passwordHash: nextPasswordHash || user.passwordHash,
    } : user));
    setEditingUserId('');
    setEditName('');
    setEditIdentifier('');
    setEditPassword('');
    setMessage('تم حفظ بيانات المستخدم بنجاح.');
  }

  return <section className="panel settings-card full-width">
    <h2>المستخدمون والصلاحيات</h2>
    <p>أنشئ حسابات محلية وحدد الأقسام التي يستطيع كل مستخدم فتحها.</p>
    <div className="form compact-form">
      <label>اسم المستخدم<input onChange={(event) => setName(event.target.value)} value={name} /></label>
      <label>البريد الإلكتروني أو الجوال<input onChange={(event) => setIdentifier(event.target.value)} value={identifier} /></label>
      <label>كلمة المرور المؤقتة<input onChange={(event) => setPassword(event.target.value)} type="password" value={password} /></label>
      <div className="full chips">{permissionOptions.map((option) => <button className={permissions.includes(option.page) ? 'active' : ''} key={option.page} onClick={() => setPermissions((current) => current.includes(option.page) ? current.filter((item) => item !== option.page) : [...current, option.page])} type="button">{option.label}</button>)}</div>
      <Btn onClick={() => void addUser()}><Plus /> إضافة المستخدم</Btn>
      {message ? <small className="date-preview">{message}</small> : null}
    </div>
    <div className="attachment-stack">{users.map((user) => <article className="attachment-card user-card" key={user.id}>
      {editingUserId === user.id ? (
        <div className="user-edit-form">
          <label>الاسم<input onChange={(event) => setEditName(event.target.value)} value={editName} /></label>
          <label>البريد أو الجوال<input onChange={(event) => setEditIdentifier(event.target.value)} value={editIdentifier} /></label>
          <label>كلمة مرور جديدة اختيارية<input onChange={(event) => setEditPassword(event.target.value)} type="password" value={editPassword} /></label>
        </div>
      ) : (
        <div><b>{user.name}</b><p>{user.identifier} · {user.role === 'admin' ? 'مدير النظام' : 'مستخدم'}{user.id === currentUserId ? ' · المستخدم الحالي' : ''}</p></div>
      )}
      <div className="chips">{permissionOptions.map((option) => <button className={user.role === 'admin' || (user.permissions ?? []).includes(option.page) ? 'active' : ''} disabled={user.role === 'admin' || editingUserId === user.id} key={option.page} onClick={() => togglePermission(user.id, option.page)} type="button">{option.label}</button>)}</div>
      <div className="card-actions user-actions">
        {editingUserId === user.id ? (
          <>
            <Btn onClick={() => void saveUserEdit(user.id)}>حفظ</Btn>
            <Btn kind="outline" onClick={() => setEditingUserId('')}>إلغاء</Btn>
          </>
        ) : (
          <Btn kind="outline" onClick={() => startEditUser(user)}><Pencil /> تعديل</Btn>
        )}
        {user.id !== currentUserId && user.role !== 'admin' ? <Btn kind="danger" onClick={() => setUsers((current) => current.filter((item) => item.id !== user.id))}><Trash2 /> حذف</Btn> : null}
      </div>
    </article>)}</div>
  </section>;
}

function Settings({
  settings,
  setSettings,
  cases,
  agencies,
  delegations,
  monitorItems,
  restoreBackup,
  restoreBusinessData,
  users,
  setUsers,
  currentUserId,
  maxUsers,
}: {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  cases: CaseRecord[];
  agencies: AgencyRecord[];
  delegations: DelegationRecord[];
  monitorItems: MonitorItem[];
  restoreBackup: (payload: {
    settings?: Partial<AppSettings>;
    cases?: Partial<CaseRecord>[];
    agencies?: Partial<AgencyRecord>[];
    delegations?: Partial<DelegationRecord>[];
    monitorItems?: Partial<MonitorItem>[];
  }) => void;
  restoreBusinessData: (payload: {
    cases?: Partial<CaseRecord>[];
    agencies?: Partial<AgencyRecord>[];
    delegations?: Partial<DelegationRecord>[];
    monitorItems?: Partial<MonitorItem>[];
  }, mode: 'merge' | 'replace') => void;
  users: UserAccount[];
  setUsers: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  currentUserId: string;
  maxUsers: number;
}) {
  const [backupMessage, setBackupMessage] = useState('');
  const [businessImportMode, setBusinessImportMode] = useState<'merge' | 'replace'>('merge');

  function exportFullBackup() {
    downloadJson(
      {
        format: 'bayyinah-full-json-backup',
        version: 1,
        exportedAt: new Date().toISOString(),
        settings,
        cases,
        agencies,
        delegations,
        monitorItems,
      },
      `bayyinah-backup-${todayIsoDate()}.json`,
    );
    setBackupMessage('تم تنزيل نسخة JSON شاملة للبيانات والإعدادات والشعار، ولا تتضمن حسابات المستخدمين أو كلمات المرور.');
  }

  function exportBusinessData() {
    downloadJson(
      {
        format: 'bayyinah-business-data',
        version: 1,
        exportedAt: new Date().toISOString(),
        cases,
        agencies,
        delegations,
        monitorItems,
      },
      `bayyinah-business-data-${todayIsoDate()}.json`,
    );
    setBackupMessage('تم تنزيل بيانات العمل فقط دون المستخدمين أو الشعار أو الإعدادات.');
  }

  async function importBusinessData(file: File | null) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as {
        format?: string;
        cases?: Partial<CaseRecord>[];
        agencies?: Partial<AgencyRecord>[];
        delegations?: Partial<DelegationRecord>[];
        monitorItems?: Partial<MonitorItem>[];
      };
      if (parsed.format !== 'bayyinah-business-data') throw new Error('invalid-format');
      restoreBusinessData(parsed, businessImportMode);
      setBackupMessage(businessImportMode === 'merge' ? 'تم دمج بيانات العمل مع تجنب التكرار.' : 'تم استبدال بيانات العمل بنجاح.');
    } catch {
      setBackupMessage('الملف المختار ليس ملف بيانات عمل صالحاً من بيّنة.');
    }
  }

  async function importBackup(file: File | null) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as {
        settings?: Partial<AppSettings>;
        cases?: Partial<CaseRecord>[];
        agencies?: Partial<AgencyRecord>[];
        delegations?: Partial<DelegationRecord>[];
        monitorItems?: Partial<MonitorItem>[];
      };
      restoreBackup(parsed);
      setBackupMessage('تمت استعادة نسخة JSON بنجاح. لا يتم تغيير حسابات المستخدمين من هذا النوع من النسخ.');
    } catch {
      setBackupMessage('تعذر قراءة ملف JSON المختار. تأكد أنه ملف صادر من بيّنة.');
    }
  }

  async function importLogo(file: File | null) {
    if (!file) return;
    const [attachment] = await filesToAttachments({
      0: file,
      length: 1,
      item: () => file,
    } as unknown as FileList);
    if (!attachment) return;
    setSettings((current) => ({...current, logoDataUrl: attachment.dataUrl}));
  }

  async function toggleDesktopNotifications() {
    if (settings.desktopNotificationsEnabled) {
      setSettings((current) => ({...current, desktopNotificationsEnabled: false}));
      return;
    }
    if (window.bayyinahDesktop) {
      setSettings((current) => ({...current, desktopNotificationsEnabled: true}));
      return;
    }
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setSettings((current) => ({...current, desktopNotificationsEnabled: permission === 'granted'}));
  }

  async function createDesktopBackup() {
    try {
      const target = await window.bayyinahDesktop?.backup.create();
      setBackupMessage(target ? `تم إنشاء نسخة Windows الكاملة في: ${target}` : 'تم إلغاء إنشاء النسخة الاحتياطية.');
    } catch {
      setBackupMessage('تعذر إنشاء النسخة الكاملة. اختر مجلداً آخر وحاول مجدداً.');
    }
  }

  async function restoreDesktopBackup() {
    if (!window.confirm('سيتم استبدال البيانات الحالية بالنسخة المختارة، مع حفظ نسخة أمان تلقائية قبل الاستعادة. هل تريد المتابعة؟')) return;
    try {
      const restored = await window.bayyinahDesktop?.backup.restore();
      if (!restored) setBackupMessage('تم إلغاء استعادة النسخة الاحتياطية.');
    } catch {
      setBackupMessage('المجلد المختار ليس نسخة Windows كاملة صالحة.');
    }
  }

  return (
    <>
      <Head title="الإعدادات" sub="تخصيص طريقة عرض التاريخ والتنبيهات والنسخ الاحتياطي" />
      <div className="settings-grid">
        <UsersPanel currentUserId={currentUserId} maxUsers={maxUsers} setUsers={setUsers} users={users} />
        <section className="panel settings-card">
          <h2>التقويم</h2>
          <p>اختر طريقة عرض التواريخ داخل التطبيق.</p>
          <div className="chips">
            <button
              className={settings.calendarMode === 'gregorian' ? 'active' : ''}
              onClick={() => setSettings((current) => ({...current, calendarMode: 'gregorian'}))}
              type="button"
            >
              ميلادي
            </button>
            <button
              className={settings.calendarMode === 'hijri' ? 'active' : ''}
              onClick={() => setSettings((current) => ({...current, calendarMode: 'hijri'}))}
              type="button"
            >
              هجري
            </button>
          </div>
        </section>

        <section className="panel settings-card">
          <h2>التنبيهات</h2>
          <p>التحكم الأساسي بالتذكيرات المحلية داخل النسخة الحالية.</p>
          <div className="settings-row">
            <span>تفعيل التذكيرات</span>
            <button
              className={settings.remindersEnabled ? 'toggle active' : 'toggle'}
              onClick={() =>
                setSettings((current) => ({...current, remindersEnabled: !current.remindersEnabled}))
              }
              type="button"
            >
              {settings.remindersEnabled ? 'مفعلة' : 'متوقفة'}
            </button>
          </div>
          <div className="settings-row">
            <span>إشعارات سطح المكتب</span>
            <button
              className={settings.desktopNotificationsEnabled ? 'toggle active' : 'toggle'}
              onClick={() => void toggleDesktopNotifications()}
              type="button"
            >
              {settings.desktopNotificationsEnabled ? 'مفعلة' : 'تفعيل'}
            </button>
          </div>
          <small>اختر مواعيد التنبيه قبل الجلسة أو الاستحقاق:</small>
          <div className="chips reminder-chips">
            {reminderOffsetOptions.map((offset) => {
              const active = settings.defaultReminderOffsets.includes(offset);
              return (
                <button
                  className={active ? 'active' : ''}
                  key={offset}
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      defaultReminderOffsets: active
                        ? current.defaultReminderOffsets.filter((item) => item !== offset)
                        : reminderOffsetOptions.filter((item) => [...current.defaultReminderOffsets, offset].includes(item)),
                    }))
                  }
                  type="button"
                >
                  {offset}
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel settings-card full-width">
          <h2>بيانات المستخدم والهوية</h2>
          <div className="form compact-form">
            <label>
              اسم المستخدم
              <input
                onChange={(event) => setSettings((current) => ({...current, userName: event.target.value}))}
                value={settings.userName}
              />
            </label>
            <label>
              اسم الجهة / المكتب
              <input
                onChange={(event) => setSettings((current) => ({...current, organizationName: event.target.value}))}
                value={settings.organizationName}
              />
            </label>
            <label>
              اسم التطبيق
              <input
                onChange={(event) => setSettings((current) => ({...current, appName: event.target.value}))}
                value={settings.appName}
              />
            </label>
            <label>
              الوصف المختصر
              <input
                onChange={(event) => setSettings((current) => ({...current, appTagline: event.target.value}))}
                value={settings.appTagline}
              />
            </label>
            <label className="full">
              الشعار
              <div className="settings-actions">
                <label className="upload-btn">
                  <FilePlus2 /> رفع شعار
                  <input accept="image/*" onChange={(event) => void importLogo(event.target.files?.[0] ?? null)} type="file" />
                </label>
                {settings.logoDataUrl ? (
                  <Btn kind="outline" onClick={() => setSettings((current) => ({...current, logoDataUrl: ''}))}>
                    حذف الشعار
                  </Btn>
                ) : null}
              </div>
            </label>
          </div>
        </section>

        <section className="panel settings-card full-width">
          <h2>النسخ الاحتياطي والتصدير</h2>
          <p>نسخة كاملة من قاعدة البيانات والمستندات والانتهاءات والإعدادات، مع نسخة تلقائية يومية داخل Windows.</p>
          <div className="backup-guide">
            <article>
              <b>بيانات العمل فقط</b>
              <p>القضايا والجلسات والوكالات والتفويضات والانتهاءات فقط. مناسب للنقل بين المستخدمين دون نقل الشعار أو الإعدادات أو الحسابات.</p>
            </article>
            <article>
              <b>نسخة Windows كاملة</b>
              <p>نسخة مجلد كاملة من قاعدة بيانات البرنامج وملفاته المحلية. مناسبة للإنقاذ أو النقل اليدوي على نفس بيئة Windows.</p>
            </article>
            <article>
              <b>إعدادات فقط</b>
              <p>تصدير هوية البرنامج وطريقة عرض التقويم والتنبيهات. لا تتضمن القضايا ولا المستخدمين.</p>
            </article>
          </div>
          <div className="settings-actions">
            <Btn onClick={exportBusinessData}><FileDown /> تصدير بيانات العمل فقط</Btn>
            <select onChange={(event) => setBusinessImportMode(event.target.value as 'merge' | 'replace')} value={businessImportMode}>
              <option value="merge">دمج مع البيانات الحالية</option>
              <option value="replace">استبدال بيانات العمل الحالية</option>
            </select>
            <label className="upload-btn">
              <FilePlus2 /> استيراد بيانات العمل
              <input accept=".json,application/json" onChange={(event) => void importBusinessData(event.target.files?.[0] ?? null)} type="file" />
            </label>
            {window.bayyinahDesktop ? (
              <>
                <Btn onClick={() => void createDesktopBackup()}><FileDown /> إنشاء نسخة Windows كاملة في مجلد</Btn>
                <Btn kind="outline" onClick={() => void restoreDesktopBackup()}><FilePlus2 /> اختيار مجلد نسخة Windows واستعادته</Btn>
              </>
            ) : null}
            <Btn onClick={exportFullBackup}>
              <FileDown /> تنزيل نسخة JSON شاملة بدون المستخدمين
            </Btn>
            <Btn kind="outline" onClick={() => downloadJson(settings, 'bayyinah-settings.json')}>
              <Download /> تصدير الإعدادات
            </Btn>
            <label className="upload-btn">
              <FilePlus2 /> اختيار ملف JSON واستعادته
              <input
                accept=".json,application/json"
                onChange={(event) => void importBackup(event.target.files?.[0] ?? null)}
                type="file"
              />
            </label>
          </div>
          {backupMessage ? <small className="date-preview">{backupMessage}</small> : null}
        </section>
      </div>
    </>
  );
}


type ToolKey =
  | 'date-converter'
  | 'pomodoro'
  | 'floating-tasks'
  | 'pdf-merge'
  | 'pdf-split'
  | 'zip-compress'
  | 'word-to-pdf'
  | 'vat'
  | 'end-service'
  | 'payroll'
  | 'links'
  | 'system-check'
  | 'temp-clean'
  | 'password-notes';



type VatLineKey =
  | 'line1'
  | 'line2'
  | 'line3'
  | 'line4'
  | 'line5'
  | 'line7'
  | 'line8'
  | 'line9'
  | 'line10'
  | 'line11';

type VatLineDraft = {
  amount: string;
  adjustment: string;
};

type VatDraft = {
  id?: string;
  companyName: string;
  periodFrom: string;
  periodTo: string;
  lines: Record<VatLineKey, VatLineDraft>;
  previousCorrections: string;
  carriedVat: string;
  notes: string;
  savedAt?: string;
};

type VatReturnRow = {
  key: VatLineKey | 'line6' | 'line12';
  number: number;
  label: string;
  section: 'sales' | 'purchases';
  rate: number;
  editable: boolean;
};

type VatReportRange = 'month' | 'quarter' | 'half' | 'year';
type VatReportMode = 'summary' | 'detail';

const VAT_LINE_KEYS: VatLineKey[] = ['line1', 'line2', 'line3', 'line4', 'line5', 'line7', 'line8', 'line9', 'line10', 'line11'];

const VAT_RETURN_ROWS: VatReturnRow[] = [
  {key: 'line1', number: 1, label: 'المبيعات الخاضعة للنسبة الأساسية 15%', section: 'sales', rate: 15, editable: true},
  {key: 'line2', number: 2, label: 'المبيعات التي تتحمل الدولة ضريبتها', section: 'sales', rate: 0, editable: true},
  {key: 'line3', number: 3, label: 'المبيعات المحلية الخاضعة للنسبة الصفرية', section: 'sales', rate: 0, editable: true},
  {key: 'line4', number: 4, label: 'الصادرات', section: 'sales', rate: 0, editable: true},
  {key: 'line5', number: 5, label: 'المبيعات المعفاة من الضريبة', section: 'sales', rate: 0, editable: true},
  {key: 'line6', number: 6, label: 'إجمالي المبيعات', section: 'sales', rate: 0, editable: false},
  {key: 'line7', number: 7, label: 'المشتريات الخاضعة للنسبة الأساسية 15%', section: 'purchases', rate: 15, editable: true},
  {key: 'line8', number: 8, label: 'الاستيرادات الخاضعة للضريبة الأساسية والمدفوعة عند الاستيراد 15%', section: 'purchases', rate: 15, editable: true},
  {key: 'line9', number: 9, label: 'التوريدات أو الاستيرادات الخاضعة لآلية الاحتساب العكسي', section: 'purchases', rate: 0, editable: true},
  {key: 'line10', number: 10, label: 'المشتريات الخاضعة للنسبة الصفرية', section: 'purchases', rate: 0, editable: true},
  {key: 'line11', number: 11, label: 'المشتريات المعفاة من الضريبة', section: 'purchases', rate: 0, editable: true},
  {key: 'line12', number: 12, label: 'إجمالي المشتريات', section: 'purchases', rate: 0, editable: false},
];

function emptyVatLine(): VatLineDraft {
  return {amount: '', adjustment: ''};
}

function emptyVatLines(): Record<VatLineKey, VatLineDraft> {
  return VAT_LINE_KEYS.reduce((lines, key) => ({...lines, [key]: emptyVatLine()}), {} as Record<VatLineKey, VatLineDraft>);
}

function emptyVatDraft(): VatDraft {
  return {
    companyName: '',
    periodFrom: todayIsoDate(),
    periodTo: todayIsoDate(),
    lines: emptyVatLines(),
    previousCorrections: '',
    carriedVat: '',
    notes: '',
  };
}

function amountValue(value: string | number | undefined) {
  return Number(String(value || '0').replace(/,/g, '')) || 0;
}

function ensureVatLines(draft: VatDraft): Record<VatLineKey, VatLineDraft> {
  const current = draft.lines || {} as Record<VatLineKey, VatLineDraft>;
  const legacyValues: Partial<Record<VatLineKey, VatLineDraft>> = {
    line1: {amount: String((draft as unknown as {salesStandard?: string}).salesStandard || ''), adjustment: String((draft as unknown as {salesAdjustments?: string}).salesAdjustments || '')},
    line3: {amount: String((draft as unknown as {salesZero?: string}).salesZero || ''), adjustment: ''},
    line5: {amount: String((draft as unknown as {salesExempt?: string}).salesExempt || ''), adjustment: ''},
    line7: {amount: String((draft as unknown as {purchasesStandard?: string}).purchasesStandard || ''), adjustment: String((draft as unknown as {purchaseAdjustments?: string}).purchaseAdjustments || '')},
    line8: {amount: String((draft as unknown as {purchasesReduced?: string}).purchasesReduced || ''), adjustment: ''},
    line11: {amount: String((draft as unknown as {purchasesExempt?: string}).purchasesExempt || ''), adjustment: ''},
  };
  return VAT_LINE_KEYS.reduce((lines, key) => ({...lines, [key]: {...emptyVatLine(), ...(legacyValues[key] || {}), ...(current[key] || {})}}), {} as Record<VatLineKey, VatLineDraft>);
}

function calculateVatLine(line: VatLineDraft, rate: number) {
  const amount = amountValue(line.amount);
  const adjustment = amountValue(line.adjustment);
  return {amount, adjustment, tax: rate ? (amount + adjustment) * rate / 100 : 0};
}

function calculateVat(draft: VatDraft) {
  const lines = ensureVatLines(draft);
  const lineTotals = VAT_RETURN_ROWS.reduce((totals, row) => {
    if (!row.editable) return totals;
    totals[row.key as VatLineKey] = calculateVatLine(lines[row.key as VatLineKey], row.rate);
    return totals;
  }, {} as Record<VatLineKey, {amount: number; adjustment: number; tax: number}>);
  const salesKeys: VatLineKey[] = ['line1', 'line2', 'line3', 'line4', 'line5'];
  const purchaseKeys: VatLineKey[] = ['line7', 'line8', 'line9', 'line10', 'line11'];
  const sumKeys = (keys: VatLineKey[]) => keys.reduce((total, key) => ({
    amount: total.amount + (lineTotals[key]?.amount || 0),
    adjustment: total.adjustment + (lineTotals[key]?.adjustment || 0),
    tax: total.tax + (lineTotals[key]?.tax || 0),
  }), {amount: 0, adjustment: 0, tax: 0});
  const salesTotal = sumKeys(salesKeys);
  const purchasesTotal = sumKeys(purchaseKeys);
  const periodTax = salesTotal.tax - purchasesTotal.tax;
  const previousCorrections = amountValue(draft.previousCorrections);
  const carriedVat = amountValue(draft.carriedVat);
  const netTax = periodTax + previousCorrections - carriedVat;
  return {lines: lineTotals, salesTotal, purchasesTotal, periodTax, previousCorrections, carriedVat, netTax};
}

function vatReportDate(record: VatDraft) {
  const raw = record.periodFrom || record.periodTo || record.savedAt || '';
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function vatReportPeriod(record: VatDraft, range: VatReportRange) {
  const date = vatReportDate(record);
  if (!date) return {label: 'بدون تاريخ', sortKey: '0000-00'};
  const year = date.getFullYear();
  const month = date.getMonth();
  if (range === 'month') {
    const label = new Intl.DateTimeFormat('ar-SA', {month: 'long', year: 'numeric'}).format(date);
    return {label, sortKey: `${year}-${String(month + 1).padStart(2, '0')}`};
  }
  if (range === 'year') return {label: `السنة ${year}`, sortKey: `${year}-12`};
  if (range === 'half') {
    const half = month < 6 ? 1 : 2;
    return {label: `النصف ${half} - ${year}`, sortKey: `${year}-H${half}`};
  }
  const quarter = Math.floor(month / 3) + 1;
  return {label: `الربع ${quarter} - ${year}`, sortKey: `${year}-Q${quarter}`};
}

type ImportantLinkRecord = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
};

function emptyImportantLink(): ImportantLinkRecord {
  return {id: '', title: '', description: '', url: '', category: '', createdAt: ''};
}

function normalizeExternalUrl(url: string) {
  const value = url.trim();
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

type PasswordNoteRecord = {
  id: string;
  title: string;
  usernameOrKey: string;
  secretValue: string;
  usageUrl: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
};

function emptyPasswordNote(): PasswordNoteRecord {
  return {id: '', title: '', usernameOrKey: '', secretValue: '', usageUrl: '', notes: '', createdAt: ''};
}

function maskSecret(value: string) {
  return value ? '•'.repeat(Math.min(Math.max(value.length, 8), 18)) : 'بدون قيمة';
}

function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolKey>('vat');
  const [dateValue, setDateValue] = useState(todayIsoDate());
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [floatingTask, setFloatingTask] = useState('');
  const [floatingTasks, setFloatingTasks] = usePersistentState<string[]>('bayyinah-floating-tool-tasks', []);
  const [vatRecords, setVatRecords] = usePersistentState<VatDraft[]>('bayyinah-vat-records', []);
  const [vatDraft, setVatDraft] = useState<VatDraft>(emptyVatDraft());
  const [vatReportRange, setVatReportRange] = useState<VatReportRange>('month');
  const [vatReportMode, setVatReportMode] = useState<VatReportMode>('summary');
  const [vatReportFrom, setVatReportFrom] = useState(() => `${new Date().getFullYear()}-01-01`);
  const [vatReportTo, setVatReportTo] = useState(todayIsoDate());
  const [importantLinks, setImportantLinks] = usePersistentState<ImportantLinkRecord[]>('bayyinah-important-links', []);
  const [linkDraft, setLinkDraft] = useState<ImportantLinkRecord>(emptyImportantLink());
  const [editingLinkId, setEditingLinkId] = useState('');
  const [linkQuery, setLinkQuery] = useState('');
  const [linkMessage, setLinkMessage] = useState('');
  const [passwordNotes, setPasswordNotes] = usePersistentState<PasswordNoteRecord[]>('bayyinah-password-notes', []);
  const [passwordDraft, setPasswordDraft] = useState<PasswordNoteRecord>(emptyPasswordNote());
  const [editingPasswordId, setEditingPasswordId] = useState('');
  const [passwordQuery, setPasswordQuery] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [visiblePasswordIds, setVisiblePasswordIds] = useState<string[]>([]);
  const [showDraftSecret, setShowDraftSecret] = useState(false);
  const vatTotals = calculateVat(vatDraft);
  function setVatField(field: keyof VatDraft, value: string) {
    setVatDraft((current) => ({...current, [field]: value}));
  }
  function saveVatRecord() {
    const built = {...vatDraft, id: vatDraft.id || `vat-${Date.now()}`, savedAt: new Date().toISOString()};
    setVatRecords((records) => [built, ...records.filter((record) => record.id !== built.id)]);
    setVatDraft(built);
  }
  function openVatRecord(record: VatDraft) {
    setVatDraft(record);
  }
  function duplicateVatRecord(record: VatDraft) {
    setVatDraft({...record, id: '', periodFrom: todayIsoDate(), periodTo: todayIsoDate(), savedAt: undefined});
  }

  async function exportVatExcel() {
    const XLSX = await import('xlsx');
    const source = {...vatDraft, lines: ensureVatLines(vatDraft)};
    const totals = calculateVat(source);
    const getTotals = (row: VatReturnRow) => {
      if (row.key === 'line6') return totals.salesTotal;
      if (row.key === 'line12') return totals.purchasesTotal;
      return totals.lines[row.key as VatLineKey] || {amount: 0, adjustment: 0, tax: 0};
    };
    const netStatus = totals.netTax > 0 ? 'ضريبة مستحقة' : totals.netTax < 0 ? 'ضريبة مستردة' : 'لا توجد ضريبة مستحقة أو مستردة';
    const rows = [
      ['نموذج إقرار ضريبة القيمة المضافة - VAT Return Form 3A'],
      ['اسم الشركة', source.companyName || 'غير محدد'],
      ['الفترة من', source.periodFrom || 'غير محدد'],
      ['الفترة إلى', source.periodTo || 'غير محدد'],
      ['تاريخ التصدير', new Intl.DateTimeFormat('ar-SA').format(new Date())],
      [],
      ['القسم', 'رقم البند', 'البند', 'المبلغ', 'مبلغ التعديل', 'مبلغ ضريبة القيمة المضافة'],
      ...VAT_RETURN_ROWS.map((row) => {
        const rowTotals = getTotals(row);
        return [
          row.section === 'sales' ? 'ضريبة القيمة المضافة على المبيعات' : 'ضريبة القيمة المضافة على المشتريات',
          row.number,
          row.label,
          rowTotals.amount,
          rowTotals.adjustment,
          rowTotals.tax,
        ];
      }),
      [],
      ['ملخص الضريبة'],
      ['13', 'إجمالي ضريبة القيمة المضافة المستحقة للفترة الحالية', totals.periodTax],
      ['14', 'تصحيحات من الفترات السابقة', totals.previousCorrections],
      ['15', 'ضريبة القيمة المضافة المرحلة من الفترات السابقة', totals.carriedVat],
      ['16', 'صافي الضريبة المستحقة أو المستردة', totals.netTax, netStatus],
      [],
      ['ملاحظات', source.notes || 'لا توجد ملاحظات'],
    ];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet['!cols'] = [{wch: 34}, {wch: 14}, {wch: 58}, {wch: 18}, {wch: 18}, {wch: 24}];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'إقرار VAT 3A');
    const safeCompany = (source.companyName || 'VAT').replace(/[\\/:*?"<>|]/g, '-').slice(0, 40);
    XLSX.writeFile(workbook, `Bayyinah-VAT-3A-${safeCompany}-${todayIsoDate()}.xlsx`);
  }

  const vatReportRows = vatRecords
    .map((record) => {
      const normalized = {...record, lines: ensureVatLines(record)};
      const totals = calculateVat(normalized);
      const period = vatReportPeriod(normalized, vatReportRange);
      const reportDate = vatReportDate(normalized);
      return {record: normalized, totals, period, reportDate};
    })
    .filter((item) => {
      if (!item.reportDate) return false;
      const from = vatReportFrom ? new Date(`${vatReportFrom}T00:00:00`) : null;
      const to = vatReportTo ? new Date(`${vatReportTo}T23:59:59`) : null;
      return (!from || item.reportDate >= from) && (!to || item.reportDate <= to);
    })
    .sort((a, b) => a.period.sortKey.localeCompare(b.period.sortKey) || String(a.record.periodFrom || '').localeCompare(String(b.record.periodFrom || '')));
  const vatReportGroups = Object.values(vatReportRows.reduce((groups, item) => {
    const current = groups[item.period.label] || {
      label: item.period.label,
      sortKey: item.period.sortKey,
      count: 0,
      salesAmount: 0,
      purchaseAmount: 0,
      salesTax: 0,
      purchaseTax: 0,
      periodTax: 0,
      previousCorrections: 0,
      carriedVat: 0,
      netTax: 0,
    };
    current.count += 1;
    current.salesAmount += item.totals.salesTotal.amount;
    current.purchaseAmount += item.totals.purchasesTotal.amount;
    current.salesTax += item.totals.salesTotal.tax;
    current.purchaseTax += item.totals.purchasesTotal.tax;
    current.periodTax += item.totals.periodTax;
    current.previousCorrections += item.totals.previousCorrections;
    current.carriedVat += item.totals.carriedVat;
    current.netTax += item.totals.netTax;
    groups[item.period.label] = current;
    return groups;
  }, {} as Record<string, {
    label: string;
    sortKey: string;
    count: number;
    salesAmount: number;
    purchaseAmount: number;
    salesTax: number;
    purchaseTax: number;
    periodTax: number;
    previousCorrections: number;
    carriedVat: number;
    netTax: number;
  }>)).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  const vatReportSummary = vatReportGroups.reduce((summary, item) => ({
    count: summary.count + item.count,
    salesAmount: summary.salesAmount + item.salesAmount,
    purchaseAmount: summary.purchaseAmount + item.purchaseAmount,
    salesTax: summary.salesTax + item.salesTax,
    purchaseTax: summary.purchaseTax + item.purchaseTax,
    periodTax: summary.periodTax + item.periodTax,
    netTax: summary.netTax + item.netTax,
  }), {count: 0, salesAmount: 0, purchaseAmount: 0, salesTax: 0, purchaseTax: 0, periodTax: 0, netTax: 0});
  const vatReportTableRows = [
    {label: 'إجمالي المبيعات', values: vatReportGroups.map((group) => group.salesAmount), total: vatReportSummary.salesAmount},
    {label: 'إجمالي المشتريات', values: vatReportGroups.map((group) => group.purchaseAmount), total: vatReportSummary.purchaseAmount},
    {label: 'وعاء الضريبة', values: vatReportGroups.map((group) => group.salesAmount - group.purchaseAmount), total: vatReportSummary.salesAmount - vatReportSummary.purchaseAmount},
    {label: 'إجمالي ضريبة القيمة المضافة المستحقة للفترة الحالية', values: vatReportGroups.map((group) => group.periodTax), total: vatReportSummary.periodTax},
    {label: 'صافي الضريبة المستحقة أو المستردة', values: vatReportGroups.map((group) => group.netTax), total: vatReportSummary.netTax},
  ];
  const getVatStatus = (value: number) => value > 0 ? 'ضريبة مستحقة' : value < 0 ? 'ضريبة مستردة' : 'لا توجد ضريبة مستحقة أو مستردة';

  async function exportVatArchiveExcel() {
    const XLSX = await import('xlsx');
    const workbook = XLSX.utils.book_new();
    const rangeLabel = vatReportRange === 'year' ? 'سنوي' : vatReportRange === 'half' ? 'نصف سنوي' : vatReportRange === 'quarter' ? 'ربع سنوي' : 'شهري';
    const matrixRows = [
      ['تقرير ضريبة القيمة المضافة حسب الفترة'],
      [`الفترة من: ${vatReportFrom || 'غير محدد'} حتى: ${vatReportTo || 'غير محدد'}`],
      [`نوع التجميع: ${rangeLabel}`, `عدد السجلات: ${vatReportSummary.count}`, `الحالة: ${getVatStatus(vatReportSummary.netTax)}`],
      [],
      ['التفاصيل', ...vatReportGroups.map((group) => group.label), 'الإجمالي'],
      ...vatReportTableRows.map((row) => [row.label, ...row.values, row.total]),
    ];
    const detailRows = vatReportRows.flatMap(({record, totals}) => VAT_RETURN_ROWS.map((row) => {
      const rowTotals = row.key === 'line6'
        ? totals.salesTotal
        : row.key === 'line12'
          ? totals.purchasesTotal
          : totals.lines[row.key as VatLineKey] || {amount: 0, adjustment: 0, tax: 0};
      return {
        'فترة التقرير': vatReportPeriod(record, vatReportRange).label,
        'اسم الشركة': record.companyName || 'غير محدد',
        'الفترة من': record.periodFrom || '',
        'الفترة إلى': record.periodTo || '',
        'القسم': row.section === 'sales' ? 'المبيعات' : 'المشتريات',
        'رقم البند': row.number,
        'البند': row.label,
        'المبلغ': rowTotals.amount,
        'مبلغ التعديل': rowTotals.adjustment,
        'مبلغ الضريبة': rowTotals.tax,
      };
    }));
    const summarySheet = XLSX.utils.aoa_to_sheet(matrixRows);
    const detailSheet = XLSX.utils.json_to_sheet(detailRows);
    summarySheet['!cols'] = [{wch: 54}, {wch: 16}, ...vatReportGroups.map(() => ({wch: 16})), {wch: 18}];
    detailSheet['!cols'] = [{wch: 18}, {wch: 28}, {wch: 14}, {wch: 14}, {wch: 14}, {wch: 10}, {wch: 58}, {wch: 16}, {wch: 16}, {wch: 16}];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'تقرير مجمع');
    XLSX.utils.book_append_sheet(workbook, detailSheet, 'تفاصيل البنود');
    XLSX.writeFile(workbook, `Bayyinah-VAT-Report-${vatReportRange}-${todayIsoDate()}.xlsx`);
  }

  const normalizedLinkQuery = linkQuery.trim().toLowerCase();
  const filteredImportantLinks = importantLinks.filter((link) => {
    if (!normalizedLinkQuery) return true;
    return [link.title, link.description, link.url, link.category].some((value) => value.toLowerCase().includes(normalizedLinkQuery));
  });

  function setLinkField(field: keyof ImportantLinkRecord, value: string) {
    setLinkDraft((current) => ({...current, [field]: value}));
  }

  function resetLinkDraft(message = '') {
    setLinkDraft(emptyImportantLink());
    setEditingLinkId('');
    setLinkMessage(message);
  }

  function saveImportantLink() {
    const title = linkDraft.title.trim();
    const url = normalizeExternalUrl(linkDraft.url);
    if (!title || !url) {
      setLinkMessage('يرجى إدخال عنوان الرابط والرابط قبل الحفظ.');
      return;
    }
    const isEditing = Boolean(editingLinkId);
    const now = new Date().toISOString();
    const record: ImportantLinkRecord = {
      ...linkDraft,
      id: editingLinkId || linkDraft.id || `link-${Date.now()}`,
      title,
      url,
      description: linkDraft.description.trim(),
      category: linkDraft.category.trim(),
      createdAt: linkDraft.createdAt || now,
      updatedAt: now,
    };
    setImportantLinks((links) => isEditing ? links.map((link) => link.id === record.id ? record : link) : [record, ...links]);
    resetLinkDraft(isEditing ? 'تم حفظ تعديل الرابط.' : 'تمت إضافة الرابط إلى المكتبة.');
  }

  function editImportantLink(record: ImportantLinkRecord) {
    setLinkDraft(record);
    setEditingLinkId(record.id);
    setLinkMessage('وضع التعديل نشط. عدّل البيانات ثم اضغط حفظ التعديل.');
  }

  function deleteImportantLink(recordId: string) {
    if (!window.confirm('هل تريد حذف هذا الرابط من المكتبة؟')) return;
    setImportantLinks((links) => links.filter((link) => link.id !== recordId));
    if (editingLinkId === recordId) resetLinkDraft();
    setLinkMessage('تم حذف الرابط.');
  }

  function openImportantLink(url: string) {
    const target = normalizeExternalUrl(url);
    if (!target) {
      setLinkMessage('الرابط غير صالح للفتح.');
      return;
    }
    window.open(target, '_blank', 'noopener,noreferrer');
  }

  const normalizedPasswordQuery = passwordQuery.trim().toLowerCase();
  const filteredPasswordNotes = passwordNotes.filter((item) => {
    if (!normalizedPasswordQuery) return true;
    return [item.title, item.usernameOrKey, item.usageUrl, item.notes].some((value) => value.toLowerCase().includes(normalizedPasswordQuery));
  });

  function setPasswordField(field: keyof PasswordNoteRecord, value: string) {
    setPasswordDraft((current) => ({...current, [field]: value}));
  }

  function resetPasswordDraft(message = '') {
    setPasswordDraft(emptyPasswordNote());
    setEditingPasswordId('');
    setPasswordMessage(message);
    setShowDraftSecret(false);
  }

  function focusPasswordNoteForm() {
    window.requestAnimationFrame(() => {
      document.getElementById('password-note-form')?.scrollIntoView({behavior: 'smooth', block: 'start'});
      document.getElementById('password-note-title')?.focus();
    });
  }

  function savePasswordNote() {
    const title = passwordDraft.title.trim();
    const secretValue = passwordDraft.secretValue.trim();
    if (!title || !secretValue) {
      setPasswordMessage('يرجى إدخال العنوان والقيمة قبل الحفظ.');
      return;
    }
    const isEditing = Boolean(editingPasswordId);
    const now = new Date().toISOString();
    const record: PasswordNoteRecord = {
      ...passwordDraft,
      id: editingPasswordId || passwordDraft.id || `secret-${Date.now()}`,
      title,
      secretValue,
      usernameOrKey: passwordDraft.usernameOrKey.trim(),
      usageUrl: passwordDraft.usageUrl.trim(),
      notes: passwordDraft.notes.trim(),
      createdAt: passwordDraft.createdAt || now,
      updatedAt: now,
    };
    setPasswordNotes((items) => {
      if (!isEditing) return [record, ...items];
      return items.map((item) => item.id === record.id ? record : item);
    });
    resetPasswordDraft(isEditing ? 'تم حفظ تعديل الملاحظة.' : 'تمت إضافة الملاحظة.');
  }

  function editPasswordNote(record: PasswordNoteRecord) {
    setPasswordDraft({...record});
    setEditingPasswordId(record.id);
    setPasswordMessage('وضع التعديل نشط. عدّل البيانات ثم اضغط حفظ التعديل.');
    setShowDraftSecret(false);
    focusPasswordNoteForm();
  }

  function deletePasswordNote(recordId: string) {
    if (!window.confirm('هل تريد حذف هذه الملاحظة؟')) return;
    setPasswordNotes((items) => items.filter((item) => item.id !== recordId));
    setVisiblePasswordIds((ids) => ids.filter((id) => id !== recordId));
    if (editingPasswordId === recordId) resetPasswordDraft();
    setPasswordMessage('تم حذف الملاحظة.');
  }

  function togglePasswordVisibility(recordId: string) {
    setVisiblePasswordIds((ids) => ids.includes(recordId) ? ids.filter((id) => id !== recordId) : [...ids, recordId]);
  }

  function copyPasswordValue(value: string) {
    if (!value) {
      setPasswordMessage('لا توجد قيمة لنسخها.');
      return;
    }
    void navigator.clipboard.writeText(value).then(
      () => setPasswordMessage('تم نسخ القيمة إلى الحافظة.'),
      () => setPasswordMessage('تعذر النسخ تلقائياً. يمكنك تحديد القيمة ونسخها يدوياً.'),
    );
  }
  const todayHijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date());
  const todayGregorian = new Intl.DateTimeFormat('ar-SA', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date());

  const groups: {title: string; tone: string; tools: {key: ToolKey; label: string; hint: string; icon: React.ReactNode}[]}[] = [
    {title: 'أدوات التاريخ والإنتاجية', tone: 'teal', tools: [
      {key: 'date-converter', label: 'محول التاريخ', hint: 'هجري / ميلادي مع تاريخ اليوم', icon: <CalendarDays />},
      {key: 'floating-tasks', label: 'قائمة مهام عائمة', hint: 'مهام سريعة مستقلة', icon: <ClipboardList />},
    ]},
    {title: 'المحاكيات والأرشيف المالي', tone: 'gold', tools: [
      {key: 'vat', label: 'محاكي ضريبة القيمة المضافة', hint: 'نسب قابلة للتعديل وأرشيف', icon: <Calculator />},
    ]},
    {title: 'مكتبة الروابط المهمة', tone: 'purple', tools: [
      {key: 'links', label: 'مكتبة الروابط', hint: 'إضافة وفتح الروابط المهمة', icon: <LinkIcon />},
    ]},
    {title: 'أدوات النظام والأمان', tone: 'safe', tools: [
      {key: 'password-notes', label: 'ملاحظات كلمات المرور والمفاتيح', hint: 'ليست خزنة عالية الأمان', icon: <LockKeyhole />},
    ]},
  ];
  const completedToolKeys = new Set<ToolKey>(['vat', 'links', 'password-notes']);

  function renderTool() {
    if (activeTool === 'date-converter') {
      const hijri = gregorianToHijri(dateValue);
      return (
        <div className="tool-detail-grid">
          <label>التاريخ الميلادي<CalendarDateInput value={dateValue} onChange={setDateValue} /></label>
          <article className="tool-result-card"><small>تاريخ اليوم الميلادي</small><b>{todayGregorian}</b></article>
          <article className="tool-result-card"><small>تاريخ اليوم هجري - أم القرى</small><b>{todayHijri}</b></article>
          <article className="tool-result-card"><small>تحويل التاريخ المختار</small><b>{hijri ? String(hijri.day).padStart(2, '0') + ' / ' + String(hijri.month).padStart(2, '0') + ' / ' + hijri.year + ' هـ' : 'اختر تاريخًا'}</b></article>
        </div>
      );
    }
    if (activeTool === 'pomodoro') {
      return (
        <div className="tool-detail-grid">
          <label>مدة الجلسة بالدقائق<input min={1} onChange={(event) => setPomodoroMinutes(Number(event.target.value) || 25)} type="number" value={pomodoroMinutes} /></label>
          <article className="tool-result-card"><small>الحالة</small><b>جاهز لبدء جلسة تركيز مدتها {pomodoroMinutes} دقيقة</b></article>
          <p className="hint">سيتم في المرحلة التالية إضافة عداد حي مع تنبيه صوتي عند انتهاء الجلسة.</p>
        </div>
      );
    }
    if (activeTool === 'floating-tasks') {
      return (
        <div className="tool-detail-grid">
          <label>مهمة سريعة<input onChange={(event) => setFloatingTask(event.target.value)} placeholder="اكتب مهمة قصيرة" value={floatingTask} /></label>
          <Btn onClick={() => { if (floatingTask.trim()) { setFloatingTasks([floatingTask.trim(), ...floatingTasks]); setFloatingTask(''); } }}><Plus /> إضافة</Btn>
          <div className="tool-list">
            {floatingTasks.length ? floatingTasks.map((task, index) => (
              <p key={task + '-' + index}><span>{task}</span><button onClick={() => setFloatingTasks(floatingTasks.filter((_, itemIndex) => itemIndex !== index))} type="button">حذف</button></p>
            )) : <small>لا توجد مهام عائمة بعد.</small>}
          </div>
        </div>
      );
    }
    if (activeTool === 'word-to-pdf') return <div className="tool-warning"><AlertTriangle /> هذه الميزة تحتاج إعدادًا إضافيًا مستقرًا مثل Microsoft Word أو LibreOffice، ولن يتم تشغيلها الآن حتى لا يتعطل البرنامج.</div>;
    if (activeTool === 'vat') {
      const lines = ensureVatLines(vatDraft);
      const getRowTotals = (row: VatReturnRow) => {
        if (row.key === 'line6') return vatTotals.salesTotal;
        if (row.key === 'line12') return vatTotals.purchasesTotal;
        return vatTotals.lines[row.key as VatLineKey] || {amount: 0, adjustment: 0, tax: 0};
      };
      const updateVatLine = (key: VatLineKey, field: keyof VatLineDraft, value: string) => {
        setVatDraft((current) => {
          const currentLines = ensureVatLines(current);
          return {...current, lines: {...currentLines, [key]: {...currentLines[key], [field]: value}}};
        });
      };
      const netLabel = vatTotals.netTax > 0 ? 'ضريبة مستحقة' : vatTotals.netTax < 0 ? 'ضريبة مستردة' : 'لا توجد ضريبة مستحقة أو مستردة';
      return (
        <div className="vat-tool vat-return-tool">
          <section className="vat-return-note tool-warning info"><AlertTriangle /> أداة مساعدة لحساب ومراجعة إقرار ضريبة القيمة المضافة، ولا تغني عن مراجعة المحاسب أو الإقرار الرسمي.</section>
          <section className="vat-return-head panel">
            <div>
              <small>VAT Return Form - 3A</small>
              <h3>نموذج إقرار ضريبة القيمة المضافة</h3>
            </div>
            <div className="vat-return-meta">
              <label>اسم الشركة<input onChange={(event) => setVatField('companyName', event.target.value)} value={vatDraft.companyName} /></label>
              <label>الفترة من<CalendarDateInput value={vatDraft.periodFrom} onChange={(value) => setVatField('periodFrom', value)} /></label>
              <label>الفترة إلى<CalendarDateInput value={vatDraft.periodTo} onChange={(value) => setVatField('periodTo', value)} /></label>
            </div>
          </section>

          <section className="panel vat-return-table">
            <div className="vat-return-row vat-return-header">
              <span>البند</span>
              <span>المبلغ</span>
              <span>المبلغ (±)</span>
              <span>مبلغ التعديل (±)</span>
              <span>مبلغ ضريبة القيمة المضافة (±)</span>
            </div>
            <div className="vat-section-title">ضريبة القيمة المضافة على المبيعات</div>
            {VAT_RETURN_ROWS.filter((row) => row.section === 'sales').map((row) => {
              const totals = getRowTotals(row);
              const key = row.key as VatLineKey;
              return (
                <div className={row.editable ? 'vat-return-row' : 'vat-return-row vat-total-row'} key={row.key}>
                  <b>{row.number}</b>
                  <span>{row.label}</span>
                  {row.editable ? <input onChange={(event) => updateVatLine(key, 'amount', event.target.value)} type="number" value={lines[key].amount} /> : <output>{formatCurrency(totals.amount.toFixed(2))}</output>}
                  {row.editable ? <input onChange={(event) => updateVatLine(key, 'adjustment', event.target.value)} type="number" value={lines[key].adjustment} /> : <output>{formatCurrency(totals.adjustment.toFixed(2))}</output>}
                  <output>{formatCurrency(totals.tax.toFixed(2))}</output>
                </div>
              );
            })}
            <div className="vat-section-title purchases">ضريبة القيمة المضافة على المشتريات</div>
            {VAT_RETURN_ROWS.filter((row) => row.section === 'purchases').map((row) => {
              const totals = getRowTotals(row);
              const key = row.key as VatLineKey;
              return (
                <div className={row.editable ? 'vat-return-row' : 'vat-return-row vat-total-row'} key={row.key}>
                  <b>{row.number}</b>
                  <span>{row.label}</span>
                  {row.editable ? <input onChange={(event) => updateVatLine(key, 'amount', event.target.value)} type="number" value={lines[key].amount} /> : <output>{formatCurrency(totals.amount.toFixed(2))}</output>}
                  {row.editable ? <input onChange={(event) => updateVatLine(key, 'adjustment', event.target.value)} type="number" value={lines[key].adjustment} /> : <output>{formatCurrency(totals.adjustment.toFixed(2))}</output>}
                  <output>{formatCurrency(totals.tax.toFixed(2))}</output>
                </div>
              );
            })}
          </section>

          <section className="panel vat-return-summary">
            <div><small>13. إجمالي ضريبة القيمة المضافة المستحقة للفترة الحالية</small><strong>{formatCurrency(vatTotals.periodTax.toFixed(2))}</strong></div>
            <label>14. تصحيحات من الفترات السابقة<input onChange={(event) => setVatField('previousCorrections', event.target.value)} type="number" value={vatDraft.previousCorrections} /></label>
            <label>15. ضريبة القيمة المضافة المرحلة من الفترات السابقة<input onChange={(event) => setVatField('carriedVat', event.target.value)} type="number" value={vatDraft.carriedVat} /></label>
            <div><small>16. صافي الضريبة المستحقة أو المستردة</small><strong className={vatTotals.netTax > 0 ? 'danger-text' : vatTotals.netTax < 0 ? 'ok-text' : ''}>{netLabel}: {formatCurrency(Math.abs(vatTotals.netTax).toFixed(2))}</strong></div>
            <label className="vat-summary-notes">ملاحظات<textarea onChange={(event) => setVatField('notes', event.target.value)} value={vatDraft.notes} /></label>
            <div className="card-actions">
              <Btn onClick={saveVatRecord}><FileCheck2 /> حفظ السجل</Btn>
              <Btn kind="outline" onClick={() => void exportVatExcel()}><FileDown /> تصدير Excel</Btn>
              <Btn kind="outline" onClick={() => setVatDraft(emptyVatDraft())}><Plus /> إعادة تعيين</Btn>
            </div>
          </section>

          <section className="panel vat-archive">
            <h3>أرشيف إقرارات ضريبة القيمة المضافة</h3>
            {vatRecords.length ? vatRecords.map((record) => {
              const totals = calculateVat(record);
              return (
                <article key={record.id}>
                  <div>
                    <b>{record.companyName || 'شركة غير محددة'}</b>
                    <small>{record.periodFrom} ← {record.periodTo}</small>
                    <small>{totals.netTax > 0 ? 'ضريبة مستحقة' : totals.netTax < 0 ? 'ضريبة مستردة' : 'لا توجد ضريبة مستحقة أو مستردة'}: {formatCurrency(Math.abs(totals.netTax).toFixed(2))}</small>
                  </div>
                  <div>
                    <Btn kind="outline" onClick={() => openVatRecord({...record, lines: ensureVatLines(record)})}>فتح السجل</Btn>
                    <Btn kind="outline" onClick={() => duplicateVatRecord({...record, lines: ensureVatLines(record)})}><Copy /> تكرار</Btn>
                  </div>
                </article>
              );
            }) : <small>لا توجد سجلات محفوظة بعد.</small>}
          </section>

          <section className="panel vat-period-report">
            <header>
              <div>
                <small>تقرير مجمع من أرشيف الإقرارات</small>
                <h3>تقرير ضريبة القيمة المضافة حسب الفترة</h3>
              </div>
              <div className="vat-report-actions">
                <label>من<input onChange={(event) => setVatReportFrom(event.target.value)} type="date" value={vatReportFrom} /></label>
                <label>إلى<input onChange={(event) => setVatReportTo(event.target.value)} type="date" value={vatReportTo} /></label>
                <select onChange={(event) => setVatReportRange(event.target.value as VatReportRange)} value={vatReportRange}>
                  <option value="month">شهري</option>
                  <option value="quarter">ربع سنوي</option>
                  <option value="half">نصف سنوي</option>
                  <option value="year">سنوي</option>
                </select>
                <select onChange={(event) => setVatReportMode(event.target.value as VatReportMode)} value={vatReportMode}>
                  <option value="summary">إجمالي فقط</option>
                  <option value="detail">إجمالي + تفاصيل</option>
                </select>
                <Btn kind="outline" onClick={() => { if (vatReportRows.length) void exportVatArchiveExcel(); }}><FileDown /> تصدير تقرير Excel</Btn>
              </div>
            </header>
            <div className="vat-report-titlebar">
              <b>للفترة من: {vatReportFrom || 'غير محدد'} حتى: {vatReportTo || 'غير محدد'}</b>
              <span>{vatReportSummary.count} سجل · {getVatStatus(vatReportSummary.netTax)}</span>
            </div>
            {vatReportGroups.length ? (
              <div className="vat-report-table-wrap">
                <table className="vat-report-table">
                  <thead>
                    <tr>
                      <th>التفاصيل</th>
                      {vatReportGroups.map((group) => <th key={group.label}>{group.label}</th>)}
                      <th>الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vatReportTableRows.map((row) => (
                      <tr key={row.label}>
                        <th>{row.label}</th>
                        {row.values.map((value, index) => (
                          <td className={value < 0 ? 'negative-cell' : ''} key={`${row.label}-${vatReportGroups[index]?.label || index}`}>
                            {formatCurrency(value.toFixed(2))}
                          </td>
                        ))}
                        <td className={row.total < 0 ? 'total-cell negative-cell' : 'total-cell'}>{formatCurrency(row.total.toFixed(2))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="empty-lite">لا توجد سجلات محفوظة ضمن الفترة المحددة لإنشاء التقرير.</p>}
            {vatReportMode === 'detail' ? (
              <div className="vat-period-detail">
                {vatReportRows.length ? vatReportRows.map(({record, totals, period}) => (
                  <article key={record.id || `${record.periodFrom}-${record.periodTo}`}>
                    <div>
                      <b>{record.companyName || 'شركة غير محددة'}</b>
                      <small>{period.label} · {record.periodFrom || 'بدون بداية'} ← {record.periodTo || 'بدون نهاية'}</small>
                    </div>
                    <small>ضريبة المبيعات: {formatCurrency(totals.salesTotal.tax.toFixed(2))}</small>
                    <small>ضريبة المشتريات: {formatCurrency(totals.purchasesTotal.tax.toFixed(2))}</small>
                    <span>{getVatStatus(totals.netTax)}</span>
                    <strong className={totals.netTax > 0 ? 'danger-text' : totals.netTax < 0 ? 'ok-text' : ''}>{formatCurrency(Math.abs(totals.netTax).toFixed(2))}</strong>
                  </article>
                )) : <p className="empty-lite">لا توجد سجلات محفوظة للعرض التفصيلي.</p>}
              </div>
            ) : null}
          </section>
        </div>
      );
    }
    if (activeTool === 'password-notes') {
      const isEditingPassword = Boolean(editingPasswordId);
      return (
        <div className="secrets-tool">
          <div className="tool-warning secrets-warning"><ShieldCheck /> تنبيه: هذه الأداة مخصصة لحفظ كلمات المرور والمفاتيح العادية فقط، ولا تعتبر خزنة آمنة للمعلومات الحساسة أو السرية. يرجى عدم استخدامها لحفظ بيانات بنكية أو معلومات عالية الخطورة.</div>
          <section className="panel secrets-form-panel" id="password-note-form">
            <header>
              <div>
                <small>ملاحظات الحسابات والمفاتيح</small>
                <h3>{isEditingPassword ? 'تعديل ملاحظة محفوظة' : 'إضافة ملاحظة جديدة'}</h3>
              </div>
              <LockKeyhole />
            </header>
            <div className="secrets-form-grid">
              <label>العنوان<input id="password-note-title" onChange={(event) => setPasswordField('title', event.target.value)} placeholder="مثال: حساب منصة ناجز" value={passwordDraft.title} /></label>
              <label>اسم المستخدم أو المفتاح<input onChange={(event) => setPasswordField('usernameOrKey', event.target.value)} placeholder="البريد / اسم المستخدم / المفتاح" value={passwordDraft.usernameOrKey} /></label>
              <label>كلمة المرور / القيمة<div className="secret-input-wrap"><input dir="ltr" onChange={(event) => setPasswordField('secretValue', event.target.value)} type={showDraftSecret ? 'text' : 'password'} value={passwordDraft.secretValue} /><button onClick={() => setShowDraftSecret((value) => !value)} type="button">{showDraftSecret ? <EyeOff /> : <Eye />}</button></div></label>
              <label>رابط أو جهة الاستخدام<input onChange={(event) => setPasswordField('usageUrl', event.target.value)} placeholder="الجهة أو الرابط المرتبط" value={passwordDraft.usageUrl} /></label>
              <label className="secrets-wide">ملاحظات<textarea onChange={(event) => setPasswordField('notes', event.target.value)} placeholder="معلومة مختصرة تساعدك على تذكر الاستخدام" value={passwordDraft.notes} /></label>
            </div>
            {passwordMessage ? <small className="date-preview">{passwordMessage}</small> : null}
            <div className="card-actions">
              <Btn onClick={savePasswordNote}><FileCheck2 /> {isEditingPassword ? 'حفظ التعديل' : 'إضافة الملاحظة'}</Btn>
              <Btn kind="outline" onClick={() => resetPasswordDraft()}><RotateCcw /> تفريغ</Btn>
            </div>
          </section>

          <section className="panel secrets-library-panel">
            <header>
              <div>
                <small>{passwordNotes.length} ملاحظة محفوظة</small>
                <h3>الملاحظات المحفوظة</h3>
              </div>
              <input onChange={(event) => setPasswordQuery(event.target.value)} placeholder="بحث بالعنوان أو المستخدم أو الجهة..." value={passwordQuery} />
            </header>
            <div className="secrets-list">
              {filteredPasswordNotes.length ? filteredPasswordNotes.map((item) => {
                const isVisible = visiblePasswordIds.includes(item.id);
                return (
                  <article className="secret-card" key={item.id}>
                    <div>
                      <b>{item.title}</b>
                      <small>{item.usernameOrKey || 'بدون اسم مستخدم'} · {item.createdAt ? new Intl.DateTimeFormat('ar-SA').format(new Date(item.createdAt)) : 'تاريخ غير محدد'}</small>
                      <p>{item.usageUrl || 'لا توجد جهة استخدام محددة.'}</p>
                      <code>{isVisible ? item.secretValue : maskSecret(item.secretValue)}</code>
                      {item.notes ? <p>{item.notes}</p> : null}
                    </div>
                    <div className="secret-actions">
                      <Btn kind="outline" onClick={() => copyPasswordValue(item.secretValue)}><Copy /> نسخ</Btn>
                      <Btn kind="outline" onClick={() => togglePasswordVisibility(item.id)}>{isVisible ? <EyeOff /> : <Eye />} {isVisible ? 'إخفاء' : 'إظهار'}</Btn>
                      <Btn kind="outline" onClick={() => editPasswordNote(item)}><Pencil /> تعديل</Btn>
                      <Btn kind="outline" onClick={() => deletePasswordNote(item.id)}><Trash2 /> حذف</Btn>
                    </div>
                  </article>
                );
              }) : <div className="tool-warning info"><LockKeyhole /> لا توجد ملاحظات مطابقة حالياً. أضف ملاحظة جديدة أو غيّر عبارة البحث.</div>}
            </div>
          </section>
        </div>
      );
    }
    if (activeTool === 'temp-clean') return <div className="tool-warning info"><Trash2 /> سيتم تنظيف ملفات البرنامج المؤقتة فقط بعد عرض ملخص وطلب تأكيد. لن يتم لمس Windows Temp أو Downloads أو Desktop أو Cache المتصفح.</div>;
    if (activeTool === 'links') {
      const isEditingLink = Boolean(editingLinkId);
      return (
        <div className="links-tool">
          <section className="panel links-form-panel">
            <header>
              <div>
                <small>إدارة الروابط المهمة</small>
                <h3>{isEditingLink ? 'تعديل رابط محفوظ' : 'إضافة رابط جديد'}</h3>
              </div>
              <LinkIcon />
            </header>
            <div className="links-form-grid">
              <label>عنوان الرابط<input onChange={(event) => setLinkField('title', event.target.value)} placeholder="مثال: ناجز" value={linkDraft.title} /></label>
              <label>الرابط<input dir="ltr" onChange={(event) => setLinkField('url', event.target.value)} placeholder="https://example.com" value={linkDraft.url} /></label>
              <label>التصنيف اختياري<input onChange={(event) => setLinkField('category', event.target.value)} placeholder="محاكم / جهات / أنظمة" value={linkDraft.category} /></label>
              <label className="links-wide">الوظيفة / الوصف<textarea onChange={(event) => setLinkField('description', event.target.value)} placeholder="اكتب وصفاً مختصراً لوظيفة الرابط" value={linkDraft.description} /></label>
            </div>
            {linkMessage ? <small className="date-preview">{linkMessage}</small> : null}
            <div className="card-actions">
              <Btn onClick={saveImportantLink}><FileCheck2 /> {isEditingLink ? 'حفظ التعديل' : 'إضافة الرابط'}</Btn>
              <Btn kind="outline" onClick={() => resetLinkDraft()}><RotateCcw /> تفريغ</Btn>
            </div>
          </section>

          <section className="panel links-library-panel">
            <header>
              <div>
                <small>{importantLinks.length} رابط محفوظ</small>
                <h3>الروابط المحفوظة</h3>
              </div>
              <input onChange={(event) => setLinkQuery(event.target.value)} placeholder="بحث بالعنوان أو التصنيف أو الرابط..." value={linkQuery} />
            </header>
            <div className="links-list">
              {filteredImportantLinks.length ? filteredImportantLinks.map((link) => (
                <article className="link-card" key={link.id}>
                  <div>
                    <b>{link.title}</b>
                    <small>{link.category || 'بدون تصنيف'} · {link.createdAt ? new Intl.DateTimeFormat('ar-SA').format(new Date(link.createdAt)) : 'تاريخ غير محدد'}</small>
                    <p>{link.description || 'لا يوجد وصف.'}</p>
                    <button className="link-url" onClick={() => openImportantLink(link.url)} type="button">{link.url}</button>
                  </div>
                  <div className="link-actions">
                    <Btn kind="outline" onClick={() => openImportantLink(link.url)}><ExternalLink /> فتح</Btn>
                    <Btn kind="outline" onClick={() => editImportantLink(link)}><Pencil /> تعديل</Btn>
                    <Btn kind="outline" onClick={() => deleteImportantLink(link.id)}><Trash2 /> حذف</Btn>
                  </div>
                </article>
              )) : <div className="tool-warning info"><ExternalLink /> لا توجد روابط مطابقة حالياً. أضف رابطاً جديداً أو غيّر عبارة البحث.</div>}
            </div>
          </section>
        </div>
      );
    }
    return <div className="tool-warning info"><Sparkles /> هذه الأداة مفتوحة كبطاقة مستقلة وجاهزة للتنفيذ التفصيلي في المرحلة التالية دون كسر الوظائف الحالية.</div>;
  }

  const activeLabel = groups.flatMap((group) => group.tools).find((tool) => tool.key === activeTool)?.label ?? 'الأداة';

  return (
    <>
      <section className="hero tools-hero">
        <div>
          <small>مركز تشغيل مستقل</small>
          <h2>الأدوات المساعدة</h2>
          <p>أدوات التاريخ والملفات والحسابات المالية والروابط والنظام من مكان واحد.</p>
        </div>
        <Wrench />
      </section>
      <section className="assistant-tools-layout">
        {groups.map((group) => (
          <article className={'panel tool-group ' + group.tone} key={group.title}>
            <h3>{group.title}</h3>
            <div>
              {group.tools.map((tool) => (
                <button className={`${activeTool === tool.key ? 'active' : ''} ${completedToolKeys.has(tool.key) ? 'completed-tool' : ''}`} key={tool.key} onClick={() => setActiveTool(tool.key)} type="button">
                  {tool.icon}
                  <span><b>{tool.label}</b><small>{tool.hint}</small></span>
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>
      <section className="panel tool-detail-panel">
        <header>
          <div>
            <small>الأداة الحالية</small>
            <h2>{activeLabel}</h2>
          </div>
          <Btn kind="outline"><RotateCcw /> جاهزة للمرحلة التالية</Btn>
        </header>
        {renderTool()}
      </section>
    </>
  );
}

function Reports({
  cases,
  agencies,
  delegations,
  monitorItems,
}: {
  cases: CaseRecord[];
  agencies: AgencyRecord[];
  delegations: DelegationRecord[];
  monitorItems: MonitorItem[];
}) {
  const totalCases = cases.length;
  const activeCases = cases.filter((record) => record.status !== 'مغلقة').length;
  const closedCases = cases.filter((record) => record.status === 'مغلقة').length;
  const byCategory = Object.entries(
    cases.reduce<Record<string, number>>((accumulator, record) => {
      accumulator[record.category] = (accumulator[record.category] ?? 0) + 1;
      return accumulator;
    }, {}),
  );
  const byCourt = Object.entries(
    cases.reduce<Record<string, number>>((accumulator, record) => {
      accumulator[record.court] = (accumulator[record.court] ?? 0) + 1;
      return accumulator;
    }, {}),
  );
  const byCity = Object.entries(
    cases.reduce<Record<string, number>>((accumulator, record) => {
      const key = record.city || 'غير محددة';
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {}),
  );
  const byLawyer = Object.entries(
    cases.reduce<Record<string, number>>((accumulator, record) => {
      const key = record.responsibleLawyer || 'غير محدد';
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {}),
  );
  const byStatus = Object.entries(
    cases.reduce<Record<string, number>>((accumulator, record) => {
      accumulator[record.status] = (accumulator[record.status] ?? 0) + 1;
      return accumulator;
    }, {}),
  );
  const monitorByType = Object.entries(
    monitorItems.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.type] = (accumulator[item.type] ?? 0) + 1;
      return accumulator;
    }, {}),
  );
  const monitorByStatus = Object.entries(
    monitorItems.reduce<Record<string, number>>((accumulator, item) => {
      const status = getMonitorStatus(item);
      accumulator[status] = (accumulator[status] ?? 0) + 1;
      return accumulator;
    }, {}),
  );
  const monitorDueWindows = [
    ['خلال 7 أيام', monitorItems.filter((item) => { const days = getDaysUntil(item.endDate); return !item.completed && days >= 0 && days <= 7; }).length],
    ['خلال 30 يوم', monitorItems.filter((item) => { const days = getDaysUntil(item.endDate); return !item.completed && days >= 0 && days <= 30; }).length],
    ['منتهية أو متأخرة', monitorItems.filter((item) => ['منتهي', 'متأخر'].includes(getMonitorStatus(item))).length],
    ['مكتملة', monitorItems.filter((item) => item.completed).length],
  ] as const;
  const allHearings = cases.flatMap((record) => record.hearings);
  const upcomingHearings = allHearings.filter((hearing) => hearing.status === 'قادمة').length;
  const completedHearings = allHearings.filter((hearing) => hearing.status === 'تمت').length;
  const activeAgencies = agencies.filter((record) => getExpiryStatus(record.endDate) === 'سارية').length;
  const expiringAgencies = agencies.filter((record) => getExpiryStatus(record.endDate) === 'تنتهي قريبًا').length;
  const expiredAgencies = agencies.filter((record) => getExpiryStatus(record.endDate) === 'منتهية').length;
  const totalDelegations = delegations.length;

  function exportReportsJson() {
    downloadJson(
      {
        summary: {
          totalCases,
          activeCases,
          closedCases,
          upcomingHearings,
          completedHearings,
          activeAgencies,
          expiringAgencies,
          expiredAgencies,
          totalDelegations,
        },
        casesByCategory: byCategory,
        casesByCourt: byCourt,
        casesByCity: byCity,
        casesByLawyer: byLawyer,
        casesByStatus: byStatus,
        monitorByType,
        monitorByStatus,
        monitorDueWindows,
      },
      'bayyinah-reports.json',
    );
  }

  function exportReportsText() {
    downloadText(
      [
        `إجمالي القضايا: ${totalCases}`,
        `القضايا النشطة: ${activeCases}`,
        `القضايا المغلقة: ${closedCases}`,
        `الجلسات القادمة: ${upcomingHearings}`,
        `الجلسات المنتهية: ${completedHearings}`,
        `الوكالات السارية: ${activeAgencies}`,
        `الوكالات التي تنتهي قريبًا: ${expiringAgencies}`,
        `الوكالات المنتهية: ${expiredAgencies}`,
        `إجمالي التفويضات: ${totalDelegations}`,
        '',
        'القضايا حسب النوع:',
        ...byCategory.map(([label, value]) => `- ${label}: ${value}`),
        '',
        'القضايا حسب المحكمة:',
        ...byCourt.map(([label, value]) => `- ${label}: ${value}`),
        '',
        'القضايا حسب المدينة:',
        ...byCity.map(([label, value]) => `- ${label}: ${value}`),
        '',
        'القضايا حسب المحامي المسؤول:',
        ...byLawyer.map(([label, value]) => `- ${label}: ${value}`),
        '',
        'القضايا حسب الحالة:',
        ...byStatus.map(([label, value]) => `- ${label}: ${value}`),
      ].join('\n'),
      'bayyinah-reports.txt',
    );
  }

  async function exportReportsExcel() {
    const XLSX = await import('xlsx');
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(cases.map((record) => ({
      'رقم القضية': record.number,
      'اسم القضية': record.title,
      'التصنيف': record.category,
      'المحكمة': record.court,
      'المدينة': record.city,
      'الحالة': record.status,
      'المحامي': record.responsibleLawyer,
      'المبلغ': record.amountClaimed,
    }))), 'القضايا');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(cases.flatMap((record) => record.hearings.map((hearing) => ({
      'القضية': record.title, 'التاريخ': hearing.date, 'الوقت': hearing.time, 'المحكمة': hearing.court, 'الحالة': hearing.status,
    })))), 'الجلسات');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(agencies.map((record) => ({
      'رقم الوكالة': record.id, 'الموكل': record.principal, 'الوكيل': record.attorney, 'النوع': record.type, 'الانتهاء': record.endDate, 'الحالة': getExpiryStatus(record.endDate),
    }))), 'الوكالات');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(delegations.map((record) => ({
      'رقم التفويض': record.id, 'المفوض': record.principal, 'المفوض إليه': record.delegate, 'الصلاحيات': record.powers, 'الانتهاء': record.endDate,
    }))), 'التفويضات');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(monitorItems.map((item) => ({
      'النوع': item.type, 'الاسم': item.name, 'الرقم': item.referenceNumber || item.vehiclePlate, 'الانتهاء': item.endDate, 'المبلغ': item.amount, 'الحالة': getMonitorStatus(item), 'الأيام المتبقية': getDaysUntil(item.endDate),
    }))), 'الانتهاءات');
    XLSX.writeFile(workbook, `bayyinah-report-${todayIsoDate()}.xlsx`);
  }

  async function exportReportsPdf() {
    const summaryRows = [
      ['إجمالي القضايا', totalCases], ['القضايا النشطة', activeCases], ['القضايا المغلقة', closedCases],
      ['الجلسات القادمة', upcomingHearings], ['الوكالات السارية', activeAgencies], ['الانتهاءات والاستحقاقات', monitorItems.length],
    ];
    const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>body{font-family:Tahoma,Arial;padding:32px;color:#172033}h1{color:#0b162c;border-bottom:3px solid #d4af37;padding-bottom:12px}table{width:100%;border-collapse:collapse;margin:18px 0}th,td{padding:9px;border:1px solid #d8dde6;text-align:right}th{background:#0b162c;color:#fff}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.card{padding:12px;border:1px solid #d8dde6;border-radius:8px}.card b{display:block;font-size:22px;color:#2457a7}small{color:#667085}</style></head><body><h1>تقرير بيّنة - قضيتي</h1><p>${escapeHtml(new Date().toLocaleDateString('ar-SA'))}</p><div class="summary">${summaryRows.map(([label, value]) => `<div class="card"><small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b></div>`).join('')}</div><h2>القضايا</h2><table><thead><tr><th>الرقم</th><th>القضية</th><th>المحكمة</th><th>الحالة</th></tr></thead><tbody>${cases.map((record) => `<tr><td>${escapeHtml(record.number)}</td><td>${escapeHtml(record.title)}</td><td>${escapeHtml(record.court)}</td><td>${escapeHtml(record.status)}</td></tr>`).join('')}</tbody></table><h2>الانتهاءات والاستحقاقات</h2><table><thead><tr><th>النوع</th><th>الاسم</th><th>التاريخ</th><th>الحالة</th></tr></thead><tbody>${monitorItems.map((item) => `<tr><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(formatDate(item.endDate))}</td><td>${escapeHtml(getMonitorStatus(item))}</td></tr>`).join('')}</tbody></table></body></html>`;
    if (window.bayyinahDesktop) {
      await window.bayyinahDesktop.reports.savePdf({html, filename: `Bayyinah-Report-${todayIsoDate()}.pdf`});
    } else {
      const report = window.open('', '_blank');
      report?.document.write(html);
      report?.document.close();
      report?.print();
    }
  }

  const cards = [
    ['إجمالي القضايا', totalCases],
    ['القضايا النشطة', activeCases],
    ['القضايا المغلقة', closedCases],
    ['الجلسات القادمة', upcomingHearings],
    ['الجلسات المنتهية', completedHearings],
    ['الوكالات السارية', activeAgencies],
    ['تنتهي قريبًا', expiringAgencies],
    ['إجمالي التفويضات', totalDelegations],
    ['الانتهاءات والاستحقاقات', monitorItems.length],
  ];

  return (
    <div className="reports-page">
      <Head
        title="التقارير"
        sub="إحصاءات سريعة وتقارير قابلة للتصدير عن القضايا والجلسات والوكالات"
        action={
          <div className="settings-actions">
            <Btn kind="outline" onClick={() => void exportReportsExcel()}><FileDown /> Excel</Btn>
            <Btn kind="outline" onClick={() => void exportReportsPdf()}><FileText /> PDF / طباعة</Btn>
          </div>
        }
      />
      <div className="stats-grid">
        {cards.map(([label, value]) => (
          <article className="panel statcard" key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <div className="reports-grid">
        <section className="panel settings-card">
          <h2>القضايا حسب النوع</h2>
          <div className="report-list">
            {byCategory.length ? (
              byCategory.map(([label, value]) => (
                <div className="report-row" key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </div>
              ))
            ) : (
              <p>لا توجد بيانات بعد.</p>
            )}
          </div>
        </section>
        <section className="panel settings-card">
          <h2>القضايا حسب المحكمة</h2>
          <div className="report-list">
            {byCourt.length ? (
              byCourt.map(([label, value]) => (
                <div className="report-row" key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </div>
              ))
            ) : (
              <p>لا توجد بيانات بعد.</p>
            )}
          </div>
        </section>
        <section className="panel settings-card">
          <h2>القضايا حسب المدينة</h2>
          <div className="report-list">
            {byCity.length ? (
              byCity.map(([label, value]) => (
                <div className="report-row" key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </div>
              ))
            ) : (
              <p>لا توجد بيانات بعد.</p>
            )}
          </div>
        </section>
        <section className="panel settings-card">
          <h2>القضايا حسب المحامي المسؤول</h2>
          <div className="report-list">
            {byLawyer.length ? (
              byLawyer.map(([label, value]) => (
                <div className="report-row" key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </div>
              ))
            ) : (
              <p>لا توجد بيانات بعد.</p>
            )}
          </div>
        </section>
        <section className="panel settings-card full-width">
          <h2>القضايا حسب الحالة</h2>
          <div className="report-list">
            {byStatus.length ? (
              byStatus.map(([label, value]) => (
                <div className="report-row" key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </div>
              ))
            ) : (
              <p>لا توجد بيانات بعد.</p>
            )}
          </div>
        </section>
        <section className="panel settings-card full-width monitor-report-section">
          <h2>تقارير الانتهاءات والاستحقاقات</h2>
          <div className="monitor-report-grid">
            <div>
              <h3>حسب التصنيف</h3>
              <div className="report-list">
                {monitorByType.length ? monitorByType.map(([label, value]) => (
                  <div className="report-row" key={label}><span>{label}</span><b>{value}</b></div>
                )) : <p>لا توجد بيانات بعد.</p>}
              </div>
            </div>
            <div>
              <h3>حسب الحالة</h3>
              <div className="report-list">
                {monitorByStatus.length ? monitorByStatus.map(([label, value]) => (
                  <div className="report-row" key={label}><span>{label}</span><b>{value}</b></div>
                )) : <p>لا توجد بيانات بعد.</p>}
              </div>
            </div>
            <div>
              <h3>حسب المدة</h3>
              <div className="report-list">
                {monitorDueWindows.map(([label, value]) => (
                  <div className="report-row" key={label}><span>{label}</span><b>{value}</b></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Agencies({
  agencies,
  setAgencies,
  delegations,
  setDelegations,
  onNotice,
}: {
  agencies: AgencyRecord[];
  setAgencies: React.Dispatch<React.SetStateAction<AgencyRecord[]>>;
  delegations: DelegationRecord[];
  setDelegations: React.Dispatch<React.SetStateAction<DelegationRecord[]>>;
  onNotice: (message: string) => void;
}) {
  const [tab, setTab] = useState<'الوكالات' | 'التفويضات'>('الوكالات');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'الكل' | AgencyStatus>('الكل');
  const [delegationFilter, setDelegationFilter] = useState<'الكل' | AgencyStatus>('الكل');
  const [showAgencyForm, setShowAgencyForm] = useState(false);
  const [showDelegationForm, setShowDelegationForm] = useState(false);
  const [agencyForm, setAgencyForm] = useState<AgencyRecord>(emptyAgency());
  const [delegationForm, setDelegationForm] = useState<DelegationRecord>(emptyDelegation());
  const [editingAgencyId, setEditingAgencyId] = useState<string | null>(null);
  const [editingDelegationId, setEditingDelegationId] = useState<string | null>(null);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [selectedDelegationId, setSelectedDelegationId] = useState<string | null>(null);

  const shownAgencies = agencies.filter((agency) => {
    const haystack = [agency.id, agency.principal, agency.attorney, agency.type, agency.notes].join(' ').toLowerCase();
    const matchQuery = haystack.includes(query.toLowerCase());
    const matchFilter = filter === 'الكل' ? true : getExpiryStatus(agency.endDate) === filter;
    return matchQuery && matchFilter;
  });

  const shownDelegations = delegations.filter((delegation) => {
    const haystack = [delegation.id, delegation.principal, delegation.delegate, delegation.powers, delegation.notes]
      .join(' ')
      .toLowerCase();
    const matchFilter = delegationFilter === 'الكل' ? true : getExpiryStatus(delegation.endDate) === delegationFilter;
    return haystack.includes(query.toLowerCase()) && matchFilter;
  });

  function startNewAgency() {
    setEditingAgencyId(null);
    setAgencyForm(emptyAgency());
    setShowAgencyForm(true);
  }

  function startNewDelegation() {
    setEditingDelegationId(null);
    setDelegationForm(emptyDelegation());
    setShowDelegationForm(true);
  }

  function editAgency(record: AgencyRecord) {
    setEditingAgencyId(record.id);
    setAgencyForm({...record, attachments: record.attachments ?? []});
    setShowAgencyForm(true);
    setSelectedAgencyId(record.id);
  }

  function editDelegation(record: DelegationRecord) {
    setEditingDelegationId(record.id);
    setDelegationForm({...record, attachments: record.attachments ?? []});
    setShowDelegationForm(true);
    setSelectedDelegationId(record.id);
  }

  function saveAgency() {
    if (!agencyForm.id.trim() || !agencyForm.principal.trim() || !agencyForm.attorney.trim()) return;
    if (agencies.some((record) => record.id === agencyForm.id && record.id !== editingAgencyId)) {
      onNotice('رقم الوكالة مستخدم مسبقًا.');
      return;
    }
    const built = {...agencyForm, status: getExpiryStatus(agencyForm.endDate)};
    setAgencies((current) =>
      editingAgencyId ? current.map((record) => (record.id === editingAgencyId ? built : record)) : [built, ...current],
    );
    playSuccessSound();
    onNotice(editingAgencyId ? 'تم حفظ تعديلات الوكالة.' : 'تمت إضافة الوكالة بنجاح.');
    setSelectedAgencyId(built.id);
    setEditingAgencyId(null);
    setAgencyForm(emptyAgency());
    setShowAgencyForm(false);
  }

  function saveDelegation() {
    if (!delegationForm.id.trim() || !delegationForm.principal.trim() || !delegationForm.delegate.trim()) return;
    if (delegations.some((record) => record.id === delegationForm.id && record.id !== editingDelegationId)) {
      onNotice('رقم التفويض مستخدم مسبقًا.');
      return;
    }
    const built = {...delegationForm};
    setDelegations((current) =>
      editingDelegationId
        ? current.map((record) => (record.id === editingDelegationId ? built : record))
        : [built, ...current],
    );
    playSuccessSound();
    onNotice(editingDelegationId ? 'تم حفظ تعديلات التفويض.' : 'تمت إضافة التفويض بنجاح.');
    setSelectedDelegationId(built.id);
    setEditingDelegationId(null);
    setDelegationForm(emptyDelegation());
    setShowDelegationForm(false);
  }

  function deleteAgency(record: AgencyRecord) {
    if (!window.confirm(`هل تريد حذف الوكالة رقم ${record.id} نهائيًا؟`)) return;
    setAgencies((current) => current.filter((item) => item.id !== record.id));
    if (selectedAgencyId === record.id) setSelectedAgencyId(null);
    if (editingAgencyId === record.id) {
      setEditingAgencyId(null);
      setShowAgencyForm(false);
    }
    onNotice('تم حذف الوكالة.');
  }

  function deleteDelegation(record: DelegationRecord) {
    if (!window.confirm(`هل تريد حذف التفويض رقم ${record.id} نهائيًا؟`)) return;
    setDelegations((current) => current.filter((item) => item.id !== record.id));
    if (selectedDelegationId === record.id) setSelectedDelegationId(null);
    if (editingDelegationId === record.id) {
      setEditingDelegationId(null);
      setShowDelegationForm(false);
    }
    onNotice('تم حذف التفويض.');
  }

  async function onAgencyFiles(fileList: FileList | null) {
    const attachments = await filesToAttachments(fileList);
    if (!attachments.length) return;
    setAgencyForm((current) => ({...current, attachments: [...current.attachments, ...attachments]}));
  }

  async function onDelegationFiles(fileList: FileList | null) {
    const attachments = await filesToAttachments(fileList);
    if (!attachments.length) return;
    setDelegationForm((current) => ({...current, attachments: [...current.attachments, ...attachments]}));
  }

  function exportAttachmentsIndex(title: string, attachments: AttachmentRecord[], id: string) {
    downloadJson(
      attachments.map((attachment) => ({
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
        uploadedAt: attachment.uploadedAt,
      })),
      `${title}-${id}-attachments.json`,
    );
  }

  return (
    <>
      <Head
        title="الوكالات والتفويضات"
        sub="أصبح هذا القسم يدعم الإضافة والبحث والتصفية الفعلية"
        action={
          tab === 'الوكالات' ? (
            <Btn onClick={startNewAgency}>
              <Plus /> إضافة وكالة
            </Btn>
          ) : (
            <Btn onClick={startNewDelegation}>
              <Plus /> إضافة تفويض
            </Btn>
          )
        }
      />
      <div className="tabs big">
        {(['الوكالات', 'التفويضات'] as const).map((item) => (
          <button className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)} type="button">
            {item}
          </button>
        ))}
      </div>

      <div className="agencytools">
        <div className="search">
          <Search />
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tab === 'الوكالات' ? 'ابحث برقم الوكالة أو الاسم' : 'ابحث برقم التفويض أو الاسم'}
            value={query}
          />
        </div>
        {tab === 'الوكالات' && (
          <div className="chips">
            {(['الكل', ...agencyStatuses] as const).map((item) => (
              <button
                className={filter === item ? 'active' : ''}
                key={item}
                onClick={() => setFilter(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        )}
        {tab === 'التفويضات' && (
          <div className="chips">
            {(['الكل', ...agencyStatuses] as const).map((item) => (
              <button
                className={delegationFilter === item ? 'active' : ''}
                key={item}
                onClick={() => setDelegationFilter(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {showAgencyForm && tab === 'الوكالات' && (
        <section className="panel inline-form">
          <h2>{editingAgencyId ? `تعديل الوكالة رقم ${editingAgencyId}` : 'إضافة وكالة'}</h2>
          <div className="form">
            <label>
              رقم الوكالة
              <input onChange={(event) => setAgencyForm({...agencyForm, id: event.target.value})} value={agencyForm.id} />
            </label>
            <label>
              نوع الوكالة
              <input onChange={(event) => setAgencyForm({...agencyForm, type: event.target.value})} value={agencyForm.type} />
            </label>
            <label>
              اسم الموكل
              <input
                onChange={(event) => setAgencyForm({...agencyForm, principal: event.target.value})}
                value={agencyForm.principal}
              />
            </label>
            <label>
              اسم الوكيل
              <input
                onChange={(event) => setAgencyForm({...agencyForm, attorney: event.target.value})}
                value={agencyForm.attorney}
              />
            </label>
            <label>
              تاريخ البداية
              <CalendarDateInput onChange={(value) => setAgencyForm({...agencyForm, startDate: value})} value={agencyForm.startDate} />
              <DatePreview value={agencyForm.startDate} />
            </label>
            <label>
              تاريخ الانتهاء
              <CalendarDateInput onChange={(value) => setAgencyForm({...agencyForm, endDate: value})} value={agencyForm.endDate} />
              <DatePreview value={agencyForm.endDate} />
            </label>
            <label>
              الحالة
              <select
                onChange={(event) => setAgencyForm({...agencyForm, status: event.target.value as AgencyStatus})}
                value={agencyForm.status}
              >
                {agencyStatuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="full">
              ملاحظات
              <textarea onChange={(event) => setAgencyForm({...agencyForm, notes: event.target.value})} value={agencyForm.notes} />
            </label>
            <label className="full">
              مرفقات الوكالة
              <input multiple onChange={(event) => void onAgencyFiles(event.target.files)} type="file" />
            </label>
          </div>
          {agencyForm.attachments.length ? (
            <div className="attachment-stack">
              {agencyForm.attachments.map((attachment) => (
                <article className="attachment-card" key={attachment.id}>
                  <div>
                    <small>الملف</small>
                    <b>{attachment.name}</b>
                    <p>{formatBytes(attachment.size)}</p>
                  </div>
                  <div className="attachment-actions">
                    <Btn kind="outline" onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}>
                      <Download /> تنزيل
                    </Btn>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
          <div className="form-actions">
            <Btn kind="outline" onClick={() => { setShowAgencyForm(false); setEditingAgencyId(null); setAgencyForm(emptyAgency()); }}>
              إغلاق
            </Btn>
            <Btn onClick={saveAgency}>{editingAgencyId ? 'حفظ التعديلات' : 'حفظ الوكالة'}</Btn>
          </div>
        </section>
      )}

      {showDelegationForm && tab === 'التفويضات' && (
        <section className="panel inline-form">
          <h2>{editingDelegationId ? `تعديل التفويض رقم ${editingDelegationId}` : 'إضافة تفويض'}</h2>
          <div className="form">
            <label>
              رقم التفويض
              <input
                onChange={(event) => setDelegationForm({...delegationForm, id: event.target.value})}
                value={delegationForm.id}
              />
            </label>
            <label>
              اسم المفوض
              <input
                onChange={(event) => setDelegationForm({...delegationForm, principal: event.target.value})}
                value={delegationForm.principal}
              />
            </label>
            <label>
              اسم المفوض إليه
              <input
                onChange={(event) => setDelegationForm({...delegationForm, delegate: event.target.value})}
                value={delegationForm.delegate}
              />
            </label>
            <label>
              الصلاحيات
              <input
                onChange={(event) => setDelegationForm({...delegationForm, powers: event.target.value})}
                value={delegationForm.powers}
              />
            </label>
            <label>
              تاريخ البداية
              <CalendarDateInput onChange={(value) => setDelegationForm({...delegationForm, startDate: value})} value={delegationForm.startDate} />
              <DatePreview value={delegationForm.startDate} />
            </label>
            <label>
              تاريخ الانتهاء
              <CalendarDateInput onChange={(value) => setDelegationForm({...delegationForm, endDate: value})} value={delegationForm.endDate} />
              <DatePreview value={delegationForm.endDate} />
            </label>
            <label className="full">
              ملاحظات
              <textarea
                onChange={(event) => setDelegationForm({...delegationForm, notes: event.target.value})}
                value={delegationForm.notes}
              />
            </label>
            <label className="full">
              مرفقات التفويض
              <input multiple onChange={(event) => void onDelegationFiles(event.target.files)} type="file" />
            </label>
          </div>
          {delegationForm.attachments.length ? (
            <div className="attachment-stack">
              {delegationForm.attachments.map((attachment) => (
                <article className="attachment-card" key={attachment.id}>
                  <div>
                    <small>الملف</small>
                    <b>{attachment.name}</b>
                    <p>{formatBytes(attachment.size)}</p>
                  </div>
                  <div className="attachment-actions">
                    <Btn kind="outline" onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}>
                      <Download /> تنزيل
                    </Btn>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
          <div className="form-actions">
            <Btn kind="outline" onClick={() => { setShowDelegationForm(false); setEditingDelegationId(null); setDelegationForm(emptyDelegation()); }}>
              إغلاق
            </Btn>
            <Btn onClick={saveDelegation}>{editingDelegationId ? 'حفظ التعديلات' : 'حفظ التفويض'}</Btn>
          </div>
        </section>
      )}

      {tab === 'الوكالات' ? (
        <>
          <article className="critical">
            <AlertTriangle />
            <div>
              <h3>تنبيه: الوكالات الآن قابلة للبحث والتصفية والإضافة مباشرة</h3>
              <p>جرّب البحث برقم الوكالة أو التبديل بين سارية وتنتهي قريبًا ومنتهية.</p>
            </div>
            <Btn kind="light" onClick={() => setFilter('تنتهي قريبًا')}>
              عرض القريبة
            </Btn>
          </article>
          {shownAgencies.length ? (
            shownAgencies.map((agency) => {
              const attachments = agency.attachments ?? [];
              const isOpen = selectedAgencyId === agency.id;

              return (
                <div key={agency.id}>
                  <article className="agency panel">
                    <div>
                      <small>رقم الوكالة</small>
                      <h3>{agency.id}</h3>
                      <Status text={getExpiryStatus(agency.endDate)} tone={getAgencyTone(getExpiryStatus(agency.endDate))} />
                    </div>
                    <div>
                      <small>الموكل / الوكيل</small>
                      <b>{agency.principal}</b>
                      <p>{agency.attorney}</p>
                    </div>
                    <div>
                      <small>النوع</small>
                      <b>{agency.type}</b>
                      <p>{agency.notes}</p>
                    </div>
                    <div>
                      <small>تاريخ الانتهاء</small>
                      <b>{formatDate(agency.endDate)}</b>
                    </div>
                    <div className="card-actions record-actions">
                      <Btn kind="outline" onClick={() => setSelectedAgencyId(isOpen ? null : agency.id)}>
                        {isOpen ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                      </Btn>
                      <Btn kind="outline" onClick={() => editAgency(agency)}><Pencil /> تعديل</Btn>
                      <Btn kind="danger" onClick={() => deleteAgency(agency)}><Trash2 /> حذف</Btn>
                    </div>
                  </article>

                  {isOpen && (
                    <section className="panel detail-panel inline-detail">
                      <div className="sectiontitle">
                        <h2>تفاصيل الوكالة رقم {agency.id}</h2>
                        <button onClick={() => exportAttachmentsIndex('agency', attachments, agency.id)} type="button">
                          تصدير فهرس المرفقات
                        </button>
                      </div>
                      <div className="summary-grid">
                        <div>
                          <small>الحالة الحالية</small>
                          <b>{getExpiryStatus(agency.endDate)}</b>
                        </div>
                        <div>
                          <small>نوع الوكالة</small>
                          <b>{agency.type}</b>
                        </div>
                        <div>
                          <small>الموكل</small>
                          <b>{agency.principal}</b>
                        </div>
                        <div>
                          <small>الوكيل</small>
                          <b>{agency.attorney}</b>
                        </div>
                        <div>
                          <small>تاريخ البداية</small>
                          <b>{formatDate(agency.startDate)}</b>
                        </div>
                        <div>
                          <small>تاريخ الانتهاء</small>
                          <b>{formatDate(agency.endDate)}</b>
                        </div>
                      </div>
                      <p className="notes-box">{agency.notes || 'لا توجد ملاحظات.'}</p>
                      {attachments.length ? (
                        <div className="attachment-stack">
                          {attachments.map((attachment) => (
                            <article className="attachment-card" key={attachment.id}>
                              <div>
                                <small>المستند</small>
                                <b>{attachment.name}</b>
                                <p>{formatBytes(attachment.size)}</p>
                              </div>
                              <div className="attachment-actions">
                                <Btn kind="outline" onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}>
                                  <Download /> تنزيل المستند
                                </Btn>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-lite">لا توجد مرفقات لهذه الوكالة.</div>
                      )}
                    </section>
                  )}
                </div>
              );
            })
          ) : (
            <div className="empty panel">
              <UsersRound />
              <h2>لا توجد وكالات مطابقة</h2>
              <p>غيّر البحث أو التصنيف وستظهر النتائج المطابقة.</p>
            </div>
          )}
        </>
      ) : shownDelegations.length ? (
        shownDelegations.map((delegation) => {
          const attachments = delegation.attachments ?? [];
          const isOpen = selectedDelegationId === delegation.id;

          return (
            <div key={delegation.id}>
              <article className="agency panel delegation">
                <div>
                  <small>رقم التفويض</small>
                  <h3>{delegation.id}</h3>
                  <Status text={getExpiryStatus(delegation.endDate)} tone={getAgencyTone(getExpiryStatus(delegation.endDate))} />
                </div>
                <div>
                  <small>المفوض / المفوض إليه</small>
                  <b>{delegation.principal}</b>
                  <p>{delegation.delegate}</p>
                </div>
                <div>
                  <small>الصلاحيات</small>
                  <b>{delegation.powers}</b>
                  <p>{delegation.notes}</p>
                </div>
                <div>
                  <small>المدة</small>
                  <b>
                    {formatDate(delegation.startDate)} · {formatDate(delegation.endDate)}
                  </b>
                </div>
                <div className="card-actions record-actions">
                  <Btn kind="outline" onClick={() => setSelectedDelegationId(isOpen ? null : delegation.id)}>
                    {isOpen ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                  </Btn>
                  <Btn kind="outline" onClick={() => editDelegation(delegation)}><Pencil /> تعديل</Btn>
                  <Btn kind="danger" onClick={() => deleteDelegation(delegation)}><Trash2 /> حذف</Btn>
                </div>
              </article>

              {isOpen && (
                <section className="panel detail-panel inline-detail">
                  <div className="sectiontitle">
                    <h2>تفاصيل التفويض رقم {delegation.id}</h2>
                    <button
                      onClick={() => exportAttachmentsIndex('delegation', attachments, delegation.id)}
                      type="button"
                    >
                      تصدير فهرس المرفقات
                    </button>
                  </div>
                  <div className="summary-grid">
                    <div>
                      <small>الحالة الحالية</small>
                      <b>{getExpiryStatus(delegation.endDate)}</b>
                    </div>
                    <div>
                      <small>الصلاحيات</small>
                      <b>{delegation.powers}</b>
                    </div>
                    <div>
                      <small>المفوض</small>
                      <b>{delegation.principal}</b>
                    </div>
                    <div>
                      <small>المفوض إليه</small>
                      <b>{delegation.delegate}</b>
                    </div>
                    <div>
                      <small>تاريخ البداية</small>
                      <b>{formatDate(delegation.startDate)}</b>
                    </div>
                    <div>
                      <small>تاريخ الانتهاء</small>
                      <b>{formatDate(delegation.endDate)}</b>
                    </div>
                  </div>
                  <p className="notes-box">{delegation.notes || 'لا توجد ملاحظات.'}</p>
                  {attachments.length ? (
                    <div className="attachment-stack">
                      {attachments.map((attachment) => (
                        <article className="attachment-card" key={attachment.id}>
                          <div>
                            <small>المستند</small>
                            <b>{attachment.name}</b>
                            <p>{formatBytes(attachment.size)}</p>
                          </div>
                          <div className="attachment-actions">
                            <Btn kind="outline" onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}>
                              <Download /> تنزيل المستند
                            </Btn>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-lite">لا توجد مرفقات لهذا التفويض.</div>
                  )}
                </section>
              )}
            </div>
          );
        })
      ) : (
        <div className="empty panel">
          <UsersRound />
          <h2>لا توجد تفويضات مطابقة</h2>
          <p>أضف تفويضًا جديدًا أو جرّب كلمة بحث أخرى.</p>
          <Btn onClick={startNewDelegation}>
            <Plus /> إضافة تفويض
          </Btn>
        </div>
      )}

    </>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [cases, setCases] = usePersistentState<CaseRecord[]>('bayyinah-cases', seedCases);
  const [agencies, setAgencies] = usePersistentState<AgencyRecord[]>('bayyinah-agencies', seedAgencies);
  const [delegations, setDelegations] = usePersistentState<DelegationRecord[]>('bayyinah-delegations', seedDelegations);
  const [monitorItems, setMonitorItems] = usePersistentState<MonitorItem[]>('bayyinah-monitor-items', []);
  const [draft, setDraft] = usePersistentState<NewCaseDraft>('bayyinah-case-draft', emptyDraft());
  const [settings, setSettings] = usePersistentState<AppSettings>('bayyinah-settings', emptySettings());
  const [stickyNotes, setStickyNotes] = usePersistentState<StickyNoteRecord[]>('bayyinah-sticky-notes', []);
  const [users, setUsers, usersLoaded, usersLoadError] = usePersistentState<UserAccount[]>('bayyinah-users', []);
  const [authenticatedUserId, setAuthenticatedUserId] = useState(() =>
    window.localStorage.getItem('bayyinah-auth-user') ?? window.sessionStorage.getItem('bayyinah-auth-user') ?? '',
  );
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id ?? '');
  const [draftMode, setDraftMode] = useState<DraftMode>('create');
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [scheduledAlert, setScheduledAlert] = useState<{target: 'case' | 'monitoring'; recordId: string; title: string; text: string} | null>(null);
  const [licenseStatus, setLicenseStatus] = useState<DesktopLicenseStatus>(() =>
    window.bayyinahDesktop ? {status: 'loading', deviceCode: ''} : {status: 'active', deviceCode: '', customer: 'نسخة المتصفح'},
  );

  useEffect(() => {
    if (!window.bayyinahDesktop) return;
    void window.bayyinahDesktop.license.status().then(setLicenseStatus);
  }, []);

  useEffect(() => {
    if (!usersLoaded || !users.length) return;
    const needsUpgrade = users.some((user) => user.role !== 'admin' || JSON.stringify(user.permissions ?? []) !== JSON.stringify(allUserPermissions));
    if (!needsUpgrade) return;
    const upgradedUsers = users.map((user) => ({...user, role: 'admin' as const, permissions: allUserPermissions}));
    setUsers(upgradedUsers);
    window.localStorage.setItem('bayyinah-users', JSON.stringify(upgradedUsers));
    void window.bayyinahDesktop?.storage.set('bayyinah-users', upgradedUsers);
  }, [setUsers, users, usersLoaded]);

  async function activateLicense(code: string) {
    const result = await window.bayyinahDesktop?.license.activate(code) ?? licenseStatus;
    setLicenseStatus(result);
    return result;
  }

  async function registerUser(name: string, identifier: string, password: string) {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    if (users.some((user) => user.identifier === normalizedIdentifier)) return 'هذا البريد أو الجوال مسجل مسبقاً.';
    const account: UserAccount = {
      id: crypto.randomUUID(),
      name: name.trim(),
      identifier: normalizedIdentifier,
      passwordHash: await hashPassword(password),
      role: 'admin',
      permissions: allUserPermissions,
      createdAt: new Date().toISOString(),
    };
    const nextUsers = [...users, account];
    setUsers(nextUsers);
    window.localStorage.setItem('bayyinah-users', JSON.stringify(nextUsers));
    await window.bayyinahDesktop?.storage.set('bayyinah-users', nextUsers);
    setAuthenticatedUserId(account.id);
    window.localStorage.setItem('bayyinah-auth-user', account.id);
    currentUserName = account.name;
    setShowRegisterForm(false);
    setPage('dashboard');
    return '';
  }

  async function loginUser(identifier: string, password: string) {
    if (!identifier.trim() || !password) return 'يرجى إدخال بيانات الدخول.';
    const passwordHash = await hashPassword(password);
    const account = users.find((user) => user.identifier === identifier.trim().toLowerCase() && user.passwordHash === passwordHash);
    if (!account) return 'البريد أو الجوال أو كلمة المرور غير صحيحة.';
    setAuthenticatedUserId(account.id);
    window.localStorage.setItem('bayyinah-auth-user', account.id);
    currentUserName = account.name;
    setShowRegisterForm(false);
    setPage('dashboard');
    return '';
  }

  useEffect(() => {
    setCases((current) => current.map((record) => normalizeCase(record)));
    setAgencies((current) => current.map((record) => normalizeAgency(record)));
    setDelegations((current) => current.map((record) => normalizeDelegation(record)));
    setMonitorItems((current) => current.map((record) => normalizeMonitorItem(record)));
  }, [setAgencies, setCases, setDelegations, setMonitorItems]);

  useEffect(() => {
    if (!selectedCaseId && cases[0]) {
      setSelectedCaseId(cases[0].id);
    }
  }, [cases, selectedCaseId]);

  useEffect(() => {
    currentCalendarMode = settings.calendarMode;
    currentUserName = settings.userName;
    currentOrganizationName = settings.organizationName;
    currentAppName = settings.appName;
    currentAppTagline = settings.appTagline;
    currentLogoDataUrl = settings.logoDataUrl;
  }, [settings]);

  useEffect(() => {
    const legacyOffsets = ['30 يوم', '14 يوم', '3 أيام', 'يوم واحد', 'ساعة'];
    if (JSON.stringify(settings.defaultReminderOffsets) !== JSON.stringify(legacyOffsets)) return;
    setSettings((current) => ({...current, defaultReminderOffsets: reminderOffsetOptions}));
  }, [setSettings, settings.defaultReminderOffsets]);

  useEffect(() => {
    if (typeof settings.desktopNotificationsEnabled === 'boolean') return;
    setSettings((current) => ({...current, desktopNotificationsEnabled: false}));
  }, [setSettings, settings.desktopNotificationsEnabled]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const selectedCase = useMemo(
    () => cases.find((record) => record.id === selectedCaseId) ?? cases[0],
    [cases, selectedCaseId],
  );

  function openCase(caseId: string) {
    setSelectedCaseId(caseId);
    setPage('details');
  }

  useEffect(() => {
    if (!settings.remindersEnabled) return;
    const reminderMinutes = getReminderMinutes(settings);

    function checkScheduledHearings() {
      let sent: Set<string>;
      try {
        sent = new Set(JSON.parse(window.localStorage.getItem('bayyinah-sent-reminders') ?? '[]') as string[]);
      } catch {
        sent = new Set();
      }

      for (const record of cases) {
        for (const hearing of record.hearings) {
          if (hearing.status !== 'قادمة' && hearing.status !== 'مؤجلة') continue;
          const hearingAt = new Date(`${hearing.date}T${hearing.time || '00:00'}:00`);
          const differenceMinutes = Math.ceil((hearingAt.getTime() - Date.now()) / 60000);
          if (!Number.isFinite(differenceMinutes) || differenceMinutes <= 0) continue;
          const activeOffset = reminderMinutes.find((offset) => offset >= differenceMinutes);
          if (!activeOffset) continue;
          const reminderKey = `${record.id}-${hearing.id}-${hearing.date}-${hearing.time}-${activeOffset}`;
          if (sent.has(reminderKey)) continue;

          sent.add(reminderKey);
          window.localStorage.setItem('bayyinah-sent-reminders', JSON.stringify([...sent]));
          const remaining = activeOffset === 60 ? 'ساعة واحدة' : activeOffset === 1440 ? 'يوم واحد' : `${activeOffset / 1440} أيام`;
          const title = `تذكير جلسة خلال ${remaining}`;
          const text = `${record.title} · ${hearing.time} · ${hearing.court}`;
          setScheduledAlert({target: 'case', recordId: record.id, title, text});
          playReminderSound();

          if (settings.desktopNotificationsEnabled && window.bayyinahDesktop) {
            void window.bayyinahDesktop.notify({title, body: text});
          } else if (
            settings.desktopNotificationsEnabled &&
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            const desktopNotification = new Notification(title, {body: text, tag: reminderKey});
            desktopNotification.onclick = () => {
              window.focus();
              setSelectedCaseId(record.id);
              setPage('details');
              desktopNotification.close();
            };
          }
          return;
        }
      }

      for (const item of monitorItems) {
        if (item.completed) continue;
        const days = getDaysUntil(item.endDate);
        if (!item.alertOffsets.includes(days)) continue;
        const reminderKey = `monitor-${item.id}-${item.endDate}-${days}`;
        if (sent.has(reminderKey)) continue;
        sent.add(reminderKey);
        window.localStorage.setItem('bayyinah-sent-reminders', JSON.stringify([...sent]));
        const title = days === 0 ? 'استحقاق اليوم' : `استحقاق خلال ${days} يوم`;
        const text = `${item.type} · ${item.name}`;
        setScheduledAlert({target: 'monitoring', recordId: item.id, title, text});
        playReminderSound();
        if (settings.desktopNotificationsEnabled && window.bayyinahDesktop) {
          void window.bayyinahDesktop.notify({title, body: text});
        } else if (settings.desktopNotificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {body: text, tag: reminderKey});
        }
        return;
      }
    }

    checkScheduledHearings();
    const timer = window.setInterval(checkScheduledHearings, 60000);
    return () => window.clearInterval(timer);
  }, [cases, monitorItems, settings]);

  function startNewCase() {
    setDraftMode('create');
    setEditingCaseId(null);
    setDraft(emptyDraft());
    setPage('new');
  }

  function startEditCase(caseId: string) {
    const record = cases.find((item) => item.id === caseId);
    if (!record) return;
    setDraftMode('edit');
    setEditingCaseId(caseId);
    setDraft(toCaseDraft(record));
    setPage('new');
  }

  function deleteCase(caseId: string) {
    const record = cases.find((item) => item.id === caseId);
    if (!record || !window.confirm(`هل تريد حذف القضية «${record.title}آ» وجميع بياناتها نهائيًا؟`)) return;
    const remaining = cases.filter((item) => item.id !== caseId);
    setCases(remaining);
    setSelectedCaseId(remaining[0]?.id ?? '');
    setEditingCaseId(null);
    setDraftMode('create');
    setDraft(emptyDraft());
    setPage('cases');
    setNotice('تم حذف القضية.');
  }

  function handleSaveCase() {
    if (!draft.title.trim() || !draft.number.trim() || !draft.responsibleLawyer.trim()) return;
    const existingRecord = draftMode === 'edit' ? cases.find((item) => item.id === editingCaseId) : undefined;

    const builtRecord: CaseRecord = {
      id: editingCaseId ?? `case-${Date.now()}`,
      title: draft.title.trim(),
      number: draft.number.trim(),
      year: draft.year.trim(),
      category: draft.category,
      court: draft.court,
      chamber: draft.chamber.trim(),
      city: draft.city.trim(),
      status: draft.status,
      registrationDate: draft.registrationDate,
      responsibleLawyer: draft.responsibleLawyer.trim(),
      notes: draft.notes.trim(),
      amountClaimed: draft.amountClaimed.trim(),
      parties: draft.parties.filter((party) => party.name.trim()),
      hearings: existingRecord
        ? existingRecord.hearings
        : draft.hearingDate
          ? [
              {
                id: `hearing-${Date.now()}`,
                date: draft.hearingDate,
                time: draft.hearingTime,
                court: draft.court,
                chamber: draft.chamber.trim(),
                description: draft.hearingDescription.trim(),
                decision: draft.hearingDecision.trim(),
                status: draft.hearingStatus,
              },
            ]
          : [],
      tasks: existingRecord
        ? existingRecord.tasks
        : draft.hearingDescription.trim()
        ? [
            {
              id: `task-${Date.now()}`,
              title: draft.hearingDescription.trim(),
              owner: draft.responsibleLawyer.trim(),
              dueDate: draft.hearingDate,
              priority: 'عالية',
              status: 'مفتوحة',
            },
          ]
        : [],
      attachments: draft.attachments,
      reminders: existingRecord?.reminders ?? [],
      nextTask: existingRecord?.nextTask || draft.hearingDescription.trim() || 'مراجعة القضية',
      createdAt: existingRecord?.createdAt ?? todayIsoDate(),
    };

    if (draftMode === 'edit' && editingCaseId) {
      setCases((current) => current.map((record) => (record.id === editingCaseId ? builtRecord : record)));
      setNotice('تم حفظ تعديلات القضية.');
    } else {
      setCases((current) => [builtRecord, ...current]);
      setNotice('تم حفظ القضية الجديدة.');
    }

    playSuccessSound();

    setDraftMode('create');
    setEditingCaseId(null);
    setDraft(emptyDraft());
    setSelectedCaseId(builtRecord.id);
    setPage('details');
  }

  function handleReminder(caseId: string) {
    const timestamp = new Date().toISOString();
    setCases((current) =>
      current.map((record) =>
        record.id === caseId ? {...record, reminders: [...record.reminders, timestamp]} : record,
      ),
    );
    setNotice('تم تسجيل تذكير محلي لهذه القضية.');
  }

  function updateCase(caseId: string, updater: (record: CaseRecord) => CaseRecord) {
    setCases((current) => current.map((record) => (record.id === caseId ? normalizeCase(updater(record)) : record)));
    setNotice('تم تحديث بيانات القضية.');
  }

  function exportCasesReportLegacy() {
    downloadJson(
      cases.map((record) => ({
        title: record.title,
        number: record.number,
        status: record.status,
        court: record.court,
        city: record.city,
        amountClaimed: record.amountClaimed,
        responsibleLawyer: record.responsibleLawyer,
      })),
      'cases-report.json',
    );
    setNotice('تم تصدير تقرير القضايا.');
  }

  async function exportCasesReport() {
    const XLSX = await import('xlsx');
    const workbook = XLSX.utils.book_new();
    const rows = cases.map((record) => ({
      'رقم القضية': record.number,
      'السنة': record.year,
      'اسم القضية': record.title,
      'التصنيف': record.category,
      'المحكمة': record.court,
      'الدائرة': record.chamber,
      'المدينة': record.city,
      'الحالة': record.status,
      'المحامي المسؤول': record.responsibleLawyer,
      'المبلغ المطلوب': record.amountClaimed,
      'تاريخ التسجيل': record.registrationDate,
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    sheet['!cols'] = [{wch: 16},{wch: 10},{wch: 32},{wch: 18},{wch: 28},{wch: 18},{wch: 16},{wch: 18},{wch: 24},{wch: 18},{wch: 16}];
    XLSX.utils.book_append_sheet(workbook, sheet, 'القضايا');
    XLSX.writeFile(workbook, `Bayyinah-Cases-${todayIsoDate()}.xlsx`);
    setNotice('تم تصدير تقرير القضايا بصيغة Excel.');
  }

  function restoreBackup(payload: {
    settings?: Partial<AppSettings>;
    cases?: Partial<CaseRecord>[];
    agencies?: Partial<AgencyRecord>[];
    delegations?: Partial<DelegationRecord>[];
    monitorItems?: Partial<MonitorItem>[];
  }) {
    if (payload.settings) {
      setSettings({
        ...emptySettings(),
        ...payload.settings,
      });
    }
    if (payload.cases) {
      setCases(payload.cases.map((record) => normalizeCase(record)));
    }
    if (payload.agencies) {
      setAgencies(payload.agencies.map((record) => normalizeAgency(record)));
    }
    if (payload.delegations) {
      setDelegations(payload.delegations.map((record) => normalizeDelegation(record)));
    }
    if (payload.monitorItems) {
      setMonitorItems(payload.monitorItems.map((record) => normalizeMonitorItem(record)));
    }
    setSelectedCaseId(payload.cases?.[0]?.id ?? '');
    setNotice('تمت استعادة النسخة الاحتياطية بنجاح.');
  }

  function restoreBusinessData(payload: {
    cases?: Partial<CaseRecord>[];
    agencies?: Partial<AgencyRecord>[];
    delegations?: Partial<DelegationRecord>[];
    monitorItems?: Partial<MonitorItem>[];
  }, mode: 'merge' | 'replace') {
    const mergeById = <T extends {id: string}>(current: T[], incoming: T[]) => {
      const records = new Map(current.map((record) => [record.id, record]));
      incoming.forEach((record) => records.set(record.id, record));
      return Array.from(records.values());
    };
    if (payload.cases) {
      const incoming = payload.cases.map((record) => normalizeCase(record));
      setCases((current) => mode === 'merge' ? mergeById(current, incoming) : incoming);
    }
    if (payload.agencies) {
      const incoming = payload.agencies.map((record) => normalizeAgency(record));
      setAgencies((current) => mode === 'merge' ? mergeById(current, incoming) : incoming);
    }
    if (payload.delegations) {
      const incoming = payload.delegations.map((record) => normalizeDelegation(record));
      setDelegations((current) => mode === 'merge' ? mergeById(current, incoming) : incoming);
    }
    if (payload.monitorItems) {
      const incoming = payload.monitorItems.map((record) => normalizeMonitorItem(record));
      setMonitorItems((current) => mode === 'merge' ? mergeById(current, incoming) : incoming);
    }
    setNotice(mode === 'merge' ? 'تم دمج بيانات العمل بنجاح.' : 'تم استبدال بيانات العمل بنجاح.');
  }

  if (window.bayyinahDesktop && (licenseStatus.status === 'expired' || licenseStatus.status === 'invalid')) {
    return <LicensePanel blocking onActivate={activateLicense} status={licenseStatus} />;
  }

  if (!usersLoaded) {
    return (
      <main className="login">
        <section className="welcome">
          <Brand />
          <h1>جاري تحميل بيانات الدخول</h1>
          <p>نقرأ بيانات المستخدمين المحفوظة على هذا الجهاز.</p>
        </section>
        <section className="loginbox panel">
          <h2>لحظة واحدة</h2>
          <p>يتم تجهيز شاشة الدخول.</p>
        </section>
      </main>
    );
  }

  if (usersLoadError) {
    return (
      <main className="login">
        <section className="welcome">
          <Brand />
          <h1>تعذر قراءة بيانات الدخول</h1>
          <p>لم نتمكن من قراءة حسابات المستخدمين المحفوظة على هذا الجهاز.</p>
        </section>
        <section className="loginbox panel">
          <h2>بيانات الدخول غير متاحة</h2>
          <p>يرجى استخدام آخر نسخة احتياطية سليمة أو تشغيل أداة الإصلاح قبل إنشاء حساب جديد.</p>
        </section>
      </main>
    );
  }

  if (!users.length) {
    return <Register onRegister={registerUser} />;
  }

  if (showRegisterForm) {
    return <Register onBackToLogin={() => setShowRegisterForm(false)} onRegister={registerUser} />;
  }

  if (page === 'login' || !users.some((user) => user.id === authenticatedUserId)) {
    return <Login onCreateAccount={() => setShowRegisterForm(true)} onLogin={loginUser} />;
  }

  const authenticatedUser = users.find((user) => user.id === authenticatedUserId)!;
  const allowedPages = authenticatedUser.role === 'admin' ? allUserPermissions : (authenticatedUser.permissions ?? ['dashboard']);
  const requiredPage = page === 'new' || page === 'details' ? 'cases' : page;
  if (!allowedPages.includes(requiredPage)) setPage(allowedPages[0] ?? 'dashboard');

  return (
    <Shell
      agencies={agencies}
      cases={cases}
      delegations={delegations}
      monitorItems={monitorItems}
      onNewCase={startNewCase}
      openCase={openCase}
      page={page}
      setPage={setPage}
      settings={settings}
      allowedPages={allowedPages}
      onLogout={() => {
        window.localStorage.removeItem('bayyinah-auth-user');
        window.sessionStorage.removeItem('bayyinah-auth-user');
        setAuthenticatedUserId('');
        setPage('login');
      }}
    >
      {scheduledAlert ? (
        <aside className="scheduled-alert panel" role="alert">
          <Bell />
          <div>
            <b>{scheduledAlert.title}</b>
            <p>{scheduledAlert.text}</p>
          </div>
          <div className="scheduled-alert-actions">
            <Btn
              kind="outline"
              onClick={() => {
                if (scheduledAlert.target === 'case') openCase(scheduledAlert.recordId);
                else setPage('monitoring');
                setScheduledAlert(null);
              }}
            >
              {scheduledAlert.target === 'case' ? 'فتح القضية' : 'فتح المراقبة'}
            </Btn>
            <button onClick={() => setScheduledAlert(null)} type="button">إغلاق</button>
          </div>
        </aside>
      ) : null}
      {notice ? <div className="notice-banner panel">{notice}</div> : null}
      {page === 'dashboard' ? <StickyNotesBoard notes={stickyNotes} setNotes={setStickyNotes} /> : null}
      {page === 'dashboard' && <Dashboard agencies={agencies} cases={cases} monitorItems={monitorItems} openCase={openCase} setPage={setPage} settings={settings} userName={authenticatedUser.name} />}
      {page === 'cases' && (
        <Cases
          cases={cases}
          deleteCase={deleteCase}
          editCase={startEditCase}
          exportCasesReport={exportCasesReport}
          openCase={openCase}
        />
      )}
      {page === 'details' && (
        <Details
          onDelete={deleteCase}
          onEdit={startEditCase}
          onRemind={handleReminder}
          onUpdateCase={updateCase}
          record={selectedCase}
        />
      )}
      {page === 'new' && <NewCase draft={draft} mode={draftMode} onSave={handleSaveCase} setDraft={setDraft} />}
      {page === 'sessions' && <Sessions cases={cases} monitorItems={monitorItems} onUpdateCase={updateCase} openCase={openCase} />}
      {page === 'tasks' && <TasksPage cases={cases} onUpdateCase={updateCase} openCase={openCase} />}
      {page === 'monitoring' && <MonitoringPage items={monitorItems} onNotice={setNotice} setItems={setMonitorItems} />}
      {page === 'tools' && <ToolsPage />}
      {page === 'reports' && <Reports agencies={agencies} cases={cases} delegations={delegations} monitorItems={monitorItems} />}
      {page === 'agencies' && (
        <Agencies
          agencies={agencies}
          delegations={delegations}
          onNotice={setNotice}
          setAgencies={setAgencies}
          setDelegations={setDelegations}
        />
      )}
      {page === 'settings' && (
        <Settings
          agencies={agencies}
          cases={cases}
          delegations={delegations}
          monitorItems={monitorItems}
          restoreBackup={restoreBackup}
          restoreBusinessData={restoreBusinessData}
          settings={settings}
          setSettings={setSettings}
          users={users}
          setUsers={setUsers}
          currentUserId={authenticatedUserId}
          maxUsers={licenseStatus.maxUsers ?? 1}
        />
      )}
    </Shell>
  );
}

