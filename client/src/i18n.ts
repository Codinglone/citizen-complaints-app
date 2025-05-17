import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English translations
const enResources = {
  translation: {
    app: {
      title: "Citizen Engagement Platform",
    },
    nav: {
      submitComplaint: "Submit Complaint",
      dashboard: "Dashboard",
      adminPanel: "Admin Panel",
      signIn: "Sign In",
      register: "Register",
      userDashboard: "Dashboard",
      adminDashboard: "Admin Dashboard",
      manageComplaints: "Manage Complaints",
      manageUsers: "Manage Users",
      analytics: "Analytics",
      myComplaints: "My Complaints",
      settings: "Settings",
      profile: "Profile",
      logout: "Logout",
      backToHome: "Back to Home",
    },
    landing: {
      title: "Citizen Engagement Platform",
      description: "AI-powered citizen complaint submission and routing system",
      submitComplaint: "Submit a Complaint",
      signIn: "Sign In",
      register: "Register",
      adminPanel: "Admin Portal",
      hero: {
        title: "Your Voice Matters",
        subtitle: "Making government more responsive through technology",
        cta: "Get Started",
      },
      features: {
        title: "Powerful Features",
        subtitle: "Designed to improve citizen-government communication",
        ai: {
          title: "AI-Powered Routing",
          description:
            "Our system automatically routes your complaint to the right department",
        },
        tracking: {
          title: "Real-time Tracking",
          description:
            "Check your complaint status anytime from submission to resolution",
        },
        analytics: {
          title: "Data Analytics",
          description:
            "Insights help agencies improve services based on citizen feedback",
        },
      },
      howItWorks: {
        title: "How It Works",
        step1: "Submit your complaint",
        step2: "AI routes it to the right department",
        step3: "Track status in real-time",
        step4: "Receive updates until resolution",
      },
      testimonials: {
        title: "What Citizens Are Saying",
        subtitle: "Real feedback from platform users",
      },
      cta: {
        title: "Ready to improve your community?",
        subtitle: "Your voice can make a difference",
        button: "Submit Complaint Now",
      },
    },
    userDashboard: {
      title: "User Dashboard",
      complaintStatus: "Complaint Status",
      statusDescription: "Track the status of your submitted complaints",
      notifications: "Recent Notifications",
      notificationsDescription: "Updates on your complaints and responses",
      quickActions: "Quick Actions",
      actionsDescription: "Submit new complaints or check status",
      myComplaints: "My Complaints",
      settings: "Account Settings",
    },
    adminPanel: {
      title: "Admin Dashboard",
      totalComplaints: "Total Complaints",
      pendingComplaints: "Pending Complaints",
      resolutionRate: "Resolution Rate",
      thisMonth: "This Month",
      needsAction: "Needs Your Action",
      increasedBy: "Increased by",
      manageComplaints: "Manage Complaints",
      manageUsers: "Manage Users",
      analytics: "Analytics Dashboard",
    },
    complaint: {
      title: "Submit a Complaint",
      category: "Category",
      categoryPlaceholder: "Select a category",
      description: "Description",
      descriptionPlaceholder: "Describe your issue in detail",
      location: "Location",
      locationPlaceholder: "Enter the address or location",
      attachments: "Attachments",
      attachmentsDescription: "Upload photos or documents (optional)",
      submit: "Submit Complaint",
      success: "Complaint submitted successfully!",
      error: "Error submitting complaint. Please try again.",
      categories: {
        roads: "Roads & Infrastructure",
        water: "Water Supply",
        waste: "Waste Management",
        electricity: "Electricity",
        publicTransport: "Public Transport",
        noise: "Noise Pollution",
        other: "Other",
      },
    },
    theme: {
      change: "Change Theme",
    },
    footer: {
      rights: "All Rights Reserved",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      services: "Services",
      about: "About",
      legal: "Legal",
      social: "Social",
      team: "Team",
      press: "Press",
      faq: "FAQ",
      howItWorks: "How It Works",
      trackStatus: "Track Status",
      viewDashboard: "View Dashboard",
      contactSupport: "Contact Support",
    },
  },
};

// French translations
const frResources = {
  translation: {
    app: {
      title: "Plateforme d'Engagement Citoyen",
    },
    nav: {
      submitComplaint: "Soumettre une Plainte",
      dashboard: "Tableau de Bord",
      adminPanel: "Panneau Admin",
      signIn: "Connexion",
      register: "S'inscrire",
      userDashboard: "Tableau de Bord",
      adminDashboard: "Tableau Admin",
      manageComplaints: "Gérer les Plaintes",
      manageUsers: "Gérer les Utilisateurs",
      analytics: "Analyses",
      myComplaints: "Mes Plaintes",
      settings: "Paramètres",
      profile: "Profil",
      logout: "Déconnexion",
      backToHome: "Retour à l'Accueil",
    },
    landing: {
      title: "Plateforme d'Engagement Citoyen",
      description:
        "Système de soumission et d'acheminement des plaintes citoyennes assisté par IA",
      submitComplaint: "Soumettre une Plainte",
      signIn: "Connexion",
      register: "S'inscrire",
      adminPanel: "Portail Admin",
      hero: {
        title: "Votre Voix Compte",
        subtitle: "Rendre le gouvernement plus réactif grâce à la technologie",
        cta: "Commencer",
      },
      features: {
        title: "Fonctionnalités Puissantes",
        subtitle:
          "Conçues pour améliorer la communication citoyen-gouvernement",
        ai: {
          title: "Acheminement par IA",
          description:
            "Notre système achemine automatiquement votre plainte au bon département",
        },
        tracking: {
          title: "Suivi en Temps Réel",
          description:
            "Vérifiez l'état de votre plainte à tout moment, de la soumission à la résolution",
        },
        analytics: {
          title: "Analyse de Données",
          description:
            "Les informations aident les agences à améliorer les services basés sur les retours des citoyens",
        },
      },
      howItWorks: {
        title: "Comment Ça Marche",
        step1: "Soumettez votre plainte",
        step2: "L'IA l'achemine au bon département",
        step3: "Suivez l'état en temps réel",
        step4: "Recevez des mises à jour jusqu'à la résolution",
      },
      testimonials: {
        title: "Ce que Disent les Citoyens",
        subtitle: "Retours réels des utilisateurs de la plateforme",
      },
      cta: {
        title: "Prêt à améliorer votre communauté?",
        subtitle: "Votre voix peut faire la différence",
        button: "Soumettre une Plainte Maintenant",
      },
    },
    userDashboard: {
      title: "Tableau de Bord Utilisateur",
      complaintStatus: "État des Plaintes",
      statusDescription: "Suivez l'état de vos plaintes soumises",
      notifications: "Notifications Récentes",
      notificationsDescription: "Mises à jour sur vos plaintes et réponses",
      quickActions: "Actions Rapides",
      actionsDescription: "Soumettre de nouvelles plaintes ou vérifier l'état",
      myComplaints: "Mes Plaintes",
      settings: "Paramètres du Compte",
    },
    adminPanel: {
      title: "Tableau de Bord Admin",
      totalComplaints: "Total des Plaintes",
      pendingComplaints: "Plaintes en Attente",
      resolutionRate: "Taux de Résolution",
      thisMonth: "Ce Mois",
      needsAction: "Nécessite Votre Action",
      increasedBy: "Augmenté de",
      manageComplaints: "Gérer les Plaintes",
      manageUsers: "Gérer les Utilisateurs",
      analytics: "Tableau de Bord Analytique",
    },
    complaint: {
      title: "Soumettre une Plainte",
      category: "Catégorie",
      categoryPlaceholder: "Sélectionnez une catégorie",
      description: "Description",
      descriptionPlaceholder: "Décrivez votre problème en détail",
      location: "Emplacement",
      locationPlaceholder: "Entrez l'adresse ou l'emplacement",
      attachments: "Pièces Jointes",
      attachmentsDescription: "Téléchargez des photos ou documents (optionnel)",
      submit: "Soumettre la Plainte",
      success: "Plainte soumise avec succès!",
      error: "Erreur lors de la soumission de la plainte. Veuillez réessayer.",
      categories: {
        roads: "Routes et Infrastructure",
        water: "Approvisionnement en Eau",
        waste: "Gestion des Déchets",
        electricity: "Électricité",
        publicTransport: "Transport Public",
        noise: "Pollution Sonore",
        other: "Autre",
      },
    },
    theme: {
      change: "Changer de Thème",
    },
    footer: {
      rights: "Tous droits réservés",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      contact: "Contactez-Nous",
    },
  },
};

i18n.use(initReactI18next).init({
  resources: {
    en: enResources,
    fr: frResources,
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
