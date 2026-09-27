import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Download, Sparkles, Database, Sliders, Play } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface SqlFormatterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_SQL = `select u.id, u.username, u.email, count(o.id) as total_orders, sum(o.amount) as total_spent, max(o.created_at) as latest_order from users u left join orders o on u.id = o.user_id where u.status = 'active' and u.created_at >= '2026-01-01' and o.status in ('completed', 'shipped') group by u.id, u.username, u.email having sum(o.amount) > 250.00 order by total_spent desc, u.username asc limit 50;`;

const SQL_KEYWORDS = [
  'SELECT', 'DISTINCT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'LIKE', 'BETWEEN',
  'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN',
  'ON', 'GROUP BY', 'HAVING', 'ORDER BY', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'UNION', 'UNION ALL',
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'DEFAULT',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS', 'EXISTS', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'
];

// Clauses that should start on a fresh newline
const MAJOR_CLAUSES = [
  'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'CROSS JOIN',
  'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET',
  'UNION ALL', 'UNION', 'VALUES', 'SET'
];

function formatSql(
  rawSql: string,
  indentStr: string,
  caseOption: 'upper' | 'lower' | 'preserve'
): string {
  if (!rawSql.trim()) return '';

  // Step 1: Tokenize while protecting string literals
  const tokens: { text: string; isString: boolean }[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < rawSql.length; i++) {
    const char = rawSql[i];
    const prev = i > 0 ? rawSql[i - 1] : '';

    if ((char === "'" || char === '"') && prev !== '\\') {
      if (!inString) {
        if (current) {
          tokens.push({ text: current, isString: false });
          current = '';
        }
        inString = true;
        stringChar = char;
        current += char;
      } else if (stringChar === char) {
        current += char;
        tokens.push({ text: current, isString: true });
        current = '';
        inString = false;
      } else {
        current += char;
      }
      continue;
    }

    if (inString) {
      current += char;
    } else {
      if (char === '(' || char === ')' || char === ',' || char === ';') {
        if (current) {
          tokens.push({ text: current, isString: false });
          current = '';
        }
        tokens.push({ text: char, isString: false });
      } else if (/\s/.test(char)) {
        if (current) {
          tokens.push({ text: current, isString: false });
          current = '';
        }
      } else {
        current += char;
      }
    }
  }

  if (current) {
    tokens.push({ text: current, isString: inString });
  }

  // Step 2: Assemble query with clause line breaks and indentation
  let result = '';
  let depth = 0;
  let lineHasTokens = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.isString) {
      result += (lineHasTokens ? ' ' : '') + token.text;
      lineHasTokens = true;
      continue;
    }

    let word = token.text;
    const upperWord = word.toUpperCase();

    // Check for 2-word clauses like GROUP BY, ORDER BY, LEFT JOIN
    let matchedClause = '';
    const nextToken = i < tokens.length - 1 && !tokens[i + 1].isString ? tokens[i + 1].text.toUpperCase() : '';
    const twoWord = `${upperWord} ${nextToken}`;

    if (MAJOR_CLAUSES.includes(twoWord)) {
      matchedClause = twoWord;
      i++; // advance past the second word
    } else if (MAJOR_CLAUSES.includes(upperWord)) {
      matchedClause = upperWord;
    }

    if (matchedClause) {
      const displayClause =
        caseOption === 'upper'
          ? matchedClause
          : caseOption === 'lower'
          ? matchedClause.toLowerCase()
          : matchedClause;

      if (result.length > 0 && !result.endsWith('\n')) {
        result += '\n';
      }
      result += indentStr.repeat(depth) + displayClause;
      lineHasTokens = true;
      continue;
    }

    // Capitalize other keywords if applicable
    if (SQL_KEYWORDS.includes(upperWord)) {
      word = caseOption === 'upper' ? upperWord : caseOption === 'lower' ? upperWord.toLowerCase() : word;
    }

    if (token.text === '(') {
      result += ' (';
      depth++;
      result += '\n' + indentStr.repeat(depth);
      lineHasTokens = false;
    } else if (token.text === ')') {
      depth = Math.max(0, depth - 1);
      result = result.trimEnd() + '\n' + indentStr.repeat(depth) + ')';
      lineHasTokens = true;
    } else if (token.text === ',') {
      result += ',';
      if (depth === 0) {
        result += '\n' + indentStr.repeat(depth + 1);
        lineHasTokens = false;
      } else {
        result += ' ';
        lineHasTokens = true;
      }
    } else if (token.text === ';') {
      result += ';\n\n';
      lineHasTokens = false;
    } else {
      result += (lineHasTokens ? ' ' : '') + word;
      lineHasTokens = true;
    }
  }

  return result.trim();
}

function minifySql(rawSql: string): string {
  return rawSql
    // Remove inline SQL comments -- ...
    .replace(/--.*$/gm, '')
    // Remove block comments /* ... */
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    // Remove space before punctuation
    .replace(/\s*([,;()=><])\s*/g, '$1 ')
    .replace(/\s*([;])\s*/g, '$1')
    .trim();
}

export const SqlFormatter: React.FC<SqlFormatterProps> = ({ tool, onToast }) => {
  const [inputSql, setInputSql] = useState<string>(SAMPLE_SQL);
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify');
  const [caseOption, setCaseOption] = useState<'upper' | 'lower' | 'preserve'>('upper');
  const [indentOption, setIndentOption] = useState<'2' | '4' | 'tab'>('2');
  const [copied, setCopied] = useState<boolean>(false);

  const indentStr = useMemo(() => {
    if (indentOption === '4') return '    ';
    if (indentOption === 'tab') return '\t';
    return '  ';
  }, [indentOption]);

  const outputSql = useMemo(() => {
    if (!inputSql.trim()) return '';
    if (mode === 'minify') {
      return minifySql(inputSql);
    }
    return formatSql(inputSql, indentStr, caseOption);
  }, [inputSql, mode, indentStr, caseOption]);

  const handleCopy = () => {
    if (!outputSql) return;
    navigator.clipboard.writeText(outputSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast(`Copied ${mode === 'minify' ? 'minified' : 'beautified'} SQL`);
  };

  const handleDownload = () => {
    if (!outputSql) return;
    const blob = new Blob([outputSql], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query-${mode}.sql`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Downloaded SQL file');
  };

  const handleClear = () => {
    setInputSql('');
    onToast('Cleared SQL input');
  };

  const handleLoadSample = () => {
    setInputSql(SAMPLE_SQL);
    onToast('Loaded sample SQL query');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMode('beautify')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'beautify'
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Format / Beautify
            </button>
            <button
              onClick={() => setMode('minify')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'minify'
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minify (Single-Line)
            </button>
          </div>

          {mode === 'beautify' && (
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 mr-1">Keywords:</span>
                {(['upper', 'lower', 'preserve'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCaseOption(c)}
                    className={`px-2 py-1 rounded-lg border text-xs capitalize transition-colors ${
                      caseOption === c
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <span className="text-slate-500 mr-1 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Indent:
                </span>
                {(['2', '4', 'tab'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setIndentOption(opt)}
                    className={`px-2 py-1 rounded-lg border text-xs transition-colors ${
                      indentOption === opt
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt === 'tab' ? 'Tabs' : `${opt} Spaces`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Sample
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Input Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">Raw SQL Input</span>
              <span>{inputSql.length} characters</span>
            </div>
            <textarea
              value={inputSql}
              onChange={(e) => setInputSql(e.target.value)}
              placeholder="Paste SQL statements (SELECT, INSERT, UPDATE, JOIN, etc.)..."
              rows={14}
              className="w-full font-mono text-xs p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y shadow-sm"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">
                {mode === 'minify' ? 'Minified SQL' : 'Formatted SQL Output'}
              </span>
              <span>{outputSql.length} characters · {outputSql.split('\n').filter(Boolean).length} lines</span>
            </div>
            <textarea
              value={outputSql}
              readOnly
              placeholder="Formatted query will appear here..."
              rows={14}
              className="w-full font-mono text-xs p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none text-slate-800 transition-all resize-y"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            <span>
              Supports PostgreSQL, MySQL, SQLite, Oracle, and MS SQL dialects with client-side formatting.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!outputSql}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download .sql
            </button>
            <button
              onClick={handleCopy}
              disabled={!outputSql}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied SQL' : 'Copy Output'}
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
