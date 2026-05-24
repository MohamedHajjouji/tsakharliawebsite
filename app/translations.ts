export type Language = 'en' | 'ar' | 'fr';

export interface Translation {
  nav: {
    order: string;
    partnerWithUs: string;
    rideWithUs: string;
    login: string;
    getApp: string;
    orderFood: string;
    partner: string;
    courier: string;
    deliveryWorkers: string;
    partners: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    placeholder: string;
    findFood: string;
  };
  features: {
    title: string;
    subtitle: string;
    lightningFast: {
      title: string;
      description: string;
    };
    localFavorites: {
      title: string;
      description: string;
    };
    friendlyService: {
      title: string;
      description: string;
    };
  };
  partner: {
    badge: string;
    title: string;
    subtitle: string;
    boostRevenue: {
      title: string;
      description: string;
    };
    seamlessDelivery: {
      title: string;
      description: string;
    };
    getStarted: string;
    businessInfo: string;
    firstName: string;
    lastName: string;
    businessName: string;
    businessType: string;
    email: string;
    phone: string;
    submit: string;
    terms: string;
  };
  courier: {
    title: string;
    subtitle: string;
    flexibleHours: {
      title: string;
      description: string;
    };
    fastEarnings: {
      title: string;
      description: string;
    };
    signUp: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    deliveryMethod: string;
    city: string;
    next: string;
  };
  footer: {
    about: string;
    careers: string;
    blog: string;
    contact: string;
    addRestaurant: string;
    signUpDeliver: string;
    businessApp: string;
    downloadAppStore: string;
    downloadPlayStore: string;
    copyright: string;
    privacy: string;
    terms: string;
    pricing: string;
    privacyPolicy: string;
    allRightsReserved: string;
  };
  deliveryTime: string;
  onTheWay: string;
  groceries: string;
  freshProduce: string;
  dairyEggs: string;
  contact: {
    title: string;
    subtitle: string;
    form: {
      title: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      submit: string;
      submitting: string;
      success: string;
    };
    faq: {
      title: string;
      questions: { q: string; a: string }[];
    };
    info: {
      email: string;
      hours: string;
    };
  };
}

export const translations: Record<Language, Translation> = {
  en: {
    nav: {
      order: 'Order Now',
      partnerWithUs: 'Become a Partner',
      rideWithUs: 'Become a Driver',
      login: 'Sign In',
      getApp: 'Download App',
      orderFood: 'Food & Groceries',
      partner: 'Partners',
      courier: 'Drivers',
      deliveryWorkers: 'Delivery Workers',
      partners: 'Partners',
    },

    hero: {
      badge: 'Fast delivery across your city',
      title: 'Everything,',
      titleHighlight: 'delivered fast.',
      subtitle:
        'Meals, groceries, pharmacy items, snacks, and more — delivered to your door in minutes.',
      placeholder: 'Enter your address',
      findFood: 'Start Ordering',
    },

    features: {
      title: 'Built for everyday life',
      subtitle:
        'From late-night cravings to daily groceries, Tsakharlia gets it to you fast.',

      lightningFast: {
        title: 'Fast Delivery',
        description:
          'Our drivers move quickly so your order arrives fresh, hot, and on time.',
      },

      localFavorites: {
        title: 'Your Favorite Stores',
        description:
          'Restaurants, cafés, grocery stores, pharmacies, and local shops — all in one app.',
      },

      friendlyService: {
        title: 'Reliable Experience',
        description:
          'Simple ordering, live tracking, and support that actually helps.',
      },
    },

    partner: {
      badge: 'For Businesses',
      title: 'Grow your business with Tsakharlia.',
      subtitle:
        'Reach more customers, increase orders, and let us handle the delivery operations.',

      boostRevenue: {
        title: 'More Orders',
        description:
          'Get discovered by customers actively looking to buy nearby.',
      },

      seamlessDelivery: {
        title: 'Delivery Handled',
        description:
          'Focus on your business while our drivers handle the logistics.',
      },

      getStarted: 'Get Started',
      businessInfo: 'Tell us about your business.',
      firstName: 'First Name',
      lastName: 'Last Name',
      businessName: 'Business Name',
      businessType: 'Business Type',
      email: 'Email Address',
      phone: 'Phone Number',
      submit: 'Submit Application',
      terms: 'By submitting this form, you agree to our Terms & Privacy Policy.',
    },

    courier: {
      title: 'Earn on your own schedule.',
      subtitle:
        'Deliver with Tsakharlia and earn money whenever it works for you.',

      flexibleHours: {
        title: 'Flexible Work',
        description:
          'Go online whenever you want and deliver when it suits you.',
      },

      fastEarnings: {
        title: 'Weekly Payouts',
        description:
          'Track your earnings directly from the app and get paid بسهولة.',
      },

      signUp: 'Apply as Driver',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      deliveryMethod: 'Vehicle Type',
      city: 'City',
      next: 'Continue',
    },

    footer: {
      about: 'About',
      careers: 'Careers',
      blog: 'Blog',
      contact: 'Contact',
      addRestaurant: 'Add your business',
      signUpDeliver: 'Become a driver',
      businessApp: 'Business Dashboard',
      downloadAppStore: 'App Store',
      downloadPlayStore: 'Google Play',
      copyright: '© 2026 Tsakharlia',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      pricing: 'Pricing',
      privacyPolicy: 'Privacy Policy',
      allRightsReserved: 'All rights reserved',
    },

    deliveryTime: '15-35 min',
    onTheWay: 'On the way',
    groceries: 'Groceries',
    freshProduce: 'Fresh Produce',
    dairyEggs: 'Dairy & Eggs',
    contact: {
      title: 'Get in Touch',
      subtitle: 'Have questions? We\'re here to help.',
      form: {
        title: 'Send us a message',
        name: 'Your Name',
        email: 'Email Address',
        subject: 'Subject',
        message: 'Your Message',
        submit: 'Send Message',
        submitting: 'Sending...',
        success: 'Message sent successfully! We\'ll get back to you soon.',
      },
      faq: {
        title: 'Frequently Asked Questions',
        questions: [
          { q: 'How fast is delivery?', a: 'Our delivery typically takes 15-35 minutes depending on your location.' },
          { q: 'How can I track my order?', a: 'You can track your order in real-time through our app.' },
          { q: 'Is there a delivery fee?', a: 'Yes, there is a small delivery fee that varies based on distance.' },
        ],
      },
      info: {
        email: 'contact@tsakharlia.com',
        hours: 'Available daily until 1 AM',
      },
    },
  },

  ar: {
    nav: {
      order: 'طلب دابا',
      partnerWithUs: 'خدم معنا',
      rideWithUs: 'ولي ليفريور',
      login: 'دخول',
      getApp: 'حمّل التطبيق',
      orderFood: 'ماكلة و بقّالة',
      partner: 'شركاء',
      courier: 'ليفرورات',
      deliveryWorkers: 'سائقين التوصيل',
      partners: 'شركاء',
    },

    hero: {
      badge: 'توصيل سريع فمدينتك',
      title: 'أي حاجة محتاجها،',
      titleHighlight: 'نوصلوهالك بسرعة.',
      subtitle:
        'ماكلة، بقّالة، دوا، سناكات و بزاف — حتى لباب دارك فدقائق.',
      placeholder: 'دخل العنوان ديالك',
      findFood: 'بدا الطلب',
    },

    features: {
      title: 'مصمم للحياة اليومية',
      subtitle:
        'من الجوع ديال نص الليل حتى لقضية ديال الدار، تسخر ليا كيوصلها ليك بسرعة.',

      lightningFast: {
        title: 'توصيل سريع',
        description:
          'الطلبات كاتوصل سخونة، طازجة، و فالوقت.',
      },

      localFavorites: {
        title: 'المحلات لي كتعرف',
        description:
          'مطاعم، كافيهات، بقّالات، صيدليات ومحلات قريبة ليك — كاملين فتطبيق واحد.',
      },

      friendlyService: {
        title: 'تجربة سهلة',
        description:
          'طلب بسهولة، تتبع مباشر، و دعم كيعاونك بصح.',
      },
    },

    partner: {
      badge: 'لأصحاب المحلات والمطاعم',
      title: 'كبر البيزنس ديالك مع تسخر ليا.',
      subtitle:
        'وصل لزبناء جداد، زيد فالطلبات، وخلي علينا التوصيل.',

      boostRevenue: {
        title: 'طلبات أكثر',
        description:
          'خلي الناس لي حداك يلقاو المحل ديالك بسهولة.',
      },

      seamlessDelivery: {
        title: 'التوصيل علينا',
        description:
          'ركز على الخدمة ديالك و حنا نتكلفو بالليفريزون.',
      },

      getStarted: 'بدا معنا',
      businessInfo: 'عطينا معلومات على البيزنس ديالك.',
      firstName: 'الاسم',
      lastName: 'النسب',
      businessName: 'اسم المحل',
      businessType: 'نوع النشاط',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      submit: 'إرسال الطلب',
      terms: 'بإرسال الطلب، كتوافق على الشروط و سياسة الخصوصية.',
    },

    courier: {
      title: 'خدم بوقتك.',
      subtitle:
        'وصل الطلبات مع تسخر ليا و ربح على حساب الوقت لي مناسب ليك.',

      flexibleHours: {
        title: 'وقت مرن',
        description:
          'دخل تخدم وقت ما بغيتي و خرج وقت ما بغيتي.',
      },

      fastEarnings: {
        title: 'دخل مستمر',
        description:
          'تبع الأرباح ديالك مباشرة من التطبيق.',
      },

      signUp: 'سجل كليفرور',
      firstName: 'الاسم',
      lastName: 'النسب',
      email: 'البريد',
      phone: 'الهاتف',
      deliveryMethod: 'بشنو غادي توصل؟',
      city: 'المدينة',
      next: 'التالي',
    },

    footer: {
      about: 'حولنا',
      careers: 'الوظائف',
      blog: 'المدونة',
      contact: 'تواصل معنا',
      addRestaurant: 'زيد المحل ديالك',
      signUpDeliver: 'ولي ليفريور',
      businessApp: 'لوحة التسيير',
      downloadAppStore: 'App Store',
      downloadPlayStore: 'Google Play',
      copyright: '© 2026 تسخر ليا',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      pricing: 'الأسعار',
      privacyPolicy: 'سياسة الخصوصية',
      allRightsReserved: 'جميع الحقوق محفوظة',
    },

    deliveryTime: '15-35 دقيقة',
    onTheWay: 'جا فالثنية',
    groceries: 'البقّالة',
    freshProduce: 'خضرة وفواكه',
    dairyEggs: 'الحليب و البيض',
    contact: {
      title: 'تواصل معنا',
      subtitle: 'عندك أسئلة؟ حنا هنا باش نعاونوك.',
      form: {
        title: 'صيفط لينا رسالة',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        subject: 'الموضوع',
        message: 'الرسالة',
        submit: 'إرسال',
        submitting: 'جاري الإرسال...',
        success: 'تم إرسال الرسالة بنجاح! غادي نتواصلو معاك قريبا.',
      },
      faq: {
        title: 'الأسئلة الشائعة',
        questions: [
          { q: 'شحال كيدوز الوقت باش يوصل الطلب؟', a: 'التوصيل كاياخد عادة 15-35 دقيقة حسب المنطقة.' },
          { q: 'كيفاش يمكن لي نتبع الطلب ديالي؟', a: 'يمكن ليك تتبع الطلب ديالك مباشرة من التطبيق.' },
          { q: 'كاين شي رسم توصيل؟', a: 'آه، كاين رسم توصيل صغير كايختالف حسب المسافة.' },
        ],
      },
      info: {
        email: 'contact@tsakharlia.com',
        hours: 'متاح يوميا حتى 1 صباحا',
      },
    },
  },

  fr: {
    nav: {
      order: 'Commander',
      partnerWithUs: 'Devenir partenaire',
      rideWithUs: 'Devenir livreur',
      login: 'Connexion',
      getApp: 'Télécharger',
      orderFood: 'Repas & Courses',
      partner: 'Partenaires',
      courier: 'Livreurs',
      deliveryWorkers: 'Livreurs',
      partners: 'Partenaires',
    },

    hero: {
      badge: 'Livraison rapide dans votre ville',
      title: 'Tout ce dont vous avez besoin,',
      titleHighlight: 'livré rapidement.',
      subtitle:
        'Repas, courses, snacks, pharmacie et plus encore — livrés chez vous en quelques minutes.',
      placeholder: 'Entrez votre adresse',
      findFood: 'Commander',
    },

    features: {
      title: 'Pensé pour le quotidien',
      subtitle:
        'Des repas aux courses du quotidien, Tsakharlia livre rapidement ce dont vous avez besoin.',

      lightningFast: {
        title: 'Livraison Rapide',
        description:
          'Vos commandes arrivent fraîches, chaudes et à temps.',
      },

      localFavorites: {
        title: 'Vos commerces préférés',
        description:
          'Restaurants, cafés, supermarchés, pharmacies et commerces locaux réunis dans une seule application.',
      },

      friendlyService: {
        title: 'Expérience Fiable',
        description:
          'Commande simple, suivi en direct et support réactif.',
      },
    },

    partner: {
      badge: 'Pour les commerces',
      title: 'Développez votre activité avec Tsakharlia.',
      subtitle:
        'Touchez plus de clients, augmentez vos commandes et laissez-nous gérer la livraison.',

      boostRevenue: {
        title: 'Plus de commandes',
        description:
          'Soyez visible auprès des clients autour de vous.',
      },

      seamlessDelivery: {
        title: 'Livraison simplifiée',
        description:
          'Concentrez-vous sur votre activité, nous gérons la logistique.',
      },

      getStarted: 'Commencer',
      businessInfo: 'Parlez-nous de votre activité.',
      firstName: 'Prénom',
      lastName: 'Nom',
      businessName: 'Nom du commerce',
      businessType: 'Type d’activité',
      email: 'Adresse email',
      phone: 'Téléphone',
      submit: 'Envoyer',
      terms: 'En envoyant ce formulaire, vous acceptez nos conditions et notre politique de confidentialité.',
    },

    courier: {
      title: 'Travaillez à votre rythme.',
      subtitle:
        'Livrez avec Tsakharlia et gagnez de l’argent selon votre disponibilité.',

      flexibleHours: {
        title: 'Horaires flexibles',
        description:
          'Connectez-vous quand vous voulez et livrez librement.',
      },

      fastEarnings: {
        title: 'Revenus réguliers',
        description:
          'Suivez vos gains directement depuis l’application.',
      },

      signUp: 'Devenir livreur',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      deliveryMethod: 'Moyen de livraison',
      city: 'Ville',
      next: 'Continuer',
    },

    footer: {
      about: 'À propos',
      careers: 'Carrières',
      blog: 'Blog',
      contact: 'Contact',
      addRestaurant: 'Ajouter votre commerce',
      signUpDeliver: 'Devenir livreur',
      businessApp: 'Espace Business',
      downloadAppStore: 'App Store',
      downloadPlayStore: 'Google Play',
      copyright: '© 2026 Tsakharlia',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d’utilisation',
      pricing: 'Tarifs',
      privacyPolicy: 'Politique de confidentialité',
      allRightsReserved: 'Tous droits réservés',
    },

    deliveryTime: '15-35 min',
    onTheWay: 'En route',
    groceries: 'Courses',
    freshProduce: 'Produits frais',
    dairyEggs: 'Produits laitiers & œufs',
    contact: {
      title: 'Contactez-nous',
      subtitle: 'Des questions ? Nous sommes là pour vous aider.',
      form: {
        title: 'Envoyez-nous un message',
        name: 'Votre nom',
        email: 'Adresse email',
        subject: 'Sujet',
        message: 'Votre message',
        submit: 'Envoyer',
        submitting: 'Envoi...',
        success: 'Message envoyé avec succès ! Nous vous répondrons bientôt.',
      },
      faq: {
        title: 'Questions fréquentes',
        questions: [
          { q: 'Quel est le délai de livraison ?', a: 'Notre livraison prend généralement 15 à 35 minutes selon votre emplacement.' },
          { q: 'Comment suivre ma commande ?', a: 'Vous pouvez suivre votre commande en temps réel via notre application.' },
          { q: 'Y a-t-il des frais de livraison ?', a: 'Oui, de petits frais de livraison s\'appliquent selon la distance.' },
        ],
      },
      info: {
        email: 'contact@tsakharlia.com',
        hours: 'Disponible tous les jours jusqu\'à 1h du matin',
      },
    },
  },
};

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];