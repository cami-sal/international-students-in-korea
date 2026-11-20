(() => {
  "use strict";

  const C = {
    v: "var(--v)",
    c: "var(--c)",
    u: "var(--u)",
    l: "var(--l)",
    o: "var(--o)",
    n: "var(--n)"
  };

  const NAT = [
    ["c", "China"],
    ["v", "Vietnam"],
    ["u", "Uzbekistan"],
    ["l", "Mongolia"],
    ["o", "Others"]
  ];

  const PRG = [
    ["l", "Language course"],
    ["c", "Undergraduate"],
    ["o", "Graduate school"],
    ["n", "Other training"]
  ];

  const GEN = [
    ["v", "Women"],
    ["c", "Men"]
  ];

  const K = (c, t) => `<b class="k" style="background:var(--${c})">${t}</b>`;

  // Simplified KOSTAT (2018) provincial boundaries for South Korea (viewBox -60 0 440 379)
  const MP = {
    "Seoul": "M52 64L57 65L58 71L57 74L61 72L62 75L59 76L60 78L60 80L54 83L53 80L46 83L44 78L41 80L41 75L38 74L40 71L44 72L46 72L46 68L48 67L50 69Z",
    "Busan": "M163 251L162 246L161 248L161 245L159 247L159 245L158 247L155 247L154 246L155 244L153 242L157 241L157 242L157 242L158 238L164 237L165 234L171 232L172 228L171 227L174 228L176 226L179 226L180 229L181 229L182 230L182 230L179 231L177 240L175 242L171 242L172 245L171 247L171 246L170 247L170 247L170 246L170 245L170 246L169 246L168 245L168 244L167 244L165 249L165 247L165 250L163 249Z",
    "Daegu": "M147 182L150 185L150 188L151 191L150 193L149 193L148 196L146 198L147 202L143 204L143 201L140 201L138 203L136 208L129 210L131 208L128 204L132 204L130 200L132 196L135 196L133 194L130 193L130 190L134 187L135 188L134 190L136 191L138 187L138 184L139 186L143 183Z",
    "Incheon": "M32 68L37 72L40 72L37 77L39 81L35 86L33 86L32 88L32 89L31 89L32 89L27 89L28 89L28 88L32 88L29 86L29 83L30 83L30 84L31 83L30 83L29 83L29 81L28 82L28 81L30 81L28 80L31 79L31 78L29 78L29 74L27 72L30 71ZM19 55L24 61L24 66L25 70L24 70L24 72L24 71L17 71L16 70L15 69L18 67L17 64L14 63L14 58L17 55Z",
    "Gwangju": "M38 235L37 237L40 238L47 235L49 240L52 241L52 244L48 248L47 247L40 249L37 249L38 248L36 245L32 246L31 243L33 241L32 239L35 238L36 235Z",
    "Daejeon": "M74 149L74 151L77 152L79 150L80 154L81 153L83 155L81 156L80 159L79 167L76 169L72 164L72 168L70 170L67 166L68 164L65 163L67 159L67 154L71 153L72 149Z",
    "Ulsan": "M173 203L179 204L179 207L181 208L184 205L190 207L191 212L190 217L189 217L190 219L187 220L186 215L186 218L185 218L186 218L187 219L187 219L185 221L185 221L184 220L184 219L183 219L186 223L184 223L185 228L182 230L180 229L179 226L176 226L177 224L176 222L174 223L170 218L167 217L168 216L164 216L163 214L166 212L165 209L167 207L169 208L169 204Z",
    "Sejong": "M61 132L68 135L67 138L68 142L70 144L73 143L74 145L74 148L72 149L70 153L65 154L62 152L62 149L61 147L63 143L60 141L60 135L58 133Z",
    "Gyeonggi": "M37 110L37 109L33 105L33 103L32 103L34 102L31 102L32 100L31 100L32 97L32 94L30 93L32 93L31 92L30 93L30 93L30 93L31 92L32 92L33 93L33 95L37 95L39 97L39 94L40 94L40 92L42 94L42 94L41 92L38 92L33 90L29 91L27 92L31 94L32 99L30 98L30 99L30 96L28 97L29 98L28 99L29 97L27 98L26 99L25 97L27 96L25 93L26 94L27 92L27 92L29 91L34 89L37 85L39 86L39 85L39 86L39 85L37 85L39 81L37 79L38 74L41 75L41 80L44 78L46 83L51 80L55 83L60 79L59 77L62 75L61 72L57 74L58 71L57 65L53 64L51 65L50 68L50 69L48 67L46 68L46 72L43 73L40 71L40 72L37 72L32 68L30 71L26 71L24 66L24 59L28 60L32 58L32 54L34 52L33 52L33 46L41 43L43 41L43 35L46 33L49 33L48 32L50 27L51 27L57 23L58 26L60 26L62 32L64 33L67 30L68 31L67 34L69 36L76 35L77 42L82 43L82 45L85 46L85 52L81 55L82 56L81 57L82 60L80 63L83 63L82 68L83 69L86 67L91 72L96 72L99 74L94 78L97 80L97 83L94 87L94 98L91 103L87 102L87 106L85 107L85 108L84 108L83 110L78 109L77 112L73 113L74 115L72 117L68 118L68 120L59 115L46 120L41 114L39 113L40 111Z",
    "Gangwon": "M142 33L158 55L168 66L167 68L171 72L171 74L171 75L173 78L172 78L171 79L173 78L176 84L179 86L180 90L185 96L184 101L185 103L180 105L177 108L178 110L175 110L170 106L168 108L160 107L159 110L152 106L150 111L143 107L138 107L136 104L132 106L130 102L125 104L123 102L127 98L123 98L120 96L117 98L115 97L114 99L110 100L109 96L106 95L103 97L104 101L96 103L93 98L94 92L95 91L94 87L97 83L97 80L94 78L99 74L96 72L91 72L86 67L82 69L82 67L83 62L80 62L82 60L81 57L81 54L85 52L86 47L82 45L82 43L77 42L76 35L69 36L67 34L68 31L67 30L64 33L62 32L60 26L58 26L57 23L59 21L65 20L68 21L73 19L79 22L84 19L90 20L95 19L98 22L104 21L108 24L109 21L112 21L117 19L124 12L126 7L125 1L128 0L131 4L132 8L134 11L134 13L142 28L141 29L141 30L141 29L142 29L143 30Z",
    "Chungbuk": "M67 135L72 130L74 131L75 130L74 127L69 123L68 118L72 117L74 115L73 113L77 112L78 109L83 110L84 108L85 108L85 107L87 106L87 102L90 103L93 98L96 103L101 101L102 102L104 101L103 97L106 95L109 96L110 100L114 99L115 97L117 98L120 96L123 98L127 98L123 102L125 104L130 102L132 106L136 104L138 107L143 107L145 108L144 110L142 109L140 111L139 113L133 118L132 122L133 124L132 126L126 126L122 122L121 124L120 124L120 126L115 125L113 127L111 126L110 131L112 133L105 131L104 135L101 135L104 136L104 141L101 137L99 139L100 140L96 141L97 142L100 143L103 147L101 149L101 153L100 155L102 158L99 161L99 164L101 164L102 162L106 165L109 164L111 165L110 166L111 169L107 169L108 172L106 178L101 181L99 180L94 182L91 180L90 179L89 180L85 174L85 168L82 167L82 165L79 166L80 159L81 156L83 155L81 153L80 154L79 150L77 152L74 151L74 145L73 143L70 144L68 142L67 138L68 136Z",
    "Chungnam": "M16 141L15 143L18 149L18 151L19 152L19 155L13 152L14 148L12 142L15 140ZM30 113L39 115L41 120L43 121L51 117L57 117L58 115L60 115L67 119L69 121L69 123L70 123L70 125L74 127L75 130L70 130L71 132L67 135L61 132L58 133L60 135L60 141L63 143L61 147L62 149L62 152L65 154L67 154L67 159L65 163L68 164L67 166L70 170L72 168L72 164L73 167L76 169L81 165L82 167L85 168L85 174L87 178L86 178L86 180L87 181L86 181L86 183L81 180L82 183L80 184L77 184L76 181L74 182L70 174L65 175L65 177L63 176L59 177L58 179L55 177L54 173L49 172L45 173L44 179L37 181L36 183L32 183L32 181L30 178L31 177L31 176L29 176L27 173L26 174L24 172L23 174L22 172L24 171L26 164L24 162L23 160L26 158L22 156L23 153L25 152L23 153L22 151L21 142L15 139L11 142L11 139L12 138L9 134L10 132L8 133L6 136L3 136L3 134L4 133L6 134L7 132L4 130L3 130L3 132L1 133L2 131L1 129L3 128L3 124L5 126L4 125L6 123L5 121L6 120L9 119L10 120L11 120L11 116L12 115L12 119L13 121L11 123L13 124L11 125L11 127L14 126L13 124L13 123L15 125L15 122L19 120L17 119L18 118L18 117L17 118L13 116L17 115L13 114L15 112L18 112L20 113L23 108Z",
    "Jeonbuk": "M45 173L54 173L55 177L58 179L59 177L63 176L65 177L65 175L70 174L73 181L74 182L76 181L77 184L79 184L82 183L81 180L86 183L86 181L87 181L86 180L87 178L89 180L90 179L91 180L94 182L99 180L101 181L103 187L101 189L100 190L99 192L93 194L92 197L89 199L89 203L86 208L87 210L84 214L87 215L88 219L87 221L89 222L86 227L86 229L85 231L84 231L78 227L76 228L73 232L71 230L66 231L64 230L63 231L62 229L57 232L54 230L55 227L53 225L54 223L53 220L51 221L50 223L50 225L48 225L45 222L42 221L41 219L36 221L37 224L35 225L35 227L32 228L31 231L28 230L28 232L25 231L24 228L23 228L22 226L22 224L22 223L19 223L22 216L23 217L26 215L28 216L30 213L33 215L32 212L23 212L21 210L21 208L26 204L24 202L22 196L27 205L30 201L30 197L35 197L33 191L29 191L30 187L28 187L28 190L28 189L27 190L27 187L25 188L23 194L20 196L20 195L22 194L25 188L24 185L36 184L37 181L44 179Z",
    "Jeonnam": "M9 282L12 283L12 285L14 284L16 287L15 292L13 295L13 293L12 295L11 294L12 296L11 297L11 296L10 295L10 297L6 297L7 298L5 299L2 298L3 296L1 296L0 292L2 292L1 291L5 287L6 288ZM48 292L44 291L45 293L40 290L39 291L39 280L38 288L36 289L37 290L33 294L29 295L29 301L26 300L24 302L24 298L23 297L23 298L22 298L22 298L22 298L22 299L22 299L21 299L21 298L22 297L22 296L21 296L21 296L21 296L23 296L22 294L24 294L23 292L22 293L20 292L22 291L20 290L21 287L20 286L21 286L18 284L16 286L16 284L12 283L12 282L9 280L11 279L9 278L9 276L11 270L13 271L15 274L17 272L15 271L16 269L20 268L20 267L16 268L14 267L18 264L16 261L17 259L16 253L15 259L12 258L13 257L11 255L12 254L13 255L15 254L13 253L17 251L16 250L15 250L13 247L12 250L9 249L10 251L9 252L7 252L8 249L4 248L3 247L5 245L9 246L8 245L9 243L13 244L14 242L13 246L15 246L14 248L16 249L17 247L16 248L18 249L17 250L19 251L18 250L20 248L19 247L21 246L18 245L15 241L16 238L14 240L14 238L13 239L11 237L14 234L13 233L16 233L17 227L20 229L18 226L18 223L22 223L22 224L22 226L23 228L24 228L24 231L28 232L28 230L31 231L32 228L35 227L35 225L37 224L36 221L41 219L42 221L45 222L48 225L50 225L50 223L51 221L53 220L54 223L53 225L55 227L54 230L57 232L62 229L63 231L64 230L66 231L71 230L73 232L76 228L78 227L83 231L86 235L86 240L96 252L94 256L95 258L93 258L94 256L93 256L91 259L89 258L89 260L87 261L87 260L88 259L85 258L84 259L86 260L85 262L87 265L91 262L95 263L95 267L93 269L94 271L91 272L88 270L88 274L86 274L87 275L86 275L88 279L84 277L84 279L82 275L84 274L82 273L85 271L83 266L81 266L82 264L81 261L79 262L79 264L74 265L71 264L75 266L73 268L74 269L72 271L75 276L79 278L77 278L79 279L80 281L79 283L74 282L74 284L76 285L76 287L72 288L73 289L70 289L69 291L70 292L69 292L66 289L67 288L66 287L58 286L58 284L60 281L61 281L62 277L64 277L65 273L67 273L67 276L69 276L71 273L70 270L66 272L65 270L62 274L58 274L54 279L49 279L52 280L50 283L52 283L49 288L50 290L48 289Z",
    "Gyeongbuk": "M188 120L192 129L191 132L191 135L188 139L190 147L186 163L186 169L189 176L186 179L186 181L189 181L187 182L188 181L188 183L190 184L196 177L198 182L194 188L195 192L190 207L184 205L181 208L179 207L179 204L173 202L169 204L169 208L167 207L164 210L160 208L152 213L147 211L141 212L138 209L138 203L141 201L143 201L143 204L147 202L146 198L148 196L149 193L151 192L150 188L150 185L147 182L143 183L139 186L138 184L138 187L136 191L134 190L135 188L134 187L130 190L130 193L133 194L135 196L132 196L130 200L132 204L128 204L131 208L129 210L128 208L125 207L121 208L117 207L117 206L119 205L119 203L117 198L115 198L115 195L112 194L108 195L107 193L104 193L103 190L101 190L101 188L103 187L101 181L106 178L108 172L107 169L111 169L110 166L111 165L109 164L106 165L102 162L101 164L99 164L99 161L102 158L100 155L101 153L101 149L103 147L100 143L96 141L100 140L99 139L101 137L104 141L104 136L101 135L104 135L105 131L112 133L110 131L111 126L113 127L115 125L120 126L120 124L121 124L122 122L126 126L132 126L133 124L132 122L133 118L139 113L141 110L144 110L145 108L151 111L152 106L159 110L160 107L168 108L170 106L175 110L178 110L177 108L184 103L185 103L186 106L189 109L188 111Z",
    "Gyeongnam": "M102 263L105 267L107 265L112 266L111 271L110 272L111 273L109 274L109 272L105 273L105 269L102 269L103 272L100 272L99 270L100 269L97 263L98 260L100 260L100 257L104 257ZM146 268L144 269L146 271L146 272L143 271L144 273L140 274L142 272L140 271L142 269L139 269L140 268L138 268L141 267L141 264L137 265L137 266L135 262L138 258L143 261L141 256L142 255L145 256L145 253L146 254L146 250L149 252L147 253L149 257L147 261L150 260L149 262L149 264L148 264L149 264L150 268L146 266ZM133 246L135 247L133 248L132 249L128 250L129 250L129 252L130 252L130 250L133 250L134 248L135 249L134 250L136 252L134 254L131 253L133 255L132 262L133 261L133 259L135 261L132 264L130 265L129 263L132 262L130 262L130 262L129 261L129 262L128 261L126 262L125 260L128 259L126 256L125 259L123 260L123 257L122 257L119 257L119 260L117 259L115 261L114 260L115 258L111 258L110 256L111 255L110 251L111 247L110 248L109 251L108 251L109 250L108 249L109 250L107 250L106 251L109 252L108 254L106 253L104 254L103 252L102 256L99 257L99 256L97 257L98 257L97 258L97 258L97 258L96 258L94 255L96 252L95 249L86 240L86 235L84 232L86 230L86 227L89 222L87 221L88 219L87 215L84 214L87 210L86 208L89 203L89 199L92 197L93 194L99 192L100 190L101 189L102 191L103 190L104 193L115 195L115 198L117 198L119 203L119 205L117 206L117 207L128 208L129 211L133 208L136 208L137 206L138 205L138 209L141 212L147 211L151 213L156 212L158 208L161 209L163 210L166 210L166 212L163 214L164 216L168 216L167 217L170 218L172 222L176 222L177 224L175 228L171 227L172 228L171 231L165 234L164 237L158 238L157 242L157 241L153 242L156 245L154 248L152 248L153 246L152 245L151 246L152 246L151 249L150 246L147 246L147 243L146 245L144 242L142 243L141 239L143 238L144 238L141 238L140 240L142 243L140 244L142 244L141 245L143 247L142 248L144 248L140 249L142 248L140 248L141 247L139 246L138 245L137 246Z",
    "Jeju": "M46 357L46 359L48 361L47 362L48 363L46 363L46 366L44 367L42 371L39 371L37 374L21 377L20 376L13 376L10 379L4 373L4 369L12 360L30 355L31 354L32 355L38 353L41 354L42 356Z"
  };

  // Province label anchor points
  const MC = {
    "Seoul": [48, 73],
    "Busan": [169, 238],
    "Daegu": [141, 196],
    "Incheon": [34, 79],
    "Gwangju": [42, 242],
    "Daejeon": [73, 161],
    "Ulsan": [177, 216],
    "Sejong": [66, 143],
    "Gyeonggi": [74, 72],
    "Gangwon": [120, 56],
    "Chungbuk": [83, 138],
    "Chungnam": [44, 147],
    "Jeonbuk": [59, 203],
    "Jeonnam": [51, 261],
    "Gyeongbuk": [143, 160],
    "Gyeongnam": [131, 226],
    "Jeju": [26, 366]
  };

  // Callout label positions for dense metropolitan cities
  const CO = {
    "Seoul": [44, 36, "end"],
    "Incheon": [44, 90, "end"],
    "Sejong": [44, 128, "end"],
    "Daejeon": [44, 162, "end"],
    "Gwangju": [56, 244, "end"],
    "Daegu": [300, 176, "start"],
    "Ulsan": [300, 210, "start"],
    "Busan": [300, 250, "start"]
  };

  // Province stats: [2025 total, 2026 total, 2026 women, 2026 language course]
  const PR = {
    "Seoul": [82911, 96078, 66100, 19872],
    "Busan": [18630, 24328, 12410, 5293],
    "Daegu": [7457, 8929, 5111, 3069],
    "Incheon": [5440, 5875, 3422, 1030],
    "Gwangju": [6640, 7984, 3940, 1752],
    "Daejeon": [13478, 14371, 7619, 3282],
    "Ulsan": [1333, 1555, 683, 378],
    "Sejong": [1169, 1356, 634, 65],
    "Gyeonggi": [49040, 59669, 31103, 13269],
    "Gangwon": [7565, 8650, 3905, 878],
    "Chungbuk": [10537, 14454, 5715, 1462],
    "Chungnam": [13871, 16477, 7943, 4747],
    "Jeonbuk": [8650, 12272, 5761, 1829],
    "Jeonnam": [5126, 6178, 2599, 1076],
    "Gyeongbuk": [16109, 22456, 10095, 3353],
    "Gyeongnam": [4162, 5427, 2605, 1649],
    "Jeju": [1316, 1405, 707, 266]
  };

  // Historical total international students (1999-2026)
  const TOT = [
    3418, 3980, 4690, 5776, 7962, 16832, 22526, 32557, 49270, 63952,
    75850, 83842, 89537, 86878, 85923, 84891, 91332, 104262, 123858, 142205,
    160165, 153695, 152281, 166892, 181842, 208962, 253434, 307464
  ];

  // Nationality breakdown by year: [China, Vietnam, Uzbekistan, Mongolia, Others]
  const NY = {
    2018: [68537, 27061, 5496, 6768, 34343],
    2019: [71067, 37426, 7492, 7381, 36799],
    2020: [67030, 38337, 9104, 6842, 32382],
    2021: [67348, 35843, 8242, 6028, 34820],
    2022: [67439, 37940, 8608, 7348, 45557],
    2023: [68065, 43361, 10409, 10375, 49632],
    2024: [72020, 56003, 12025, 12317, 56597],
    2025: [76541, 75144, 15786, 15270, 70693],
    2026: [78890, 96834, 20876, 0, 110864]
  };

  // Country drill-down for "Others" (April 2025, total = 85,963)
  const DR = [
    ["Mongolia", 15270],
    ["Nepal", 12784],
    ["Myanmar", 8114],
    ["Japan", 5395],
    ["United States", 3331],
    ["Bangladesh", 3218],
    ["Russia", 3125],
    ["Indonesia", 2446],
    ["France", 2435],
    ["Taiwan", 2060],
    ["Kyrgyzstan", 2002],
    ["Pakistan", 1801],
    ["174 more countries", 23982]
  ];

  // Section 1: Historical timeline & nationality race steps
  const LINE_NOTE = "2026* from press reports of the Ministry release · Others = everyone except China, Vietnam and Uzbekistan";

  const TS = [
    {
      h: "1999–2007: the first wave",
      t: "In 1999 Korea hosted 3,418 international students. By 2007 there were 49,270, and by 2010 the count had reached 83,842.",
      lim: 2007,
      mode: "t"
    },
    {
      h: "2008–2014: growth stalls",
      t: "The total peaked at 89,537 in 2011 and then slipped to 84,891 by 2014.",
      lim: 2014,
      mode: "t"
    },
    {
      h: "2015–2019: the rebound",
      t: "From 91,332 in 2015 to 160,165 in 2019, the number of students grew by three quarters in just four years.",
      lim: 2019,
      mode: "t"
    },
    {
      h: "2020–21: the pandemic pause",
      t: "The pandemic years saw the total dip to 153,695 in 2020 and 152,281 in 2021.",
      lim: 2021,
      mode: "t"
    },
    {
      h: "2022–2026: the surge",
      t: "208,962 in 2024, 253,434 in 2025 and 307,464 in 2026. The total is now almost double the pre-pandemic level of 2019.",
      lim: 2026,
      mode: "t"
    },
    {
      h: "Now, where did they come from?",
      t: "Nationality figures in our files start in 2018, so the chart zooms in on 2018–2026. Keep scrolling and the race begins: every line grows year by year.",
      lim: 2026,
      mode: "l",
      yr: 0,
      hl: [],
      note: LINE_NOTE
    },
    {
      h: "2018–2020: China leads",
      t: "China starts far ahead with 68,537 students in 2018, about 2.5 times Vietnam’s 27,061.",
      lim: 2026,
      mode: "l",
      yr: 2,
      hl: ["c"],
      note: LINE_NOTE
    },
    {
      h: "2021–2023: Vietnam climbs",
      t: "Vietnam grows from 35,843 in 2021 to 43,361 in 2023, while Uzbekistan edges up to 10,409.",
      lim: 2026,
      mode: "l",
      yr: 5,
      hl: ["v", "u"],
      note: LINE_NOTE
    },
    {
      h: "2024–2025: the gap closes",
      t: "Vietnam leaps from 43,361 in 2023 to 75,144 in 2025, almost level with China’s 76,541.",
      lim: 2026,
      mode: "l",
      yr: 7,
      hl: ["c", "v"],
      note: LINE_NOTE
    },
    {
      h: "2026: Vietnam takes the lead",
      t: "Vietnam reaches 96,834 students and overtakes China’s 78,890 to become the largest sender.",
      lim: 2026,
      mode: "l",
      yr: 8,
      hl: ["v", "c"],
      note: LINE_NOTE
    },
    {
      h: "Everyone else is rising too",
      t: "Uzbekistan grew from 5,496 to 20,876, and all other countries combined, including Mongolia, Japan and the US, from 41,111 to 110,864. Click “Others” to see which countries it holds.",
      lim: 2026,
      mode: "l",
      yr: 8,
      hl: ["u", "o"],
      note: LINE_NOTE
    }
  ];

  // Section 2: 100-student class, maps & bar chart steps
  const S = [
    {
      h: "More than nine in ten come from Asia",
      t: `In 2025, ${K("u", "92")} of every 100 students came from Asia. Europe sent about 5 and Africa, the Americas and Oceania together fewer than 4.`,
      ppl: 1,
      a: [["u", 92], ["c", 5], ["o", 3]],
      lg: [["u", "Asia"], ["c", "Europe"], ["o", "Rest of the world"]]
    },
    {
      h: "2018: one country dominated",
      t: `Nearly half of all students, ${K("c", "48")} in 100, were Chinese (68,537). Vietnam was second with 27,061, or 19 in 100.`,
      a: [["c", 48], ["v", 19], ["u", 4], ["l", 5], ["o", 24]],
      lg: NAT
    },
    {
      h: "2025: Vietnam nearly catches China",
      t: `Vietnam almost tripled to 75,144 students while China grew only 12% to 76,541. Each country now accounts for about ${K("v", "30")} in 100.`,
      a: [["c", 30], ["v", 30], ["u", 6], ["l", 6], ["o", 28]],
      lg: NAT
    },
    {
      h: "2026: Vietnam takes the lead",
      t: "Press reports of the 2026 release put Vietnam first with 96,834 students (31.5%), ahead of China at 78,890 (25.7%) and Uzbekistan at 20,876 (6.8%). Tap a legend item to highlight a group.",
      a: [["v", 32], ["c", 26], ["u", 7], ["o", 35]],
      lg: [["v", "Vietnam"], ["c", "China"], ["u", "Uzbekistan"], ["o", "Others"]]
    },
    {
      h: "China: graduate school focus",
      t: `Same headline numbers, very different journeys. Of every 100 Chinese students in 2025, ${K("o", "39")} were in graduate school and just 7 in language courses.`,
      a: [["l", 7], ["c", 50], ["o", 39], ["n", 4]],
      lg: PRG
    },
    {
      h: "Vietnam: Korean first, then the degree",
      t: `Among Vietnamese students, ${K("l", "45")} in 100 were in language courses and only 11 in graduate school. Many use Korean courses as a stepping stone.`,
      a: [["l", 45], ["c", 43], ["o", 11], ["n", 1]],
      lg: PRG
    },
    {
      h: "Nepal: almost all undergraduates",
      t: `${K("c", "87")} of every 100 Nepalese students were in undergraduate programs and only 1 in a language course.`,
      a: [["l", 1], ["c", 87], ["o", 12]],
      lg: PRG.slice(0, 3)
    },
    {
      h: "Seven in ten are in degree programs",
      t: `In 2026, ${K("c", "73")} of every 100 are pursuing a degree (223,191 students). Language courses account for 63,270 and other training for 21,003.`,
      a: [["c", 51], ["o", 17], ["u", 5], ["l", 20], ["n", 7]],
      lg: [
        ["c", "Bachelor’s"],
        ["o", "Master’s"],
        ["u", "Doctorate"],
        ["l", "Language course"],
        ["n", "Other training"]
      ]
    },
    {
      h: "Bachelor’s up 30%, doctorates down 8%",
      t: "One year of growth did not lift all programs. Undergraduate enrollment grew by almost a third, while the number of doctoral students fell.",
      bars: {
        max: 40,
        cap: "Change in enrollment, April 2025 → April 2026",
        rows: [
          ["Other training", 36, "o", "+36%", "Non-degree students outside language courses: exchange, visiting and other short-term programs"],
          ["Bachelor’s", 30, "c", "+30%"],
          ["Master’s", 24, "u", "+24%"],
          ["Language", 8, "l", "+8%"],
          ["Doctorate", -8, "v", "−8%"]
        ]
      },
      lg: []
    },
    {
      h: "Nine in ten pay their own way",
      t: `${K("u", "93")} of every 100 students in 2025 were self-funded. Only about 5 in 100 held a government, university or home-country scholarship.`,
      a: [["u", 93], ["l", 7]],
      lg: [["u", "Self-funded"], ["l", "Scholarship or other"]]
    },
    {
      h: "A majority are women",
      t: `${K("v", "55")} of every 100 students are women (170,352 vs 137,112 men). The share peaked near 60% between 2016 and 2022 and has eased since.`,
      a: [["v", 55], ["c", 45]],
      lg: GEN
    },
    {
      h: "In Seoul, nearly 7 in 10 are women",
      t: `Seoul hosts 96,078 international students, and ${K("v", "69")} of every 100 are women (66,100).`,
      a: [["v", 69], ["c", 31]],
      lg: GEN
    },
    {
      h: "In Chungbuk, the balance flips",
      t: `In North Chungcheong province only ${K("v", "40")} in 100 are women (5,715 of 14,454). Gyeongbuk is similar at 45%.`,
      a: [["v", 40], ["c", 60]],
      lg: GEN
    },
    {
      h: "A gender map of Korea",
      t: "Women outnumber men in Seoul (69%), Incheon (58%) and Daegu (57%), while they are a minority in Chungbuk (40%), Jeonnam (42%) and Ulsan (44%).",
      map: "women",
      lg: []
    },
    {
      h: "Seoul is no longer the only destination",
      t: `In 1999, 55% of international students studied in Seoul; in 2026 it is 31%. ${K("u", "47")} in 100 now study outside the capital region (Seoul, Incheon, Gyeonggi), up from 45.8% in 2025.`,
      a: [["o", 53], ["u", 47]],
      lg: [["o", "Seoul, Incheon, Gyeonggi"], ["u", "Rest of Korea"]]
    },
    {
      h: "Two regions host half of everyone",
      t: "Seoul and Gyeonggi together hold 50.7% of students. Each dot is about 3,000 students; behind the capital region comes a second tier led by Busan (24,328) and Gyeongbuk (22,456). Hover or tap a province for details.",
      map: "dots",
      lg: []
    },
    {
      h: "The regions are growing fastest",
      t: "Jeonbuk (+42%), Gyeongbuk (+39%) and Chungbuk (+37%) grew more than twice as fast as Seoul (+16%) in one year. Growth is strongest outside the capital region.",
      map: "growth",
      lg: []
    },
    {
      h: "Where language courses matter most",
      t: "Language courses are about a third of students in Daegu (34%) and close to 30% in Gyeongnam and Chungnam, but only 10% in Chungbuk and Gangwon and 5% in Sejong.",
      map: "lang",
      lg: []
    },
    {
      h: "The top ten campuses",
      t: "Hanyang University hosts the most international students, followed by Yonsei and Gachon. Eight of the ten largest hosts are in Seoul.",
      bars: {
        max: 9500,
        cap: "International students by university, April 2025",
        rows: [
          ["Hanyang", 8919, "v"],
          ["Yonsei", 7036, "v"],
          ["Gachon", 6668, "c"],
          ["Kyung Hee", 6184, "v"],
          ["Korea Univ.", 6117, "v"],
          ["Chung-Ang", 5987, "v"],
          ["Sungkyunkwan", 5407, "v"],
          ["Seojeong", 5092, "c"],
          ["Sejong", 4854, "v"],
          ["Dongguk", 4517, "v"]
        ]
      },
      lg: []
    },
    {
      h: "From “how many” to “how well”",
      t: "In September 2026 the Ministry of Education shifted its focus from attracting as many students as possible to educating them as skilled talent. Closer monitoring of overstays and dropouts had already reduced dropout rates.",
      a: [["o", 100]],
      lg: []
    },
    {
      h: "Every dot is a real person",
      t: "Behind each dot is someone learning a language, finding a room, working part-time and building a life far from home. The question now is how to support them.",
      a: [["v", 32], ["c", 26], ["u", 7], ["o", 35]],
      lg: []
    }
  ];

  window.KoreaStudentsData = {
    C,
    MP,
    MC,
    CO,
    PR,
    TOT,
    NY,
    DR,
    TS,
    S
  };
})();
