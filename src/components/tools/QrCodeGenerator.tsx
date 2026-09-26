import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, QrCode as QrIcon, Wifi, Globe, Mail, Phone, MessageSquare, FileText } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface QrCodeGeneratorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type PayloadType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms';

export const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ tool, onToast }) => {
  const [payloadType, setPayloadType] = useState<PayloadType>('url');

  // Payload states
  const [url, setUrl] = useState('https://toolnest.example.com');
  const [plainText, setPlainText] = useState('Hello from ToolNest!');
  
  // WiFi states
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState('SecretKey123');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email states
  const [emailTo, setEmailTo] = useState('contact@example.com');
  const [emailSubject, setEmailSubject] = useState('Inquiry via ToolNest');
  const [emailBody, setEmailBody] = useState('Hi, I am interested in your project.');

  // Phone & SMS
  const [phoneNum, setPhoneNum] = useState('+1234567890');
  const [smsNum, setSmsNum] = useState('+1234567890');
  const [smsMessage, setSmsMessage] = useState('Hello! Checking in.');

  // Styling options
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [ecLevel, setEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [size, setSize] = useState<number>(300);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  // Construct target string to encode
  const targetPayload = (() => {
    switch (payloadType) {
      case 'url':
        return url.trim() || 'https://';
      case 'text':
        return plainText;
      case 'wifi':
        return `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiAuth === 'nopass' ? '' : wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNum}`;
      case 'sms':
        return `smsto:${smsNum}:${smsMessage}`;
      default:
        return 'https://';
    }
  })();

  // Render QR Code onto Canvas whenever payload or options change
  useEffect(() => {
    if (!canvasRef.current || !targetPayload) return;

    QRCode.toCanvas(
      canvasRef.current,
      targetPayload,
      {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: ecLevel,
      },
      (err) => {
        if (err) {
          console.error('QR rendering error', err);
        }
      }
    );
  }, [targetPayload, fgColor, bgColor, ecLevel, size]);

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `qrcode-${payloadType}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    onToast('QR Code PNG downloaded!');
  };

  const handleDownloadSvg = async () => {
    try {
      const svgString = await QRCode.toString(targetPayload, {
        type: 'svg',
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: ecLevel,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const urlObj = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qrcode-${payloadType}-${Date.now()}.svg`;
      link.href = urlObj;
      link.click();
      URL.revokeObjectURL(urlObj);
      onToast('Vector SVG downloaded!');
    } catch (e) {
      console.error(e);
      onToast('Error exporting SVG');
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        onToast('QR Code image copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.error(err);
      onToast('Copy failed. Try downloading PNG instead.');
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8">
        {/* Payload Type Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setPayloadType('url')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              payloadType === 'url' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website URL</span>
          </button>
          <button
            onClick={() => setPayloadType('wifi')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              payloadType === 'wifi' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>WiFi Network</span>
          </button>
          <button
            onClick={() => setPayloadType('text')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              payloadType === 'text' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Plain Text</span>
          </button>
          <button
            onClick={() => setPayloadType('email')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              payloadType === 'email' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            onClick={() => setPayloadType('phone')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              payloadType === 'phone' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
          <button
            onClick={() => setPayloadType('sms')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              payloadType === 'sms' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SMS</span>
          </button>
        </div>

        {/* Two-column layout: Configuration on Left, QR Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inputs & Options */}
          <div className="lg:col-span-7 space-y-5">
            {/* Contextual Input according to Payload Type */}
            {payloadType === 'url' && (
              <div>
                <label htmlFor="qr-url" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Website URL:
                </label>
                <input
                  id="qr-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
                />
              </div>
            )}

            {payloadType === 'wifi' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="wifi-ssid" className="block text-xs font-semibold text-slate-700 mb-1">
                    Network Name (SSID):
                  </label>
                  <input
                    id="wifi-ssid"
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="WiFi Network Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="wifi-pwd" className="block text-xs font-semibold text-slate-700 mb-1">
                    Password:
                  </label>
                  <input
                    id="wifi-pwd"
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="WiFi Password"
                    disabled={wifiAuth === 'nopass'}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm disabled:opacity-40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Security Type:</label>
                    <select
                      value={wifiAuth}
                      onChange={(e) => setWifiAuth(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Hidden SSID</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {payloadType === 'text' && (
              <div>
                <label htmlFor="qr-plain-text" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Plain Text Content:
                </label>
                <textarea
                  id="qr-plain-text"
                  rows={4}
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Enter any text you want to encode..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm resize-y"
                />
              </div>
            )}

            {payloadType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Email:</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject:</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message Body:</label>
                  <textarea
                    rows={3}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none text-sm resize-y"
                  />
                </div>
              </div>
            )}

            {payloadType === 'phone' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number:</label>
                <input
                  type="tel"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  placeholder="+1 555-0199"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none text-sm"
                />
              </div>
            )}

            {payloadType === 'sms' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    value={smsNum}
                    onChange={(e) => setSmsNum(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pre-filled Message:</label>
                  <textarea
                    rows={2}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {/* Visual Customization Panel */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Visual Styling & Error Correction
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">QR Color:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                    />
                    <span className="font-mono text-slate-600 text-[11px] uppercase">{fgColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Background:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                    />
                    <span className="font-mono text-slate-600 text-[11px] uppercase">{bgColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Error Correction:</label>
                  <select
                    value={ecLevel}
                    onChange={(e) => setEcLevel(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-none text-xs"
                  >
                    <option value="L">L (7% recovery)</option>
                    <option value="M">M (15% standard)</option>
                    <option value="Q">Q (25% high)</option>
                    <option value="H">H (30% best)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Canvas Size:</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-none text-xs"
                  >
                    <option value={200}>200 px (Compact)</option>
                    <option value={300}>300 px (Standard)</option>
                    <option value={450}>450 px (Large)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Preview & Exports */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200/90 text-center">
            <span className="text-xs font-semibold text-slate-600 mb-4 block">
              Live Scannable Preview
            </span>

            {/* Canvas Box */}
            <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded" />
            </div>

            <div className="mt-4 text-[11px] text-slate-400 font-mono break-all max-w-xs line-clamp-2">
              Encoded: {targetPayload}
            </div>

            {/* Action Buttons */}
            <div className="w-full mt-6 space-y-2.5">
              <button
                onClick={handleDownloadPng}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG Image</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadSvg}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
                <button
                  onClick={handleCopyImage}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Image'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
