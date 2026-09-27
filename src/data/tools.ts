import { ToolItem } from '../types/tool';

export const CATEGORIES = [
  { id: 'all', name: 'All Tools', description: 'Browse all available utilities and calculators' },
  { id: 'text', name: 'Text Tools', description: 'Word counters, character statistics, and text manipulation' },
  { id: 'utility', name: 'Utility & Calculators', description: 'Quick everyday calculators, passwords, and QR generators' },
  { id: 'dev', name: 'Developer Tools', description: 'Formatters, decoders, and technical workflow helpers' },
  { id: 'image', name: 'Image Tools', description: 'Fast client-side image transformations and optimization' },
  { id: 'pdf', name: 'PDF Tools', description: 'Browser-based document reorganization and compression' },
  { id: 'ai', name: 'AI Tools (Preview)', description: 'Upcoming smart language and creative generation assistants' },
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
    isImplemented: false,
    popular: false,
    tags: ['pdf', 'compress', 'shrink pdf', 'document', 'size', 'email attachment'],
    features: [
      'In-browser PDF stream downsampling',
      'Multiple compression presets (Basic, Medium, Maximum)',
      'Zero file retention or server transfer'
    ],
    howToUse: [
      'Select the PDF file from your device.',
      'Pick your target compression intensity.',
      'Download the reduced PDF file.'
    ],
    faqs: [
      {
        question: 'Are my confidential PDF documents safe?',
        answer: 'Yes! Processing is designed to execute locally in client memory so your sensitive documents never touch a third-party server.'
      }
    ],
    relatedToolIds: ['pdf-merger', 'pdf-splitter', 'image-compressor'],
    statusNote: 'Catalog Architecture Preview · In-browser PDF stream engine in staging'
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Combine multiple PDF files into a single organized document with custom page reordering.',
    iconName: 'Files',
    isImplemented: false,
    popular: false,
    tags: ['pdf', 'merge', 'combine', 'join pdf', 'bind', 'document'],
    features: [
      'Drag-and-drop file reordering',
      'Merge unlimited pages into one master PDF',
      'Fast client-side binary assembly'
    ],
    howToUse: [
      'Upload two or more PDF documents.',
      'Drag cards to set the desired page order.',
      'Click "Merge PDFs" and download the merged document.'
    ],
    faqs: [
      {
        question: 'Is there a page limit for merging?',
        answer: 'The merger handles hundreds of pages depending on your device RAM, running entirely client-side without arbitrary paywalls.'
      }
    ],
    relatedToolIds: ['pdf-compressor', 'pdf-splitter'],
    statusNote: 'Catalog Architecture Preview'
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Extract specific pages or page ranges from large PDF documents into separate individual PDF files.',
    iconName: 'Scissors',
    isImplemented: false,
    popular: false,
    tags: ['pdf', 'split', 'extract pages', 'separate', 'document pages'],
    features: [
      'Visual page range selector (e.g., 1-5, 8, 11-14)',
      'Extract single pages or split into individual single-page documents',
      'Fast client-side processing'
    ],
    howToUse: [
      'Upload your PDF file.',
      'Specify the pages or ranges you wish to extract.',
      'Download the extracted PDF bundle.'
    ],
    faqs: [
      {
        question: 'How do I specify multiple page ranges?',
        answer: 'Use commas and hyphens, for example: "1-3, 5, 7-10".'
      }
    ],
    relatedToolIds: ['pdf-merger', 'pdf-compressor'],
    statusNote: 'Catalog Architecture Preview'
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

  // --- AI Tools (Architecture & UI Preview without fake pretend execution) ---
  {
    id: 'ai-text-summarizer',
    name: 'AI Text Summarizer',
    category: 'ai',
    categoryName: 'AI Tools',
    description: 'Condense long articles, research papers, and documents into executive bullet points and key takeaways.',
    iconName: 'Sparkles',
    isImplemented: false,
    popular: false,
    tags: ['ai', 'summarize', 'summary', 'tldr', 'executive summary', 'bullets', 'notes'],
    features: [
      'Adjustable summary depth: Bullet Points, Quick TL;DR, or Executive Brief',
      'Tone customization: Professional, Academic, Casual',
      'Architected for zero-cost client integration or user-provided keys'
    ],
    howToUse: [
      'Paste your source article or long-form copy.',
      'Select preferred summary format.',
      'Review the generated summary points once the AI connector is active.'
    ],
    faqs: [
      {
        question: 'Is this AI tool currently active?',
        answer: 'This is an architecture preview. In adherence to our $0 budget and transparency policy, AI execution is clearly marked as upcoming and will connect to free client or self-configured APIs.'
      }
    ],
    relatedToolIds: ['ai-email-writer', 'ai-caption-generator', 'word-counter'],
    statusNote: 'Upcoming Feature · Architecture Preview (No fake simulation)'
  },
  {
    id: 'ai-email-writer',
    name: 'AI Email Writer',
    category: 'ai',
    categoryName: 'AI Tools',
    description: 'Draft professional emails, follow-ups, outreach messages, and polite replies based on simple prompt outlines.',
    iconName: 'Mail',
    isImplemented: false,
    popular: false,
    tags: ['ai', 'email', 'writer', 'draft', 'outreach', 'follow up', 'business'],
    features: [
      'Tone selection: Formal, Direct, Friendly, Persuasive',
      'Subject line generator with multiple variants',
      'Draft refinement controls'
    ],
    howToUse: [
      'Describe the recipient and the main goal of your email.',
      'Select the appropriate tone.',
      'Generate and customize your draft.'
    ],
    faqs: [
      {
        question: 'When will this feature be available?',
        answer: 'The user interface and state structure are built in this version. The model integration will be activated in an upcoming release.'
      }
    ],
    relatedToolIds: ['ai-text-summarizer', 'ai-caption-generator'],
    statusNote: 'Upcoming Feature · Architecture Preview (No fake simulation)'
  },
  {
    id: 'ai-caption-generator',
    name: 'AI Caption Generator',
    category: 'ai',
    categoryName: 'AI Tools',
    description: 'Generate engaging social media captions, hashtags, and hooks tailored for Instagram, LinkedIn, and X.',
    iconName: 'MessageSquare',
    isImplemented: false,
    popular: false,
    tags: ['ai', 'caption', 'social media', 'instagram', 'linkedin', 'hashtags', 'hook'],
    features: [
      'Platform tailored lengths and formatting',
      'Trending hashtag suggestion cluster',
      'Hook style variations (Question, Story, Punchy)'
    ],
    howToUse: [
      'Enter the topic, product, or theme of your post.',
      'Select your target social platform.',
      'Review generated hooks and captions.'
    ],
    faqs: [
      {
        question: 'Will it support custom tone of voice?',
        answer: 'Yes, future updates will include brand voice customization profiles.'
      }
    ],
    relatedToolIds: ['ai-text-summarizer', 'ai-email-writer', 'character-counter'],
    statusNote: 'Upcoming Feature · Architecture Preview (No fake simulation)'
  }
];
