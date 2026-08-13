"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES, LOOKING_FOR_TAGS } from "@/lib/directoryOptions";

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

// Best-effort parse of a combined "Tag, Tag — freeform" string back into
// checkbox state. Only trusts the tag list when every comma-separated
// segment before the separator is a recognized tag; otherwise the whole
// original string is preserved in the freeform field so nothing is lost.
function parseLookingFor(raw: string): { tags: string[]; other: string } {
  if (!raw.trim()) {
    return { tags: [], other: "" };
  }
  const separatorIndex = raw.indexOf(" — ");
  const tagsPart = separatorIndex === -1 ? raw : raw.slice(0, separatorIndex);
  const otherPart = separatorIndex === -1 ? "" : raw.slice(separatorIndex + 3);

  const candidateTags = tagsPart
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const allRecognized =
    candidateTags.length > 0 &&
    candidateTags.every((t) => (LOOKING_FOR_TAGS as readonly string[]).includes(t));

  if (allRecognized) {
    return { tags: candidateTags, other: otherPart.trim() };
  }

  return { tags: [], other: raw };
}

function combineLookingFor(tags: string[], other: string): string {
  const trimmedOther = other.trim();
  const tagPart = tags.join(", ");
  if (tagPart && trimmedOther) return `${tagPart} — ${trimmedOther}`;
  if (tagPart) return tagPart;
  return trimmedOther;
}

export function ProfileForm({ initial }: { initial: ProfileFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lookingForTags, setLookingForTags] = useState<string[]>(
    () => parseLookingFor(initial.lookingFor).tags
  );
  const [lookingForOther, setLookingForOther] = useState<string>(
    () => parseLookingFor(initial.lookingFor).other
  );

  function set<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
    setError(null);
  }

  // Tag checkboxes and the freeform detail are the source of truth for the
  // UI, but the single lookingFor string (what actually gets submitted) is
  // recombined and pushed into values on every change.
  function toggleLookingForTag(tag: string) {
    setLookingForTags((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      set("lookingFor", combineLookingFor(next, lookingForOther));
      return next;
    });
  }

  function setLookingForOtherText(text: string) {
    setLookingForOther(text);
    set("lookingFor", combineLookingFor(lookingForTags, text));
  }

  const industryOptions =
    values.industry && !(INDUSTRIES as readonly string[]).includes(values.industry)
      ? [values.industry, ...INDUSTRIES]
      : INDUSTRIES;

  const completionFields = [
    values.occupation,
    values.industry,
    values.company,
    values.location,
    values.bio,
    values.lookingFor,
    values.linkedinUrl,
    values.websiteUrl,
  ];
  const completedCount = completionFields.filter((f) => f.trim().length > 0).length;
  const totalFields = completionFields.length;

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
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={sectionHeadingClass}>Profile completion</span>
          <span className="text-sm text-neutral-500">
            {completedCount} of {totalFields} fields complete
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${(completedCount / totalFields) * 100}%` }}
          />
        </div>
      </div>

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

        <div className="flex flex-col gap-2">
          <label className={labelClass}>What are you looking for?</label>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {LOOKING_FOR_TAGS.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
              >
                <input
                  type="checkbox"
                  checked={lookingForTags.includes(tag)}
                  onChange={() => toggleLookingForTag(tag)}
                  className="h-4 w-4 accent-accent"
                />
                {tag}
              </label>
            ))}
          </div>
          <input
            className={fieldClass}
            placeholder="Anything else? (optional)"
            value={lookingForOther}
            onChange={(e) => setLookingForOtherText(e.target.value)}
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
