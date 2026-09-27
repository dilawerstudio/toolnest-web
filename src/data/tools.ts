import { ToolItem } from '../types/tool';

export const CATEGORIES = [
  { id: 'all', name: 'All Tools', description: 'Browse all available utilities and calculators' },
  { id: 'text', name: 'Text Tools', description: 'Word counters, character statistics, and text manipulation' },
  { id: 'utility', name: 'Utility & Calculators', description: 'Quick everyday calculators, passwords, and QR generators' },
  { id: 'dev', name: 'Developer Tools', description: 'Formatters, decoders, and technical workflow helpers' },
  { id: 'image', name: 'Image Tools', description: 'Fast client-side image transformations and optimization' },
  { id: 'pdf', name: 'PDF Tools', description: 'Browser-based document reorganization and compression' },
] as const;

export const TOOLS: ToolItem[] = [
  // --- First 7 Fully Working Tools ---
  {
    id: 'word-counter',
    name: 'Word Counter',
    category: 'text',
    categoryName: 'Text Tools',
    description: 'Count words, characters, sentences, paragraphs, and calculate estimated reading and speaking times instantly.',
    iconName: 'FileText',
    isImplemented: true,
    popular: true,
    tags: ['word', 'count', 'words', 'reading time', 'speaking time', 'sentences', 'paragraphs', 'keyword density', 'essay', 'article'],
    features: [
      'Real-time live counting as you type or paste',
      'Word, character (with & without spaces), sentence, and paragraph statistics',
      'Accurate reading time (225 wpm) and speaking time (130 wpm) estimates',
      'Keyword frequency distribution table with top recurring words',
      'Text statistics: average word length and sentence length',
      'One-click copy, sample text loader, and clear functionality',
      '100% private: text never leaves your browser'
    ],
    howToUse: [
      'Type or paste your text directly into the main input box.',
      'Review the live metrics grid updating instantly below the editor.',
      'Check keyword frequency and estimated reading times for content optimization.',
      'Click "Copy Text" to copy the updated text or "Clear" to start a new document.'
    ],
    faqs: [
      {
        question: 'Does this word counter store or upload my text?',
        answer: 'No. All calculations run strictly inside your web browser using JavaScript. No text is sent to any server or database.'
      },
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is estimated based on the standard average silent reading speed of 225 words per minute for adults.'
      },
      {
        question: 'Does it count punctuation as words?',
        answer: 'No. Punctuation marks are treated as word boundaries or punctuation characters and are not counted as independent words.'
      }
    ],
    relatedToolIds: ['character-counter', 'case-converter', 'qr-code-generator']
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    category: 'text',
    categoryName: 'Text Tools',
    description: 'Detailed character analysis with letter, number, and whitespace breakdown plus social media length limit trackers.',
    iconName: 'Hash',
    isImplemented: true,
    popular: true,
    tags: ['character', 'letter', 'length', 'twitter', 'sms', 'seo title', 'meta description', 'limit', 'byte', 'utf8'],
    features: [
      'Comprehensive breakdown: letters, digits, whitespace, and punctuation',
      'Accurate UTF-8 byte weight calculation for technical payloads',
      'Real-time progress bars for Twitter/X (280), SMS (160), Google SEO Title (60), and Meta Description (160)',
      'Visual warnings when text exceeds platform guidelines',
      'Zero latency client-side execution'
    ],
    howToUse: [
      'Paste your draft message, tweet, or metadata into the text box.',
      'Watch character breakdowns and progress bars update in real time.',
      'Adjust length until you fall cleanly within the target platform limit.',
      'Use the copy button to transfer your finalized copy.'
    ],
    faqs: [
      {
        question: 'Why does byte count differ from character count?',
        answer: 'Standard ASCII letters use 1 byte, but special symbols, accented characters, and emojis use between 2 and 4 bytes in UTF-8 encoding.'
      },
      {
        question: 'What is the standard SMS limit?',
        answer: 'A single standard SMS message allows up to 160 GSM 7-bit characters. Exceeding 160 characters will split your SMS into concatenated multi-part messages.'
      }
    ],
    relatedToolIds: ['word-counter', 'case-converter', 'password-generator']
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    category: 'text',
    categoryName: 'Text Tools',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and more.',
    iconName: 'Type',
    isImplemented: true,
    popular: true,
    tags: ['case', 'capital', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake_case', 'kebab-case', 'pascalcase', 'convert'],
    features: [
      '10+ formatting styles: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and Alternating cAsE',
      'Individual quick-copy buttons for every converted format',
      'Smart title casing that preserves common articles and prepositions',
      'Instant conversion without page refreshes or external requests'
    ],
    howToUse: [
      'Enter or paste text into the source text area.',
      'Inspect the generated cards for each casing convention.',
      'Click the "Copy" button on the card with your desired casing to copy it immediately to your clipboard.'
    ],
    faqs: [
      {
        question: 'What is the difference between camelCase and PascalCase?',
        answer: 'camelCase starts with a lowercase letter (e.g. userProfileData), whereas PascalCase begins with an uppercase letter (e.g. UserProfileData).'
      },
      {
        question: 'Does Title Case capitalize every word?',
        answer: 'Title Case capitalizes primary nouns, verbs, and adjectives, but keeps minor words like "a", "an", "the", "in", and "of" lowercase unless they begin the sentence.'
      }
    ],
    relatedToolIds: ['word-counter', 'character-counter', 'json-formatter']
  },
  {
    id: 'text-cleaner',
    name: 'Text Cleaner',
    category: 'text',
    categoryName: 'Text Tools',
    description: 'Clean and sanitize messy text: remove duplicate spaces, trim line edges, collapse blank lines, eliminate duplicate lines, and sort lines.',
    iconName: 'Eraser',
    isImplemented: true,
    popular: true,
    tags: ['text', 'clean', 'cleaner', 'whitespace', 'spaces', 'trim', 'empty lines', 'duplicates', 'sort', 'format text'],
    features: [
      'Collapse repeated spaces and tabs into clean single spaces',
      'Trim leading and trailing whitespace from every line',
      'Remove empty lines and collapse multiple blank lines',
      'Eliminate duplicate lines and normalize CRLF line breaks',
      'Instant alphabetical A-Z and Z-A line sorting',
      'Before and after character, word, and line count comparison',
      'One-click complete deep clean button'
    ],
    howToUse: [
      'Paste or type your unformatted or messy text into the editor.',
      'Click any individual cleaning action or use "One-Click Complete Clean".',
      'Inspect the cleaned result side-by-side with live line/character metrics.',
      'Copy the cleaned text or download it as a .txt file.'
    ],
    faqs: [
      {
        question: 'Is my text transmitted over the internet?',
        answer: 'No. All string manipulation executes 100% locally in your browser memory.'
      },
      {
        question: 'Can I sort lines alphabetically?',
        answer: 'Yes. You can sort lines A to Z or Z to A with a single click.'
      }
    ],
    relatedToolIds: ['text-reverser', 'word-counter', 'case-converter']
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser & Sorter',
    category: 'text',
    categoryName: 'Text Tools',
    description: 'Reverse entire text, invert lines, reverse word order, and sort lines by alphabet or string length.',
    iconName: 'ArrowUpDown',
    isImplemented: true,
    popular: false,
    tags: ['reverse', 'reverser', 'backwards', 'flip text', 'sort lines', 'word order', 'length sort'],
    features: [
      'Multiple reversal modes: Entire Text, Each Line, and Word Sequence',
      'Line sorting modes: Alphabetical (A-Z / Z-A) and Line Length (Shortest / Longest)',
      'Optional toggles to remove empty lines and remove duplicate lines',
      'Live character and line count monitoring',
      'Instant copy and text file download'
    ],
    howToUse: [
      'Enter your text into the source text area.',
      'Select your desired reversal or sorting mode.',
      'Optionally toggle duplicate or empty line removal.',
      'Copy or download the transformed output.'
    ],
    faqs: [
      {
        question: 'Can I reverse words without reversing letters within the words?',
        answer: 'Yes! Select the "Reverse Word Order" mode to keep individual words intact while reversing their sequence.'
      }
    ],
    relatedToolIds: ['text-cleaner', 'case-converter', 'word-counter']
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'utility',
    categoryName: 'Utility & Calculators',
    description: 'Calculate your exact age in years, months, days, hours, and seconds, with next birthday countdown and zodiac information.',
    iconName: 'Calendar',
    isImplemented: true,
    popular: true,
    tags: ['age', 'birthday', 'calculator', 'date', 'zodiac', 'birthdate', 'how old', 'days lived', 'countdown'],
    features: [
      'Exact age breakdown: years, months, and days simultaneously',
      'Total units breakdown: total days, weeks, months, hours, and minutes lived',
      'Interactive next birthday countdown with day-of-week indicator',
      'Birth day of the week (e.g., Saturday) and Western/Chinese zodiac calculation',
      'Customizable target date to calculate age at any past or future point in time'
    ],
    howToUse: [
      'Select your birth date using the date selector.',
      'Optionally change the "Age as of date" if you want to know your age at a specific milestone.',
      'View your complete age analysis, milestones, and next birthday countdown.'
    ],
    faqs: [
      {
        question: 'Does this calculator account for leap years?',
        answer: 'Yes. The calculation uses full Gregorian calendar month and leap year adjustments for precise day and year totals.'
      },
      {
        question: 'Is my date of birth stored anywhere?',
        answer: 'No. The calculation is performed purely on your device in your browser session. No personal dates are transmitted or saved.'
      }
    ],
    relatedToolIds: ['percentage-calculator', 'qr-code-generator', 'password-generator']
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'utility',
    categoryName: 'Utility & Calculators',
    description: 'Solve percentage problems: calculate percentage of values, percentage changes (increase/decrease), and discount/tax amounts.',
    iconName: 'Percent',
    isImplemented: true,
    popular: true,
    tags: ['percentage', 'percent', 'calculator', 'discount', 'increase', 'decrease', 'sales tax', 'tip', 'math', 'ratio'],
    features: [
      '4 essential calculation modes: "X% of Y", "X is what % of Y", "Percentage Change (Increase/Decrease)", and "Add/Subtract %"',
      'Clear mathematical formulas and step-by-step reasoning shown for each result',
      'Color-coded positive/negative indicators for percentage fluctuations',
      'One-click result copying and instant recalculation'
    ],
    howToUse: [
      'Choose the percentage calculation type matching your problem.',
      'Enter the numerical values into the input fields.',
      'Read the calculated answer along with the mathematical breakdown below.'
    ],
    faqs: [
      {
        question: 'How do you calculate percentage increase?',
        answer: 'Subtract the old value from the new value, divide by the absolute original value, and multiply by 100: ((New - Old) / Old) * 100.'
      },
      {
        question: 'Can I use this for sales discounts and tips?',
        answer: 'Yes! Mode 4 ("Add / Subtract Percentage") allows you to enter a price and discount/tax rate to find the exact net total.'
      }
    ],
    relatedToolIds: ['age-calculator', 'unit-converter', 'word-counter']
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'utility',
    categoryName: 'Utility & Calculators',
    description: 'Generate ultra-secure, cryptographically random passwords with custom lengths, character sets, and live entropy strength meters.',
    iconName: 'ShieldCheck',
    isImplemented: true,
    popular: true,
    tags: ['password', 'generator', 'security', 'random', 'strong password', 'entropy', 'credentials', 'pin'],
    features: [
      'Powered by window.crypto.getRandomValues for true cryptographic randomness',
      'Custom length slider ranging from 4 to 64 characters',
      'Granular character toggles: uppercase, lowercase, digits, symbols',
      'Option to avoid ambiguous characters (like 1, l, I, 0, O, o)',
      'Real-time entropy score (bits) and brute-force crack time estimates',
      'Bulk generation option (generate 1, 5, or 10 passwords at a time)',
      'One-click clipboard copy with animated verification'
    ],
    howToUse: [
      'Adjust the password length slider to your desired length (16+ recommended).',
      'Toggle the character sets and ambiguity filters you require.',
      'Click "Regenerate" or inspect the generated password.',
      'Click the copy button to copy it safely to your clipboard.'
    ],
    faqs: [
      {
        question: 'Are generated passwords safe from being intercepted?',
        answer: 'Yes. Passwords are generated directly inside your browser memory using the Web Cryptography API. They are never sent across the internet.'
      },
      {
        question: 'What is a good password entropy score?',
        answer: 'A password with 60 to 80 bits of entropy is considered strong for most consumer services. Over 80 bits provides enterprise-grade protection against brute-force attacks.'
      }
    ],
    relatedToolIds: ['qr-code-generator', 'character-counter', 'base64-converter']
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'utility',
    categoryName: 'Utility & Calculators',
    description: 'Generate high-resolution QR codes for websites, plain text, WiFi networks, emails, and phone numbers. Download PNG or SVG.',
    iconName: 'QrCode',
    isImplemented: true,
    popular: true,
    tags: ['qr', 'qr code', 'generator', 'wifi qr', 'barcode', 'scan', 'svg', 'png', 'link to qr'],
    features: [
      'Pure client-side generation without any external tracking or 3rd party APIs',
      'Multi-format support: Website URL, Plain Text, WiFi Network, Email, Phone, SMS',
      'Custom foreground and background color pickers',
      'Adjustable error correction level (L: 7%, M: 15%, Q: 25%, H: 30%)',
      'Export directly to PNG image or vector SVG for print and web design',
      'Live scan preview with real-time reactive updates'
    ],
    howToUse: [
      'Select the payload type (URL, WiFi, Text, Email, Phone).',
      'Fill in the target details (e.g. WiFi SSID and password, or web URL).',
      'Customize colors and resolution if desired.',
      'Click "Download PNG" or "Download SVG" to save your high-resolution QR code.'
    ],
    faqs: [
      {
        question: 'Do these QR codes expire?',
        answer: 'No. These are static QR codes that encode your data directly into the matrix. They never expire and do not route through any redirect server.'
      },
      {
        question: 'What error correction level should I choose?',
        answer: 'Medium (15%) is great for digital screens. High (30%) is recommended if you plan to print the QR code on paper, packaging, or business cards where scratches could occur.'
      }
    ],
    relatedToolIds: ['password-generator', 'barcode-generator', 'url-encoder']
  },

  // --- Image Tools ---
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Compress JPG, PNG, and WebP images directly in your browser with adjustable quality levels to reduce file size without losing clarity.',
    iconName: 'Image',
    isImplemented: true,
    popular: true,
    tags: ['image', 'compress', 'compressor', 'jpg', 'png', 'webp', 'shrink', 'file size', 'optimize image'],
    features: [
      'Client-side HTML5 canvas compression with zero server upload',
      'Adjustable compression quality ratio (10% - 100%)',
      'Support for JPG, PNG, and modern WebP output formats',
      'Side-by-side original vs compressed size comparison & savings percentage',
      'Instant high-resolution download'
    ],
    howToUse: [
      'Drag and drop or select an image file (JPG, PNG, or WebP) from your device.',
      'Adjust the quality slider to balance visual fidelity and file size.',
      'Choose your preferred target format if desired.',
      'Download the compressed file with a single click.'
    ],
    faqs: [
      {
        question: 'How does client-side compression work?',
        answer: 'The browser decodes the image into an in-memory canvas element and re-encodes it at the specified target quality level using standard Web APIs.'
      },
      {
        question: 'Are my private photos uploaded to any server?',
        answer: 'Never. Every byte is processed strictly inside your device’s local browser memory.'
      }
    ],
    relatedToolIds: ['image-resizer', 'jpg-to-png', 'png-to-jpg']
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Resize image dimensions by exact pixels or percentage scale while preserving aspect ratio, perfect for web and social media.',
    iconName: 'Maximize2',
    isImplemented: true,
    popular: true,
    tags: ['image', 'resize', 'dimensions', 'width', 'height', 'scale', 'aspect ratio', 'pixels', 'resizer'],
    features: [
      'Custom pixel width & height resizing with high-quality bicubic canvas interpolation',
      'Lock aspect ratio toggle to prevent visual distortion',
      'Percentage scaling presets (25%, 50%, 75%, 100%, 150%, 200%)',
      'Multi-format export: Original, JPG, PNG, or WebP',
      'Instant client-side download'
    ],
    howToUse: [
      'Upload the image you want to resize.',
      'Enter the target width or height, or select a preset percentage.',
      'Toggle aspect ratio lock according to your formatting requirements.',
      'Preview the resized image and click download.'
    ],
    faqs: [
      {
        question: 'Will resizing reduce quality?',
        answer: 'Scaling down maintains crispness while reducing memory footprint. Scaling up significantly may introduce softness or pixelation.'
      },
      {
        question: 'Can I resize photos for social media limits?',
        answer: 'Yes. Enter the exact pixel dimensions required (e.g. 1080×1080 for Instagram, 1200×630 for Facebook or Twitter) to resize instantly.'
      }
    ],
    relatedToolIds: ['image-compressor', 'jpg-to-png', 'png-to-jpg']
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Convert JPEG/JPG images to lossless PNG format with clean 24-bit RGB raster encoding entirely in your browser.',
    iconName: 'RefreshCw',
    isImplemented: true,
    popular: false,
    tags: ['jpg', 'png', 'convert', 'format', 'image converter', 'lossless', 'jpeg to png'],
    features: [
      'Lossless re-encoding from JPEG to 24-bit PNG',
      'Preserves original pixel dimensions exactly',
      '100% private in-browser conversion with zero server latency',
      'Side-by-side output preview and instant download'
    ],
    howToUse: [
      'Select or drop your JPEG/JPG image file.',
      'Review the decoded image preview and source dimensions.',
      'Click Download PNG to save the lossless file.'
    ],
    faqs: [
      {
        question: 'Why convert JPG to PNG?',
        answer: 'PNG uses lossless compression, making it ideal for diagrams, screenshots, and graphics where sharpness is paramount.'
      }
    ],
    relatedToolIds: ['png-to-jpg', 'image-compressor', 'image-resizer']
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Convert PNG images to lightweight JPG format with custom background color fill for transparent areas.',
    iconName: 'RefreshCw',
    isImplemented: true,
    popular: false,
    tags: ['png', 'jpg', 'jpeg', 'convert', 'file size reduction', 'png to jpg'],
    features: [
      'Fast PNG to JPEG rasterization directly via HTML5 Canvas',
      'Custom background color selector for transparent regions (default white, plus custom palette)',
      'Adjustable JPEG compression quality slider',
      'Immediate side-by-side preview with transparency checkerboard'
    ],
    howToUse: [
      'Upload a PNG file with or without transparency.',
      'Select a background color fill for transparent areas.',
      'Adjust the output quality if desired.',
      'Download the lightweight JPG.'
    ],
    faqs: [
      {
        question: 'What happens to transparent backgrounds in JPG?',
        answer: 'Because JPG does not support alpha transparency, transparent areas are filled with a solid background color (default white, or your custom selection).'
      }
    ],
    relatedToolIds: ['jpg-to-png', 'image-compressor', 'image-resizer']
  },

  // --- PDF Tools ---
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Reduce the file size of PDF documents for email attachments and web upload limits using client-side compression.',
    iconName: 'FileArchive',
    isImplemented: true,
    popular: true,
    tags: ['pdf', 'compress', 'shrink pdf', 'document', 'size', 'email attachment', 'optimize pdf'],
    features: [
      'In-browser PDF stream and object stream compaction',
      'Multiple compression presets (Low, Medium Balanced, High)',
      'Side-by-side original vs compressed file size and reduction percentage',
      'Zero file retention or server transfer: 100% private in client memory'
    ],
    howToUse: [
      'Select or drag-and-drop a PDF file from your device.',
      'Pick your preferred compression intensity (Low, Medium, or High).',
      'Review the calculated file size and download your compressed PDF.'
    ],
    faqs: [
      {
        question: 'Are my confidential PDF documents safe?',
        answer: 'Yes! Processing executes entirely locally in your browser memory so your sensitive documents never touch a third-party server.'
      },
      {
        question: 'Why did my PDF only shrink slightly?',
        answer: 'PDFs that already contain pre-compressed images or compacted vector objects cannot be compressed further without downsampling embedded graphics.'
      }
    ],
    relatedToolIds: ['pdf-merger', 'pdf-splitter', 'image-compressor']
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Combine multiple PDF files into a single organized document with custom page reordering.',
    iconName: 'Files',
    isImplemented: true,
    popular: true,
    tags: ['pdf', 'merge', 'combine', 'join pdf', 'bind', 'document', 'pdf joiner'],
    features: [
      'Interactive file list with drag-and-drop and up/down reordering',
      'Merge unlimited pages into one unified master PDF document',
      'Page count and file size preview for each input file',
      'Fast client-side binary assembly with zero server latency'
    ],
    howToUse: [
      'Upload two or more PDF documents using the file picker or drag-and-drop.',
      'Reorder items using the Move Up / Move Down buttons to set the final sequence.',
      'Click "Merge PDFs Now" and download your combined document.'
    ],
    faqs: [
      {
        question: 'Is there a limit to how many PDFs I can merge?',
        answer: 'The merger handles dozens of documents and hundreds of pages depending on your device RAM, running entirely client-side without paywalls.'
      },
      {
        question: 'Does merging alter my original files?',
        answer: 'No. Original files on your computer are untouched. A brand new combined document is synthesized in your browser.'
      }
    ],
    relatedToolIds: ['pdf-compressor', 'pdf-splitter']
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Extract specific pages or page ranges from large PDF documents into separate individual PDF files.',
    iconName: 'Scissors',
    isImplemented: true,
    popular: true,
    tags: ['pdf', 'split', 'extract pages', 'separate', 'document pages', 'cut pdf'],
    features: [
      'Three versatile split modes: Custom Page Ranges, Split Every N Pages, or All Individual Pages',
      'Input validation for page ranges (e.g., 1, 3, 5-8)',
      'Batch download options for all generated PDF documents',
      'Fast client-side processing without uploading files to any server'
    ],
    howToUse: [
      'Upload your PDF file.',
      'Choose whether to extract specific page ranges, split every N pages, or extract all single pages.',
      'Click "Split PDF Now" and download individual files or the whole batch.'
    ],
    faqs: [
      {
        question: 'How do I specify multiple page ranges?',
        answer: 'Use commas and hyphens, for example: "1-3, 5, 7-10".'
      },
      {
        question: 'Can I extract a single page from a 100-page PDF?',
        answer: 'Yes, simply enter the target page number (e.g., "42") and click Split.'
      }
    ],
    relatedToolIds: ['pdf-merger', 'pdf-compressor']
  },

  // --- Other Utility Tools ---
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    category: 'utility',
    categoryName: 'Utility & Calculators',
    description: 'Create standard 1D barcodes including Code 128, EAN-13, and UPC-A with custom labels and vector downloads.',
    iconName: 'Barcode',
    isImplemented: true,
    popular: true,
    tags: ['barcode', 'code 128', 'ean13', 'upc', 'retail', 'inventory', 'sku', 'generator', 'code128', 'upc-a'],
    features: [
      'Support for industry standards: Code 128, EAN-13, and UPC-A',
      'Instant client-side barcode matrix rendering on canvas and SVG',
      'Automatic check-digit computation and validation for EAN-13 and UPC-A',
      'Customizable bar width, height, background, and line colors',
      'Download high-resolution PNG or vector SVG with zero external tracking'
    ],
    howToUse: [
      'Select your barcode standard (Code 128, EAN-13, or UPC-A).',
      'Enter the numeric or alphanumeric payload in the input field.',
      'Customize dimensions, display text, or colors if desired.',
      'Download the barcode as a crisp PNG image or vector SVG file.'
    ],
    faqs: [
      {
        question: 'What is the difference between Code 128, EAN-13, and UPC-A?',
        answer: 'Code 128 supports any alphanumeric ASCII text, making it ideal for shipping and inventory tags. EAN-13 (13 digits) and UPC-A (12 digits) are retail standards worldwide for product barcodes.'
      },
      {
        question: 'Does this generator require a server or paid API?',
        answer: 'No. The barcode graphics are rendered 100% locally in your browser using client-side JavaScript.'
      }
    ],
    relatedToolIds: ['qr-code-generator', 'password-generator', 'url-encoder']
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'utility',
    categoryName: 'Utility & Calculators',
    description: 'Convert length, weight/mass, temperature, area, volume, speed, time, and digital data storage units instantaneously.',
    iconName: 'Scale',
    isImplemented: true,
    popular: true,
    tags: ['unit', 'converter', 'metric', 'imperial', 'length', 'weight', 'temperature', 'celsius', 'fahrenheit', 'kg to lbs', 'area', 'volume', 'speed', 'data storage'],
    features: [
      'Support for 8 core categories: Length, Weight/Mass, Temperature, Area, Volume, Speed, Time, Data Storage',
      'Bidirectional instant real-time calculation',
      'One-click unit swap button and clear input control',
      'Clear formula explanation with conversion ratio details',
      'Accurate precision handling with copyable results'
    ],
    howToUse: [
      'Select a measurement category from the category selector.',
      'Choose the "From" and "To" units from the dropdown menus.',
      'Enter a numerical value in the input field to view the converted result instantly.',
      'Use the "Swap Units" button to invert the conversion direction.'
    ],
    faqs: [
      {
        question: 'Does it support both Metric and Imperial units?',
        answer: 'Yes. All common Metric (SI) and Imperial units are supported across all categories with accurate conversion factors.'
      },
      {
        question: 'How are temperature scales converted?',
        answer: 'Temperature conversions use exact thermodynamic offset formulas: Fahrenheit = (Celsius × 9/5) + 32, and Kelvin = Celsius + 273.15.'
      }
    ],
    relatedToolIds: ['percentage-calculator', 'age-calculator', 'word-counter']
  },

  // --- Developer Tools ---
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Prettify, format, validate, and minify JSON code with syntax error detection and clean indentation.',
    iconName: 'Braces',
    isImplemented: true,
    popular: true,
    tags: ['json', 'formatter', 'validator', 'prettify', 'minify', 'developer', 'parse', 'indent', 'format json'],
    features: [
      'Safe client-side JSON parsing using standard Web APIs (no eval)',
      'Adjustable indentation: 2 spaces, 4 spaces, or Tab characters',
      'One-click minification to eliminate whitespace for production payloads',
      'Detailed syntax error highlighting with character position and message',
      'Individual copy buttons for formatted or minified output, plus sample loader'
    ],
    howToUse: [
      'Paste your raw or minified JSON text into the editor.',
      'Click "Format JSON" to beautify or "Minify JSON" to compress.',
      'Inspect any syntax errors displayed in the error diagnostics panel.',
      'Copy the clean result or download it directly to your device.'
    ],
    faqs: [
      {
        question: 'Is my JSON transmitted to a remote server or API?',
        answer: 'Never. Parsing and validation happen entirely in your local browser JavaScript engine.'
      },
      {
        question: 'Can this tool validate large JSON objects?',
        answer: 'Yes, it processes multi-megabyte payloads swiftly in browser memory.'
      }
    ],
    relatedToolIds: ['url-encoder', 'base64-converter', 'case-converter']
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder / Decoder',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Encode special characters into percent-encoded URI strings or decode encoded URLs back to human-readable format.',
    iconName: 'Link',
    isImplemented: true,
    popular: false,
    tags: ['url', 'encode', 'decode', 'uri', 'percent encoding', 'query parameters', 'developer', 'url encoder', 'url decoder'],
    features: [
      'Support for both Component mode (encodeURIComponent) and Full URI mode (encodeURI)',
      'Bidirectional instant encoding and decoding',
      'Safe character preservation and malformed sequence handling',
      'One-click copy and clear controls',
      '100% private client-side processing'
    ],
    howToUse: [
      'Paste or type the text or URL you want to convert into the input area.',
      'Select "Encode" or "Decode" mode.',
      'Choose whether to encode as a URL Component (query param) or Full URI.',
      'Copy the converted result to your clipboard.'
    ],
    faqs: [
      {
        question: 'When should I use Component vs Full URI mode?',
        answer: 'Use Component mode when encoding query parameter values (it encodes symbols like "&", "=", and "?"). Use Full URI mode when preserving the overall URL structure while escaping invalid characters.'
      }
    ],
    relatedToolIds: ['base64-converter', 'json-formatter', 'qr-code-generator']
  },
  {
    id: 'base64-converter',
    name: 'Base64 Encoder / Decoder',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Convert plain text to Base64 representation or decode Base64 strings back to standard UTF-8 text with full Unicode support.',
    iconName: 'Binary',
    isImplemented: true,
    popular: false,
    tags: ['base64', 'encode', 'decode', 'binary', 'ascii', 'utf8', 'developer', 'base64 encoder', 'base64 decoder', 'unicode'],
    features: [
      'Full UTF-8 Unicode support: correctly encodes and decodes accented letters, foreign alphabets, and emojis',
      'Real-time input validation detecting invalid Base64 padding or illegal characters',
      'One-click mode switcher (Encode Text → Base64, or Decode Base64 → Text)',
      'Clear, copy, and sample text loaders',
      'Client-side execution with zero external requests'
    ],
    howToUse: [
      'Choose "Encode to Base64" or "Decode from Base64".',
      'Type or paste your content in the input area.',
      'View the converted text in real time or inspect validation warnings.',
      'Click "Copy Result" to copy it to your clipboard.'
    ],
    faqs: [
      {
        question: 'Why do other Base64 tools fail on emojis and special characters?',
        answer: 'Native btoa/atob only handles Latin1 (1 byte per char). ToolNest uses TextEncoder/TextDecoder to properly support all multi-byte UTF-8 Unicode characters without crashes.'
      }
    ],
    relatedToolIds: ['url-encoder', 'json-formatter', 'password-generator']
  },
  {
    id: 'slug-generator',
    name: 'URL Slug Generator',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Convert article titles and headlines into search-engine-friendly, clean URL slugs with customizable separators and Unicode support.',
    iconName: 'Link',
    isImplemented: true,
    popular: true,
    tags: ['slug', 'url', 'permalink', 'seo', 'generator', 'hyphenate', 'clean url', 'article title'],
    features: [
      'Transforms spaces and punctuation into clean URL-safe delimiters',
      'Configurable separator: Hyphen (-) or Underscore (_)',
      'Automatic lowercase normalization and duplicate hyphen collapsing',
      'Support for ASCII transliteration or preserving international Unicode characters',
      'Live URL preview and one-click copy'
    ],
    howToUse: [
      'Type or paste your post title or headline.',
      'Choose your preferred separator and casing options.',
      'Copy the generated slug directly into your CMS or codebase.'
    ],
    faqs: [
      {
        question: 'Why are URL slugs important for SEO?',
        answer: 'Clean, descriptive slugs help search engines understand page topics and improve click-through rates by being easily readable by humans.'
      }
    ],
    relatedToolIds: ['url-encoder', 'text-cleaner', 'word-counter']
  },
  {
    id: 'color-converter',
    name: 'Color Converter (HEX · RGB · HSL)',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Convert colors interchangeably between HEX, RGB, and HSL formats with real-time visual preview swatch and palette presets.',
    iconName: 'Palette',
    isImplemented: true,
    popular: true,
    tags: ['color', 'converter', 'hex', 'rgb', 'hsl', 'css', 'color picker', 'palette', 'web design'],
    features: [
      'Bidirectional conversion between HEX, RGB, and HSL color models',
      'Interactive color swatch preview with click-to-pick native color wheel',
      'Random color generator for inspiration',
      'Pre-configured palette of popular web design colors',
      'One-click copying for individual HEX, RGB, and HSL values'
    ],
    howToUse: [
      'Enter a color in HEX (e.g. #4f46e5), RGB (e.g. rgb(79, 70, 229)), or HSL format.',
      'Watch all counterpart color codes update instantly.',
      'Click "Copy" next to any format to copy the code to your clipboard.'
    ],
    faqs: [
      {
        question: 'Does this support 3-digit shorthand HEX codes?',
        answer: 'Yes. Shorthand codes like #fff are automatically expanded to #ffffff.'
      }
    ],
    relatedToolIds: ['qr-code-generator', 'image-resizer', 'json-formatter']
  },
  {
    id: 'uuid-generator',
    name: 'UUID v4 Generator',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Generate cryptographically secure Version 4 UUIDs (Universally Unique Identifiers) in bulk directly in your browser.',
    iconName: 'Key',
    isImplemented: true,
    popular: true,
    tags: ['uuid', 'guid', 'v4', 'random', 'generator', 'unique id', 'developer', 'database key'],
    features: [
      'Powered by standard crypto.randomUUID and Web Cryptography API',
      'Bulk generation options: 1, 5, 10, 25, or 50 UUIDs at a time',
      'Customizable casing (lowercase or uppercase)',
      'Format toggle: standard hyphens (8-4-4-4-12) or raw 32-character string',
      'Copy individual UUIDs or download the full batch as a text file'
    ],
    howToUse: [
      'Select the number of UUIDs you want to generate.',
      'Adjust casing or hyphen preferences.',
      'Click "Copy All" or download the text file.'
    ],
    faqs: [
      {
        question: 'Can two generated UUIDs ever collide?',
        answer: 'The probability of a collision in UUID v4 is approximately 1 in 2^122, making accidental duplication mathematically negligible.'
      }
    ],
    relatedToolIds: ['hash-generator', 'password-generator', 'base64-converter']
  },
  {
    id: 'hash-generator',
    name: 'Cryptographic Hash Generator',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Calculate cryptographic digests using SHA-256, SHA-512, SHA-384, and SHA-1 in your browser using the Web Crypto API.',
    iconName: 'Fingerprint',
    isImplemented: true,
    popular: true,
    tags: ['hash', 'sha256', 'sha512', 'sha384', 'sha1', 'crypto', 'digest', 'checksum', 'security'],
    features: [
      'Full client-side computation using the native Web Cryptography API (crypto.subtle)',
      'Simultaneous calculation of SHA-256, SHA-512, SHA-384, and SHA-1',
      'Full UTF-8 support for accented characters and international scripts',
      'Uppercase or lowercase hexadecimal output toggle',
      'Zero latency and zero transmission of plaintext data'
    ],
    howToUse: [
      'Type or paste the text you want to hash into the input area.',
      'Review the generated cryptographic hashes updating in real time.',
      'Click "Copy" next to your desired hash algorithm.'
    ],
    faqs: [
      {
        question: 'Can a hash be decrypted back into original text?',
        answer: 'No. Cryptographic hashes are one-way mathematical functions and cannot be reversed or decrypted.'
      }
    ],
    relatedToolIds: ['uuid-generator', 'password-generator', 'base64-converter']
  },
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Convert Unix epoch timestamps to human-readable UTC and local date formats, or convert dates back into epoch seconds and milliseconds.',
    iconName: 'Clock',
    isImplemented: true,
    popular: true,
    tags: ['timestamp', 'unix', 'epoch', 'date', 'time', 'converter', 'seconds', 'milliseconds', 'utc', 'local time'],
    features: [
      'Bidirectional conversion: Timestamp to Date, and Date to Timestamp',
      'Automatic detection of seconds (10 digits) vs milliseconds (13 digits)',
      'Displays full Local Browser Time (using your browser’s own timezone) and UTC',
      'Outputs ISO 8601 extended and relative time phrases (e.g. 2 hours ago)',
      'One-click "Use Current Timestamp" button'
    ],
    howToUse: [
      'To convert a timestamp: enter the numeric epoch value to view date equivalents.',
      'To convert a date: pick your date & time to calculate the exact epoch seconds and milliseconds.',
      'Copy any converted result with a single click.'
    ],
    faqs: [
      {
        question: 'What is a Unix epoch timestamp?',
        answer: 'A Unix timestamp is the total number of seconds elapsed since 00:00:00 UTC on January 1, 1970, not counting leap seconds.'
      }
    ],
    relatedToolIds: ['age-calculator', 'unit-converter', 'json-formatter']
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Previewer',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Live in-browser Markdown editor with instant sanitized HTML preview, task lists, code blocks, tables, and export options.',
    iconName: 'Code2',
    isImplemented: true,
    popular: true,
    tags: ['markdown', 'preview', 'editor', 'md', 'html', 'live preview', 'github markdown', 'render markdown'],
    features: [
      'Real-time live preview rendering as you type',
      'Supports headings, lists, blockquotes, code blocks, tables, and task checkboxes',
      'Rigorous XSS sanitization that neutralizes raw script and frame tags',
      'Flexible layout options: Split View, Editor Only, or Preview Only',
      'Download .md files or copy sanitized HTML with one click'
    ],
    howToUse: [
      'Write or paste Markdown into the left editor pane.',
      'Observe the live rendered HTML preview on the right.',
      'Copy the Markdown, copy the sanitized HTML, or download as a .md file.'
    ],
    faqs: [
      {
        question: 'Is my Markdown sanitized against script attacks?',
        answer: 'Yes! All raw HTML characters are escaped before parsing to ensure zero risk of cross-site scripting (XSS).'
      }
    ],
    relatedToolIds: ['word-counter', 'character-counter', 'json-formatter']
  },

  // --- Phase 6 Developer & Text Tools ---
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Test, validate, and debug regular expressions with live visual match highlights, capture groups, flag toggles, and pattern presets.',
    iconName: 'Code2',
    isImplemented: true,
    popular: true,
    tags: ['regex', 'regular expression', 'pattern', 'match', 'test regex', 'tester', 'flags', 'capture groups', 'developer'],
    features: [
      'Interactive real-time match evaluation with loop guard safety',
      'Configurable flags: Global (g), Case-Insensitive (i), Multiline (m), DotAll (s), Unicode (u)',
      'Visual match highlighting with index positions and length statistics',
      'Capture group inspection table for extracting specific token values',
      'Curated regular expression presets: Email, URL, Hex color, IPv4, Date formats'
    ],
    howToUse: [
      'Enter your regular expression pattern in the pattern input box.',
      'Toggle regex flags (g, i, m, s, u) according to your match criteria.',
      'Type or paste your target test string into the text area.',
      'Examine the highlighted match occurrences and capture group breakdown.'
    ],
    faqs: [
      {
        question: 'Does this tool execute eval() or send data to servers?',
        answer: 'No. Patterns are safely compiled using the standard JavaScript RegExp constructor in your browser with zero server communication.'
      },
      {
        question: 'How do capture groups work?',
        answer: 'Parentheses () in your regex pattern define capture groups, which appear in the detailed match table below the preview.'
      }
    ],
    relatedToolIds: ['json-diff', 'text-diff', 'url-encoder']
  },
  {
    id: 'json-diff',
    name: 'JSON Diff & Compare',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Compare two JSON objects or arrays structurally to pinpoint added, removed, and modified values with visual highlighting.',
    iconName: 'GitCompare',
    isImplemented: true,
    popular: true,
    tags: ['json', 'diff', 'compare', 'compare json', 'json diff', 'structural comparison', 'json compare', 'developer'],
    features: [
      'Deep structural comparison of nested JSON objects and arrays',
      'Categorized change breakdown: Added (+), Removed (-), and Modified (~)',
      'Syntax validation with precise line error notifications for invalid JSON',
      'One-click JSON formatting, Swap A/B, and filter only differences',
      'Exportable unified text diff summary for pull requests and documentation'
    ],
    howToUse: [
      'Paste your baseline JSON document into the JSON A editor.',
      'Paste your revised JSON document into the JSON B editor.',
      'Review the categorized structural diff entries and summary metrics.',
      'Use the filter toggle to view all keys or exclusively modified values.'
    ],
    faqs: [
      {
        question: 'Does this compare raw strings or parsed data structures?',
        answer: 'It parses both JSON documents into abstract syntax trees and compares keys and values hierarchically, ignoring arbitrary key order or whitespace.'
      }
    ],
    relatedToolIds: ['json-formatter', 'text-diff', 'regex-tester']
  },
  {
    id: 'text-diff',
    name: 'Text Diff Checker',
    category: 'text',
    categoryName: 'Text Tools',
    description: 'Compare two text passages side-by-side or line-by-line to reveal added, deleted, and altered lines using an LCS diff engine.',
    iconName: 'ArrowRightLeft',
    isImplemented: true,
    popular: true,
    tags: ['text diff', 'compare text', 'diff checker', 'line comparison', 'file diff', 'text compare', 'lcs'],
    features: [
      'High-performance Longest Common Subsequence (LCS) line diff algorithm',
      'Side-by-side editing panes with line-numbered synchronized views',
      'Optional whitespace ignore toggle for focusing on semantic changes',
      'Detailed comparison metrics: Added lines, Removed lines, Unchanged lines',
      'One-click unified diff export compatible with Git and patch utilities'
    ],
    howToUse: [
      'Paste your original text into Text A.',
      'Paste your updated text into Text B.',
      'View the highlighted line differences in the Unified Diff result pane.',
      'Copy the unified diff or swap text sides with one click.'
    ],
    faqs: [
      {
        question: 'Are large text files supported?',
        answer: 'Yes, typical document comparisons (hundreds of lines) execute instantaneously in your browser memory.'
      }
    ],
    relatedToolIds: ['text-cleaner', 'word-counter', 'json-diff']
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Decode and inspect JSON Web Tokens (JWT) payload claims, algorithm headers, and expiration timestamps securely in your browser.',
    iconName: 'KeyRound',
    isImplemented: true,
    popular: true,
    tags: ['jwt', 'token', 'decode jwt', 'jwt decoder', 'bearer token', 'json web token', 'claims', 'auth', 'expiration'],
    features: [
      'Base64URL decoding with full UTF-8 character encoding support',
      'Formatted color-coded JSON inspector for Header, Payload, and Signature',
      'Automatic expiration analysis: Active vs Expired status and human-readable dates',
      'Zero-transmission privacy: tokens are never transmitted to any network server',
      'One-click copying for decoded claims and payloads'
    ],
    howToUse: [
      'Paste an encoded JSON Web Token into the input field.',
      'Inspect the decoded Header properties and Payload claims.',
      'Check the expiration badge to confirm token validity.',
      'Copy formatted JSON claims for debugging API requests.'
    ],
    faqs: [
      {
        question: 'Does this tool verify token signatures?',
        answer: 'No. This is a client-side payload decoder. Signature verification requires server-side public or private keys.'
      }
    ],
    relatedToolIds: ['base64-converter', 'hash-generator', 'timestamp-converter']
  },
  {
    id: 'html-encoder',
    name: 'HTML Entity Encoder / Decoder',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Convert special characters to safe HTML entities or decode entities back to plain text to prevent XSS vulnerabilities.',
    iconName: 'Code',
    isImplemented: true,
    popular: true,
    tags: ['html', 'entities', 'encode html', 'decode html', 'xss', 'html entities', 'escape html', 'unescape', 'web'],
    features: [
      'Bidirectional conversion: Raw Text to HTML Entities and Entities to Text',
      'Three encoding scopes: Basic (<, >, &, \", \'), Extended Named, and Numeric Decimal',
      'Decodes all standard named entities (e.g. &copy;, &euro;, &trade;) and numeric entities',
      'Side-by-side editing with character and line count analytics',
      'Essential HTML entities quick reference cheat-sheet included'
    ],
    howToUse: [
      'Select Encode or Decode mode using the toggle button.',
      'Enter or paste text into the input textarea.',
      'Choose your preferred entity encoding scope (Basic, Extended, or Decimal).',
      'Copy or download the safe encoded HTML entities output.'
    ],
    faqs: [
      {
        question: 'Why should I encode HTML entities?',
        answer: 'Encoding reserved characters like < and & prevents browsers from interpreting user input as live markup, defending against cross-site scripting (XSS).'
      }
    ],
    relatedToolIds: ['url-encoder', 'base64-converter', 'markdown-preview']
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter & Minifier',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Beautify unformatted CSS stylesheets or minify CSS to reduce file size and accelerate web performance.',
    iconName: 'FileCode',
    isImplemented: true,
    popular: true,
    tags: ['css', 'formatter', 'minify css', 'beautify css', 'css minifier', 'stylesheet', 'compress css', 'clean css'],
    features: [
      'Dual mode engine: Format/Beautify for readability or Minify for production deployment',
      'Custom indentation controls: 2 spaces, 4 spaces, or Tab characters',
      'Supports CSS variables, complex selectors, media queries, and keyframe animations',
      'Instant size reduction metrics and bandwidth savings calculation',
      'Syntax integrity checker for matching curly brace pairs'
    ],
    howToUse: [
      'Paste your CSS stylesheet into the input editor.',
      'Choose "Format / Beautify" or "Minify / Compress".',
      'Adjust indentation preferences if beautifying.',
      'Copy the optimized CSS or download as a .css file.'
    ],
    faqs: [
      {
        question: 'How much bandwidth can CSS minification save?',
        answer: 'Minification typically reduces CSS file sizes by 20% to 50% by stripping whitespace and comments.'
      }
    ],
    relatedToolIds: ['json-formatter', 'html-encoder', 'color-converter']
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter & Beautifier',
    category: 'dev',
    categoryName: 'Developer Tools',
    description: 'Format, indent, and prettify messy SQL database queries with uppercase keywords, clause line breaks, and subquery alignment.',
    iconName: 'Database',
    isImplemented: true,
    popular: true,
    tags: ['sql', 'formatter', 'sql beautifier', 'format sql', 'database', 'query', 'mysql', 'postgres', 'sqlite', 'indent sql'],
    features: [
      'Universal SQL dialect formatting: PostgreSQL, MySQL, SQLite, Oracle, and SQL Server',
      'Configurable keyword casing: UPPERCASE, lowercase, or preserve original casing',
      'Major clause separation: SELECT, FROM, WHERE, JOINs, GROUP BY, ORDER BY, and HAVING',
      'Minify mode for packaging clean single-line queries into application code',
      'Preserves string literals and quoted identifier strings intact'
    ],
    howToUse: [
      'Paste your unformatted SQL query into the left editor.',
      'Select formatting preferences (UPPERCASE keywords, indentation spacing).',
      'View the neatly indented and organized SQL query.',
      'Copy formatted query or download as a .sql script file.'
    ],
    faqs: [
      {
        question: 'Does this tool connect to any database server?',
        answer: 'No. SQL formatting happens 100% locally in your web browser. No queries or credentials leave your computer.'
      }
    ],
    relatedToolIds: ['json-formatter', 'regex-tester', 'text-diff']
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    category: 'text',
    categoryName: 'Text Tools',
    description: 'Generate realistic dummy placeholder copy by paragraphs, sentences, words, or lists in plain text, HTML, or Markdown.',
    iconName: 'AlignLeft',
    isImplemented: true,
    popular: true,
    tags: ['lorem ipsum', 'dummy text', 'placeholder text', 'generator', 'lipsum', 'text generator', 'mockup copy', 'typography'],
    features: [
      'Generate by Paragraphs, Sentences, Individual Words, or Bulleted Lists',
      'Custom quantity selector from 1 to 50 items',
      'Optional classic opener: "Lorem ipsum dolor sit amet..."',
      'Multi-format export: Plain Text, HTML (<p> and <ul>), or Markdown',
      'Word, character, and paragraph count statistics with one-click regeneration'
    ],
    howToUse: [
      'Select the generation unit (Paragraphs, Sentences, Words, or List).',
      'Choose the desired quantity using the quick buttons or number input.',
      'Select output formatting (Plain Text, HTML, or Markdown).',
      'Copy the generated copy or download as a .txt or .html file.'
    ],
    faqs: [
      {
        question: 'What is Lorem Ipsum?',
        answer: 'Lorem Ipsum has been the industry standard dummy text since the 1500s, derived from Cicero\'s classical Latin literature.'
      }
    ],
    relatedToolIds: ['word-counter', 'character-counter', 'case-converter']
  }
];
