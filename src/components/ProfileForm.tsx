"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfileFormValues = {
  studentName: string;
  gradYear: string;
  location: string;
  occupation: string;
  industry: string;
  company: string;
  bio: string;
  lookingFor: string;
};

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-400";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function ProfileForm({ initial }: { initial: ProfileFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Occupation</label>
          <input
            className={fieldClass}
            placeholder="e.g. Electrician, Realtor, CPA"
            value={values.occupation}
            onChange={(e) => set("occupation", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Industry</label>
          <input
            className={fieldClass}
            placeholder="e.g. Trades, Real Estate, Finance"
            value={values.industry}
            onChange={(e) => set("industry", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Company / business</label>
          <input
            className={fieldClass}
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Location</label>
          <input
            className={fieldClass}
            placeholder="City, State"
            value={values.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Student&apos;s name (optional)</label>
          <input
            className={fieldClass}
            value={values.studentName}
            onChange={(e) => set("studentName", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Student&apos;s grad year</label>
          <input
            className={fieldClass}
            type="number"
            placeholder="2028"
            value={values.gradYear}
            onChange={(e) => set("gradYear", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Bio</label>
        <textarea
          className={fieldClass}
          rows={4}
          placeholder="A short intro — what you do and what you're looking for."
          value={values.bio}
          onChange={(e) => set("bio", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>What are you looking for?</label>
        <input
          className={fieldClass}
          placeholder="e.g. mentorship, referrals, partners, hiring"
          value={values.lookingFor}
          onChange={(e) => set("lookingFor", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
