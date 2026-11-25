# Open Access Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** إصدار بيّنة 1.0.11 مفتوح الاستخدام بلا فترة تجريبية أو رمز تفعيل، مع إزالة الأدوات الملغاة من واجهة الأدوات المساعدة.

**Architecture:** توضع سياسة الوصول المفتوح في وحدة Electron صغيرة مستقلة ويستهلكها مسار حالة الترخيص الحالي للمحافظة على توافق الجسر المكتبي. تزال بطاقات الأدوات الملغاة من قائمة العرض فقط، ثم يُبنى التطبيق والمثبّت من السورس الرسمي.

**Tech Stack:** Electron، React، TypeScript، Vite، Node.js built-in test runner، electron-builder.

## Global Constraints

- لا مكتبات جديدة.
- لا تشغيل لسكريبتات `<LOCAL_TOOLING_ROOT>`.
- لا تعديل داخل إصدار 1.0.7 المرجعي أو مجلدات `win-unpacked`.
- الحفاظ على بيانات المستخدم وقاعدة البيانات دون حذف.

---

### Task 1: سياسة الوصول المفتوح

**Files:**
- Create: `electron/open-access-policy.cjs`
- Create: `tests/open-access-policy.test.cjs`
- Modify: `electron/main.cjs`

**Interfaces:**
- Produces: `getOpenAccessStatus(deviceCode)` يعيد حالة `active` وحد مستخدمين غير مقيد عملياً.
- Consumes: `getDeviceCode()` من عملية Electron الرئيسية.

- [ ] كتابة اختبار يثبت أن الحالة دائماً `active` ولا تحتوي فترة تجريبية.
- [ ] تشغيل الاختبار ومشاهدة فشله لغياب الوحدة.
- [ ] إنشاء سياسة الوصول المفتوح وربط `license:status` و`license:activate` بها.
- [ ] إعادة الاختبار والتأكد من نجاحه.

### Task 2: إزالة الأدوات الملغاة من الواجهة

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: مصفوفة `groups` داخل `ToolsPage`.
- Produces: واجهة تعرض الأدوات المعتمدة فقط.

- [ ] إزالة بطاقات بومودورو وأدوات PDF وWord والرواتب ونهاية الخدمة وفاحص الجهاز والتنظيف.
- [ ] إبقاء محول التاريخ، القائمة العائمة، VAT، مكتبة الروابط، وملاحظات المفاتيح.
- [ ] التحقق من TypeScript عبر build.

### Task 3: إصدار Windows 1.0.11

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces: `Bayyinah-Setup-1.0.11.exe`.

- [ ] رفع رقم الإصدار إلى `1.0.11`.
- [ ] تشغيل اختبار سياسة الوصول المفتوح.
- [ ] تشغيل `pnpm.cmd run build`.
- [ ] تشغيل `pnpm.cmd run desktop:dist`.
- [ ] التحقق من وجود المثبّت وحجمه وتاريخ إنشائه.
