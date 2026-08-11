"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES } from "@/lib/directoryOptions";

type ProfileFormValues = {
  studentName: string;
  gradYear: string;
  location: string;
  occupation: string;
  industry: string;
  company: string;
  bio: string;
  lookingFor: string;
  linkedinUrl: string;
  websiteUrl: string;
  isPublic: boolean;
};

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent dark:border-neutral-700 dark:focus:border-accent";
const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";
const sectionHeadingClass =
  "text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400";
const sectionDescClass = "mt-1 text-sm text-neutral-500";

export function ProfileForm({ initial }: { initial: ProfileFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
    setError(null);
  }

  const industryOptions =
    values.industry && !(INDUSTRIES as readonly string[]).includes(values.industry)
      ? [values.industry, ...INDUSTRIES]
      : INDUSTRIES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Something went wrong. Please try again.");
      setSaved(false);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <fieldset className="flex flex-col gap-6">
        <legend className={sectionHeadingClass}>About you</legend>
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
            <select
              className={fieldClass}
              value={values.industry}
              onChange={(e) => set("industry", e.target.value)}
            >
              <option value="">Select an industry</option>
              {industryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
      </fieldset>

      <fieldset className="flex flex-col gap-6 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <legend className={sectionHeadingClass}>Your story</legend>
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
      </fieldset>

      <fieldset className="flex flex-col gap-6 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <legend className={sectionHeadingClass}>Contact &amp; links</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>LinkedIn URL</label>
            <input
              className={fieldClass}
              value={values.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Website URL</label>
            <input
              className={fieldClass}
              value={values.websiteUrl}
              onChange={(e) => set("websiteUrl", e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <legend className={sectionHeadingClass}>Visibility</legend>
        <label className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={values.isPublic}
            onChange={(e) => set("isPublic", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-accent"
          />
          <span>
            List me in the public directory
            <span className={sectionDescClass + " block"}>
              Other signed-in parents will be able to find and contact you.
            </span>
          </span>
        </label>
      </fieldset>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
        {saved && (
          <span className="text-sm text-neutral-500">Saved.</span>
        )}
        {error && (
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        )}
      </div>
    </form>
  );
}
