/* ========================================
   AYQIDH TAQATAK - Awaken Your Energy
   Complete Application Logic (Enhanced)
   ======================================== */

(function () {
  'use strict';

  // ============ STATE ============
  let currentLang = localStorage.getItem('ayqidh-lang') || 'ar';
  let currentTheme = localStorage.getItem('ayqidh-theme') || 'energy';
  let soundEnabled = localStorage.getItem('ayqidh-sound') !== 'off';
  let quizState = JSON.parse(localStorage.getItem('ayqidh-quiz') || '{}');
  let exploredDomains = JSON.parse(localStorage.getItem('ayqidh-explored') || '[]');
  let challengeCompleted = localStorage.getItem('ayqidh-challenge-date') === new Date().toDateString();
  let audioCtx = null;

  // ============ TRANSLATIONS ============
  const T = {
    ar: {
      appTitle: 'أيقظ طاقتك',
      ayahTranslation: '',
      homeTitle: 'لوحة الطاقة',
      meterLow: 'معطلة',
      meterHigh: 'مفعلة',
      meterStart: 'ابدأ التقييم لقياس طاقتك',
      dailyTip: 'نصيحة اليوم لتفعيل الطاقة',
      introTitle: 'عن هذا التطبيق',
      introText: 'ملخص تفاعلي لكتاب "الإسلام والطاقات المعطلة" للشيخ محمد الغزالي. يشخص أسباب تراجع الأمة ويقترح حلولا عملية لإيقاظ الطاقات الكامنة.',
      sufiTitle: 'رؤية بارزة: نقد التصوف المغالي',
      sufiText: 'يرى الغزالي أن التصوف شخّص الطمع بشكل صحيح لكنه بالغ في الزهد. المثال: كمن يعالج بخيلا بأن يجعله يبذر كل شيء. عالجوا الكبر فقتلوا الطموح واحترام الذات.',
      sufiAnalogy: 'تشخيص صحيح + جرعة زائدة = ضرر جديد',
      causesTitle: '⚡ الأسباب الأربعة للتراجع',
      causesDesc: 'يشخص الغزالي أربعة أسباب جذرية وراء تراجع الأمة رغم امتلاكها للوحي الإلهي',
      energiesTitle: '🔋 الطاقات الست المعطلة',
      energiesDesc: 'ست مجالات كبرى تم تعطيل طاقتها في الأمة',
      solutionsTitle: '💊 العلاج: خمسة أبعاد',
      solutionsDesc: 'الحلول العملية التي يقترحها الغزالي لإيقاظ الأمة',
      scenariosTitle: '🎮 سيناريوهات تفاعلية',
      scenariosDesc: 'اختر الاستجابة الصحيحة لكل موقف',
      assessTitle: '🤔 ما مدى تفعيل طاقاتك؟',
      assessDesc: 'أجب بصدق لتقييم مستوى تفعيل طاقاتك',
      submitQuiz: 'أرسل التقييم',
      resetQuiz: 'إعادة التقييم',
      aboutTitle: '📖 عن الكتاب',
      bookInfoTitle: 'معلومات الكتاب',
      bookName: 'الكتاب:',
      bookNameVal: 'الإسلام والطاقات المعطلة',
      authorLabel: 'المؤلف:',
      authorVal: 'الشيخ محمد الغزالي (1917-1996)',
      chaptersLabel: 'الفصول:',
      structureLabel: 'الهيكل:',
      structureVal: 'تشخيص → تحليل → رؤية',
      authorBioTitle: 'عن المؤلف',
      authorBio: 'الشيخ محمد الغزالي (1917-1996) مفكر إسلامي مصري بارز. ألف أكثر من 60 كتابا في الفكر الإسلامي. عُرف بمنهجه الوسطي الجامع بين الأصالة والتجديد. دافع عن حقوق المرأة والعقل والاجتهاد.',
      disclaimerTitle: 'إخلاء مسؤولية',
      disclaimerText: 'لست عالما. هذا جهد متواضع من أم مسلمة. المحتوى مستمد من الكتاب ومصادر إسلامية موثوقة. ليس فتوى.',
      sourcesTitle: 'المصادر',
      source1: 'الإسلام والطاقات المعطلة - محمد الغزالي',
      source2: 'القرآن الكريم',
      source3: 'السنة النبوية الشريفة',
      tabHome: 'الرئيسية',
      tabCauses: 'الأسباب',
      tabEnergies: 'الطاقات',
      tabScenarios: 'سيناريو',
      tabSolutions: 'العلاج',
      tabAssess: 'تقييم',
      tabAbout: 'الكتاب',
      helpTitle: 'مساعدة',
      helpDisclaimer: 'إخلاء مسؤولية',
      helpDisclaimerText: 'لست عالما. هذا جهد متواضع من أم مسلمة. المحتوى من الكتاب ومصادر إسلامية موثوقة. ليس فتوى.',
      helpSources: 'المصادر',
      helpSourcesText: 'الإسلام والطاقات المعطلة - الشيخ محمد الغزالي | القرآن الكريم | السنة النبوية',
      helpContrib: 'المساهمة',
      helpContribText: 'هذا مشروع مفتوح. يمكنك المساهمة عبر workshop-diy.org',
      resultExcellent: 'ممتاز! طاقاتك مفعلة بشكل كبير. استمر وشارك هذا مع غيرك.',
      resultGood: 'جيد! لديك قاعدة قوية. ركز على المجالات التي لم تفعلها بعد.',
      resultAverage: 'متوسط. هناك مجال كبير للتحسين. ابدأ بخطوة واحدة يوميا.',
      resultLow: 'طاقاتك بحاجة لإيقاظ. لا تيأس! ابدأ بقراءة الأسباب والحلول في هذا التطبيق.',
      scoreLabel: 'من',
      toastDua: 'اللهم أيقظ طاقاتنا لخدمة دينك وأمتك',
      toastQuizSaved: 'تم حفظ تقييمك',
      toastQuizReset: 'تم إعادة التقييم',
      toastShare: 'تم النسخ!',
      toastChallenge: 'بارك الله فيك! أكملت تحدي اليوم',
      progressLabel: 'تقدمك',
      challengeTitle: 'تحدي اليوم',
      challengeDone: '✓ أنجزت',
      challengeCompleted: '✓ مكتمل',
      searchPlaceholder: 'ابحث في الطاقات...',
      cause1Title: 'القراءة السلبية للنصوص الدينية',
      cause2Title: 'الاستبداد السياسي',
      cause3Title: 'الجهل وسوء الثقافة الفكرية',
      cause4Title: 'النفور من الأحكام الإسلامية',
      wasteLabel: 'التعطيل',
      evidenceLabel: 'الشواهد',
      activationLabel: 'التفعيل',
      domain1Title: 'القرآن الكريم',
      domain2Title: 'السنة النبوية',
      domain3Title: 'الفقه الإسلامي',
      domain4Title: 'العقيدة',
      domain5Title: 'العلم والمعرفة',
      domain6Title: 'المرأة',
      sol1Title: 'البعد السياسي',
      sol2Title: 'البعد الاقتصادي',
      sol3Title: 'البعد التعليمي',
      sol4Title: 'البعد الاجتماعي',
      sol5Title: 'البعد الدفاعي',
    },
    en: {
      appTitle: 'Awaken Your Energy',
      ayahTranslation: '"God does not change a people\'s condition until they change what is in themselves"',
      homeTitle: 'Energy Dashboard',
      meterLow: 'Wasted',
      meterHigh: 'Activated',
      meterStart: 'Take the assessment to measure your energy',
      dailyTip: 'Today\'s Activation Tip',
      introTitle: 'About This App',
      introText: 'An interactive summary of "Islam & Wasted Energies" by Sheikh Mohammed al-Ghazali. It diagnoses why the Ummah declined and proposes practical solutions to awaken dormant energies.',
      sufiTitle: 'Notable Insight: Critique of Excessive Sufism',
      sufiText: 'Al-Ghazali argues that Sufism correctly diagnosed greed but overdosed on asceticism. Like treating a miser by making them waste everything. They cured pride but destroyed ambition and self-respect.',
      sufiAnalogy: 'Correct diagnosis + overdose = new harm',
      causesTitle: '⚡ The 4 Root Causes of Decline',
      causesDesc: 'Al-Ghazali identifies four root causes behind the Ummah\'s decline despite possessing divine revelation',
      energiesTitle: '🔋 The 6 Wasted Energies',
      energiesDesc: 'Six major domains where the Ummah\'s energy has been wasted',
      solutionsTitle: '💊 The Cure: Five Dimensions',
      solutionsDesc: 'Practical solutions proposed by al-Ghazali to awaken the Ummah',
      scenariosTitle: '🎮 Interactive Scenarios',
      scenariosDesc: 'Choose the correct response for each situation',
      assessTitle: '🤔 How Activated Are Your Energies?',
      assessDesc: 'Answer honestly to assess your energy activation level',
      submitQuiz: 'Submit Assessment',
      resetQuiz: 'Reset Assessment',
      aboutTitle: '📖 About the Book',
      bookInfoTitle: 'Book Information',
      bookName: 'Book:',
      bookNameVal: 'Islam & Wasted Energies',
      authorLabel: 'Author:',
      authorVal: 'Sheikh Mohammed al-Ghazali (1917-1996)',
      chaptersLabel: 'Chapters:',
      structureLabel: 'Structure:',
      structureVal: 'Diagnosis → Analysis → Vision',
      authorBioTitle: 'About the Author',
      authorBio: 'Sheikh Mohammed al-Ghazali (1917-1996) was a prominent Egyptian Islamic thinker. He authored over 60 books on Islamic thought. Known for his balanced approach combining authenticity with renewal. He championed women\'s rights, reason, and ijtihad.',
      disclaimerTitle: 'Disclaimer',
      disclaimerText: 'I am not a scholar. This is a humble effort by a Muslim parent. Content from the book and trusted Islamic sources. Not a fatwa.',
      sourcesTitle: 'Sources',
      source1: 'Islam & Wasted Energies - Mohammed al-Ghazali',
      source2: 'The Holy Quran',
      source3: 'The Prophetic Sunnah',
      tabHome: 'Home',
      tabCauses: 'Causes',
      tabEnergies: 'Energies',
      tabScenarios: 'Scenarios',
      tabSolutions: 'Cure',
      tabAssess: 'Assess',
      tabAbout: 'Book',
      helpTitle: 'Help',
      helpDisclaimer: 'Disclaimer',
      helpDisclaimerText: 'I am not a scholar. This is a humble effort by a Muslim parent. Content from the book and trusted Islamic sources. Not a fatwa.',
      helpSources: 'Sources',
      helpSourcesText: 'Islam & Wasted Energies - Sheikh Mohammed al-Ghazali | The Holy Quran | Prophetic Sunnah',
      helpContrib: 'Contributing',
      helpContribText: 'This is an open project. You can contribute via workshop-diy.org',
      resultExcellent: 'Excellent! Your energies are highly activated. Keep going and share this with others.',
      resultGood: 'Good! You have a strong foundation. Focus on areas you haven\'t activated yet.',
      resultAverage: 'Average. There is significant room for improvement. Start with one step daily.',
      resultLow: 'Your energies need awakening. Don\'t despair! Start by reading the causes and solutions in this app.',
      scoreLabel: 'out of',
      toastDua: 'O Allah, awaken our energies to serve Your religion and Ummah',
      toastQuizSaved: 'Your assessment has been saved',
      toastQuizReset: 'Assessment has been reset',
      toastShare: 'Copied!',
      toastChallenge: 'Well done! You completed today\'s challenge',
      progressLabel: 'Progress',
      challengeTitle: 'Today\'s Challenge',
      challengeDone: '✓ Done',
      challengeCompleted: '✓ Completed',
      searchPlaceholder: 'Search energies...',
      cause1Title: 'Passive Reading of Religious Texts',
      cause2Title: 'Political Despotism',
      cause3Title: 'Ignorance & Bad Intellectual Culture',
      cause4Title: 'Aversion to Islamic Rulings',
      wasteLabel: 'The Waste',
      evidenceLabel: 'Evidence',
      activationLabel: 'Activation',
      domain1Title: 'The Quran',
      domain2Title: 'The Sunnah',
      domain3Title: 'Islamic Jurisprudence (Fiqh)',
      domain4Title: 'Creed (Aqeedah)',
      domain5Title: 'Science & Knowledge',
      domain6Title: 'Women',
      sol1Title: 'Political Dimension',
      sol2Title: 'Economic Dimension',
      sol3Title: 'Educational Dimension',
      sol4Title: 'Social Dimension',
      sol5Title: 'Defense Dimension',
    },
    fr: {
      appTitle: 'Eveille ton Energie',
      ayahTranslation: '"Dieu ne change pas la condition d\'un peuple tant qu\'il ne change pas ce qui est en lui-meme"',
      homeTitle: 'Tableau de l\'Energie',
      meterLow: 'Gaspillee',
      meterHigh: 'Activee',
      meterStart: 'Faites l\'evaluation pour mesurer votre energie',
      dailyTip: 'Conseil d\'Activation du Jour',
      introTitle: 'A propos de cette App',
      introText: 'Un resume interactif du livre "L\'Islam et les Energies Gaspillees" de Cheikh Mohammed al-Ghazali. Il diagnostique les causes du declin de la Oumma et propose des solutions pratiques pour reveiller les energies dormantes.',
      sufiTitle: 'Vision Marquante: Critique du Soufisme Excessif',
      sufiText: 'Al-Ghazali soutient que le soufisme a correctement diagnostique l\'avidite mais a surdose l\'ascetisme. Comme traiter un avare en le faisant tout gaspiller. Ils ont gueri l\'orgueil mais detruit l\'ambition et le respect de soi.',
      sufiAnalogy: 'Diagnostic correct + surdose = nouveau tort',
      causesTitle: '⚡ Les 4 Causes du Declin',
      causesDesc: 'Al-Ghazali identifie quatre causes profondes du declin de la Oumma malgre la revelation divine',
      energiesTitle: '🔋 Les 6 Energies Gaspillees',
      energiesDesc: 'Six domaines majeurs ou l\'energie de la Oumma a ete gaspillee',
      solutionsTitle: '💊 Le Remede: Cinq Dimensions',
      solutionsDesc: 'Les solutions pratiques proposees par al-Ghazali pour reveiller la Oumma',
      scenariosTitle: '🎮 Scenarios Interactifs',
      scenariosDesc: 'Choisissez la bonne reponse pour chaque situation',
      assessTitle: '🤔 Vos Energies sont-elles Activees?',
      assessDesc: 'Repondez honnetement pour evaluer votre niveau d\'activation',
      submitQuiz: 'Soumettre l\'Evaluation',
      resetQuiz: 'Reinitialiser',
      aboutTitle: '📖 A propos du Livre',
      bookInfoTitle: 'Informations sur le Livre',
      bookName: 'Livre:',
      bookNameVal: 'L\'Islam et les Energies Gaspillees',
      authorLabel: 'Auteur:',
      authorVal: 'Cheikh Mohammed al-Ghazali (1917-1996)',
      chaptersLabel: 'Chapitres:',
      structureLabel: 'Structure:',
      structureVal: 'Diagnostic → Analyse → Vision',
      authorBioTitle: 'A propos de l\'Auteur',
      authorBio: 'Cheikh Mohammed al-Ghazali (1917-1996) etait un penseur islamique egyptien eminent. Il a ecrit plus de 60 livres sur la pensee islamique. Connu pour son approche equilibree alliant authenticite et renouveau. Il a defendu les droits des femmes, la raison et l\'ijtihad.',
      disclaimerTitle: 'Avertissement',
      disclaimerText: 'Je ne suis pas un savant. C\'est un humble effort d\'un parent musulman. Contenu du livre et de sources islamiques fiables. Ce n\'est pas une fatwa.',
      sourcesTitle: 'Sources',
      source1: 'L\'Islam et les Energies Gaspillees - Mohammed al-Ghazali',
      source2: 'Le Saint Coran',
      source3: 'La Sunna Prophetique',
      tabHome: 'Accueil',
      tabCauses: 'Causes',
      tabEnergies: 'Energies',
      tabScenarios: 'Scenarios',
      tabSolutions: 'Remede',
      tabAssess: 'Evaluer',
      tabAbout: 'Livre',
      helpTitle: 'Aide',
      helpDisclaimer: 'Avertissement',
      helpDisclaimerText: 'Je ne suis pas un savant. C\'est un humble effort d\'un parent musulman. Contenu du livre et de sources islamiques fiables. Ce n\'est pas une fatwa.',
      helpSources: 'Sources',
      helpSourcesText: 'L\'Islam et les Energies Gaspillees - Cheikh Mohammed al-Ghazali | Le Saint Coran | La Sunna Prophetique',
      helpContrib: 'Contribuer',
      helpContribText: 'C\'est un projet ouvert. Vous pouvez contribuer via workshop-diy.org',
      resultExcellent: 'Excellent! Vos energies sont hautement activees. Continuez et partagez ceci.',
      resultGood: 'Bien! Vous avez une base solide. Concentrez-vous sur les domaines non encore actives.',
      resultAverage: 'Moyen. Il y a beaucoup de marge d\'amelioration. Commencez par un pas quotidien.',
      resultLow: 'Vos energies ont besoin d\'eveil. Ne desesperez pas! Commencez par lire les causes et solutions.',
      scoreLabel: 'sur',
      toastDua: 'O Allah, eveille nos energies pour servir Ta religion et Ta Oumma',
      toastQuizSaved: 'Votre evaluation a ete enregistree',
      toastQuizReset: 'L\'evaluation a ete reinitialisee',
      toastShare: 'Copie!',
      toastChallenge: 'Bravo! Vous avez complete le defi du jour',
      progressLabel: 'Progres',
      challengeTitle: 'Defi du Jour',
      challengeDone: '✓ Fait',
      challengeCompleted: '✓ Complete',
      searchPlaceholder: 'Chercher dans les energies...',
      cause1Title: 'Lecture Passive des Textes Religieux',
      cause2Title: 'Le Despotisme Politique',
      cause3Title: 'L\'Ignorance et la Mauvaise Culture Intellectuelle',
      cause4Title: 'L\'Aversion envers les Regles Islamiques',
      wasteLabel: 'Le Gaspillage',
      evidenceLabel: 'Preuves',
      activationLabel: 'Activation',
      domain1Title: 'Le Coran',
      domain2Title: 'La Sunna',
      domain3Title: 'La Jurisprudence Islamique (Fiqh)',
      domain4Title: 'La Croyance (Aqida)',
      domain5Title: 'La Science et le Savoir',
      domain6Title: 'La Femme',
      sol1Title: 'Dimension Politique',
      sol2Title: 'Dimension Economique',
      sol3Title: 'Dimension Educative',
      sol4Title: 'Dimension Sociale',
      sol5Title: 'Dimension Defensive',
    }
  };

  // ============ CONTENT DATA ============

  const CAUSES = {
    ar: [
      {
        icon: '📖', title: 'القراءة السلبية للنصوص الدينية',
        items: [
          'التعامل مع القرآن كطقوس تلاوة دون تدبر وفهم',
          'حفظ الأحاديث دون تطبيقها في الحياة اليومية',
          'الاكتفاء بالبركة الروحية دون استخراج الأحكام والمعاني',
          'تحويل العبادات إلى عادات شكلية فارغة من الروح',
          'إهمال مقاصد الشريعة والتمسك بالظاهر فقط',
          'تجاهل الآيات التي تحث على التفكر في الكون والطبيعة',
          'الانفصال بين العلم الشرعي والتطبيق الاجتماعي والسياسي'
        ]
      },
      {
        icon: '👑', title: 'الاستبداد السياسي',
        items: [
          'الحكم الفردي يقتل روح المبادرة والإبداع في الأمة',
          'تغييب الشورى أدى إلى سلبية المجتمعات الإسلامية',
          'الظلم السياسي يدمر الدافعية ويشل الطاقات الكامنة',
          'التوريث السياسي حرم الأمة من الكفاءات القيادية',
          'تحالف السلطة مع الجهل لإبقاء الشعوب في التبعية',
          'تخويف العلماء وإسكات أصوات الإصلاح والنقد البناء',
          'استخدام الدين أداةً لتبرير الظلم وتثبيت الحكم الاستبدادي'
        ]
      },
      {
        icon: '🧠', title: 'الجهل وسوء الثقافة الفكرية',
        items: [
          'انتشار الخرافات والشعوذة بدلا من التفكير العلمي',
          'تقديس الموروث الثقافي على حساب الاجتهاد والتجديد',
          'الخلط بين العادات والتقاليد وبين الأحكام الشرعية',
          'تراجع المنهج النقدي وقبول كل ما يُروى دون تمحيص',
          'العزوف عن القراءة والبحث العلمي المنهجي',
          'الاكتفاء بالشهادات الجامعية دون تحصيل معرفة حقيقية',
          'ضعف اللغات الأجنبية مما يعزل الأمة عن المعرفة العالمية'
        ]
      },
      {
        icon: '⚖️', title: 'النفور من الأحكام الإسلامية',
        items: [
          'التخلي عن الشريعة كمرجعية في التشريع والحكم',
          'تبني قوانين وضعية دون دراسة البدائل الإسلامية',
          'الشعور بالنقص أمام الحضارة الغربية ومحاولة تقليدها',
          'إهمال نظام الزكاة والوقف كأدوات للعدالة الاجتماعية',
          'رفض تطبيق مبادئ العدل الإسلامي في الاقتصاد والسياسة',
          'تشويه صورة الأحكام الإسلامية في الإعلام والمناهج الدراسية',
          'الفشل في تقديم الإسلام بلغة معاصرة تخاطب الأجيال الجديدة'
        ]
      }
    ],
    en: [
      {
        icon: '📖', title: 'Passive Reading of Religious Texts',
        items: [
          'Treating the Quran as a recitation ritual without reflection or understanding',
          'Memorizing hadiths without applying them in daily life',
          'Settling for spiritual blessing without extracting rulings and meanings',
          'Turning worship into empty rituals devoid of spiritual substance',
          'Neglecting the objectives of Sharia while clinging only to appearances',
          'Ignoring verses that urge reflection on the universe and nature',
          'Disconnecting religious knowledge from social and political application'
        ]
      },
      {
        icon: '👑', title: 'Political Despotism',
        items: [
          'Autocratic rule killing the spirit of initiative and creativity in the Ummah',
          'Abolishing shura (consultation) leading to the passivity of Muslim societies',
          'Political injustice destroying motivation and paralyzing latent energies',
          'Hereditary politics depriving the Ummah of qualified leadership',
          'Alliance of power with ignorance to keep populations dependent',
          'Intimidating scholars and silencing voices of reform and constructive criticism',
          'Using religion as a tool to justify oppression and entrench authoritarian rule'
        ]
      },
      {
        icon: '🧠', title: 'Ignorance & Bad Intellectual Culture',
        items: [
          'Spread of superstition and sorcery instead of scientific thinking',
          'Sanctifying cultural heritage at the expense of ijtihad and renewal',
          'Confusing customs and traditions with actual Islamic rulings',
          'Decline of critical methodology and accepting all narratives uncritically',
          'Aversion to reading and systematic scientific research',
          'Settling for university degrees without acquiring genuine knowledge',
          'Weak foreign language skills isolating the Ummah from global knowledge'
        ]
      },
      {
        icon: '⚖️', title: 'Aversion to Islamic Rulings',
        items: [
          'Abandoning Sharia as a reference in legislation and governance',
          'Adopting foreign laws without studying Islamic alternatives',
          'Feeling inferior to Western civilization and attempting to imitate it',
          'Neglecting zakat and waqf systems as tools for social justice',
          'Refusing to apply Islamic principles of justice in economy and politics',
          'Distorting the image of Islamic rulings in media and curricula',
          'Failing to present Islam in a contemporary language that addresses new generations'
        ]
      }
    ],
    fr: [
      {
        icon: '📖', title: 'Lecture Passive des Textes Religieux',
        items: [
          'Traiter le Coran comme un rituel de recitation sans reflexion ni comprehension',
          'Memoriser les hadiths sans les appliquer dans la vie quotidienne',
          'Se contenter de la benediction spirituelle sans en extraire les regles et les sens',
          'Transformer les actes d\'adoration en rituels vides de substance spirituelle',
          'Negliger les objectifs de la Charia en s\'accrochant seulement aux apparences',
          'Ignorer les versets qui incitent a la reflexion sur l\'univers et la nature',
          'Deconnecter le savoir religieux de l\'application sociale et politique'
        ]
      },
      {
        icon: '👑', title: 'Le Despotisme Politique',
        items: [
          'Le pouvoir autocratique tue l\'esprit d\'initiative et de creativite dans la Oumma',
          'L\'abolition de la choura mene a la passivite des societes musulmanes',
          'L\'injustice politique detruit la motivation et paralyse les energies latentes',
          'La politique hereditaire prive la Oumma de dirigeants competents',
          'L\'alliance du pouvoir et de l\'ignorance maintient les peuples dans la dependance',
          'Intimider les savants et faire taire les voix de reforme et de critique constructive',
          'Utiliser la religion comme outil pour justifier l\'oppression et ancrer le pouvoir autoritaire'
        ]
      },
      {
        icon: '🧠', title: 'L\'Ignorance et la Mauvaise Culture Intellectuelle',
        items: [
          'Propagation de la superstition et de la sorcellerie au lieu de la pensee scientifique',
          'Sacraliser l\'heritage culturel aux depens de l\'ijtihad et du renouveau',
          'Confondre coutumes et traditions avec les regles islamiques reelles',
          'Declin de la methodologie critique et acceptation de tout recit sans examen',
          'Aversion pour la lecture et la recherche scientifique systematique',
          'Se contenter de diplomes universitaires sans acquerir de veritable savoir',
          'Faibles competences en langues etrangeres isolant la Oumma du savoir mondial'
        ]
      },
      {
        icon: '⚖️', title: 'L\'Aversion envers les Regles Islamiques',
        items: [
          'Abandonner la Charia comme reference en legislation et gouvernance',
          'Adopter des lois etrangeres sans etudier les alternatives islamiques',
          'Se sentir inferieur a la civilisation occidentale et tenter de l\'imiter',
          'Negliger les systemes de zakat et waqf comme outils de justice sociale',
          'Refuser d\'appliquer les principes islamiques de justice en economie et politique',
          'Deformer l\'image des regles islamiques dans les medias et les programmes scolaires',
          'Echouer a presenter l\'Islam dans un langage contemporain qui parle aux nouvelles generations'
        ]
      }
    ]
  };

  const ENERGIES = {
    ar: [
      {
        icon: '📕', title: 'القرآن الكريم',
        waste: ['تحويل القرآن إلى مجرد تلاوة احتفالية دون تطبيق', 'إهمال تدبر الآيات واستخراج الدروس العملية', 'الاعتقاد أن التبرك بالقرآن يكفي دون فهم مقاصده', 'حصر القرآن في المناسبات الدينية دون جعله مرجعا يوميا', 'تجاهل الآيات الكونية والعلمية في القرآن'],
        evidence: ['التفاوت الكبير بين عدد الحفاظ وقلة المطبقين', 'ضعف تأثير القرآن في السياسات والقوانين المعاصرة', 'الفجوة بين التلاوة والسلوك في المجتمعات المسلمة', 'ندرة المؤسسات التي تربط القرآن بالعلوم الحديثة', 'انحسار تأثير القرآن في الأدب والفن والإبداع المعاصر'],
        activation: ['تحويل القرآن من كتاب تلاوة إلى منهج حياة شامل', 'ربط الآيات بالواقع المعاصر والتحديات الحالية', 'إنشاء حلقات تدبر تركز على الفهم والتطبيق', 'تطوير تطبيقات ذكية للتدبر القرآني الموضوعي', 'إنشاء مراكز بحثية قرآنية متعددة التخصصات']
      },
      {
        icon: '📗', title: 'السنة النبوية',
        waste: ['رواية الأحاديث بمعزل عن سياقها ومقاصدها', 'التركيز على الإسناد فقط دون فهم المتن والتطبيق', 'استخدام الأحاديث لتبرير الجمود لا للتجديد', 'انتشار الأحاديث الضعيفة والموضوعة بين العوام', 'اختزال السنة في المظاهر دون الجوهر'],
        evidence: ['كثرة المحدثين وقلة من يحولون الحديث إلى مشروع عمل', 'الخلاف على الأحاديث بدل التعاون على تطبيقها', 'انفصال علم الحديث عن العلوم الإنسانية والطبيعية', 'غياب مناهج معاصرة لتدريس السيرة النبوية كنموذج قيادي', 'ضعف الترجمات الحديثية الموثوقة للغات العالمية'],
        activation: ['دراسة السنة كمنهج متكامل لا أحاديث منفصلة', 'ربط السيرة النبوية بعلوم الإدارة والقيادة المعاصرة', 'تطبيق المبادئ النبوية في ريادة الأعمال والابتكار', 'إنشاء موسوعات حديثية رقمية بلغات متعددة', 'تطوير برامج تدريبية مبنية على المنهج النبوي']
      },
      {
        icon: '📘', title: 'الفقه الإسلامي',
        waste: ['التعصب المذهبي الذي مزق وحدة الأمة الفقهية', 'إغلاق باب الاجتهاد منذ قرون', 'التقليد الأعمى دون مراعاة تغير الزمان والمكان', 'تحويل الفقه إلى قوالب جامدة بعيدة عن روح الشريعة', 'إهمال فقه الأولويات والموازنات'],
        evidence: ['عجز الفقه التقليدي عن مواكبة المستجدات المعاصرة', 'الفتاوى المتناقضة التي تربك المسلم العادي', 'غياب مجامع فقهية فعالة تجمع بين المذاهب', 'ضعف التأصيل الفقهي للمعاملات المالية الحديثة', 'انعدام الحوار البناء بين المدارس الفقهية المختلفة'],
        activation: ['فتح باب الاجتهاد المنضبط بالأصول', 'إنشاء مراكز بحثية تجمع بين الفقه والواقع المعاصر', 'تشجيع الحوار بين المذاهب للوصول إلى حلول مشتركة', 'تطوير فقه المعاملات المالية والتقنية المعاصرة', 'تأسيس مجالس فقهية شبابية تواكب العصر']
      },
      {
        icon: '🕌', title: 'العقيدة',
        waste: ['تحويل العقيدة إلى جدال فلسفي مجرد بعيد عن الحياة', 'الانشغال بالخلافات الكلامية عن البناء الروحي', 'جعل التوحيد نظرية ذهنية بدلا من قوة دافعة للعمل', 'تجفيف الجانب الروحاني وتحويل الدين إلى شكليات', 'استخدام العقيدة للتفرقة بين المسلمين بدل توحيدهم'],
        evidence: ['ضعف تأثير العقيدة في سلوك المسلمين اليومي', 'تحول دروس التوحيد إلى مادة جافة في المدارس', 'انفصال الإيمان النظري عن الالتزام العملي', 'ازدياد ظاهرة الإلحاد بين الشباب المسلم', 'ضعف الوازع الديني رغم المظاهر الدينية الكثيرة'],
        activation: ['ربط التوحيد بالتحرر من كل عبودية لغير الله', 'تحويل العقيدة إلى وقود للعمل والإنجاز', 'جعل الإيمان محركا للإبداع والتميز في كل مجال', 'بناء برامج روحية معاصرة تجمع بين العمق والبساطة', 'تقديم العقيدة بأسلوب عقلاني يخاطب الشباب']
      },
      {
        icon: '🔬', title: 'العلم والمعرفة',
        waste: ['التخلي عن البحث العلمي رغم الأمر القرآني بالتفكر', 'الفصل بين العلم الشرعي والعلم التجريبي', 'ترك الريادة العلمية التي كانت سمة الحضارة الإسلامية', 'تهميش العلماء والباحثين في المجتمعات الإسلامية', 'هجرة العقول المسلمة إلى الغرب بحثا عن بيئة بحثية'],
        evidence: ['تراجع ترتيب الجامعات الإسلامية عالميا', 'ضعف الإنفاق على البحث العلمي في الدول الإسلامية', 'اعتماد كلي على التكنولوجيا المستوردة دون تطوير محلي', 'غياب جوائز علمية إسلامية مرموقة تحفز الابتكار', 'انخفاض عدد براءات الاختراع من العالم الإسلامي'],
        activation: ['إعادة دمج العلوم الطبيعية مع العلوم الشرعية', 'تخصيص ميزانيات كبيرة للبحث والتطوير', 'تشجيع الابتكار وربط البحث العلمي بحاجات المجتمع', 'إنشاء صناديق استثمارية للمشاريع العلمية الإسلامية', 'بناء شبكات تواصل بين العلماء المسلمين حول العالم']
      },
      {
        icon: '👩', title: 'المرأة',
        waste: ['تهميش المرأة رغم تحرير الإسلام لها أصلا', 'خلط العادات القبلية بالأحكام الشرعية لتقييد المرأة', 'حرمان نصف المجتمع من المشاركة الفعالة في البناء', 'تجاهل النماذج النسائية المشرقة في التاريخ الإسلامي', 'استخدام نصوص دينية مجتزأة لتبرير التمييز ضد المرأة'],
        evidence: ['تدني نسبة مشاركة المرأة في القوى العاملة بالدول الإسلامية', 'قوانين تمييزية ليس لها أصل في الشريعة', 'فجوة تعليمية بين الجنسين في كثير من المجتمعات المسلمة', 'ضعف تمثيل المرأة في مراكز صنع القرار', 'ارتفاع معدلات الأمية بين النساء في بعض المجتمعات المسلمة'],
        activation: ['العودة للنموذج النبوي في تمكين المرأة', 'إزالة القيود العرفية المتناقضة مع الشريعة', 'تشجيع تعليم المرأة ومشاركتها في جميع المجالات', 'تأهيل المرأة للقيادة والمشاركة في صنع القرار', 'إنشاء مؤسسات بحثية متخصصة في دراسات المرأة الإسلامية']
      }
    ],
    en: [
      {
        icon: '📕', title: 'The Quran',
        waste: ['Reducing the Quran to ceremonial recitation without application', 'Neglecting deep reflection on verses and extracting practical lessons', 'Believing that seeking blessings from the Quran suffices without understanding its objectives', 'Confining the Quran to religious occasions without making it a daily reference', 'Ignoring the cosmic and scientific verses in the Quran'],
        evidence: ['Huge gap between the number of memorizers and those who apply', 'Weak influence of the Quran on contemporary policies and laws', 'Gap between recitation and behavior in Muslim societies', 'Scarcity of institutions connecting the Quran to modern sciences', 'Decline of Quranic influence on contemporary literature, art, and creativity'],
        activation: ['Transforming the Quran from a recitation book to a comprehensive life methodology', 'Connecting verses to contemporary reality and current challenges', 'Creating study circles focused on understanding and application', 'Developing smart apps for thematic Quranic reflection', 'Establishing multidisciplinary Quranic research centers']
      },
      {
        icon: '📗', title: 'The Sunnah',
        waste: ['Narrating hadiths in isolation from their context and objectives', 'Focusing only on chain of narration without understanding the text and application', 'Using hadiths to justify stagnation rather than renewal', 'Spread of weak and fabricated hadiths among common people', 'Reducing the Sunnah to appearances without substance'],
        evidence: ['Many hadith scholars but few who turn hadith into action plans', 'Disputes over hadiths instead of cooperation in applying them', 'Disconnection between hadith sciences and humanities/natural sciences', 'Lack of modern curricula teaching the Prophetic biography as a leadership model', 'Weak reliable hadith translations into world languages'],
        activation: ['Studying the Sunnah as an integrated methodology, not isolated hadiths', 'Connecting the Prophetic biography to modern management and leadership sciences', 'Applying Prophetic principles in entrepreneurship and innovation', 'Creating multilingual digital hadith encyclopedias', 'Developing training programs based on the Prophetic methodology']
      },
      {
        icon: '📘', title: 'Islamic Jurisprudence (Fiqh)',
        waste: ['Sectarian rigidity that tore apart the Ummah\'s jurisprudential unity', 'Closing the door of ijtihad (independent reasoning) for centuries', 'Blind imitation without considering changes in time and place', 'Turning fiqh into rigid frameworks disconnected from the spirit of Sharia', 'Neglecting the fiqh of priorities and balances'],
        evidence: ['Inability of traditional fiqh to keep up with modern developments', 'Contradictory fatwas that confuse ordinary Muslims', 'Absence of effective jurisprudential councils uniting all schools', 'Weak juristic foundation for modern financial transactions', 'Lack of constructive dialogue between different juristic schools'],
        activation: ['Opening the door to disciplined ijtihad grounded in principles', 'Establishing research centers combining fiqh with contemporary reality', 'Encouraging dialogue between schools to reach common solutions', 'Developing fiqh for modern financial and technological transactions', 'Creating youth juristic councils that keep pace with the times']
      },
      {
        icon: '🕌', title: 'Creed (Aqeedah)',
        waste: ['Turning creed into abstract philosophical debate disconnected from life', 'Preoccupation with theological disputes over spiritual building', 'Making tawhid a mental theory instead of a driving force for action', 'Drying up the spiritual dimension and turning religion into formalities', 'Using creed to divide Muslims instead of uniting them'],
        evidence: ['Weak influence of creed on Muslims\' daily behavior', 'Tawhid lessons becoming dry material in schools', 'Disconnection between theoretical faith and practical commitment', 'Increasing atheism among Muslim youth', 'Weak religious consciousness despite many religious appearances'],
        activation: ['Connecting tawhid to liberation from all servitude other than to God', 'Transforming creed into fuel for work and achievement', 'Making faith a driver of creativity and excellence in every field', 'Building contemporary spiritual programs combining depth and simplicity', 'Presenting creed in a rational style that addresses youth']
      },
      {
        icon: '🔬', title: 'Science & Knowledge',
        waste: ['Abandoning scientific research despite the Quranic mandate to reflect', 'Separating religious sciences from empirical sciences', 'Leaving behind the scientific leadership that characterized Islamic civilization', 'Marginalizing scientists and researchers in Muslim societies', 'Brain drain of Muslim minds to the West seeking research environments'],
        evidence: ['Declining global ranking of Islamic universities', 'Low spending on scientific research in Muslim-majority countries', 'Total dependence on imported technology without local development', 'Absence of prestigious Islamic scientific awards that incentivize innovation', 'Low number of patents from the Muslim world'],
        activation: ['Reintegrating natural sciences with religious sciences', 'Allocating major budgets for research and development', 'Encouraging innovation and linking scientific research to community needs', 'Creating investment funds for Islamic scientific projects', 'Building communication networks among Muslim scientists worldwide']
      },
      {
        icon: '👩', title: 'Women',
        waste: ['Marginalizing women despite Islam\'s original liberation of them', 'Mixing tribal customs with Sharia rulings to restrict women', 'Depriving half of society from effective participation in development', 'Ignoring the shining female role models in Islamic history', 'Using out-of-context religious texts to justify discrimination against women'],
        evidence: ['Low rates of women\'s workforce participation in Muslim-majority countries', 'Discriminatory laws with no basis in Sharia', 'Educational gap between genders in many Muslim societies', 'Weak representation of women in decision-making positions', 'High illiteracy rates among women in some Muslim societies'],
        activation: ['Returning to the Prophetic model of empowering women', 'Removing customary restrictions that contradict Sharia', 'Encouraging women\'s education and participation in all fields', 'Qualifying women for leadership and participation in decision-making', 'Establishing specialized research institutions for Islamic women\'s studies']
      }
    ],
    fr: [
      {
        icon: '📕', title: 'Le Coran',
        waste: ['Reduire le Coran a une recitation ceremonielle sans application', 'Negliger la reflexion profonde sur les versets et l\'extraction de lecons pratiques', 'Croire que la benediction du Coran suffit sans comprendre ses objectifs', 'Confiner le Coran aux occasions religieuses sans en faire une reference quotidienne', 'Ignorer les versets cosmiques et scientifiques du Coran'],
        evidence: ['Enorme ecart entre le nombre de memorisateurs et ceux qui appliquent', 'Faible influence du Coran sur les politiques et lois contemporaines', 'Fosse entre la recitation et le comportement dans les societes musulmanes', 'Rarete des institutions reliant le Coran aux sciences modernes', 'Declin de l\'influence coranique sur la litterature et l\'art contemporains'],
        activation: ['Transformer le Coran d\'un livre de recitation en une methodologie de vie complete', 'Relier les versets a la realite contemporaine et aux defis actuels', 'Creer des cercles d\'etude axes sur la comprehension et l\'application', 'Developper des applications intelligentes pour la reflexion coranique thematique', 'Etablir des centres de recherche coraniques multidisciplinaires']
      },
      {
        icon: '📗', title: 'La Sunna',
        waste: ['Raconter les hadiths isolement de leur contexte et objectifs', 'Se concentrer uniquement sur la chaine de narration sans comprendre le texte et l\'application', 'Utiliser les hadiths pour justifier la stagnation plutot que le renouveau', 'Propagation de hadiths faibles et fabriques parmi le commun des gens', 'Reduire la Sunna aux apparences sans la substance'],
        evidence: ['Beaucoup de specialistes du hadith mais peu qui le transforment en plan d\'action', 'Des disputes sur les hadiths au lieu de cooperer pour les appliquer', 'Deconnexion entre les sciences du hadith et les sciences humaines/naturelles', 'Manque de programmes modernes enseignant la biographie prophetique comme modele de leadership', 'Faibles traductions fiables des hadiths dans les langues du monde'],
        activation: ['Etudier la Sunna comme une methodologie integree, pas des hadiths isoles', 'Relier la biographie prophetique aux sciences modernes de gestion et leadership', 'Appliquer les principes prophetiques dans l\'entrepreneuriat et l\'innovation', 'Creer des encyclopedies numeriques de hadiths multilingues', 'Developper des programmes de formation bases sur la methodologie prophetique']
      },
      {
        icon: '📘', title: 'La Jurisprudence Islamique (Fiqh)',
        waste: ['La rigidite sectaire qui a dechire l\'unite juridique de la Oumma', 'La fermeture de la porte de l\'ijtihad depuis des siecles', 'L\'imitation aveugle sans tenir compte des changements de temps et de lieu', 'Transformer le fiqh en cadres rigides deconnectes de l\'esprit de la Charia', 'Negliger le fiqh des priorites et des equilibres'],
        evidence: ['Incapacite du fiqh traditionnel a suivre les developpements modernes', 'Des fatwas contradictoires qui deroutent les musulmans ordinaires', 'Absence de conseils juridiques efficaces unissant toutes les ecoles', 'Faible fondement juridique pour les transactions financieres modernes', 'Manque de dialogue constructif entre les differentes ecoles juridiques'],
        activation: ['Ouvrir la porte a un ijtihad discipline ancre dans les principes', 'Etablir des centres de recherche combinant fiqh et realite contemporaine', 'Encourager le dialogue entre les ecoles pour trouver des solutions communes', 'Developper le fiqh des transactions financieres et technologiques modernes', 'Creer des conseils juridiques de jeunes qui suivent le rythme de l\'epoque']
      },
      {
        icon: '🕌', title: 'La Croyance (Aqida)',
        waste: ['Transformer la croyance en debat philosophique abstrait deconnecte de la vie', 'La preoccupation avec les disputes theologiques au detriment de la construction spirituelle', 'Faire du tawhid une theorie mentale au lieu d\'une force motrice pour l\'action', 'Assecher la dimension spirituelle et transformer la religion en formalites', 'Utiliser la croyance pour diviser les musulmans au lieu de les unir'],
        evidence: ['Faible influence de la croyance sur le comportement quotidien des musulmans', 'Les lecons de tawhid devenant une matiere seche dans les ecoles', 'Deconnexion entre la foi theorique et l\'engagement pratique', 'Augmentation de l\'atheisme parmi la jeunesse musulmane', 'Faible conscience religieuse malgre les nombreuses apparences religieuses'],
        activation: ['Relier le tawhid a la liberation de toute servitude autre qu\'envers Dieu', 'Transformer la croyance en carburant pour le travail et la reussite', 'Faire de la foi un moteur de creativite et d\'excellence dans tous les domaines', 'Construire des programmes spirituels contemporains alliant profondeur et simplicite', 'Presenter la croyance dans un style rationnel qui parle aux jeunes']
      },
      {
        icon: '🔬', title: 'La Science et le Savoir',
        waste: ['Abandonner la recherche scientifique malgre l\'injonction coranique a la reflexion', 'Separer les sciences religieuses des sciences empiriques', 'Abandonner le leadership scientifique qui caracterisait la civilisation islamique', 'Marginaliser les scientifiques et chercheurs dans les societes musulmanes', 'Fuite des cerveaux musulmans vers l\'Occident a la recherche d\'environnements de recherche'],
        evidence: ['Classement mondial en baisse des universites islamiques', 'Faibles depenses en recherche scientifique dans les pays a majorite musulmane', 'Dependance totale a la technologie importee sans developpement local', 'Absence de prix scientifiques islamiques prestigieux qui encouragent l\'innovation', 'Faible nombre de brevets du monde musulman'],
        activation: ['Reintegrer les sciences naturelles avec les sciences religieuses', 'Allouer des budgets importants a la recherche et au developpement', 'Encourager l\'innovation et relier la recherche scientifique aux besoins de la communaute', 'Creer des fonds d\'investissement pour les projets scientifiques islamiques', 'Construire des reseaux de communication entre scientifiques musulmans dans le monde']
      },
      {
        icon: '👩', title: 'La Femme',
        waste: ['Marginaliser les femmes malgre la liberation originale de l\'Islam', 'Melanger les coutumes tribales avec les regles de la Charia pour restreindre les femmes', 'Priver la moitie de la societe d\'une participation effective au developpement', 'Ignorer les modeles feminins brillants de l\'histoire islamique', 'Utiliser des textes religieux hors contexte pour justifier la discrimination contre les femmes'],
        evidence: ['Faibles taux de participation des femmes au marche du travail dans les pays musulmans', 'Lois discriminatoires sans fondement dans la Charia', 'Ecart educatif entre les sexes dans de nombreuses societes musulmanes', 'Faible representation des femmes dans les postes de decision', 'Taux eleves d\'analphabetisme parmi les femmes dans certaines societes musulmanes'],
        activation: ['Revenir au modele prophetique d\'autonomisation des femmes', 'Supprimer les restrictions coutumieres qui contredisent la Charia', 'Encourager l\'education des femmes et leur participation dans tous les domaines', 'Qualifier les femmes pour le leadership et la participation a la prise de decision', 'Etablir des institutions de recherche specialisees dans les etudes feminines islamiques']
      }
    ]
  };

  const SOLUTIONS = {
    ar: [
      { icon: '🏛️', title: 'البعد السياسي', items: ['تطبيق مبدأ الشورى الحقيقية في الحكم والإدارة', 'بناء مؤسسات رقابية مستقلة تحاسب الحاكم', 'ضمان حرية التعبير والنقد البناء في المجتمع', 'تداول سلمي للسلطة قائم على الكفاءة لا الوراثة'] },
      { icon: '💰', title: 'البعد الاقتصادي', items: ['ضمان أجور عادلة تحفظ كرامة العامل وأسرته', 'تفعيل نظام الزكاة كأداة حقيقية لمكافحة الفقر', 'محاربة الاستغلال والاحتكار بالقوانين الإسلامية', 'تشجيع ريادة الأعمال والمشاريع الصغيرة المحلية'] },
      { icon: '🎓', title: 'البعد التعليمي', items: ['توحيد المناهج وإزالة الفصل بين الديني والمدني', 'دمج العلوم الشرعية مع العلوم التطبيقية والإنسانية', 'تطوير التفكير النقدي والبحث العلمي منذ الصغر', 'إنشاء جامعات بحثية إسلامية ذات مستوى عالمي'] },
      { icon: '🤝', title: 'البعد الاجتماعي', items: ['تعزيز ثقافة التعاون والعمل الجماعي المنظم', 'بناء الاعتماد على الذات بدلا من الاتكالية', 'تقوية الروابط الأسرية والمجتمعية بالقيم الإسلامية', 'محاربة الفردية المفرطة والأنانية الاجتماعية'] },
      { icon: '🛡️', title: 'البعد الدفاعي', items: ['بناء قدرات دفاعية تتوافق مع التوجيه القرآني للإعداد', 'تطوير صناعات دفاعية محلية تحقق الاستقلالية', 'الاستثمار في التكنولوجيا والأمن السيبراني', 'تدريب الشباب على المسؤولية والانضباط'] }
    ],
    en: [
      { icon: '🏛️', title: 'Political Dimension', items: ['Implementing genuine shura (consultation) in governance and administration', 'Building independent oversight institutions that hold rulers accountable', 'Ensuring freedom of expression and constructive criticism in society', 'Peaceful transfer of power based on competence, not heredity'] },
      { icon: '💰', title: 'Economic Dimension', items: ['Ensuring fair wages that preserve the dignity of workers and their families', 'Activating the zakat system as a real tool to combat poverty', 'Fighting exploitation and monopoly through Islamic economic laws', 'Encouraging entrepreneurship and local small businesses'] },
      { icon: '🎓', title: 'Educational Dimension', items: ['Unifying curricula and removing the divide between religious and secular education', 'Integrating religious sciences with applied and human sciences', 'Developing critical thinking and scientific research from an early age', 'Establishing world-class Islamic research universities'] },
      { icon: '🤝', title: 'Social Dimension', items: ['Strengthening the culture of organized cooperation and teamwork', 'Building self-reliance instead of dependency', 'Strengthening family and community bonds through Islamic values', 'Fighting excessive individualism and social selfishness'] },
      { icon: '🛡️', title: 'Defense Dimension', items: ['Building defense capabilities aligned with the Quranic directive for preparation', 'Developing local defense industries for self-sufficiency', 'Investing in technology and cybersecurity', 'Training youth in responsibility and discipline'] }
    ],
    fr: [
      { icon: '🏛️', title: 'Dimension Politique', items: ['Mettre en oeuvre une veritable choura (consultation) dans la gouvernance et l\'administration', 'Construire des institutions de controle independantes qui responsabilisent les dirigeants', 'Garantir la liberte d\'expression et la critique constructive dans la societe', 'Transfert pacifique du pouvoir base sur la competence, pas l\'heredite'] },
      { icon: '💰', title: 'Dimension Economique', items: ['Garantir des salaires equitables qui preservent la dignite des travailleurs et de leurs familles', 'Activer le systeme de la zakat comme veritable outil de lutte contre la pauvrete', 'Combattre l\'exploitation et le monopole par les lois economiques islamiques', 'Encourager l\'entrepreneuriat et les petites entreprises locales'] },
      { icon: '🎓', title: 'Dimension Educative', items: ['Unifier les programmes et supprimer le clivage entre enseignement religieux et seculier', 'Integrer les sciences religieuses aux sciences appliquees et humaines', 'Developper la pensee critique et la recherche scientifique des le jeune age', 'Creer des universites de recherche islamiques de niveau mondial'] },
      { icon: '🤝', title: 'Dimension Sociale', items: ['Renforcer la culture de la cooperation organisee et du travail d\'equipe', 'Construire l\'autonomie au lieu de la dependance', 'Renforcer les liens familiaux et communautaires par les valeurs islamiques', 'Combattre l\'individualisme excessif et l\'egoisme social'] },
      { icon: '🛡️', title: 'Dimension Defensive', items: ['Developper des capacites de defense conformes a la directive coranique de preparation', 'Developper des industries de defense locales pour l\'autosuffisance', 'Investir dans la technologie et la cybersecurite', 'Former les jeunes a la responsabilite et a la discipline'] }
    ]
  };

  // ============ SCENARIOS DATA ============
  const SCENARIOS = {
    ar: [
      { situation: 'مسلم يقرأ القرآن يوميا...', optionA: 'يردد الآيات بصوت جميل ويختم كل شهر، لكنه لا يتوقف عند المعاني ولا يغير سلوكا في حياته.', optionB: 'يقرأ صفحة واحدة يوميا لكنه يتدبر كل آية ويسأل: كيف أطبق هذا اليوم؟ ثم يعمل بما فهم.', correct: 'B', feedback: 'الاستجابة المفعّلة هي (ب). التدبر والتطبيق أهم من كثرة التلاوة بلا فهم. القرآن نزل ليُعمل به لا ليُتلى فقط.' },
      { situation: 'مجتمع يواجه ظلما واضحا...', optionA: 'الصمت والصبر بحجة أن هذا قدر الله ولا يجوز الاعتراض على ولي الأمر.', optionB: 'المواجهة السلمية بالحكمة والموعظة الحسنة، والمطالبة بالعدل كما أمر الإسلام.', correct: 'B', feedback: 'الاستجابة المفعّلة هي (ب). الإسلام يأمر بالأمر بالمعروف والنهي عن المنكر. الصمت على الظلم ليس صبرا بل تعطيل لطاقة الإصلاح.' },
      { situation: 'شاب مسلم يريد دراسة الفيزياء...', optionA: 'عائلته تقول له: ادرس الشريعة فقط، العلوم الطبيعية ليست إسلامية.', optionB: 'عائلته تشجعه وتذكره بأن القرآن يأمر بالنظر في خلق السماوات والأرض: "أفلا ينظرون إلى الإبل كيف خلقت".', correct: 'B', feedback: 'الاستجابة المفعّلة هي (ب). القرآن مليء بالآيات التي تحث على التفكر العلمي. الحضارة الإسلامية ازدهرت بفضل العلماء في كل المجالات.' },
      { situation: 'امرأة مسلمة تريد المساهمة في مجتمعها...', optionA: 'تُمنع من العمل والمشاركة بحجة أن مكانها البيت فقط ولا يجوز لها الخروج.', optionB: 'تُشجَّع على التعلم والعمل والمشاركة كما كانت نساء عصر النبوة يشاركن في كل مجالات الحياة.', correct: 'B', feedback: 'الاستجابة المفعّلة هي (ب). في عهد النبي، شاركت المرأة في التعليم والتجارة والطب وحتى المعارك. تهميش المرأة عادة قبلية لا حكم شرعي.' },
      { situation: 'خلاف فقهي بين مسلمين حول مسألة فرعية...', optionA: 'كل طرف يكفّر الآخر ويتهمه بالضلال ويقطع العلاقة معه.', optionB: 'حوار محترم مع الاعتراف بمشروعية الاختلاف الفقهي، والتركيز على المشتركات والتعاون على البر.', correct: 'B', feedback: 'الاستجابة المفعّلة هي (ب). اختلاف الفقهاء رحمة. الأئمة الأربعة كانوا يحترم بعضهم بعضا رغم اختلافهم. التعصب المذهبي من أخطر أسباب تعطيل طاقة الأمة.' }
    ],
    en: [
      { situation: 'A Muslim reads the Quran daily...', optionA: 'He recites beautifully and finishes the Quran every month, but never pauses to understand meanings or changes his behavior.', optionB: 'He reads one page daily but reflects deeply on each verse asking: how can I apply this today? Then acts on what he understood.', correct: 'B', feedback: 'The activated response is (B). Reflection and application matter more than abundant recitation without understanding. The Quran was revealed to be acted upon, not merely recited.' },
      { situation: 'A community faces clear injustice...', optionA: 'Silence and patience, arguing that this is God\'s decree and one must not oppose authority.', optionB: 'Peaceful confrontation with wisdom and good counsel, demanding justice as Islam commands.', correct: 'B', feedback: 'The activated response is (B). Islam commands enjoining good and forbidding evil. Silence in the face of oppression is not patience -- it is wasting the energy of reform.' },
      { situation: 'A young Muslim wants to study physics...', optionA: 'His family says: study only Islamic theology, natural sciences are not Islamic.', optionB: 'His family encourages him, reminding him that the Quran commands reflecting on the creation of the heavens and earth.', correct: 'B', feedback: 'The activated response is (B). The Quran is full of verses urging scientific reflection. Islamic civilization flourished thanks to scholars in every field.' },
      { situation: 'A Muslim woman wants to contribute to society...', optionA: 'She is prevented from working and participating, told her only place is at home.', optionB: 'She is encouraged to learn, work, and participate, just as women in the Prophet\'s era participated in all aspects of life.', correct: 'B', feedback: 'The activated response is (B). In the Prophet\'s time, women participated in education, commerce, medicine, and even battles. Marginalizing women is a tribal custom, not an Islamic ruling.' },
      { situation: 'A fiqh disagreement between Muslims on a secondary matter...', optionA: 'Each side declares the other misguided, accuses them of deviation, and cuts ties.', optionB: 'Respectful dialogue acknowledging the legitimacy of juristic differences, focusing on commonalities and cooperation.', correct: 'B', feedback: 'The activated response is (B). Scholarly disagreement is a mercy. The four great imams respected each other despite their differences. Sectarian rigidity is among the most dangerous causes of wasting the Ummah\'s energy.' }
    ],
    fr: [
      { situation: 'Un musulman lit le Coran quotidiennement...', optionA: 'Il recite magnifiquement et termine le Coran chaque mois, mais ne s\'arrete jamais pour comprendre les sens ni changer son comportement.', optionB: 'Il lit une page par jour mais reflechit profondement a chaque verset en se demandant: comment puis-je appliquer cela aujourd\'hui? Puis agit selon ce qu\'il a compris.', correct: 'B', feedback: 'La reponse activee est (B). La reflexion et l\'application comptent plus que la recitation abondante sans comprehension. Le Coran a ete revele pour etre mis en pratique.' },
      { situation: 'Une communaute fait face a une injustice claire...', optionA: 'Le silence et la patience, arguant que c\'est le decret de Dieu et qu\'on ne doit pas s\'opposer a l\'autorite.', optionB: 'La confrontation pacifique avec sagesse et bon conseil, exigeant la justice comme l\'Islam le commande.', correct: 'B', feedback: 'La reponse activee est (B). L\'Islam ordonne d\'enjoindre le bien et d\'interdire le mal. Le silence face a l\'oppression n\'est pas de la patience -- c\'est gaspiller l\'energie de la reforme.' },
      { situation: 'Un jeune musulman veut etudier la physique...', optionA: 'Sa famille dit: etudie seulement la theologie islamique, les sciences naturelles ne sont pas islamiques.', optionB: 'Sa famille l\'encourage, lui rappelant que le Coran commande de reflechir a la creation des cieux et de la terre.', correct: 'B', feedback: 'La reponse activee est (B). Le Coran est plein de versets incitant a la reflexion scientifique. La civilisation islamique a prospere grace aux savants dans tous les domaines.' },
      { situation: 'Une femme musulmane veut contribuer a la societe...', optionA: 'On l\'empeche de travailler et de participer, en disant que sa seule place est a la maison.', optionB: 'On l\'encourage a apprendre, travailler et participer, comme les femmes de l\'epoque du Prophete participaient a tous les aspects de la vie.', correct: 'B', feedback: 'La reponse activee est (B). A l\'epoque du Prophete, les femmes participaient a l\'education, au commerce, a la medecine et meme aux batailles. Marginaliser les femmes est une coutume tribale, pas une regle islamique.' },
      { situation: 'Un desaccord de fiqh entre musulmans sur une question secondaire...', optionA: 'Chaque partie declare l\'autre egaree, l\'accuse de deviation et coupe les liens.', optionB: 'Un dialogue respectueux reconnaissant la legitimite des differences juridiques, se concentrant sur les points communs et la cooperation.', correct: 'B', feedback: 'La reponse activee est (B). Le desaccord des savants est une misericorde. Les quatre grands imams se respectaient malgre leurs differences. La rigidite sectaire est parmi les causes les plus dangereuses du gaspillage de l\'energie de la Oumma.' }
    ]
  };

  // ============ QUIZ (15 items) ============
  const QUIZ_ITEMS = {
    ar: [
      'أقرأ القرآن بتدبر وأحاول تطبيق ما أقرأ في حياتي',
      'أتعلم من السنة النبوية وأطبق أخلاقها في تعاملاتي',
      'أفهم أن الإسلام يشجع العلم والبحث والاكتشاف',
      'أحترم الاختلاف الفقهي ولا أتعصب لمذهب واحد',
      'أؤمن بأن العقيدة قوة دافعة للعمل لا مجرد نظرية',
      'أدعم تعليم المرأة ومشاركتها في بناء المجتمع',
      'أمارس الشورى في حياتي الأسرية والمهنية',
      'أساهم في مشاريع خيرية أو مجتمعية بشكل منتظم',
      'أسعى لتطوير مهاراتي وتعلم علوم جديدة باستمرار',
      'أعتمد على نفسي وأبادر بدلا من انتظار الآخرين',
      'أدفع الزكاة وأحرص على حقوق الآخرين المالية',
      'أرفض الخرافات وأفكر بمنهجية علمية نقدية',
      'أربط بين إيماني وبين عملي المهني والاجتماعي',
      'أتحدث عن الظلم ولا أسكت عنه بحجة الصبر',
      'أسعى لفهم مقاصد الشريعة لا حفظ النصوص فقط'
    ],
    en: [
      'I read the Quran with reflection and try to apply what I read in my life',
      'I learn from the Prophetic Sunnah and apply its ethics in my dealings',
      'I understand that Islam encourages science, research, and discovery',
      'I respect juristic differences and do not fanatically follow one school',
      'I believe creed is a driving force for action, not just a theory',
      'I support women\'s education and their participation in building society',
      'I practice shura (consultation) in my family and professional life',
      'I contribute to charitable or community projects regularly',
      'I continuously strive to develop my skills and learn new sciences',
      'I rely on myself and take initiative rather than waiting for others',
      'I pay zakat and safeguard the financial rights of others',
      'I reject superstitions and think with a critical scientific methodology',
      'I connect my faith with my professional and social work',
      'I speak up against injustice and do not stay silent under the pretext of patience',
      'I strive to understand the objectives of Sharia, not just memorize texts'
    ],
    fr: [
      'Je lis le Coran avec reflexion et j\'essaie d\'appliquer ce que je lis dans ma vie',
      'J\'apprends de la Sunna prophetique et j\'applique son ethique dans mes relations',
      'Je comprends que l\'Islam encourage la science, la recherche et la decouverte',
      'Je respecte les differences juridiques et ne suis pas fanatique d\'une seule ecole',
      'Je crois que la croyance est une force motrice pour l\'action, pas juste une theorie',
      'Je soutiens l\'education des femmes et leur participation a la construction de la societe',
      'Je pratique la choura (consultation) dans ma vie familiale et professionnelle',
      'Je contribue regulierement a des projets caritatifs ou communautaires',
      'Je m\'efforce continuellement de developper mes competences et d\'apprendre de nouvelles sciences',
      'Je compte sur moi-meme et prends l\'initiative plutot que d\'attendre les autres',
      'Je paye la zakat et preserve les droits financiers des autres',
      'Je rejette les superstitions et pense avec une methodologie scientifique critique',
      'Je relie ma foi a mon travail professionnel et social',
      'Je m\'eleve contre l\'injustice et ne me tais pas sous pretexte de patience',
      'Je cherche a comprendre les objectifs de la Charia, pas seulement memoriser les textes'
    ]
  };

  // ============ DAILY TIPS (14) ============
  const DAILY_TIPS = {
    ar: [
      'اقرأ صفحة من القرآن اليوم واسأل نفسك: كيف أطبق هذا في حياتي؟',
      'تعلم مهارة جديدة اليوم. الإسلام يحث على طلب العلم من المهد إلى اللحد.',
      'مارس الشورى اليوم: استشر أهلك أو زملاءك في قرار مهم.',
      'ابحث عن خرافة شائعة في مجتمعك وتعلم الحكم الشرعي الصحيح.',
      'ادعم امرأة في محيطك لتتعلم أو تعمل أو تشارك في قرار.',
      'تبرع اليوم ولو بمبلغ بسيط. الزكاة والصدقة طاقة مالية مفعلة.',
      'اقرأ عن عالم مسلم قديم في الطب أو الفلك أو الرياضيات واستلهم منه.',
      'اكتب ثلاثة أشياء أنت ممتن لها اليوم واربطها بنعم الله عليك.',
      'ناقش موضوعا فكريا مع شخص يختلف معك بأدب واحترام.',
      'خصص 15 دقيقة لقراءة كتاب أو مقال علمي خارج تخصصك.',
      'ساعد جارك أو زميلك في أمر عملي اليوم. التعاون طاقة اجتماعية.',
      'تأمل في آية كونية: السماء، البحر، الجبال. التفكر عبادة.',
      'علّم طفلا شيئا جديدا اليوم. نقل المعرفة طاقة تعليمية مفعلة.',
      'راجع نيتك في عملك اليوم: هل تعمل لله ولخدمة الناس؟'
    ],
    en: [
      'Read a page of the Quran today and ask yourself: how can I apply this in my life?',
      'Learn a new skill today. Islam urges seeking knowledge from cradle to grave.',
      'Practice shura today: consult your family or colleagues on an important decision.',
      'Find a common superstition in your community and learn the correct Islamic ruling.',
      'Support a woman around you to learn, work, or participate in a decision.',
      'Donate today, even a small amount. Zakat and charity are activated financial energy.',
      'Read about an ancient Muslim scholar in medicine, astronomy, or mathematics and be inspired.',
      'Write three things you are grateful for today and connect them to God\'s blessings.',
      'Discuss an intellectual topic with someone who disagrees with you, politely and respectfully.',
      'Dedicate 15 minutes to reading a book or scientific article outside your specialty.',
      'Help your neighbor or colleague with a practical matter today. Cooperation is social energy.',
      'Contemplate a cosmic sign: the sky, the sea, the mountains. Reflection is worship.',
      'Teach a child something new today. Transferring knowledge is activated educational energy.',
      'Review your intention in your work today: are you working for God and to serve people?'
    ],
    fr: [
      'Lisez une page du Coran aujourd\'hui et demandez-vous: comment puis-je appliquer ceci dans ma vie?',
      'Apprenez une nouvelle competence aujourd\'hui. L\'Islam encourage la quete du savoir du berceau a la tombe.',
      'Pratiquez la choura aujourd\'hui: consultez votre famille ou vos collegues sur une decision importante.',
      'Trouvez une superstition courante dans votre communaute et apprenez le jugement islamique correct.',
      'Soutenez une femme autour de vous pour qu\'elle apprenne, travaille ou participe a une decision.',
      'Faites un don aujourd\'hui, meme petit. La zakat et la charite sont une energie financiere activee.',
      'Lisez sur un ancien savant musulman en medecine, astronomie ou mathematiques et inspirez-vous.',
      'Ecrivez trois choses pour lesquelles vous etes reconnaissant aujourd\'hui et reliez-les aux bienfaits de Dieu.',
      'Discutez d\'un sujet intellectuel avec quelqu\'un qui n\'est pas d\'accord avec vous, poliment et respectueusement.',
      'Consacrez 15 minutes a la lecture d\'un livre ou d\'un article scientifique en dehors de votre specialite.',
      'Aidez votre voisin ou collegue dans une affaire pratique aujourd\'hui. La cooperation est une energie sociale.',
      'Contemplez un signe cosmique: le ciel, la mer, les montagnes. La reflexion est une adoration.',
      'Enseignez quelque chose de nouveau a un enfant aujourd\'hui. Transmettre le savoir est une energie educative activee.',
      'Revoyez votre intention dans votre travail aujourd\'hui: travaillez-vous pour Dieu et pour servir les gens?'
    ]
  };

  // ============ DUAS (8) ============
  const DUAS = {
    ar: [
      'اللهم أيقظ طاقاتنا لخدمة دينك وأمتك',
      'رب اشرح لي صدري ويسر لي أمري',
      'اللهم علمنا ما ينفعنا وانفعنا بما علمتنا',
      'ربنا آتنا من لدنك رحمة وهيئ لنا من أمرنا رشدا',
      'اللهم اجعلنا مفاتيح للخير مغاليق للشر',
      'ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة',
      'اللهم ألهمنا رشدنا وقنا شر أنفسنا',
      'ربنا هب لنا من أزواجنا وذرياتنا قرة أعين واجعلنا للمتقين إماما'
    ],
    en: [
      'O Allah, awaken our energies to serve Your religion and Ummah',
      'My Lord, expand my chest and ease my task for me',
      'O Allah, teach us what benefits us and benefit us from what You teach us',
      'Our Lord, grant us mercy from Yourself and provide us right guidance',
      'O Allah, make us keys to goodness and locks against evil',
      'Our Lord, let not our hearts deviate after You have guided us and grant us mercy from Yourself',
      'O Allah, inspire us with right guidance and protect us from the evil of our own selves',
      'Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us leaders for the righteous'
    ],
    fr: [
      'O Allah, eveille nos energies pour servir Ta religion et Ta Oumma',
      'Mon Seigneur, ouvre-moi la poitrine et facilite ma tache',
      'O Allah, enseigne-nous ce qui nous profite et fais-nous profiter de ce que Tu nous enseignes',
      'Notre Seigneur, accorde-nous une misericorde de Ta part et guide-nous correctement',
      'O Allah, fais de nous des cles du bien et des verrous contre le mal',
      'Notre Seigneur, ne fais pas devier nos coeurs apres nous avoir guides et accorde-nous une misericorde de Ta part',
      'O Allah, inspire-nous la droiture et protege-nous du mal de nos propres ames',
      'Notre Seigneur, accorde-nous en nos epouses et nos enfants la joie des yeux et fais de nous un guide pour les pieux'
    ]
  };

  // ============ DAILY CHALLENGES ============
  const CHALLENGES = {
    ar: [
      'اقرأ آية واحدة اليوم وابحث عن تفسيرها واكتب كيف يمكنك تطبيقها في حياتك.',
      'تحدث مع شخص من مذهب فقهي مختلف واسأله عن رأيه في مسألة معينة باحترام.',
      'ابحث عن إنجاز علمي لعالم مسلم وشاركه مع صديق.',
      'ادعم امرأة في محيطك: شجعها على تعلم شيء جديد أو المشاركة في قرار.',
      'مارس الشورى: اسأل 3 أشخاص عن رأيهم قبل اتخاذ قرار اليوم.',
      'تبرع بمبلغ أو وقت لمشروع خيري. فعّل طاقتك المالية.',
      'اقرأ 10 صفحات من كتاب في غير تخصصك. وسّع معرفتك.'
    ],
    en: [
      'Read one verse today, research its tafsir, and write how you can apply it in your life.',
      'Talk to someone from a different fiqh school and respectfully ask their opinion on a topic.',
      'Find a scientific achievement by a Muslim scholar and share it with a friend.',
      'Support a woman in your circle: encourage her to learn something new or participate in a decision.',
      'Practice shura: ask 3 people for their opinion before making a decision today.',
      'Donate money or time to a charitable project. Activate your financial energy.',
      'Read 10 pages of a book outside your specialty. Broaden your knowledge.'
    ],
    fr: [
      'Lisez un verset aujourd\'hui, recherchez son tafsir et ecrivez comment vous pouvez l\'appliquer dans votre vie.',
      'Parlez a quelqu\'un d\'une ecole de fiqh differente et demandez respectueusement son avis sur un sujet.',
      'Trouvez une reussite scientifique d\'un savant musulman et partagez-la avec un ami.',
      'Soutenez une femme dans votre entourage: encouragez-la a apprendre quelque chose de nouveau ou a participer a une decision.',
      'Pratiquez la choura: demandez l\'avis de 3 personnes avant de prendre une decision aujourd\'hui.',
      'Faites un don d\'argent ou de temps a un projet caritatif. Activez votre energie financiere.',
      'Lisez 10 pages d\'un livre en dehors de votre specialite. Elargissez vos connaissances.'
    ]
  };

  // ============ DOM ELEMENTS ============
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ============ SOUND ENGINE (Web Audio API) ============
  function initAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* silent */ }
    }
  }

  function playTone(freq, duration, type) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration || 0.15));
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + (duration || 0.15));
    } catch (e) { /* silent */ }
  }

  function playClick() { playTone(800, 0.08, 'sine'); }
  function playExpand() { playTone(600, 0.12, 'triangle'); }
  function playTab() { playTone(1000, 0.1, 'sine'); }
  function playCheck() { playTone(1200, 0.1, 'sine'); }
  function playSuccess() {
    playTone(523, 0.15, 'sine');
    setTimeout(() => playTone(659, 0.15, 'sine'), 100);
    setTimeout(() => playTone(784, 0.2, 'sine'), 200);
  }
  function playWrong() { playTone(300, 0.2, 'sawtooth'); }

  // ============ SPLASH SCREEN ============
  function runSplash() {
    const splash = $('#splash');
    const countEl = $('#splashCountdown');
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (countEl) countEl.textContent = count;
      if (count <= 0) {
        clearInterval(interval);
        splash.classList.add('hidden');
        setTimeout(() => { splash.style.display = 'none'; }, 600);
      }
    }, 1000);
  }

  // ============ THEME ============
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ayqidh-theme', theme);
    $$('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
  }

  // ============ LANGUAGE ============
  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('ayqidh-lang', lang);
    const isRTL = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    // Update all translatable elements
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (T[lang] && T[lang][key] !== undefined) {
        el.textContent = T[lang][key];
      }
    });

    // Placeholder translations
    const searchInput = $('#energySearch');
    if (searchInput && T[lang]) {
      searchInput.placeholder = T[lang].searchPlaceholder || '';
    }

    // SVG text elements
    const meterLowEl = document.querySelector('[data-i18n="meterLow"]');
    const meterHighEl = document.querySelector('[data-i18n="meterHigh"]');
    if (meterLowEl && T[lang]) meterLowEl.textContent = T[lang].meterLow;
    if (meterHighEl && T[lang]) meterHighEl.textContent = T[lang].meterHigh;

    // Ayah translation
    const ayahT = $('#ayahTranslation');
    if (ayahT) ayahT.textContent = T[lang].ayahTranslation || '';

    // Update active state
    $$('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

    // Re-render dynamic content
    renderCauses();
    renderEnergies();
    renderSolutions();
    renderScenarios();
    renderQuiz();
    renderDailyTip();
    renderChallenge();
    updateProgress();
  }

  // ============ SHARE FUNCTIONALITY ============
  function shareCard(title, text) {
    const shareText = title + '\n\n' + text + '\n\n#AyqidhTaqatak #أيقظ_طاقتك';
    if (navigator.share) {
      navigator.share({ title: title, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast(T[currentLang].toastShare || 'Copied!');
      }).catch(() => {});
    }
  }

  // ============ RENDER CARDS ============
  function createExpandCard(num, icon, title, bodyHTML, shareText) {
    const card = document.createElement('div');
    card.className = 'expand-card reveal-on-scroll';
    card.innerHTML = `
      <div class="card-header" role="button" tabindex="0" aria-expanded="false">
        <span class="card-number">${num}</span>
        <span class="card-icon">${icon}</span>
        <span class="card-title">${title}</span>
        <button class="card-share-btn" title="Share" aria-label="Share">&#128279;</button>
        <span class="card-chevron">&#9660;</span>
      </div>
      <div class="card-body">
        <div class="card-body-inner">${bodyHTML}</div>
      </div>
    `;
    const header = card.querySelector('.card-header');
    const shareBtn = card.querySelector('.card-share-btn');

    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      shareCard(title, shareText || title);
      playClick();
    });

    header.addEventListener('click', (e) => {
      if (e.target.closest('.card-share-btn')) return;
      initAudio();
      const isOpen = card.classList.contains('active');
      card.parentElement.querySelectorAll('.expand-card.active').forEach(c => {
        if (c !== card) c.classList.remove('active');
      });
      card.classList.toggle('active');
      header.setAttribute('aria-expanded', !isOpen);
      isOpen ? playClick() : playExpand();
    });
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
    });
    return card;
  }

  function renderCauses() {
    const container = $('#causesCards');
    if (!container) return;
    container.innerHTML = '';
    const data = CAUSES[currentLang] || CAUSES.ar;
    data.forEach((cause, i) => {
      const body = `<div class="card-sub">
        <ul>${cause.items.map(it => `<li>${it}</li>`).join('')}</ul>
      </div>`;
      const shareText = cause.items.join('\n');
      container.appendChild(createExpandCard(i + 1, cause.icon, cause.title, body, shareText));
    });
  }

  function renderEnergies() {
    const container = $('#energiesCards');
    if (!container) return;
    container.innerHTML = '';
    const data = ENERGIES[currentLang] || ENERGIES.ar;
    const lang = T[currentLang] || T.ar;
    data.forEach((domain, i) => {
      const body = `
        <div class="card-sub">
          <div class="card-sub-title"><span class="sub-icon">&#128683;</span> ${lang.wasteLabel}</div>
          <ul>${domain.waste.map(it => `<li>${it}</li>`).join('')}</ul>
        </div>
        <div class="card-sub">
          <div class="card-sub-title"><span class="sub-icon">&#128202;</span> ${lang.evidenceLabel}</div>
          <ul>${domain.evidence.map(it => `<li>${it}</li>`).join('')}</ul>
        </div>
        <div class="card-sub">
          <div class="card-sub-title"><span class="sub-icon">&#9889;</span> ${lang.activationLabel}</div>
          <ul>${domain.activation.map(it => `<li class="spark-item">${it}</li>`).join('')}</ul>
          <div class="activation-badge">&#9889; ${lang.activationLabel}</div>
        </div>
      `;
      const card = createExpandCard(i + 1, domain.icon, domain.title, body, domain.activation.join('\n'));

      // Track explored domains
      const cardHeader = card.querySelector('.card-header');
      const origHandler = cardHeader.onclick;
      cardHeader.addEventListener('click', () => {
        if (!exploredDomains.includes(i)) {
          exploredDomains.push(i);
          localStorage.setItem('ayqidh-explored', JSON.stringify(exploredDomains));
          updateProgress();
        }
      });

      container.appendChild(card);
    });
  }

  function renderSolutions() {
    const container = $('#solutionsCards');
    if (!container) return;
    container.innerHTML = '';
    const data = SOLUTIONS[currentLang] || SOLUTIONS.ar;
    data.forEach((sol, i) => {
      const body = `<div class="card-sub">
        <ul>${sol.items.map(it => `<li>${it}</li>`).join('')}</ul>
      </div>`;
      const shareText = sol.items.join('\n');
      container.appendChild(createExpandCard(i + 1, sol.icon, sol.title, body, shareText));
    });
  }

  // ============ SCENARIOS ============
  function renderScenarios() {
    const container = $('#scenariosContainer');
    if (!container) return;
    container.innerHTML = '';
    const data = SCENARIOS[currentLang] || SCENARIOS.ar;
    data.forEach((sc, i) => {
      const card = document.createElement('div');
      card.className = 'scenario-card reveal-on-scroll';
      card.innerHTML = `
        <div class="scenario-situation">${i + 1}. ${sc.situation}</div>
        <div class="scenario-options">
          <div class="scenario-option" data-choice="A">
            <span class="option-letter">A</span>
            <span class="option-text">${sc.optionA}</span>
          </div>
          <div class="scenario-option" data-choice="B">
            <span class="option-letter">B</span>
            <span class="option-text">${sc.optionB}</span>
          </div>
        </div>
        <div class="scenario-feedback" id="scenarioFeedback${i}">${sc.feedback}</div>
      `;
      const options = card.querySelectorAll('.scenario-option');
      options.forEach(opt => {
        opt.addEventListener('click', () => {
          initAudio();
          if (opt.classList.contains('disabled')) return;
          const choice = opt.dataset.choice;
          const isCorrect = choice === sc.correct;
          options.forEach(o => {
            o.classList.add('disabled');
            if (o.dataset.choice === sc.correct) o.classList.add('highlight-correct');
          });
          opt.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
          const fb = card.querySelector('.scenario-feedback');
          fb.classList.add(isCorrect ? 'correct' : 'wrong');
          isCorrect ? playSuccess() : playWrong();
        });
      });
      container.appendChild(card);
    });
  }

  // ============ QUIZ ============
  function renderQuiz() {
    const container = $('#quizContainer');
    if (!container) return;
    container.innerHTML = '';
    const items = QUIZ_ITEMS[currentLang] || QUIZ_ITEMS.ar;
    items.forEach((text, i) => {
      const item = document.createElement('div');
      item.className = 'quiz-item' + (quizState[i] ? ' checked' : '');
      item.innerHTML = `
        <div class="quiz-checkbox">${quizState[i] ? '&#10003;' : ''}</div>
        <div class="quiz-label">${text}</div>
      `;
      item.addEventListener('click', () => {
        initAudio();
        quizState[i] = !quizState[i];
        item.classList.toggle('checked');
        item.querySelector('.quiz-checkbox').innerHTML = quizState[i] ? '&#10003;' : '';
        playCheck();
        localStorage.setItem('ayqidh-quiz', JSON.stringify(quizState));
        // Real-time meter update
        updateMeterFromQuiz();
      });
      container.appendChild(item);
    });
  }

  function updateMeterFromQuiz() {
    const total = (QUIZ_ITEMS[currentLang] || QUIZ_ITEMS.ar).length;
    let score = 0;
    for (let i = 0; i < total; i++) { if (quizState[i]) score++; }
    const pct = Math.round((score / total) * 100);
    updateMeter(pct);
  }

  function submitQuiz() {
    initAudio();
    const total = (QUIZ_ITEMS[currentLang] || QUIZ_ITEMS.ar).length;
    let score = 0;
    for (let i = 0; i < total; i++) { if (quizState[i]) score++; }
    const pct = Math.round((score / total) * 100);
    const lang = T[currentLang] || T.ar;

    let msg;
    if (pct >= 80) msg = lang.resultExcellent;
    else if (pct >= 60) msg = lang.resultGood;
    else if (pct >= 40) msg = lang.resultAverage;
    else msg = lang.resultLow;

    const resultEl = $('#quizResult');
    resultEl.style.display = 'block';
    resultEl.innerHTML = `
      <div class="result-score">${score} ${lang.scoreLabel} ${total}</div>
      <div class="result-label">${pct}%</div>
      <div class="result-msg">${msg}</div>
    `;

    updateMeter(pct);
    playSuccess();
    showToast(lang.toastQuizSaved);
    localStorage.setItem('ayqidh-quiz', JSON.stringify(quizState));
  }

  function resetQuiz() {
    initAudio();
    quizState = {};
    localStorage.removeItem('ayqidh-quiz');
    renderQuiz();
    const resultEl = $('#quizResult');
    if (resultEl) resultEl.style.display = 'none';
    updateMeter(0);
    playClick();
    showToast(T[currentLang].toastQuizReset);
  }

  // ============ ENERGY METER ============
  function updateMeter(pct) {
    const needle = $('#meterNeedle');
    if (!needle) return;
    const angle = -60 + (pct / 100) * 120;
    needle.setAttribute('transform', `rotate(${angle},100,100)`);
    const label = $('#meterLabel');
    if (label) label.textContent = pct + '%';
  }

  // ============ DAILY TIP ============
  function renderDailyTip() {
    const tips = DAILY_TIPS[currentLang] || DAILY_TIPS.ar;
    const dayIndex = new Date().getDate() % tips.length;
    const tipEl = $('#tipText');
    if (tipEl) tipEl.textContent = tips[dayIndex];
  }

  // ============ DAILY CHALLENGE ============
  function renderChallenge() {
    const challenges = CHALLENGES[currentLang] || CHALLENGES.ar;
    const dayIndex = new Date().getDate() % challenges.length;
    const textEl = $('#challengeText');
    const doneBtn = $('#challengeDoneBtn');
    if (textEl) textEl.textContent = challenges[dayIndex];
    if (doneBtn) {
      const lang = T[currentLang] || T.ar;
      if (challengeCompleted) {
        doneBtn.textContent = lang.challengeCompleted || '✓ Completed';
        doneBtn.classList.add('completed');
      } else {
        doneBtn.textContent = lang.challengeDone || '✓ Done';
        doneBtn.classList.remove('completed');
      }
    }
  }

  function completeChallenge() {
    if (challengeCompleted) return;
    initAudio();
    challengeCompleted = true;
    localStorage.setItem('ayqidh-challenge-date', new Date().toDateString());
    renderChallenge();
    playSuccess();
    showToast(T[currentLang].toastChallenge);
  }

  // ============ PROGRESS TRACKING ============
  function updateProgress() {
    const totalDomains = 6;
    const explored = exploredDomains.length;
    const pct = Math.round((explored / totalDomains) * 100);
    const fill = $('#progressBarFill');
    const text = $('#progressText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = explored + '/' + totalDomains;
  }

  // ============ SEARCH / FILTER ============
  function setupEnergySearch() {
    const input = $('#energySearch');
    if (!input) return;
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      const cards = $$('#energiesCards .expand-card');
      cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const body = card.querySelector('.card-body-inner').textContent.toLowerCase();
        if (!query || title.includes(query) || body.includes(query)) {
          card.classList.remove('hidden-by-filter');
        } else {
          card.classList.add('hidden-by-filter');
        }
      });
    });
  }

  // ============ TABS ============
  function switchTab(tabName) {
    initAudio();
    $$('.tab-content').forEach(tc => tc.classList.remove('active'));
    $$('.tab-btn').forEach(tb => tb.classList.remove('active'));
    const content = $(`#tab-${tabName}`);
    if (content) content.classList.add('active');
    const btn = $(`.tab-btn[data-tab="${tabName}"]`);
    if (btn) btn.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playTab();
    // Trigger reveal for newly visible content
    setTimeout(observeReveals, 100);
  }

  // ============ TOAST ============
  function showToast(msg) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
  }

  // ============ SCROLL TO TOP ============
  function handleScroll() {
    const btn = $('#scrollTopBtn');
    if (!btn) return;
    btn.classList.toggle('visible', window.scrollY > 300);
  }

  // ============ DUA BUTTON ============
  function showDua() {
    initAudio();
    const duas = DUAS[currentLang] || DUAS.ar;
    const dua = duas[Math.floor(Math.random() * duas.length)];
    showToast(dua);
    playClick();
  }

  // ============ HELP MODAL ============
  function openHelp() {
    initAudio();
    $('#helpModal').classList.add('active');
    playClick();
  }
  function closeHelp() {
    $('#helpModal').classList.remove('active');
  }

  // ============ SCROLL REVEAL (IntersectionObserver) ============
  function observeReveals() {
    const els = $$('.reveal-on-scroll:not(.revealed)');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('revealed'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
  }

  // ============ INITIALIZE ============
  function init() {
    runSplash();
    applyTheme(currentTheme);
    applyLang(currentLang);

    // Restore quiz state
    const savedQuiz = localStorage.getItem('ayqidh-quiz');
    if (savedQuiz) {
      try { quizState = JSON.parse(savedQuiz); } catch (e) { quizState = {}; }
      updateMeterFromQuiz();
    }

    // Restore explored domains
    const savedExplored = localStorage.getItem('ayqidh-explored');
    if (savedExplored) {
      try { exploredDomains = JSON.parse(savedExplored); } catch (e) { exploredDomains = []; }
    }
    updateProgress();

    // Event: Language buttons
    $$('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        initAudio();
        applyLang(btn.dataset.lang);
        playClick();
      });
    });

    // Event: Theme buttons
    $$('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        initAudio();
        applyTheme(btn.dataset.theme);
        playClick();
      });
    });

    // Event: Tab buttons
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Event: Quiz submit/reset
    const submitBtn = $('#submitQuiz');
    if (submitBtn) submitBtn.addEventListener('click', submitQuiz);
    const resetBtn = $('#resetQuiz');
    if (resetBtn) resetBtn.addEventListener('click', resetQuiz);

    // Event: Scroll to top
    const scrollBtn = $('#scrollTopBtn');
    if (scrollBtn) scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playClick();
    });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Event: Dua button
    const duaBtn = $('#duaBtn');
    if (duaBtn) duaBtn.addEventListener('click', showDua);

    // Event: Help
    const helpBtn = $('#helpBtn');
    if (helpBtn) helpBtn.addEventListener('click', openHelp);
    const helpClose = $('#helpClose');
    if (helpClose) helpClose.addEventListener('click', closeHelp);
    const helpModal = $('#helpModal');
    if (helpModal) helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) closeHelp();
    });

    // Event: Sound toggle
    const soundBtnEl = $('#soundBtn');
    if (soundBtnEl) {
      soundBtnEl.classList.toggle('muted', !soundEnabled);
      soundBtnEl.addEventListener('click', () => {
        initAudio();
        soundEnabled = !soundEnabled;
        localStorage.setItem('ayqidh-sound', soundEnabled ? 'on' : 'off');
        soundBtnEl.classList.toggle('muted', !soundEnabled);
        soundBtnEl.innerHTML = soundEnabled ? '&#128266;' : '&#128263;';
        if (soundEnabled) playClick();
      });
    }

    // Event: Challenge done
    const challengeBtn = $('#challengeDoneBtn');
    if (challengeBtn) challengeBtn.addEventListener('click', completeChallenge);

    // Energy search
    setupEnergySearch();

    // Keyboard: Escape to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeHelp();
    });

    // Scroll reveal
    setTimeout(observeReveals, 500);
    window.addEventListener('scroll', () => observeReveals(), { passive: true });
  }

  // ============ RUN ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();


/* TICKER — rich content */
function startTicker(){
  var el=document.getElementById('tickerText');if(!el)return;
  var tips={
    ar:['⚡ ٤ أسباب للتراجع','🔋 ٦ طاقات معطلة في الأمة','💊 ٥ أبعاد للعلاج','🎭 سيناريوهات: معطلة أم مُفعّلة؟','🤲 اللّهُمّ أيقِظ طاقاتِنا','💡 Powered by workshop-diy.org'],
    en:['⚡ 4 causes of decline','🔋 6 wasted energies in the Ummah','💊 5 dimensions of cure','🎭 Scenarios: wasted or activated?','🤲 O God, awaken our energies','💡 Powered by workshop-diy.org'],
    fr:['⚡ 4 causes du déclin','🔋 6 énergies gaspillées','💊 5 dimensions de guérison','🎭 Scénarios: gaspillée ou activée?','💡 Powered by workshop-diy.org']
  };
  var lang=document.documentElement.lang||'ar';var msgs=tips[lang]||tips.ar;
  var txt=msgs.join('  ✦  ');
  el.innerHTML='<span class="tc">'+txt+'  ✦  </span><span class="tc" aria-hidden="true">'+txt+'  ✦  </span>';
  el.style.animation='tickerMarquee '+Math.max(25,txt.length*0.12)+'s linear infinite';
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',startTicker)}else{startTicker()}
