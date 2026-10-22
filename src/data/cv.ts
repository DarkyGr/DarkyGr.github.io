/**
 * Single source of truth for the CV (EN/ES).
 * Feeds the /cv/ pages, the generated PDFs (npm run cv:pdf) and /resume.json.
 *
 * Privacy: the phone number is NOT stored here (this file is public).
 * Put it in cv.private.json (git-ignored) to get private PDFs with phone.
 */
import type { Lang } from '../i18n/ui';

export interface Job {
  company: string;
  position: string;
  location?: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM, undefined = present
  summary?: string;
  highlights: string[];
  tech: string[];
}

export interface CV {
  name: string;
  label: string;
  summary: string;
  location: string;
  email: string;
  website: string;
  profiles: { network: string; url: string; username: string }[];
  headings: Record<
    'summary' | 'experience' | 'skills' | 'education' | 'courses' | 'additional' | 'languages' | 'softSkills' | 'tech' | 'present' | 'download' | 'back' | 'print',
    string
  >;
  work: Job[];
  education: { institution: string; area: string; studyType: string; start: string; end: string; courses: string[] }[];
  courses: string[];
  skills: { name: string; keywords: string[] }[];
  softSkills: string[];
  languages: { language: string; fluency: string }[];
  keywords: string[];
}

const shared = {
  name: 'Guillermo Riaño Melchor',
  email: 'guilledark17@gmail.com',
  website: 'https://darkygr.github.io',
  profiles: [
    { network: 'LinkedIn', url: 'https://www.linkedin.com/in/guillermo-ria%C3%B1o/', username: 'guillermo-riaño' },
    { network: 'GitHub', url: 'https://github.com/DarkyGr', username: 'DarkyGr' },
  ],
  keywords: [
    '.NET Developer', 'Senior .NET Developer', 'Full Stack Developer', 'C#', 'ASP.NET', 'ASP.NET Core', 'ASP.NET MVC',
    '.NET Framework', '.NET Core', 'Entity Framework', 'SQL Server', 'REST API', 'WCF', 'SOAP', 'Next.js', 'Angular',
    'JavaScript', 'TypeScript', 'Legacy Migration', 'AS400', 'RPG', 'CI/CD', 'Git', 'Scrum',
  ],
};

const tech = {
  autofin: ['C#', 'ASP.NET', '.NET Framework', 'Next.js', 'AngularJS', 'JavaScript', 'HTML', 'AJAX', 'LINQ', 'Bootstrap', 'SQL Server', 'IBM AS400 (RPG)', 'REST', 'WCF', 'SOAP', 'N-Layer', 'TFS', 'Bitbucket', 'Git', 'CI/CD', 'DevOps', 'Jira', 'Confluence'],
  kha: ['C#', 'ASP.NET MVC', 'ASP.NET Core', 'Entity Framework', 'Razor', 'WCF', 'jQuery', 'AJAX', 'Bootstrap', 'HTML', 'LINQ', 'SQL Server'],
  omega: ['C#', 'ASP.NET MVC', 'Entity Framework', 'Razor', 'WCF', 'jQuery', 'AJAX', 'Bootstrap', 'HTML5', 'LINQ', 'SQL Server', 'Unit Testing'],
  rivera: ['C#', 'ASP.NET', 'ADO.NET', '3-Tier Architecture', 'ASMX Web Services', 'JavaScript', 'HTML', 'AJAX', 'Bootstrap', 'SQL Server', 'Stored Procedures'],
  freelance: ['ASP.NET', '.NET Framework', '.NET Core', 'SQL Server', 'Azure SQL Database', 'MongoDB', 'Angular', 'AngularJS', 'Vue.js', 'REST', 'SOAP', 'Unreal Engine', 'Unity'],
};

const skillsData = (tr: (l: string[]) => string[], labels: [string, string, string, string, string, string, string, string]) =>
  [
  { name: labels[0], keywords: ['C#', 'JavaScript', 'TypeScript', 'SQL (T-SQL)', 'HTML5', 'CSS3', 'Java', 'C++', 'Python', 'PHP', 'Visual Basic', 'C', 'RPG (IBM AS400)'] },
  { name: labels[1], keywords: ['ASP.NET', 'ASP.NET Core', 'ASP.NET MVC', '.NET Framework', '.NET Core', 'Entity Framework', 'ADO.NET', 'LINQ', 'Razor', 'Blazor', 'WCF', 'Laravel'] },
  { name: labels[2], keywords: ['Next.js', 'Angular', 'AngularJS', 'Vue.js', 'Bootstrap', 'jQuery', 'AJAX'] },
  { name: labels[3], keywords: ['REST / RESTful APIs', 'SOAP', 'WCF', 'ASMX', 'XML', 'XSL', 'JSON', 'SPA', 'SOA', 'MVC', 'N-Layer', 'Design Patterns (Singleton, Abstract Factory, Adapter, Iterator)'] },
  { name: labels[4], keywords: ['SQL Server', 'Azure SQL Database', 'MySQL', 'PostgreSQL', 'MariaDB', 'MongoDB', 'IBM AS400'] },
  { name: labels[5], keywords: ['Git', 'GitHub', 'Bitbucket', 'Team Foundation Server (TFS)', 'CI/CD', 'Docker', 'AWS', 'Postman', 'Jira', 'Confluence', 'Visual Studio', 'VS Code'] },
  { name: labels[6], keywords: ['Scrum', 'Agile', 'XP', 'Waterfall', 'Unit Testing', 'Requirements Analysis', 'User Stories'] },
  { name: labels[7], keywords: ['Unreal Engine 4/5 (C++)', 'Unity (2D/3D)'] },
  ].map((s) => ({ ...s, keywords: tr(s.keywords) }));

/** Generic (non-brand) terms shown in Spanish on the ES CV. Product names stay as-is. */
const ES_TERMS: Record<string, string> = {
  'Unit Testing': 'Pruebas unitarias',
  '3-Tier Architecture': 'Arquitectura 3 capas',
  'ASMX Web Services': 'Servicios web ASMX',
  'Stored Procedures': 'Procedimientos almacenados',
  'N-Layer': 'N-Capas',
  'REST / RESTful APIs': 'APIs REST / RESTful',
  'Design Patterns (Singleton, Abstract Factory, Adapter, Iterator)': 'Patrones de diseño (Singleton, Abstract Factory, Adapter, Iterator)',
  'Waterfall': 'Cascada',
  'Agile': 'Ágil',
  'Requirements Analysis': 'Análisis de requerimientos',
  'User Stories': 'Historias de usuario',
};
const es = (list: string[]) => list.map((k) => ES_TERMS[k] ?? k);

export const CV_DATA: Record<Lang, CV> = {
  en: {
    ...shared,
    courses: [
      'C# .NET from Zero to Advanced: Cross-Platform Full Stack (course in Spanish)',
      'Web Development University: Front-End Web Developer (course in Spanish)',
      'Programming University: Python, Java and JavaScript (course in Spanish)',
      'Unreal Engine C++ Developer (Unreal 4.22)',
      'Unreal Engine 5 C++ Developer: Learn C++ & Make Video Games',
    ],
    label: 'Senior .NET Full Stack Developer',
    location: 'Mexico City, Mexico',
    summary:
      'Computer Systems Engineer and Senior .NET Developer with 5+ years of professional experience building and modernizing enterprise applications with C#, ASP.NET, .NET Core and SQL Server. Currently project lead for the migration of legacy systems (IBM AS400/RPG, WinForms, Silverlight) to .NET and Next.js. Full stack background across REST, SOAP and WCF services, relational and NoSQL databases, and web front ends (Next.js, Angular, JavaScript), working in Scrum teams with CI/CD, Git and Jira. Passionate about game development with Unreal Engine and Unity.',
    headings: {
      summary: 'Professional Summary',
      experience: 'Work Experience',
      skills: 'Technical Skills',
      education: 'Education',
      courses: 'Courses & Certifications',
      additional: 'Additional Information',
      languages: 'Languages',
      softSkills: 'Soft Skills',
      tech: 'Tech stack',
      present: 'Present',
      download: 'Download PDF',
      back: 'Back to portfolio',
      print: 'Print',
    },
    work: [
      {
        company: 'Grupo Autofin México',
        position: 'Senior .NET Developer / Project Lead',
        location: 'Mexico City, Mexico',
        start: '2023-09',
        highlights: [
          'Lead requirements gathering, analysis, development and migration of the Housing ("Casas") system from IBM AS400 (RPG) to .NET Framework.',
          'Lead the migration of the New Cars, Used Cars and Service modules from WinForms and Silverlight to .NET Framework and Next.js.',
          'Design and develop REST APIs and maintain WCF and SOAP services that integrate legacy and modern systems.',
          'Maintain and build new tools for the SmartIT Dealer Management System (DMS), including reading and updating legacy RPG code.',
          'Work with CI/CD pipelines, Team Foundation Server and Bitbucket (Git) for version control, and Jira and Confluence for Agile delivery.',
        ],
        tech: tech.autofin,
      },
      {
        company: 'KHA Bienes Raíces',
        position: '.NET Developer',
        start: '2023-01',
        end: '2023-08',
        highlights: [
          'Migrated the payroll system from a desktop application (WinForms) to a web application built with ASP.NET Core.',
          'Maintained the property listings catalog, delivering improvements and fixing errors in the property publishing flow.',
          "Implemented improvements to the company's public website.",
          'Maintained and consumed WCF services.',
        ],
        tech: tech.kha,
      },
      {
        company: 'Farmacias Omega',
        position: '.NET Developer',
        start: '2021-07',
        end: '2022-12',
        highlights: [
          'Took part in requirements gathering and analysis for the pharmacy chain.',
          'Developed an orders module from user stories, covering product catalog, stock and image management (create, edit, delete and view), backed by unit tests.',
          'Developed a medicines module to create, update, delete and search products, backed by unit tests.',
          'Built and consumed WCF services.',
        ],
        tech: tech.omega,
      },
      {
        company: 'Hotel Rivera',
        position: '.NET Developer',
        start: '2021-01',
        end: '2021-06',
        highlights: [
          'Maintained the reservations system and improved its data flow by writing new SQL Server queries and stored procedures.',
        ],
        tech: tech.rivera,
      },
      {
        company: 'Independent',
        position: 'Freelance Software Developer',
        start: '2020-01',
        end: '2020-12',
        summary: 'Software, web and video game development.',
        highlights: [
          'Developed applications with ASP.NET, .NET Framework and .NET Core, following N-Layer architecture, design patterns and Agile practices.',
          'Designed databases in SQL Server, Azure SQL Database and MongoDB.',
          'Built web front ends with Angular, AngularJS and Vue.js and integrated SOAP, REST and XML web services.',
          'Built 2D and 3D games with Unreal Engine 4/5 and Unity.',
        ],
        tech: tech.freelance,
      },
    ],
    education: [
      {
        institution: 'Instituto Tecnológico de Oaxaca',
        area: 'Computer Systems Engineering',
        studyType: "Bachelor's Degree",
        start: '2017-08',
        end: '2023-01',
        courses: [
          'Object-oriented programming and software development with Java (MVC)',
          'Databases with MySQL, PostgreSQL and MariaDB',
          'Web development with HTML5, CSS3, JavaScript, PHP, Angular, Vue.js and React',
          'Networking fundamentals',
        ],
      },
    ],
    skills: skillsData((l) => l, [
      'Programming Languages',
      '.NET & Back End',
      'Front End',
      'APIs & Architecture',
      'Databases',
      'DevOps & Tools',
      'Methodologies',
      'Game Development',
    ]),
    softSkills: ['Teamwork', 'Self-taught learner', 'Initiative and problem solving', 'Communication', 'Adaptability'],
    languages: [
      { language: 'Spanish', fluency: 'Native' },
      { language: 'English', fluency: 'Intermediate' },
      { language: 'Japanese', fluency: 'Basic' },
    ],
  },

  es: {
    ...shared,
    courses: [
      'Curso de C# .NET desde cero hasta lo más avanzado: Full Stack multiplataforma',
      'Universidad Desarrollo Web: FrontEnd Web Developer',
      'Universidad de Programación: Python, Java y JavaScript',
      'Unreal Engine C++ Developer (Unreal 4.22)',
      'Unreal Engine 5 C++ Developer: Learn C++ & Make Video Games',
    ],
    label: 'Desarrollador .NET Full Stack Sr.',
    location: 'Ciudad de México, México',
    summary:
      'Ingeniero en Sistemas Computacionales y Desarrollador .NET Sr. con más de 5 años de experiencia profesional construyendo y modernizando aplicaciones empresariales con C#, ASP.NET, .NET Core y SQL Server. Actualmente líder de proyecto en la migración de sistemas legados (IBM AS400/RPG, WinForms, Silverlight) a .NET y Next.js. Perfil Full Stack con servicios REST, SOAP y WCF, bases de datos relacionales y NoSQL, y front end web (Next.js, Angular, JavaScript), trabajando en equipos Scrum con CI/CD, Git y Jira. Apasionado del desarrollo de videojuegos con Unreal Engine y Unity.',
    headings: {
      summary: 'Perfil Profesional',
      experience: 'Experiencia Laboral',
      skills: 'Habilidades Técnicas',
      education: 'Educación',
      courses: 'Cursos y Certificaciones',
      additional: 'Información Adicional',
      languages: 'Idiomas',
      softSkills: 'Habilidades Blandas',
      tech: 'Tecnologías',
      present: 'Actualidad',
      download: 'Descargar PDF',
      back: 'Volver al portafolio',
      print: 'Imprimir',
    },
    work: [
      {
        company: 'Grupo Autofin México',
        position: 'Desarrollador .NET Sr. / Líder de Proyecto',
        location: 'Ciudad de México, México',
        start: '2023-09',
        highlights: [
          'Lidero el levantamiento de requerimientos, análisis, desarrollo y migración del sistema de Casas de IBM AS400 (RPG) a .NET Framework.',
          'Lidero la migración de los módulos de Autos Nuevos, Autos Usados y Servicio de WinForms y Silverlight a .NET Framework y Next.js.',
          'Diseño y desarrollo APIs REST y mantengo servicios WCF y SOAP que integran sistemas legados y modernos.',
          'Mantengo y desarrollo nuevas herramientas para el DMS (Dealer Management System) SmartIT, incluyendo lectura y actualización de código RPG.',
          'Trabajo con pipelines de CI/CD, Team Foundation Server y Bitbucket (Git) para control de versiones, y Jira y Confluence para la entrega ágil.',
        ],
        tech: es(tech.autofin),
      },
      {
        company: 'KHA Bienes Raíces',
        position: 'Desarrollador .NET',
        start: '2023-01',
        end: '2023-08',
        highlights: [
          'Migré el sistema de nómina de una aplicación de escritorio (WinForms) a una aplicación web con ASP.NET Core.',
          'Mantuve el catálogo de propiedades, implementando mejoras y corrigiendo errores en el flujo de publicación de propiedades.',
          'Implementé mejoras en el sitio web de la empresa.',
          'Mantuve y consumí servicios WCF.',
        ],
        tech: es(tech.kha),
      },
      {
        company: 'Farmacias Omega',
        position: 'Desarrollador .NET',
        start: '2021-07',
        end: '2022-12',
        highlights: [
          'Participé en el levantamiento y análisis de requerimientos para la cadena de farmacias.',
          'Desarrollé un módulo de pedidos a partir de historias de usuario, con gestión de catálogo de productos, stock e imágenes (alta, edición, baja y consulta), respaldado con pruebas unitarias.',
          'Desarrollé un módulo de medicamentos para registrar, actualizar, eliminar y buscar productos, respaldado con pruebas unitarias.',
          'Creé y consumí servicios WCF.',
        ],
        tech: es(tech.omega),
      },
      {
        company: 'Hotel Rivera',
        position: 'Desarrollador .NET',
        start: '2021-01',
        end: '2021-06',
        highlights: [
          'Mantuve el sistema de reservaciones y mejoré su flujo de información creando nuevas consultas y procedimientos almacenados en SQL Server.',
        ],
        tech: es(tech.rivera),
      },
      {
        company: 'Independiente',
        position: 'Desarrollador de Software Freelance',
        start: '2020-01',
        end: '2020-12',
        summary: 'Desarrollo de software, web y videojuegos.',
        highlights: [
          'Desarrollé aplicaciones con ASP.NET, .NET Framework y .NET Core, aplicando arquitectura N-Capas, patrones de diseño y prácticas ágiles.',
          'Diseñé bases de datos en SQL Server, Azure SQL Database y MongoDB.',
          'Construí interfaces web con Angular, AngularJS y Vue.js e integré servicios web SOAP, REST y XML.',
          'Desarrollé videojuegos 2D y 3D con Unreal Engine 4/5 y Unity.',
        ],
        tech: es(tech.freelance),
      },
    ],
    education: [
      {
        institution: 'Instituto Tecnológico de Oaxaca',
        area: 'Ingeniería en Sistemas Computacionales',
        studyType: 'Licenciatura',
        start: '2017-08',
        end: '2023-01',
        courses: [
          'Programación orientada a objetos y desarrollo de software con Java (MVC)',
          'Bases de datos con MySQL, PostgreSQL y MariaDB',
          'Desarrollo web con HTML5, CSS3, JavaScript, PHP, Angular, Vue.js y React',
          'Fundamentos de redes',
        ],
      },
    ],
    skills: skillsData(es, [
      'Lenguajes de Programación',
      '.NET y Back End',
      'Front End',
      'APIs y Arquitectura',
      'Bases de Datos',
      'DevOps y Herramientas',
      'Metodologías',
      'Desarrollo de Videojuegos',
    ]),
    softSkills: ['Trabajo en equipo', 'Autodidacta', 'Iniciativa y resolución de problemas', 'Comunicación', 'Adaptabilidad'],
    languages: [
      { language: 'Español', fluency: 'Nativo' },
      { language: 'Inglés', fluency: 'Intermedio' },
      { language: 'Japonés', fluency: 'Básico' },
    ],
  },
};

export const CV_PDF: Record<Lang, string> = {
  en: '/cv/Guillermo-Riano-NET-Developer-CV-EN.pdf',
  es: '/cv/Guillermo-Riano-Desarrollador-NET-CV-ES.pdf',
};

export function formatMonth(ym: string, lang: Lang): string {
  const [y, m] = ym.split('-').map(Number);
  const s = new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y!, m! - 1, 1)),
  );
  return s.charAt(0).toUpperCase() + s.slice(1).replace('.', '');
}
