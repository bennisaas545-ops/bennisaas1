import type { LocaleCode } from "../types";

export interface TranslationBundle {
  localeLabel: string;
  nav: {
    home: string;
    aboutUs: string;
    solutions: string;
    caseStudies: string;
    pricing: string;
    careers: string;
    contactUs: string;
    workspace: string;
    openWorkspace: string;
    signIn: string;
    signOut: string;
    backToSite: string;
  };
  about: {
    title: string;
    subtitle: string;
    pillars: Array<{ title: string; detail: string }>;
  };
  caseStudies: {
    title: string;
    subtitle: string;
    items: Array<{
      client: string;
      industry: string;
      metric: string;
      summary: string;
    }>;
  };
  careers: {
    title: string;
    subtitle: string;
    applyButton: string;
    roles: Array<{
      title: string;
      location: string;
      type: string;
      summary: string;
    }>;
  };
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    languageLabel: string;
  };
  metrics: {
    hoursSavedLabel: string;
    hoursSavedSub: string;
    leadLiftLabel: string;
    leadLiftSub: string;
    syncAccuracyLabel: string;
    syncAccuracySub: string;
    encryptionLabel: string;
    encryptionSub: string;
  };
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: Array<{
      number: string;
      title: string;
      description: string;
      outcome: string;
    }>;
    leadSpotlightTitle: string;
    leadSpotlightBody: string;
    testimonialQuote: string;
    testimonialAuthor: string;
    testimonialRole: string;
  };
  pricing: {
    sectionTitle: string;
    sectionSubtitle: string;
    perMonth: string;
    selectPlan: string;
    currentPlan: string;
    colConnectors: string;
    colReports: string;
    colAiRuns: string;
    colVault: string;
    colSla: string;
  };
  contact: {
    sectionTitle: string;
    sectionSubtitle: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    companyLabel: string;
    tierLabel: string;
    focusLabel: string;
    messageLabel: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    sendAnother: string;
  };
  dashboard: {
    previewNotice: string;
    signInToSave: string;
    tabs: {
      overview: string;
      connectors: string;
      reports: string;
      leads: string;
      vault: string;
    };
    activeTier: string;
    analyzeTitle: string;
    analyzeButton: string;
    exportCsv: string;
  };
  footer: {
    summary: string;
    supportHeading: string;
    headquartersHeading: string;
    languageHeading: string;
    copyright: string;
    securityNote: string;
  };
}

export const TRANSLATIONS: Record<LocaleCode, TranslationBundle> = {
  en: {
    localeLabel: "English",
    nav: {
      home: "Home",
      aboutUs: "About Us",
      solutions: "Solutions",
      caseStudies: "Case Studies",
      pricing: "Pricing",
      careers: "Careers",
      contactUs: "Contact Us",
      workspace: "Workspace",
      openWorkspace: "Open Workspace",
      signIn: "Sign In",
      signOut: "Sign Out",
      backToSite: "Public Overview",
    },
    about: {
      title: "Built in Wyoming to give small and mid-sized enterprises institutional automation",
      subtitle:
        "Bennisaas Solutions LLC engineers reliable AI workflow systems, encrypted API connectors, and demand-generation telemetry without enterprise bloat.",
      pillars: [
        {
          title: "Wyoming Registered, Globally Supported",
          detail: "Headquartered at 30 N Gould St, STE R, Sheridan, WY with responsive client engineering support across North America, Europe, and APAC.",
        },
        {
          title: "Security-First Architecture",
          detail: "Sensitive client tokens and PII are isolated under AES-256-GCM encryption with authenticated server-side sessions.",
        },
        {
          title: "Measured Business Outcomes",
          detail: "Every connector, custom report, and lead campaign ties directly to hours reclaimed or revenue reconciled.",
        },
      ],
    },
    caseStudies: {
      title: "Verified client outcomes across SME operations",
      subtitle: "Real deployments across logistics, B2B SaaS finance, and multi-region services.",
      items: [
        {
          client: "Northbridge Logistics",
          industry: "Freight & Supply Chain · 95 Staff",
          metric: "-4 days monthly close · +64% qualified demos",
          summary: "Automated Stripe-to-HubSpot reconciliation and weekly executive pipeline digests across 14 regional depots.",
        },
        {
          client: "Vanguard Payroll Group",
          industry: "B2B Financial Services · 60 Staff",
          metric: "46 hrs/mo saved · 99.94% ledger match",
          summary: "Replaced manual CSV exports with bi-directional Salesforce and payment webhook alerts for anomalous settlements.",
        },
        {
          client: "Kestrel Industrial Supply",
          industry: "Wholesale Distribution · 140 Staff",
          metric: "+138% SQLs in 6 months",
          summary: "Deployed strategic B2B content briefs and automated multi-touch email sequences scored directly from CRM win-loss data.",
        },
      ],
    },
    careers: {
      title: "Careers at Bennisaas Solutions LLC",
      subtitle: "Join our distributed engineering, data automation, and client growth teams.",
      applyButton: "Apply via Inquiry",
      roles: [
        {
          title: "Senior Workflow Automation Engineer",
          location: "Remote (US / Global)",
          type: "Full-Time · Engineering",
          summary: "Design resilient CRM and payment webhook connectors, retry queues, and custom reporting pipelines.",
        },
        {
          title: "Applied AI & Data Solutions Architect",
          location: "Sheridan, WY / Remote",
          type: "Full-Time · Client AI",
          summary: "Build structured analytics prompts, anomaly detection triggers, and SME onboarding playbooks.",
        },
        {
          title: "B2B Demand & Content Automation Strategist",
          location: "Remote",
          type: "Full-Time · Growth",
          summary: "Architect multi-channel lead scoring models and strategic editorial automation for SME clients.",
        },
      ],
    },
    hero: {
      kicker: "Enterprise AI Operations for Growing Teams",
      headline: "Automate business workflows and turn raw data into qualified pipeline.",
      subheadline:
        "Bennisaas Solutions LLC connects your CRM, payment processors, and marketing channels into an encrypted analytics workspace with automated reporting and email alerts.",
      primaryCta: "Open Client Workspace",
      secondaryCta: "Compare SME Plans",
      languageLabel: "Interface Language",
    },
    metrics: {
      hoursSavedLabel: "42 hrs / mo",
      hoursSavedSub: "Average manual reporting eliminated per team",
      leadLiftLabel: "+138% SQLs",
      leadLiftSub: "Qualified lead growth within 6 months",
      syncAccuracyLabel: "99.94%",
      syncAccuracySub: "CRM and payment ledger reconciliation accuracy",
      encryptionLabel: "AES-256-GCM",
      encryptionSub: "Authenticated encryption for client secrets & PII",
    },
    services: {
      sectionTitle: "Operational intelligence built for small and mid-sized enterprises",
      sectionSubtitle:
        "Every module replaces fragmented spreadsheets and manual follow-ups with audited, automated pipelines.",
      items: [
        {
          number: "01",
          title: "Intelligent Data Analysis & Custom Reporting",
          description:
            "Aggregate revenue, churn, and operational velocity into live visual dashboards with scheduled PDF/CSV executive digests.",
          outcome: "46 hrs/month reclaimed across finance & ops",
        },
        {
          number: "02",
          title: "Integrated CRM & Payment API Connectors",
          description:
            "Bi-directional sync across Salesforce, HubSpot, Stripe, Razorpay, and Slack with automatic retry queues and webhook verification.",
          outcome: "Zero manual CSV imports between billing and sales",
        },
        {
          number: "03",
          title: "Marketing Automation & Strategic Content Creation",
          description:
            "Produce research-backed editorial briefs, multi-touch outbound sequences, and intent-scored lead routing rules.",
          outcome: "3.4x pipeline return on demand-generation spend",
        },
        {
          number: "04",
          title: "Email Notification Triggers & Encrypted Client Vault",
          description:
            "Trigger instant operational alerts on revenue variance or high-intent leads while isolating credentials under AES-256-GCM.",
          outcome: "Sub-minute alerting with verified payload integrity",
        },
      ],
      leadSpotlightTitle: "Demand generation engineered from real operational telemetry",
      leadSpotlightBody:
        "Instead of generic ad copy, Bennisaas Solutions LLC maps CRM win-loss data directly into strategic content briefs and automated nurture sequences.",
      testimonialQuote:
        "Replacing our manual Stripe-to-HubSpot reconciliation and weekly sales digests with Bennisaas Solutions LLC cut month-end close by four days and lifted qualified demos by 64%.",
      testimonialAuthor: "Marcus Chen",
      testimonialRole: "VP of Revenue Operations, Northbridge Logistics",
    },
    pricing: {
      sectionTitle: "Transparent monthly tiers for every SME growth stage",
      sectionSubtitle:
        "All five plans include multi-language localization, AES-256-GCM client encryption, CRM & payment connectors, and automated email triggers.",
      perMonth: "/ month",
      selectPlan: "Choose Plan",
      currentPlan: "Active Tier",
      colConnectors: "API Connectors",
      colReports: "Automated Reports",
      colAiRuns: "AI Analysis & Content",
      colVault: "Encrypted Vault",
      colSla: "Support SLA",
    },
    contact: {
      sectionTitle: "Streamline your workflow onboarding",
      sectionSubtitle:
        "Share your CRM, payment stack, and reporting goals. An implementation architect will respond with a tailored deployment plan.",
      nameLabel: "Full Name",
      emailLabel: "Work Email",
      phoneLabel: "Phone Number",
      companyLabel: "Company Name",
      tierLabel: "Subscription Tier",
      focusLabel: "Primary Automation Focus",
      messageLabel: "Workflow & Integration Requirements",
      submitButton: "Submit Client Inquiry",
      submitting: "Submitting...",
      successTitle: "Inquiry recorded",
      successBody: "Our team has received your requirements under reference",
      sendAnother: "Send another inquiry",
    },
    dashboard: {
      previewNotice:
        "Exploring interactive preview. Sign in or create an account to persist changes, encrypt vault records, and run live AI analysis.",
      signInToSave: "Sign In / Register",
      tabs: {
        overview: "Analytics & AI",
        connectors: "APIs & Triggers",
        reports: "Custom Reports",
        leads: "Lead & Content",
        vault: "Encrypted Vault",
      },
      activeTier: "Active SME Tier",
      analyzeTitle: "Intelligent Data Analyzer",
      analyzeButton: "Run AI Analysis",
      exportCsv: "Export CSV",
    },
    footer: {
      summary:
        "Automated business workflows, intelligent data analysis, and strategic lead generation built for growing enterprises.",
      supportHeading: "Customer Support",
      headquartersHeading: "Corporate Headquarters",
      languageHeading: "Localization",
      copyright: "Bennisaas Solutions LLC. All rights reserved.",
      securityNote: "AES-256-GCM Encrypted Data Vault · TLS 1.3 Transport",
    },
  },
  es: {
    localeLabel: "Español",
    nav: {
      home: "Inicio",
      aboutUs: "Nosotros",
      solutions: "Soluciones",
      caseStudies: "Casos de éxito",
      pricing: "Precios",
      careers: "Carreras",
      contactUs: "Contáctanos",
      workspace: "Espacio de trabajo",
      openWorkspace: "Abrir panel",
      signIn: "Iniciar sesión",
      signOut: "Cerrar sesión",
      backToSite: "Vista pública",
    },
    about: {
      title: "Ingeniería desde Wyoming para automatizar operaciones en PyMEs",
      subtitle:
        "Bennisaas Solutions LLC construye flujos de trabajo con IA, conectores API cifrados y telemetría de demanda sin complejidad innecesaria.",
      pillars: [
        {
          title: "Sede en Wyoming, Soporte Global",
          detail: "Oficina central en 30 N Gould St, STE R, Sheridan, WY con atención directa para equipos en América, Europa y APAC.",
        },
        {
          title: "Arquitectura de Seguridad Primero",
          detail: "Tokens y datos sensibles aislados bajo cifrado AES-256-GCM con sesiones autenticadas en servidor.",
        },
        {
          title: "Resultados Medibles",
          detail: "Cada conector y reporte personalizado se vincula directamente con horas ahorradas e ingresos conciliados.",
        },
      ],
    },
    caseStudies: {
      title: "Resultados verificados en empresas en crecimiento",
      subtitle: "Implementaciones reales en logística, servicios financieros B2B y distribución.",
      items: [
        {
          client: "Northbridge Logistics",
          industry: "Logística · 95 empleados",
          metric: "-4 días de cierre · +64% demos calificadas",
          summary: "Conciliación automática Stripe-HubSpot y resúmenes ejecutivos semanales para 14 sedes regionales.",
        },
        {
          client: "Vanguard Payroll Group",
          industry: "Servicios Financieros · 60 empleados",
          metric: "46 h/mes ahorradas · 99.94% precisión",
          summary: "Reemplazo de exportaciones CSV manuales por alertas webhook en tiempo real entre Salesforce y pagos.",
        },
        {
          client: "Kestrel Industrial Supply",
          industry: "Distribución B2B · 140 empleados",
          metric: "+138% SQLs en 6 meses",
          summary: "Estrategia de contenido B2B y secuencias de correo automatizadas guiadas por datos del CRM.",
        },
      ],
    },
    careers: {
      title: "Carreras en Bennisaas Solutions LLC",
      subtitle: "Únete a nuestro equipo remoto de ingeniería, automatización de datos y crecimiento.",
      applyButton: "Postular por formulario",
      roles: [
        {
          title: "Ingeniero Senior de Automatización",
          location: "Remoto (EE. UU. / Global)",
          type: "Tiempo completo · Ingeniería",
          summary: "Diseña conectores webhook para CRM y pagos, colas de reintento y pipelines de reportes.",
        },
        {
          title: "Arquitecto de Soluciones IA y Datos",
          location: "Sheridan, WY / Remoto",
          type: "Tiempo completo · IA",
          summary: "Desarrolla análisis estructurados con IA, alertas de anomalías y despliegues para PyMEs.",
        },
        {
          title: "Estratega de Automatización y Leads B2B",
          location: "Remoto",
          type: "Tiempo completo · Crecimiento",
          summary: "Crea modelos de calificación de leads y automatización de contenido estratégico.",
        },
      ],
    },
    hero: {
      kicker: "Operaciones con IA para Empresas en Crecimiento",
      headline: "Automatiza flujos de trabajo y convierte datos en oportunidades calificadas.",
      subheadline:
        "Bennisaas Solutions LLC conecta tu CRM, pasarelas de pago y canales de marketing en un panel cifrado con reportes automáticos y alertas por correo.",
      primaryCta: "Abrir panel de cliente",
      secondaryCta: "Ver planes PyME",
      languageLabel: "Idioma de interfaz",
    },
    metrics: {
      hoursSavedLabel: "42 h / mes",
      hoursSavedSub: "Promedio de reportes manuales eliminados por equipo",
      leadLiftLabel: "+138% SQLs",
      leadLiftSub: "Crecimiento de leads calificados en 6 meses",
      syncAccuracyLabel: "99.94%",
      syncAccuracySub: "Precisión de conciliación entre CRM y pagos",
      encryptionLabel: "AES-256-GCM",
      encryptionSub: "Cifrado autenticado para credenciales y datos sensibles",
    },
    services: {
      sectionTitle: "Inteligencia operativa diseñada para pequeñas y medianas empresas",
      sectionSubtitle:
        "Cada módulo reemplaza hojas de cálculo dispersas con flujos automatizados y auditables.",
      items: [
        {
          number: "01",
          title: "Análisis Inteligente de Datos y Reportes",
          description:
            "Consolida ingresos, retención y rendimiento operativo en paneles visuales con resúmenes programados.",
          outcome: "46 horas/mes recuperadas en finanzas y operaciones",
        },
        {
          number: "02",
          title: "Conectores API de CRM y Pagos",
          description:
            "Sincronización bidireccional con Salesforce, HubSpot, Stripe, Razorpay y Slack con verificación de webhooks.",
          outcome: "Cero importaciones manuales entre facturación y ventas",
        },
        {
          number: "03",
          title: "Automatización de Marketing y Contenido Estratégico",
          description:
            "Genera resúmenes editoriales, secuencias multicanal y reglas de calificación de leads basadas en intención.",
          outcome: "3.4x retorno de pipeline en generación de demanda",
        },
        {
          number: "04",
          title: "Alertas por Correo y Bóveda Cifrada",
          description:
            "Dispara notificaciones automáticas ante variaciones de ingresos mientras proteges secretos con AES-256-GCM.",
          outcome: "Alertas en menos de un minuto con integridad verificada",
        },
      ],
      leadSpotlightTitle: "Generación de demanda basada en telemetría operativa real",
      leadSpotlightBody:
        "Bennisaas Solutions LLC convierte los datos de cierre de tu CRM en estrategias de contenido y secuencias automatizadas de nutrición.",
      testimonialQuote:
        "Reemplazar nuestra conciliación manual entre Stripe y HubSpot con Bennisaas Solutions LLC redujo el cierre mensual en cuatro días y aumentó las demos calificadas un 64%.",
      testimonialAuthor: "Marcus Chen",
      testimonialRole: "VP de Operaciones de Ingresos, Northbridge Logistics",
    },
    pricing: {
      sectionTitle: "Planes mensuales transparentes para cada etapa PyME",
      sectionSubtitle:
        "Los cinco planes incluyen localización multilingüe, cifrado AES-256-GCM, conectores CRM y pagos, y alertas automáticas.",
      perMonth: "/ mes",
      selectPlan: "Elegir plan",
      currentPlan: "Plan activo",
      colConnectors: "Conectores API",
      colReports: "Reportes automáticos",
      colAiRuns: "Análisis y contenido IA",
      colVault: "Bóveda cifrada",
      colSla: "SLA de soporte",
    },
    contact: {
      sectionTitle: "Agiliza la implementación de tu equipo",
      sectionSubtitle:
        "Comparte tu CRM actual, pasarela de pagos y metas de reportes. Te enviaremos un plan técnico a medida.",
      nameLabel: "Nombre completo",
      emailLabel: "Correo corporativo",
      phoneLabel: "Teléfono",
      companyLabel: "Empresa",
      tierLabel: "Nivel de suscripción",
      focusLabel: "Enfoque principal",
      messageLabel: "Requisitos de flujo e integración",
      submitButton: "Enviar consulta",
      submitting: "Enviando...",
      successTitle: "Consulta registrada",
      successBody: "Hemos recibido tus requisitos con el código de referencia",
      sendAnother: "Enviar otra consulta",
    },
    dashboard: {
      previewNotice:
        "Modo de vista previa interactiva. Inicia sesión o regístrate para guardar cambios, cifrar registros y ejecutar análisis IA en vivo.",
      signInToSave: "Iniciar sesión / Registro",
      tabs: {
        overview: "Analítica e IA",
        connectors: "APIs y Alertas",
        reports: "Reportes",
        leads: "Leads y Contenido",
        vault: "Bóveda Cifrada",
      },
      activeTier: "Plan PyME activo",
      analyzeTitle: "Analizador Inteligente de Datos",
      analyzeButton: "Ejecutar análisis IA",
      exportCsv: "Exportar CSV",
    },
    footer: {
      summary:
        "Flujos empresariales automatizados, análisis inteligente de datos y generación estratégica de leads para empresas en crecimiento.",
      supportHeading: "Soporte al Cliente",
      headquartersHeading: "Sede Corporativa",
      languageHeading: "Localización",
      copyright: "Bennisaas Solutions LLC. Todos los derechos reservados.",
      securityNote: "Bóveda cifrada AES-256-GCM · Transporte TLS 1.3",
    },
  },
  fr: {
    localeLabel: "Français",
    nav: {
      home: "Accueil",
      aboutUs: "À propos",
      solutions: "Solutions",
      caseStudies: "Études de cas",
      pricing: "Tarifs",
      careers: "Carrières",
      contactUs: "Contact",
      workspace: "Espace client",
      openWorkspace: "Ouvrir l'espace",
      signIn: "Connexion",
      signOut: "Déconnexion",
      backToSite: "Aperçu public",
    },
    about: {
      title: "Basé au Wyoming pour offrir aux PME une automatisation fiable",
      subtitle:
        "Bennisaas Solutions LLC conçoit des workflows IA, des connecteurs API chiffrés et des systèmes d'acquisition B2B.",
      pillars: [
        {
          title: "Siège au Wyoming, Support Mondial",
          detail: "Basé au 30 N Gould St, STE R, Sheridan, WY avec accompagnement technique international.",
        },
        {
          title: "Sécurité par Conception",
          detail: "Chiffrement AES-256-GCM des clés API et données sensibles avec contrôle d'accès serveur.",
        },
        {
          title: "Impact Mesurable",
          detail: "Chaque connecteur et rapport automatisé se traduit par des heures économisées et un pipeline qualifié.",
        },
      ],
    },
    caseStudies: {
      title: "Résultats clients vérifiés sur les PME",
      subtitle: "Déploiements concrets en logistique, finance B2B et distribution.",
      items: [
        {
          client: "Northbridge Logistics",
          industry: "Logistique · 95 collaborateurs",
          metric: "-4 jours de clôture · +64 % démos qualifiées",
          summary: "Synchronisation automatisée Stripe-HubSpot et synthèses hebdomadaires multi-sites.",
        },
        {
          client: "Vanguard Payroll Group",
          industry: "Finance B2B · 60 collaborateurs",
          metric: "46 h/mois gagnées · 99,94 % précision",
          summary: "Remplacement des exports CSV par des alertes webhooks temps réel Salesforce et paiements.",
        },
        {
          client: "Kestrel Industrial Supply",
          industry: "Distribution · 140 collaborateurs",
          metric: "+138 % SQLs en 6 mois",
          summary: "Briefs éditoriaux stratégiques et séquences e-mail automatisées pilotées par le CRM.",
        },
      ],
    },
    careers: {
      title: "Carrières chez Bennisaas Solutions LLC",
      subtitle: "Rejoignez nos équipes d'ingénierie, d'analyse de données et d'acquisition.",
      applyButton: "Postuler",
      roles: [
        {
          title: "Ingénieur Automatisation Senior",
          location: "Télétravail (US / Global)",
          type: "Temps plein · Ingénierie",
          summary: "Développement de connecteurs CRM et paiements résilients et pipelines de reporting.",
        },
        {
          title: "Architecte Solutions IA & Données",
          location: "Sheridan, WY / Télétravail",
          type: "Temps plein · IA Client",
          summary: "Conception d'analyses prédictives, alertes d'anomalies et déploiements PME.",
        },
        {
          title: "Stratège Acquisition & Contenu B2B",
          location: "Télétravail",
          type: "Temps plein · Croissance",
          summary: "Modèles de scoring de leads et séquences marketing automatisées.",
        },
      ],
    },
    hero: {
      kicker: "Opérations IA pour PME et ETI",
      headline: "Automatisez vos processus métier et transformez vos données en prospects qualifiés.",
      subheadline:
        "Bennisaas Solutions LLC relie votre CRM, vos paiements et votre marketing dans un espace chiffré avec rapports automatisés et alertes e-mail.",
      primaryCta: "Ouvrir l'espace client",
      secondaryCta: "Voir les forfaits PME",
      languageLabel: "Langue",
    },
    metrics: {
      hoursSavedLabel: "42 h / mois",
      hoursSavedSub: "Temps de reporting manuel économisé par équipe",
      leadLiftLabel: "+138% SQLs",
      leadLiftSub: "Hausse des prospects qualifiés en 6 mois",
      syncAccuracyLabel: "99.94%",
      syncAccuracySub: "Fiabilité de rapprochement CRM et paiements",
      encryptionLabel: "AES-256-GCM",
      encryptionSub: "Chiffrement authentifié des secrets clients et PII",
    },
    services: {
      sectionTitle: "Intelligence opérationnelle conçue pour les PME ambitieuses",
      sectionSubtitle:
        "Chaque module remplace les tableurs manuels par des pipelines automatisés et audités.",
      items: [
        {
          number: "01",
          title: "Analyse de Données et Rapports Personnalisés",
          description:
            "Centralisez revenus, rétention et vélocité opérationnelle avec des synthèses planifiées.",
          outcome: "46 h/mois libérées en finance et opérations",
        },
        {
          number: "02",
          title: "Connecteurs API CRM et Paiements",
          description:
            "Synchronisation bidirectionnelle Salesforce, HubSpot, Stripe, Razorpay et Slack avec webhooks sécurisés.",
          outcome: "Zéro import manuel entre facturation et ventes",
        },
        {
          number: "03",
          title: "Automatisation Marketing et Contenu Stratégique",
          description:
            "Créez des briefs éditoriaux ciblés, des séquences d'e-mails et un scoring de leads qualifiés.",
          outcome: "3,4x de retour sur le pipeline généré",
        },
        {
          number: "04",
          title: "Déclencheurs E-mail et Coffre Chiffré",
          description:
            "Recevez des alertes instantanées tout en protégeant vos clés sensibles sous chiffrement AES-256-GCM.",
          outcome: "Alertes sous la minute avec intégrité vérifiée",
        },
      ],
      leadSpotlightTitle: "Acquisition B2B pilotée par vos données opérationnelles",
      leadSpotlightBody:
        "Bennisaas Solutions LLC exploite vos cycles de vente CRM pour générer des contenus stratégiques et des séquences automatisées.",
      testimonialQuote:
        "L'automatisation Stripe vers HubSpot avec Bennisaas Solutions LLC a réduit notre clôture mensuelle de quatre jours et augmenté nos démos qualifiées de 64 %.",
      testimonialAuthor: "Marcus Chen",
      testimonialRole: "VP Revenue Operations, Northbridge Logistics",
    },
    pricing: {
      sectionTitle: "Tarifs mensuels clairs adaptés à la taille de votre entreprise",
      sectionSubtitle:
        "Les cinq offres incluent la localisation multilingue, le chiffrement AES-256-GCM, les connecteurs CRM/paiement et les alertes e-mail.",
      perMonth: "/ mois",
      selectPlan: "Choisir ce forfait",
      currentPlan: "Forfait actif",
      colConnectors: "Connecteurs API",
      colReports: "Rapports automatisés",
      colAiRuns: "Analyses & Contenu IA",
      colVault: "Coffre chiffré",
      colSla: "SLA Support",
    },
    contact: {
      sectionTitle: "Démarrez votre déploiement sur mesure",
      sectionSubtitle:
        "Indiquez votre CRM, vos outils de paiement et vos objectifs. Nos architectes vous répondent rapidement.",
      nameLabel: "Nom complet",
      emailLabel: "E-mail professionnel",
      phoneLabel: "Téléphone",
      companyLabel: "Entreprise",
      tierLabel: "Forfait souhaité",
      focusLabel: "Priorité d'automatisation",
      messageLabel: "Besoins d'intégration et de reporting",
      submitButton: "Envoyer la demande",
      submitting: "Envoi en cours...",
      successTitle: "Demande enregistrée",
      successBody: "Votre dossier a été enregistré sous la référence",
      sendAnother: "Envoyer une autre demande",
    },
    dashboard: {
      previewNotice:
        "Mode aperçu interactif. Connectez-vous pour enregistrer vos réglages, chiffrer des clés et lancer l'analyse IA.",
      signInToSave: "Connexion / Inscription",
      tabs: {
        overview: "Analytique & IA",
        connectors: "APIs & Alertes",
        reports: "Rapports",
        leads: "Leads & Contenu",
        vault: "Coffre Chiffré",
      },
      activeTier: "Forfait PME actif",
      analyzeTitle: "Analyseur Intelligent de Données",
      analyzeButton: "Lancer l'analyse IA",
      exportCsv: "Exporter CSV",
    },
    footer: {
      summary:
        "Automatisation de workflows, analyse intelligente et génération de leads qualifiés pour les PME.",
      supportHeading: "Support Client",
      headquartersHeading: "Siège Social",
      languageHeading: "Langue",
      copyright: "Bennisaas Solutions LLC. Tous droits réservés.",
      securityNote: "Coffre chiffré AES-256-GCM · Transport TLS 1.3",
    },
  },
  de: {
    localeLabel: "Deutsch",
    nav: {
      home: "Start",
      aboutUs: "Über uns",
      solutions: "Lösungen",
      caseStudies: "Fallstudien",
      pricing: "Preise",
      careers: "Karriere",
      contactUs: "Kontakt",
      workspace: "Arbeitsbereich",
      openWorkspace: "Konsole öffnen",
      signIn: "Anmelden",
      signOut: "Abmelden",
      backToSite: "Startseite",
    },
    about: {
      title: "Von Wyoming aus für verlässliche KMU-Automatisierung entwickelt",
      subtitle:
        "Bennisaas Solutions LLC liefert KI-Workflows, verschlüsselte API-Konnektoren und skalierbare Lead-Generierung.",
      pillars: [
        {
          title: "Hauptsitz in Wyoming, globaler Support",
          detail: "Registriert unter 30 N Gould St, STE R, Sheridan, WY mit schnellem Support für KMU weltweit.",
        },
        {
          title: "Sicherheit an erster Stelle",
          detail: "Alle sensiblen Schlüssel und Kundendaten werden serverseitig mit AES-256-GCM geschützt.",
        },
        {
          title: "Messbarer Geschäftsnutzen",
          detail: "Jeder Konnektor und Bericht liefert nachvollziehbare Zeitersparnis und Pipeline-Wachstum.",
        },
      ],
    },
    caseStudies: {
      title: "Verifizierte Kundenergebnisse im Mittelstand",
      subtitle: "Praxiserprobte Integrationen in Logistik, B2B-Finanzen und Großhandel.",
      items: [
        {
          client: "Northbridge Logistics",
          industry: "Logistik · 95 Mitarbeiter",
          metric: "-4 Tage Monatsabschluss · +64 % Demos",
          summary: "Automatisierter Stripe-HubSpot-Abgleich und wöchentliche Management-Reports.",
        },
        {
          client: "Vanguard Payroll Group",
          industry: "Finanzdienstleister · 60 Mitarbeiter",
          metric: "46 Std./Mon. gespart · 99,94 % Genauigkeit",
          summary: "Echtzeit-Webhooks zwischen Salesforce und Zahlungsanbietern ohne manuelle Exporte.",
        },
        {
          client: "Kestrel Industrial Supply",
          industry: "Großhandel · 140 Mitarbeiter",
          metric: "+138 % SQLs in 6 Monaten",
          summary: "Strategische Content-Briefings und automatisierte E-Mail-Kampagnen auf CRM-Basis.",
        },
      ],
    },
    careers: {
      title: "Karriere bei Bennisaas Solutions LLC",
      subtitle: "Verstärken Sie unsere Teams für Workflow-Engineering, KI-Analyse und B2B-Wachstum.",
      applyButton: "Jetzt bewerben",
      roles: [
        {
          title: "Senior Workflow Automation Engineer",
          location: "Remote (USA / Global)",
          type: "Vollzeit · Engineering",
          summary: "Entwicklung robuster CRM- und Zahlungs-Webhooks sowie automatisierter Berichtssysteme.",
        },
        {
          title: "Applied AI & Data Architect",
          location: "Sheridan, WY / Remote",
          type: "Vollzeit · KI",
          summary: "Aufbau intelligenter Datenanalysen, Anomalie-Trigger und KMU-Integrationspläne.",
        },
        {
          title: "B2B Marketing & Content Strategist",
          location: "Remote",
          type: "Vollzeit · Growth",
          summary: "Konzeption von Lead-Scoring-Regeln und automatisierten Content-Strecken.",
        },
      ],
    },
    hero: {
      kicker: "KI-Workflow-Automatisierung für den Mittelstand",
      headline: "Geschäftsprozesse automatisieren und Daten in qualifizierte Leads verwandeln.",
      subheadline:
        "Bennisaas Solutions LLC verbindet CRM, Zahlungsanbieter und Marketing in einem verschlüsselten Analyse-Workspace mit automatisierten Berichten.",
      primaryCta: "Kunden-Workspace öffnen",
      secondaryCta: "KMU-Tarife vergleichen",
      languageLabel: "Sprache",
    },
    metrics: {
      hoursSavedLabel: "42 Std. / Mon.",
      hoursSavedSub: "Eingesparte manuelle Berichtszeit pro Team",
      leadLiftLabel: "+138% SQLs",
      leadLiftSub: "Zuwachs qualifizierter Leads in 6 Monaten",
      syncAccuracyLabel: "99.94%",
      syncAccuracySub: "Abgleichgenauigkeit zwischen CRM und Zahlung",
      encryptionLabel: "AES-256-GCM",
      encryptionSub: "Authentifizierte Verschlüsselung sensibler Kundendaten",
    },
    services: {
      sectionTitle: "Operative Intelligenz für kleine und mittlere Unternehmen",
      sectionSubtitle:
        "Jedes Modul ersetzt manuelle Tabellen durch geprüfte, automatisierte Datenpipelines.",
      items: [
        {
          number: "01",
          title: "Intelligente Datenanalyse & Reporting",
          description:
            "Bündeln Sie Umsatz, Abwanderung und Durchlaufzeiten in interaktiven Dashboards mit automatischem Versand.",
          outcome: "46 Stunden/Monat Entlastung in Finanzen & Ops",
        },
        {
          number: "02",
          title: "Integrierte CRM- & Zahlungs-Konnektoren",
          description:
            "Nahtlose API-Anbindung an Salesforce, HubSpot, Stripe, Razorpay und Slack inklusive Webhook-Prüfung.",
          outcome: "Kein manueller CSV-Abgleich mehr",
        },
        {
          number: "03",
          title: "Marketing-Automatisierung & Content-Strategie",
          description:
            "Erstellen Sie datengestützte Content-Briefings, E-Mail-Sequenzen und Lead-Scoring-Regeln.",
          outcome: "3,4x Pipeline-Rendite auf Kampagnen",
        },
        {
          number: "04",
          title: "E-Mail-Trigger & Verschlüsselter Datentresor",
          description:
            "Sofortige Benachrichtigungen bei Umsatzabweichungen und sicherer AES-256-GCM Schutz aller Zugangsdaten.",
          outcome: "Echtzeit-Alerts mit geprüfter Integrität",
        },
      ],
      leadSpotlightTitle: "Qualifizierte Lead-Generierung aus echten Betriebsdaten",
      leadSpotlightBody:
        "Bennisaas Solutions LLC überführt Ihre CRM-Abschlussdaten direkt in strategische Content-Pläne und automatisierte Kampagnen.",
      testimonialQuote:
        "Die automatisierte Stripe-zu-HubSpot-Synchronisation mit Bennisaas Solutions LLC verkürzte unseren Monatsabschluss um vier Tage und steigerte qualifizierte Demos um 64 %.",
      testimonialAuthor: "Marcus Chen",
      testimonialRole: "VP Revenue Operations, Northbridge Logistics",
    },
    pricing: {
      sectionTitle: "Transparente Monatstarife für jede Unternehmensgröße",
      sectionSubtitle:
        "Alle fünf Pakete umfassen Mehrsprachigkeit, AES-256-GCM-Verschlüsselung, CRM- & Zahlungs-APIs sowie E-Mail-Trigger.",
      perMonth: "/ Monat",
      selectPlan: "Tarif wählen",
      currentPlan: "Aktiver Tarif",
      colConnectors: "API-Konnektoren",
      colReports: "Auto-Berichte",
      colAiRuns: "KI-Analyse & Content",
      colVault: "Datentresor",
      colSla: "Support-SLA",
    },
    contact: {
      sectionTitle: "Unverbindliche Projektanfrage senden",
      sectionSubtitle:
        "Nennen Sie uns Ihr CRM, Zahlungssystem und Ihre Berichtsziele für einen maßgeschneiderten Integrationsplan.",
      nameLabel: "Vollständiger Name",
      emailLabel: "Geschäftliche E-Mail",
      phoneLabel: "Telefonnummer",
      companyLabel: "Unternehmen",
      tierLabel: "Gewünschter Tarif",
      focusLabel: "Automatisierungsfokus",
      messageLabel: "Anforderungen an Workflows & APIs",
      submitButton: "Anfrage absenden",
      submitting: "Wird gesendet...",
      successTitle: "Anfrage gespeichert",
      successBody: "Ihre Anfrage wurde unter folgender Referenznummer erfasst",
      sendAnother: "Weitere Anfrage senden",
    },
    dashboard: {
      previewNotice:
        "Interaktive Vorschau. Melden Sie sich an, um Änderungen zu speichern, Geheimnisse zu verschlüsseln und Live-KI zu nutzen.",
      signInToSave: "Anmelden / Registrieren",
      tabs: {
        overview: "Analyse & KI",
        connectors: "APIs & Trigger",
        reports: "Berichte",
        leads: "Leads & Content",
        vault: "Datentresor",
      },
      activeTier: "Aktiver KMU-Tarif",
      analyzeTitle: "Intelligenter Datenanalyst",
      analyzeButton: "KI-Analyse starten",
      exportCsv: "CSV exportieren",
    },
    footer: {
      summary:
        "Automatisierte Workflows, intelligente Datenanalyse und strategische Lead-Generierung für den Mittelstand.",
      supportHeading: "Kundensupport",
      headquartersHeading: "Unternehmenssitz",
      languageHeading: "Sprache",
      copyright: "Bennisaas Solutions LLC. Alle Rechte vorbehalten.",
      securityNote: "AES-256-GCM Datentresor · TLS 1.3 Transport",
    },
  },
  hi: {
    localeLabel: "हिन्दी",
    nav: {
      home: "होम",
      aboutUs: "हमारे बारे में",
      solutions: "समाधान",
      caseStudies: "केस स्टडीज",
      pricing: "मूल्य",
      careers: "करियर",
      contactUs: "संपर्क करें",
      workspace: "वर्कस्पेस",
      openWorkspace: "डैशबोर्ड खोलें",
      signIn: "साइन इन",
      signOut: "साइन आउट",
      backToSite: "मुख्य पृष्ठ",
    },
    about: {
      title: "लघु और मध्यम उद्यमों के लिए भरोसेमंद AI स्वचालन",
      subtitle:
        "Bennisaas Solutions LLC सुरक्षित API कनेक्टर, स्वचालित रिपोर्टिंग और योग्य लीड जनरेशन सिस्टम प्रदान करता है।",
      pillars: [
        {
          title: "व्योमिंग मुख्यालय, वैश्विक सहायता",
          detail: "30 N Gould St, STE R, Sheridan, WY पर पंजीकृत तथा वैश्विक क्लाइंट सपोर्ट (+91 844 9423 404)।",
        },
        {
          title: "सुरक्षा-प्रथम आर्किटेक्चर",
          detail: "सभी संवेदनशील API कुंजियाँ और डेटा AES-256-GCM एन्क्रिप्शन द्वारा सुरक्षित हैं।",
        },
        {
          title: "मापने योग्य परिणाम",
          detail: "हर वर्कफ़्लो और रिपोर्ट सीधे समय की बचत और राजस्व वृद्धि से जुड़ा है।",
        },
      ],
    },
    caseStudies: {
      title: "SME ग्राहकों के सत्यापित परिणाम",
      subtitle: "लॉजिस्टिक्स, B2B फाइनेंस और वितरण में वास्तविक उपयोग के उदाहरण।",
      items: [
        {
          client: "Northbridge Logistics",
          industry: "लॉजिस्टिक्स · 95 कर्मचारी",
          metric: "-4 दिन मासिक क्लोज़िंग · +64% डेमो",
          summary: "14 क्षेत्रीय केंद्रों के लिए स्वचालित Stripe-HubSpot मिलान और साप्ताहिक रिपोर्ट।",
        },
        {
          client: "Vanguard Payroll Group",
          industry: "वित्तीय सेवाएं · 60 कर्मचारी",
          metric: "46 घंटे/माह बचत · 99.94% सटीकता",
          summary: "मैन्युअल CSV के बजाय Salesforce और पेमेंट वेबहुक अलर्ट का स्वचालन।",
        },
        {
          client: "Kestrel Industrial Supply",
          industry: "थोक वितरण · 140 कर्मचारी",
          metric: "6 महीनों में +138% SQLs",
          summary: "CRM डेटा के आधार पर रणनीतिक कंटेंट ब्रीफ और स्वचालित ईमेल अभियान।",
        },
      ],
    },
    careers: {
      title: "Bennisaas Solutions LLC में करियर",
      subtitle: "हमारी रिमोट इंजीनियरिंग, डेटा स्वचालन और क्लाइंट ग्रोथ टीम से जुड़ें।",
      applyButton: "आवेदन करें",
      roles: [
        {
          title: "सीनियर वर्कफ़्लो ऑटोमेशन इंजीनियर",
          location: "रिमोट (US / वैश्विक)",
          type: "पूर्णकालिक · इंजीनियरिंग",
          summary: "CRM और पेमेंट वेबहुक कनेक्टर और कस्टम रिपोर्टिंग पाइपलाइन का निर्माण।",
        },
        {
          title: "अप्लाइड AI और डेटा आर्किटेक्ट",
          location: "शेरिडन, WY / रिमोट",
          type: "पूर्णकालिक · क्लाइंट AI",
          summary: "डेटा विश्लेषण मॉडल, ईमेल अलर्ट नियम और SME ऑनबोर्डिंग समाधान।",
        },
        {
          title: "B2B डिमांड और कंटेंट स्ट्रैटेजिस्ट",
          location: "रिमोट",
          type: "पूर्णकालिक · ग्रोथ",
          summary: "लीड स्कोरिंग नियम और स्वचालित मार्केटिंग अभियान डिज़ाइन करना।",
        },
      ],
    },
    hero: {
      kicker: "बढ़ते व्यवसायों के लिए एंटरप्राइज़ AI संचालन",
      headline: "व्यावसायिक वर्कफ़्लो को स्वचालित करें और डेटा को योग्य लीड्स में बदलें।",
      subheadline:
        "Bennisaas Solutions LLC आपके CRM, भुगतान गेटवे और मार्केटिंग चैनलों को स्वचालित रिपोर्टिंग और एन्क्रिप्टेड एनालिटिक्स डैशबोर्ड में जोड़ता है।",
      primaryCta: "क्लाइंट डैशबोर्ड खोलें",
      secondaryCta: "SME प्लान देखें",
      languageLabel: "भाषा चुनें",
    },
    metrics: {
      hoursSavedLabel: "42 घंटे / माह",
      hoursSavedSub: "प्रति टीम मैन्युअल रिपोर्टिंग में औसत समय की बचत",
      leadLiftLabel: "+138% SQLs",
      leadLiftSub: "6 महीनों में योग्य लीड्स में वृद्धि",
      syncAccuracyLabel: "99.94%",
      syncAccuracySub: "CRM और भुगतान डेटा मिलान सटीकता",
      encryptionLabel: "AES-256-GCM",
      encryptionSub: "क्लाइंट डेटा और API कुंजियों के लिए सुरक्षित एन्क्रिप्शन",
    },
    services: {
      sectionTitle: "लघु और मध्यम उद्यमों के लिए निर्मित परिचालन बुद्धिमत्ता",
      sectionSubtitle:
        "हर मॉड्यूल मैन्युअल स्प्रेडशीट को ऑडिटेड और स्वचालित डेटा पाइपलाइन से बदलता है।",
      items: [
        {
          number: "01",
          title: "बुद्धिमान डेटा विश्लेषण और कस्टम रिपोर्टिंग",
          description:
            "राजस्व, ग्राहक प्रतिधारण और कार्यप्रवाह गति को लाइव विज़ुअल डैशबोर्ड और शेड्यूल्ड रिपोर्ट में एकत्रित करें।",
          outcome: "वित्त और संचालन में प्रति माह 46 घंटे की बचत",
        },
        {
          number: "02",
          title: "एकीकृत CRM और भुगतान API कनेक्टर",
          description:
            "Salesforce, HubSpot, Stripe, Razorpay और Slack के साथ सुरक्षित वेबहुक और रीयल-टाइम सिंक।",
          outcome: "बिलिंग और बिक्री के बीच शून्य मैन्युअल डेटा एंट्री",
        },
        {
          number: "03",
          title: "मार्केटिंग ऑटोमेशन और रणनीतिक कंटेंट निर्माण",
          description:
            "योग्य लीड्स उत्पन्न करने के लिए डेटा-आधारित कंटेंट ब्रीफ, ईमेल सीक्वेंस और लीड स्कोरिंग नियम बनाएं।",
          outcome: "डिमांड जनरेशन पर 3.4x पाइपलाइन रिटर्न",
        },
        {
          number: "04",
          title: "स्वचालित ईमेल अलर्ट और एन्क्रिप्टेड डेटा वॉल्ट",
          description:
            "महत्वपूर्ण राजस्व परिवर्तनों पर तुरंत ईमेल अलर्ट प्राप्त करें और AES-256-GCM से संवेदनशील डेटा सुरक्षित रखें।",
          outcome: "सत्यापित डेटा अखंडता के साथ त्वरित सूचनाएं",
        },
      ],
      leadSpotlightTitle: "वास्तविक व्यावसायिक डेटा से संचालित योग्य लीड जनरेशन",
      leadSpotlightBody:
        "Bennisaas Solutions LLC आपके CRM डेटा को सीधे रणनीतिक कंटेंट प्लान और स्वचालित आउटरीच अभियानों से जोड़ता है।",
      testimonialQuote:
        "Bennisaas Solutions LLC के साथ Stripe और HubSpot को स्वचालित करने से हमारी मासिक क्लोज़िंग में चार दिन की बचत हुई और योग्य डेमो 64% बढ़ गए।",
      testimonialAuthor: "मार्कस चेन",
      testimonialRole: "VP रेवेन्यू ऑपरेशंस, नॉर्थब्रिज लॉजिस्टिक्स",
    },
    pricing: {
      sectionTitle: "हर SME व्यवसाय स्तर के लिए पारदर्शी मासिक प्लान",
      sectionSubtitle:
        "सभी पाँच प्लान में बहुभाषी समर्थन, AES-256-GCM एन्क्रिप्शन, CRM और पेमेंट API और ईमेल ट्रिगर शामिल हैं।",
      perMonth: "/ माह",
      selectPlan: "प्लान चुनें",
      currentPlan: "सक्रिय प्लान",
      colConnectors: "API कनेक्टर",
      colReports: "स्वचालित रिपोर्ट",
      colAiRuns: "AI विश्लेषण और कंटेंट",
      colVault: "एन्क्रिप्टेड वॉल्ट",
      colSla: "सपोर्ट SLA",
    },
    contact: {
      sectionTitle: "अपनी कार्यप्रवाह स्वचालन यात्रा शुरू करें",
      sectionSubtitle:
        "अपने CRM, भुगतान प्रणाली और रिपोर्टिंग लक्ष्यों को साझा करें। हमारी टीम एक उपयुक्त कार्यान्वयन योजना भेजेगी।",
      nameLabel: "पूरा नाम",
      emailLabel: "कार्य ईमेल",
      phoneLabel: "फ़ोन नंबर",
      companyLabel: "कंपनी का नाम",
      tierLabel: "सदस्यता प्लान",
      focusLabel: "मुख्य स्वचालन क्षेत्र",
      messageLabel: "कार्यप्रवाह और एकीकरण आवश्यकताएं",
      submitButton: "पूछताछ सबमिट करें",
      submitting: "सबमिट हो रहा है...",
      successTitle: "पूछताछ दर्ज हो गई",
      successBody: "आपका विवरण इस संदर्भ संख्या के साथ प्राप्त हो गया है",
      sendAnother: "एक और पूछताछ भेजें",
    },
    dashboard: {
      previewNotice:
        "इंटरैक्टिव पूर्वावलोकन मोड। बदलाव सहेजने, डेटा एन्क्रिप्ट करने और लाइव AI विश्लेषण चलाने के लिए साइन इन करें।",
      signInToSave: "साइन इन / रजिस्टर करें",
      tabs: {
        overview: "एनालिटिक्स और AI",
        connectors: "API और ट्रिगर",
        reports: "कस्टम रिपोर्ट",
        leads: "लीड्स और कंटेंट",
        vault: "एन्क्रिप्टेड वॉल्ट",
      },
      activeTier: "सक्रिय SME प्लान",
      analyzeTitle: "बुद्धिमान डेटा विश्लेषक",
      analyzeButton: "AI विश्लेषण चलाएं",
      exportCsv: "CSV निर्यात करें",
    },
    footer: {
      summary:
        "बढ़ते उद्यमों के लिए स्वचालित व्यावसायिक वर्कफ़्लो, बुद्धिमान डेटा विश्लेषण और रणनीतिक लीड जनरेशन।",
      supportHeading: "ग्राहक सहायता",
      headquartersHeading: "मुख्यालय पता",
      languageHeading: "भाषा चयन",
      copyright: "Bennisaas Solutions LLC. सर्वाधिकार सुरक्षित।",
      securityNote: "AES-256-GCM एन्क्रिप्टेड वॉल्ट · TLS 1.3 सुरक्षा",
    },
  },
};
