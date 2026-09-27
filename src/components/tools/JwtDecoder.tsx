import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, ShieldAlert, KeyRound, Clock, AlertTriangle, FileCode, Info } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface JwtDecoderProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggSm9obnNvbiIsImVtYWlsIjoiYWxleEB0b29sbmVzdC5leGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzc0Njk5MjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Safe Base64URL decoder with UTF-8 support
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' to make length multiple of 4
  while (base64.length % 4) {
    base64 += '=';
  }
  const decoded = atob(base64);
  try {
    // Decode percent-encoded UTF-8 bytes
    return decodeURIComponent(
      Array.from(decoded)
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return decoded;
  }
}

export const JwtDecoder: React.FC<JwtDecoderProps> = ({ tool, onToast }) => {
  const [tokenInput, setTokenInput] = useState<string>(SAMPLE_JWT);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Parse JWT parts
  const { headerJson, payloadJson, signatureStr, error, isExpired, expDate, iatDate } = useMemo(() => {
    const raw = tokenInput.trim();
    if (!raw) {
      return { headerJson: null, payloadJson: null, signatureStr: '', error: null };
    }

    const parts = raw.split('.');
    if (parts.length !== 3) {
      return {
        headerJson: null,
        payloadJson: null,
        signatureStr: '',
        error: `Invalid JWT format. A valid token consists of exactly 3 dot-separated parts (Header.Payload.Signature). Found ${parts.length} parts.`,
      };
    }

    let header: any = null;
    let payload: any = null;

    try {
      const headerDecoded = base64UrlDecode(parts[0]);
      header = JSON.parse(headerDecoded);
    } catch (err: any) {
      return {
        headerJson: null,
        payloadJson: null,
        signatureStr: '',
        error: `Failed to decode JWT Header: ${err.message || 'Invalid base64url encoding'}`,
      };
    }

    try {
      const payloadDecoded = base64UrlDecode(parts[1]);
      payload = JSON.parse(payloadDecoded);
    } catch (err: any) {
      return {
        headerJson: null,
        payloadJson: null,
        signatureStr: '',
        error: `Failed to decode JWT Payload: ${err.message || 'Invalid base64url encoding'}`,
      };
    }

    // Inspect expiration timestamp if present
    let expired: boolean | null = null;
    let expD: string | null = null;
    let iatD: string | null = null;

    if (payload && typeof payload.exp === 'number') {
      const expMs = payload.exp * 1000;
      expired = Date.now() > expMs;
      expD = new Date(expMs).toLocaleString();
    }

    if (payload && typeof payload.iat === 'number') {
      iatD = new Date(payload.iat * 1000).toLocaleString();
    }

    return {
      headerJson: header,
      payloadJson: payload,
      signatureStr: parts[2],
      error: null,
      isExpired: expired,
      expDate: expD,
      iatDate: iatD,
    };
  }, [tokenInput]);

  const handleCopy = (key: string, val: any) => {
    if (!val) return;
    const text = typeof val === 'string' ? val : JSON.stringify(val, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    onToast(`Copied ${key}`);
  };

  const handleClear = () => {
    setTokenInput('');
    onToast('Cleared token input');
  };

  const handleLoadSample = () => {
    setTokenInput(SAMPLE_JWT);
    onToast('Loaded sample JWT');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Security Warning Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block">Important Security Notice:</strong>
            <p className="leading-relaxed text-amber-800">
              This tool functions strictly as a client-side <strong>token payload decoder</strong> for inspection. It does <strong>NOT</strong> verify the cryptographic signature or confirm token authenticity. Anyone can fabricate or alter unverified JWT claims. Never send confidential secrets or production private keys over the web. All processing executes 100% locally in your browser memory.
            </p>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">JSON Web Token (JWT) Inspector</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Load Sample Token
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Encoded JWT Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <label htmlFor="jwt-raw-input">Encoded JSON Web Token (Paste JWT string):</label>
            <span className="text-slate-400 font-mono text-[11px]">{tokenInput.length} characters</span>
          </div>
          <textarea
            id="jwt-raw-input"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rows={4}
            className="w-full p-4 font-mono text-xs text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed break-all"
          />
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Decoded Sections */}
        {headerJson && payloadJson && (
          <div className="space-y-4">
            {/* Expiration & Timing Pill Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <span className="font-bold text-slate-700">Claims Status:</span>
              {isExpired !== null && (
                <span
                  className={`px-2.5 py-0.5 rounded-md font-bold font-mono ${
                    isExpired ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isExpired ? '● EXPIRED' : '● ACTIVE / NOT EXPIRED'}
                </span>
              )}
              {expDate && (
                <span className="text-slate-600">
                  Expires (exp): <strong className="font-mono text-slate-800">{expDate}</strong>
                </span>
              )}
              {iatDate && (
                <span className="text-slate-600">
                  · Issued (iat): <strong className="font-mono text-slate-800">{iatDate}</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Header Box */}
              <div className="p-4 bg-white rounded-2xl border border-rose-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-700 pb-2 border-b border-rose-100">
                  <span>HEADER: Algorithm & Token Type</span>
                  <button
                    onClick={() => handleCopy('header', headerJson)}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-700 transition-colors"
                  >
                    {copiedKey === 'header' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'header' ? 'Copied' : 'Copy Header'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-rose-900 bg-rose-50/50 p-3 rounded-xl overflow-x-auto leading-relaxed">
                  {JSON.stringify(headerJson, null, 2)}
                </pre>
              </div>

              {/* Payload Box */}
              <div className="p-4 bg-white rounded-2xl border border-indigo-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-700 pb-2 border-b border-indigo-100">
                  <span>PAYLOAD: Decoded Data & Claims</span>
                  <button
                    onClick={() => handleCopy('payload', payloadJson)}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-700 transition-colors"
                  >
                    {copiedKey === 'payload' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'payload' ? 'Copied' : 'Copy Payload'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-indigo-950 bg-indigo-50/50 p-3 rounded-xl overflow-x-auto leading-relaxed">
                  {JSON.stringify(payloadJson, null, 2)}
                </pre>
              </div>
            </div>

            {/* Signature Box */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">
                <span>SIGNATURE: Raw Cryptographic Checksum</span>
                <button
                  onClick={() => handleCopy('signature', signatureStr)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  {copiedKey === 'signature' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'signature' ? 'Copied' : 'Copy Signature'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-slate-600 bg-slate-50 p-3 rounded-xl break-all select-all leading-relaxed">
                {signatureStr || <span className="italic text-slate-400">Unsigned or empty signature</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
