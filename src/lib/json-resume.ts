import type { APIRoute } from 'astro';
import type { Lang } from '../i18n/ui';
import { CV_DATA } from '../data/cv';

/** JSON Resume (https://jsonresume.org/schema) – machine-readable CV for ATS / AI tools. */
export function jsonResume(lang: Lang): APIRoute {
  return () => {
    const cv = CV_DATA[lang];
    const body = {
      $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
      basics: {
        name: cv.name,
        label: cv.label,
        email: cv.email,
        url: cv.website,
        summary: cv.summary,
        location: { city: cv.location },
        profiles: cv.profiles,
      },
      work: cv.work.map((w) => ({
        name: w.company,
        position: w.position,
        location: w.location,
        startDate: w.start,
        endDate: w.end,
        summary: w.summary,
        highlights: w.highlights,
        keywords: w.tech,
      })),
      education: cv.education.map((e) => ({
        institution: e.institution,
        area: e.area,
        studyType: e.studyType,
        startDate: e.start,
        endDate: e.end,
        courses: e.courses,
      })),
      certificates: cv.courses.map((name) => ({ name })),
      skills: cv.skills,
      languages: cv.languages,
      interests: [{ name: cv.headings.softSkills, keywords: cv.softSkills }],
      meta: { language: lang, canonical: `${cv.website}${lang === 'en' ? '' : '/es'}/resume.json` },
    };
    return new Response(JSON.stringify(body, null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  };
}
