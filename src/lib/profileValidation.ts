export type ProfileInputData = {
  studentName: string | null;
  gradYear: number | null;
  location: string | null;
  occupation: string | null;
  industry: string | null;
  company: string | null;
  bio: string | null;
  lookingFor: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  isPublic: boolean;
};

export type ValidateProfileInputResult =
  | { data: ProfileInputData }
  | { error: string };

const trim = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const checkMaxLength = (
  label: string,
  value: string | null,
  maxLength: number
) => {
  if (value && value.length > maxLength) {
    return `${label} must be ${maxLength} characters or fewer`;
  }
  return null;
};

const checkUrl = (label: string, value: string | null) => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return `${label} must be a valid URL`;
  }
};

export function validateProfileInput(
  body: Record<string, unknown>
): ValidateProfileInputResult {
  const studentName = trim(body.studentName);
  const location = trim(body.location);
  const occupation = trim(body.occupation);
  const industry = trim(body.industry);
  const company = trim(body.company);
  const bio = trim(body.bio);
  const lookingFor = trim(body.lookingFor);
  const linkedinUrl = trim(body.linkedinUrl);
  const websiteUrl = trim(body.websiteUrl);

  let gradYear: number | null = null;
  if (
    body.gradYear !== undefined &&
    body.gradYear !== null &&
    body.gradYear !== ""
  ) {
    const parsed = Number(body.gradYear);
    if (!Number.isInteger(parsed) || parsed < 1900 || parsed > 2100) {
      return { error: "gradYear must be a valid year between 1900 and 2100" };
    }
    gradYear = parsed;
  }

  const errors = [
    checkMaxLength("studentName", studentName, 100),
    checkMaxLength("location", location, 100),
    checkMaxLength("occupation", occupation, 100),
    checkMaxLength("industry", industry, 100),
    checkMaxLength("company", company, 100),
    checkMaxLength("bio", bio, 1000),
    checkMaxLength("lookingFor", lookingFor, 1000),
    checkUrl("linkedinUrl", linkedinUrl),
    checkUrl("websiteUrl", websiteUrl),
  ].filter((error): error is string => Boolean(error));

  if (errors.length > 0) {
    return { error: errors.join("; ") };
  }

  return {
    data: {
      studentName,
      gradYear,
      location,
      occupation,
      industry,
      company,
      bio,
      lookingFor,
      linkedinUrl,
      websiteUrl,
      isPublic: Boolean(body.isPublic),
    },
  };
}
