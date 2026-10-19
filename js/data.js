/*
 * BRIZON GYM — site content
 * ---------------------------------------------------------------
 * Everything that changes often lives in this one file:
 * contact details, courses, products, advice, gallery and chat answers.
 * Edit the values below and reload the page — no other file needs touching.
 */

window.BRIZON = {
  /* ---------- Shop on/off ----------
   * false = the shop shows "coming soon": no products, no cart, no orders.
   * Set to true to open it.
   */
  shopOpen: false,

  /* ---------- Contact & social ---------- */
  contact: {
    // Paste Didier's Instagram handle here (without the @), e.g. "didierleborgne"
    instagram: "didierleborgne",
    // Facebook page name (the part after facebook.com/)
    facebook: "Didierleborgne",
    // Address that receives product orders and course bookings
    email: "",
    // WhatsApp number in international format, digits only, e.g. "33612345678"
    whatsapp: "",
    location: "Auvergne, France — Riom · Clermont-Ferrand · Vichy"
  },

  /* ---------- Courses ----------
   * featured: true  → shown as the big "This week" card.
   * date: "YYYY-MM-DD" (leave "" if not fixed yet).
   */
  courses: [
    {
      featured: true,
      title: "Action / Reaction",
      subtitle: "Stage con il Maestro dei Campioni",
      discipline: "Kickboxing · K-1 · Muay Thai",
      date: "2026-10-31",
      time: "16:00 – 17:00",
      place: "Profighting Napoli Club, Via Andrea d'Isernia 59, 80122 Napoli (Italy)",
      level: "All levels",
      description:
        "Technique, exchanges and feints in combat. A technical seminar on the exchange: from action and reaction to using feints to draw the wrong response and create openings to attack. Practical partner work, led by Didier Le Borgne.",
      spots: "Limited places — book now"
    },
    {
      title: "Muay Thai — Fundamentals",
      discipline: "Muay Thai",
      time: "Weekly",
      level: "Beginners",
      description: "Guard, stance, the eight limbs, and the Brizon Gym basics, step by step."
    },
    {
      title: "Fight Team — Competition training",
      discipline: "Muay Thai · K-1",
      time: "Weekly",
      level: "Competitors",
      description: "Pad rounds, sparring and fight preparation for amateur and professional fighters."
    },
    {
      title: "MMA Stand-up",
      discipline: "MMA",
      time: "On request",
      level: "Intermediate / Pro",
      description: "Striking for MMA: distance, takedown defence on the feet, cage work and transitions."
    },
    {
      title: "Private coaching",
      discipline: "All disciplines",
      time: "On request",
      level: "All levels",
      description: "One-to-one sessions with Didier — technique, corner work, and fight camp planning."
    }
  ],

  /* ---------- Past seminars (shown under the courses) ---------- */
  pastCourses: [
    { when: "25–26 January 2025", title: "Muay Thai & K-1 Camp", place: "Taranto, Italy" },
    { when: "23 April 2023", title: "Muay Thai & K-1 Stage", place: "Palazzetto dello Sport, Marina di Camerota, Italy" },
    { when: "Two-session stage", title: "Didier Le Borgne in Stage", place: "Ludus Magnum, Milan, Italy" }
  ],

  /* ---------- Shop: the Brizon Gym line ----------
   * colors: each colour has its own picture.
   * personalize: if set, the customer can write a name to embroider/print.
   * price: number in euros, or null to show "Price on request".
   */
  products: [
    { id: "thai-shorts", name: "Muay Thai shorts", category: "Fight gear", price: null,
      colors: [{ name: "Red", image: "images/products/line/thai-shorts-red.svg" }, { name: "Black", image: "images/products/line/thai-shorts-black.svg" }, { name: "White", image: "images/products/line/thai-shorts-white.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      personalize: "Name on the shorts (optional)",
      description: "Classic wide-leg Thai shorts in satin, high elastic waistband with the Brizon Gym name, side slits. Add your name on the leg." },
    { id: "mma-shorts", name: "MMA fight shorts", category: "Fight gear", price: null,
      colors: [{ name: "Black / Red", image: "images/products/line/mma-shorts.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      description: "Stretch fight shorts with side split, velcro and drawstring closure — made for the cage and grappling." },
    { id: "boxing-gloves", name: "Boxing gloves — velcro", category: "Fight gear", price: null,
      colors: [{ name: "Red", image: "images/products/line/boxing-gloves-red.svg" }, { name: "Black", image: "images/products/line/boxing-gloves-black.svg" }],
      sizes: ["10 oz","12 oz","14 oz","16 oz"],
      description: "Full-grain leather training and sparring gloves, layered foam, wide velcro strap. Chosen and tested by Didier." },
    { id: "pro-gloves", name: "Pro fight gloves — lace-up", category: "Fight gear", price: null,
      colors: [{ name: "White / Red", image: "images/products/line/boxing-gloves-lace.svg" }],
      sizes: ["8 oz","10 oz","12 oz","14 oz","16 oz"],
      personalize: "Name on the cuff (optional)",
      description: "Lace-up competition gloves, hand-made leather, white with Brizon red cuff." },
    { id: "mma-gloves", name: "MMA gloves", category: "Fight gear", price: null,
      colors: [{ name: "Black / Red", image: "images/products/line/mma-gloves.svg" }],
      sizes: ["S","M","L","XL"],
      description: "4 oz open-finger gloves with padded knuckles and wrist strap, for MMA training and competition." },
    { id: "shin-guards", name: "Muay Thai shin guards", category: "Fight gear", price: null,
      colors: [{ name: "Red / Black", image: "images/products/line/shin-guards.svg" }],
      sizes: ["S","M","L","XL"],
      description: "Leather shin and instep protection with double strap — real Thai boxing protection for hard sparring." },
    { id: "mouthguard", name: "Mouthguard + case", category: "Fight gear", price: null,
      colors: [{ name: "Red", image: "images/products/line/mouthguard.svg" }],
      sizes: ["Junior","Adult"],
      description: "Boil-and-bite pro-fit mouthguard with vented Brizon Gym case." },
    { id: "hand-wraps", name: "Hand wraps", category: "Fight gear", price: null,
      colors: [{ name: "Red", image: "images/products/line/hand-wraps.svg" }],
      sizes: ["One size"],
      description: "180-inch semi-elastic wraps with thumb loop and velcro." },
    { id: "jump-rope", name: "Pro jump rope", category: "Fight gear", price: null,
      colors: [{ name: "Black / Red", image: "images/products/line/jump-rope.svg" }],
      sizes: ["Adjustable"],
      description: "Real boxing rope: weighted handles, ball bearings, adjustable steel cable. Not a toy." },
    { id: "sauna-suit", name: "Sweat suit", category: "Fight gear", price: null,
      colors: [{ name: "Silver / Black", image: "images/products/line/sauna-suit.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      description: "Waterproof sweat jacket and trousers to make weight and train in the rain." },
    { id: "ring-robe", name: "Fight robe — ring entrance", category: "Ring & locker room", price: null,
      colors: [{ name: "Red", image: "images/products/line/robe-ring.svg" }, { name: "Black", image: "images/products/line/robe-ring-black.svg" }],
      sizes: ["S","M","L","XL","XXL"],
      personalize: "Name on the back",
      description: "Hooded satin ring robe, Brizon Gym Fight Team on the back and your name embroidered underneath. For walking out to the ring." },
    { id: "bath-robe", name: "Shower robe", category: "Ring & locker room", price: null,
      colors: [{ name: "White", image: "images/products/line/robe-shower.svg" }],
      sizes: ["S/M","L/XL","XXL"],
      personalize: "Name on the chest",
      description: "Thick white cotton terry bathrobe with embroidered logo and your name on the chest." },
    { id: "towels", name: "Towels", category: "Ring & locker room", price: null,
      colors: [{ name: "Red / Black / White", image: "images/products/line/towel.svg" }],
      sizes: ["Corner 30×50","Gym 50×100","Bath 70×140"],
      description: "Cotton terry towels in three sizes: corner, gym and bath." },
    { id: "tee-history", name: "T-shirt — The Legacy", category: "Apparel", price: null,
      colors: [{ name: "Black", image: "images/products/line/tshirt-history.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      description: "Logo on the front, the Brizon Gym line on the back: Kurosaki 1953, Mejiro Gym 1975, Patrick Brizon, 1982, Didier Le Borgne." },
    { id: "tee-logo", name: "T-shirt — Fight Team", category: "Apparel", price: null,
      colors: [{ name: "Black", image: "images/products/line/tshirt-logo.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      description: "Heavy cotton T-shirt with the Brizon Gym 1975 Fight Team print." },
    { id: "hoodie", name: "Hoodie — pullover", category: "Apparel", price: null,
      colors: [{ name: "Black", image: "images/products/line/hoodie-pullover.svg" }, { name: "Charcoal / Red", image: "images/products/line/hoodie-fightteam.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      description: "Heavyweight fleece hoodie, kangaroo pocket, big Fight Team print." },
    { id: "hoodie-zip", name: "Hoodie — zip", category: "Apparel", price: null,
      colors: [{ name: "Red", image: "images/products/line/hoodie-zip.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      description: "Full-zip hooded sweatshirt, embroidered chest logo." },
    { id: "club-jacket", name: "Club jacket", category: "Apparel", price: null,
      colors: [{ name: "Black", image: "images/products/line/jacket-club.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      personalize: "Name on the chest (optional)",
      description: "Team jacket with collar, red and white sleeve stripes, BRIZON GYM on the chest." },
    { id: "rain-jacket", name: "Rain jacket", category: "Apparel", price: null,
      colors: [{ name: "Red", image: "images/products/line/jacket-rain.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      description: "Lightweight hooded waterproof jacket for roadwork in bad weather." },
    { id: "joggers", name: "Training trousers", category: "Apparel", price: null,
      colors: [{ name: "Black", image: "images/products/line/joggers.svg" }],
      sizes: ["XS","S","M","L","XL","XXL"],
      description: "Fleece joggers with red side stripe and cuffed ankles." },
    { id: "beanie", name: "Wool watch cap", category: "Headwear", price: null,
      colors: [{ name: "Charcoal", image: "images/products/line/beanie.svg" }],
      sizes: ["One size"],
      description: "The classic knitted boxing cap for winter roadwork — the kind Rocky ran in — with a Brizon Gym woven label." },
    { id: "cap", name: "Baseball cap", category: "Headwear", price: null,
      colors: [{ name: "Black / Red", image: "images/products/line/cap.svg" }],
      sizes: ["One size"],
      description: "Six-panel cap with the embroidered Brizon Gym 1975 logo." },
    { id: "trolley-bag", name: "Wheeled gym bag", category: "Bags", price: null,
      colors: [{ name: "Black", image: "images/products/line/bag-trolley.svg" }],
      sizes: ["90 L"],
      description: "Big trolley bag with telescopic handle and wheels: gloves, shin guards, robe, everything in one bag." },
    { id: "duffel-bag", name: "Duffel bag", category: "Bags", price: null,
      colors: [{ name: "Red / Black", image: "images/products/line/bag-duffel.svg" }],
      sizes: ["50 L"],
      description: "Classic barrel gym bag with shoulder strap." }
  ],


  /* ---------- Gallery (student photos) ---------- */
  /* ---------- Home page slideshow (vintage = old photo with the red tint) ---------- */
  hero: [
    { src: "images/history/kurosaki-dojo-high-kick.jpg", vintage: true },
    { src: "images/gallery/didier-attack-color.jpg" },
    { src: "images/gallery/high-kick-pads-color.jpg" },
    { src: "images/gallery/sparring-color-flag.jpg" },
    { src: "images/didier/heavy-bag-dark.jpg" }
  ],

  /* ---------- Didier: portraits through the years ---------- */
  portraits: [
    { src: "images/didier/mejiro-gym-young.jpg", caption: "In Mejiro Gym colours" },
    { src: "images/didier/muay-thai-ring.jpg", caption: "Muay Thai, in the ring" },
    { src: "images/didier/adidas-blue-ring.jpg", caption: "Guard up" },
    { src: "images/didier/adidas-kickboxing.jpg", caption: "Kick-boxing" },
    { src: "images/didier/sap-gym-rashguard.jpg", caption: "Ready to train" },
    { src: "images/didier/adidas-blue-gloves.jpg", caption: "Seminar day" },
    { src: "images/didier/heavy-bag-dark.jpg", caption: "On the heavy bag" }
  ],

  /* ---------- Videos (YouTube playlist "Techniques Didier") ---------- */
  playlist: "PLeh_ekBfJigI",
  videos: [
    { id: "20Oopl9IabE", category: "Technique", title: "Didier Le Borgne - Tecniche Thai Boxe (CO ott.2012) p1" },
    { id: "ljf4SP8Q7r4", category: "Technique", title: "Didier Le Borgne - Tecniche Thai Boxe (CO ott.2012) p2" },
    { id: "RCqrK6tnGeg", category: "Technique", title: "Didier Le Borgne - Tecniche Thai Boxe (CO ott.2012) p3" },
    { id: "rRfHqNVhTpo", category: "Technique", title: "Didier le Borgne: tecniche di clinch e gomiti (MI mag.2012)" },
    { id: "bb1C_q6achw", category: "Technique", title: "MUAY THAI: tecniques with Didier Le Borgne (CANNES lug.2012) p.2" },
    { id: "7wa67WwBNqU", category: "Technique", title: "K1: techniques with Didier Le Borgne (CANNES lug.2012) p.2" },
    { id: "5wDsh5SRDsM", category: "Seminars", title: "Stage Didier Le Borgne - K1 / Muay Thai" },
    { id: "GcXaMw7VKMc", category: "Seminars", title: "Giornata di Stage per amatori con Didier Le Borgne alla ProFightingNapoliClub" },
    { id: "FODMIAWessU", category: "Seminars", title: "Didier Le Borgne - Stage con Saro Presti e il Maestro Soudareth a Messina" },
    { id: "clhK6WcE0hE", category: "Seminars", title: "Perlungher Corso Allenatori con Didier Le Borgne (SV sett 2012)" },
    { id: "WKN4WxVrYOc", category: "Seminars", title: "Glory 35 a Nizza: Riscaldamento Didier Le Borgne e Alessio D'Angelo" },
    { id: "dZ7sHgqks9w", category: "Story & interviews", title: "Didier Le Borgne e la palestra Mejiro Gym di Jan Plas" },
    { id: "uQH_whZPBfc", category: "Story & interviews", title: "#ShareYourStory Didier Le Borgne" },
    { id: "ZzVgfcfDONg", category: "Story & interviews", title: "Aurelio Mastroianni e Didier Le Borgne" },
    { id: "oc8x2oShz-I", category: "Equipment", title: "Didier Le Borgne in allenamento con guantoni ADIDAS SUPERPRO (MI mag.2012)" },
    { id: "xzcbzY052pE", category: "Equipment", title: "Didier Le Borgne - Guantoni SHIMAI DYNAMIC" }
  ],

  /* ---------- Instagram posts of @didierleborgne (shown under the videos) ---------- */
  instagram: ["reel/DU3dYjjgWYw", "p/DOxvVg8jG1Q", "reel/DXq5mUPAlfU", "reel/DUQndHODOyX", "reel/DMX7ZpIMaEB", "reel/DMX6KB7Rz8q", "reel/DIZSiylM9uu", "reel/DIRDV_IoYTO", "reel/C4QiNkcN5dz", "p/CyvZFLDAw_W", "p/C1rOTd3BFMb", "reel/C1otCrNNKO6", "reel/Cu6d9xmKYMx", "p/Cu6doofOblq", "p/CsI1TCLtKlZ", "p/CoRuXHfj3HB", "p/CsDiKM9teJp", "reel/Cnrb6Uiq_nj", "reel/CnrnHv3K_s_", "p/CgjTdCIDj2x", "p/CgZBwXfDOR4", "p/CgWKrU2ovY7", "p/CgTvwBSIdxv"],

  /* ---------- Fighters (bento: 1st big, 4th tall, 6th wide) ---------- */
  fighters: [
    { src: "images/fighters/locker-room-madelen.jpg", caption: "In the locker room with Madelen Søfteland, Brizon Gym" },
    { src: "images/fighters/brizon-jacket-didier.jpg", caption: "In the corner, Brizon Gym colours" },
    { src: "images/fighters/didier-pads-sap.jpg", caption: "Holding the pads" },
    { src: "images/fighters/bkfc-team.jpg", caption: "With the Bare Knuckle FC team" },
    { src: "images/fighters/pads-teep-leone.jpg", caption: "Knee and teep on the pads" },
    { src: "images/fighters/hand-wraps.jpg", caption: "Wrapping hands before the fight" },
    { src: "images/fighters/pads-high-kick-red.jpg", caption: "High kick on the pads" }
  ],

  /* ---------- "Training with the Master" carousel ---------- */
  training: [
    { src: "images/gallery/didier-attack-color.jpg", caption: "Didier on the attack · Photo © May Elin Aunli" },
    { src: "images/gallery/didier-audace-trieste.jpg", caption: "Sparring at Audace Fight & Fitness Club, Trieste · Photo © May Elin Aunli" },
    { src: "images/gallery/high-kick-pads-color.jpg", caption: "High kick on the pads · Photo © May Elin Aunli" },
    { src: "images/gallery/pads-ring.jpg", caption: "On the pads with Didier · Photo © May Elin Aunli" },
    { src: "images/gallery/sparring-color-flag.jpg", caption: "Sparring with Didier" },
    { src: "images/gallery/didier-teep.jpg", caption: "Teep and distance · Photo © May Elin Aunli" },
    { src: "images/gallery/kick-and-check.jpg", caption: "Kick and check · Photo © May Elin Aunli" },
    { src: "images/gallery/sparring-ring.jpg", caption: "Muay Thai sparring in the ring · Photo © May Elin Aunli" },
    { src: "images/gallery/jab-and-guard.jpg", caption: "Jab and guard · Photo © May Elin Aunli" }
  ],

  /* ---------- Gallery (bento grid: 1st big, 4th tall, 6th wide) ---------- */
  gallery: [
    { src: "images/gallery/didier-tatami-kneeling.jpg", caption: "Didier on the mat" },
    { src: "images/history/fight-team-red.jpg", caption: "Fight Team in the locker room" },
    { src: "images/history/mma-victory.jpg", caption: "Victory in the cage" },
    { src: "images/history/didier-corner.jpg", caption: "Didier in the corner" },
    { src: "images/history/kids-training.jpg", caption: "Young fighters on the pads" },
    { src: "images/brand/fight-team-jacket.jpg", caption: "Brizon Gym Fight Team colours" },
    { src: "images/history/didier-today.jpg", caption: "Didier today" }
  ],

  /* ---------- Advice from the coach ---------- */
  advice: [
    { title: "Guard first, always", image: "images/gallery/jab-and-guard.jpg", tag: "Technique",
      text: "Hands up and chin down before every exchange. The fighter who drops his guard to throw is the one who gets countered." },
    { title: "Kick through, not to", image: "images/fighters/pads-high-kick-red.jpg", tag: "Technique",
      text: "In the Mejiro style the low kick goes through the target with the hip turned over. Aim behind the leg, not at it." },
    { title: "Wrap your hands every time", image: "images/fighters/hand-wraps.jpg", tag: "Equipment",
      text: "Hand wraps protect the small bones of the hand and wrist. Never put gloves on bare hands, even for light bag work." },
    { title: "Mouthguard and protection", image: "images/gallery/kick-and-check.jpg", tag: "Equipment",
      text: "For sparring: mouthguard, shin guards, groin guard (men) or chest protector (women). Good gear lets you train for years." },
    { title: "Recover like a pro", image: "images/gallery/didier-tatami-relax.jpg", tag: "Health",
      text: "Sleep, water and rest days are part of training. Hard sessions only work when the body has time to rebuild." },
    { title: "Respect in and out of the ring", image: "images/fighters/locker-room-madelen.jpg", tag: "Spirit",
      text: "Bow to your partner, protect each other in sparring, thank your coach. That is the spirit Patrick Brizon left to the gym." }
  ],

  /* ---------- Chat assistant answers ----------
   * keys: words that trigger the answer (lower case). The first match wins.
   */
  faq: [
    { keys: ["course", "class", "lesson", "cours", "seminar", "stage", "week", "train", "corso", "corsi", "lezion", "allenament", "settimana", "curso", "aula", "treino", "estágio", "semaine", "entraîn", "prochain", "prossimo", "próxim"],
      answer: "Didier teaches Muay Thai, K-1 and MMA stand-up. The next seminar, “Action / Reaction”, is on Saturday 31 October, 16:00–17:00, at Profighting Napoli Club (Via Andrea d'Isernia 59, Naples). All the details are in the Courses section — tap “Book a place” there to reserve." },
    { keys: ["price", "cost", "how much", "prix", "tarif", "prezz", "costo", "quanto", "preço", "custa", "combien", "tarifa"],
      answer: "For course fees and product prices, send us a message from the Contact section and we'll reply with the details." },
    { keys: ["order", "buy", "shop", "product", "hoodie", "shirt", "glove", "bag", "short", "robe", "rope", "commande", "commander", "acheter", "boutique", "ordin", "compr", "negozio", "encomend", "loja"],
      answer: "Open the Shop, choose colour and size (and your name on robes, shorts and pro gloves), add to your cart, then send the order. We confirm availability, price and delivery with you directly." },
    { keys: ["didier", "coach", "teacher", "who", "qui", "chi", "quem", "maestro", "maître", "mestre", "professeur", "allenatore", "treinador"],
      answer: "Didier Le Borgne was a student of Patrick Brizon, then trained in Amsterdam under Jan Plas at the Mejiro Gym. More than 100 fights in Muay Thai, kick-boxing, full contact, boxing and Vale Tudo. Today he trains professional fighters." },
    { keys: ["patrick", "brizon", "history", "histoire", "founded", "1975", "1982", "storia", "história", "fondat", "fundad"],
      answer: "Patrick Brizon trained at Sensei Kurosaki's Mejiro Gym in Tokyo in 1975 and opened the first kick-boxing (Muay Thai) school in France. He died in 1982 aged 31; his students kept the Brizon Gym alive. Read the full story in the History section." },
    { keys: ["kurosaki", "mejiro", "jan plas", "plas"],
      answer: "Kenji Kurosaki founded the Mejiro Gym in Tokyo. Jan Plas trained there and opened the Mejiro Gym in Amsterdam. Patrick Brizon and later Didier come from this same line." },
    { keys: ["beginner", "start", "debut", "first time", "never", "débutant", "commencer", "principiant", "iniziare", "inician", "começar", "comecar", "jamais", "mai "],
      answer: "Beginners are welcome! Start with the Fundamentals class. Bring sportswear, water and hand wraps — gloves can be lent for your first sessions." },
    { keys: ["kid", "child", "enfant", "young", "age", "bambin", "ragazz", "figli", "criança", "crianca", "filho", "jeune", "âge", "età", "idade"],
      answer: "Young fighters are welcome. Contact us with the child's age so we can recommend the right class." },
    { keys: ["where", "address", "location", "adresse", "où", "dove", "indirizzo", "onde", "morada", "endereço"],
      answer: "Brizon Gym is in Auvergne, France (Riom, Clermont-Ferrand, Vichy). Contact us for the exact address of each class." },
    { keys: ["instagram", "insta", "facebook", "social", "photo", "picture", "foto"],
      answer: "Follow Didier on Instagram @didierleborgne and on Facebook (links at the bottom of the page), and send us your training photos to appear in the gallery." },
    { keys: ["hello", "hi", "bonjour", "salut", "ciao", "hey", "salve", "olá", "ola", "oi", "buongiorno", "bom dia"],
      answer: "Hello! Ask me about courses, the shop, Didier or the Brizon Gym history." }
  ]
};
