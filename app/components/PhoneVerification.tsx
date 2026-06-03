'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/app/lib/supabase';

const ACCENT = '#D02828';
const OTP_LENGTH_WHATSAPP = 5;
const OTP_LENGTH_SMS = 6;

interface PhoneVerificationProps {
  fullName: string;
  onVerified: (phone: string, userId: string) => void;
  onCancel: () => void;
}

export default function PhoneVerification({ fullName, onVerified, onCancel }: PhoneVerificationProps) {
  // ─── Phase: phone entry or OTP ──────────────────────────────────────────
  const [phase, setPhase] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [waFallback, setWaFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [smsDirectLoading, setSmsDirectLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP state
  const otpLength = channel === 'whatsapp' ? OTP_LENGTH_WHATSAPP : OTP_LENGTH_SMS;
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const isValidPhone = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '').replace(/^0+/, '');
    return /^[67]\d{8}$/.test(cleaned);
  };

  const toE164 = (raw: string) => {
    const stripped = raw.replace(/\D/g, '').replace(/^0+/, '');
    return `+212${stripped}`;
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setPhone(cleaned.slice(0, 10));
    setError('');
  };

  // ── Countdown timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // ── Auto-focus hidden OTP input ─────────────────────────────────────────
  useEffect(() => {
    if (phase === 'otp') {
      setTimeout(() => hiddenInputRef.current?.focus(), 300);
    }
  }, [phase, otpLength]);

  // ── Send WhatsApp ───────────────────────────────────────────────────────
  const sendWhatsApp = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('whatsapp-send', {
        body: { phone: toE164(phone), lang: 'en' },
      });
      return !error;
    } catch {
      return false;
    }
  };

  // ── Send SMS ────────────────────────────────────────────────────────────
  const sendSms = async (): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: toE164(phone),
      options: {
        channel: 'sms',
        data: { full_name: fullName || 'Customer', phone_number: toE164(phone) },
      },
    });
    return !error;
  };

  // ── Initiate verification (WhatsApp primary, SMS fallback) ──────────────
  const handleSendCode = async () => {
    if (!isValidPhone(phone)) {
      setError('Please enter a valid Moroccan phone number');
      return;
    }
    setLoading(true);
    setError('');

    const waOk = await sendWhatsApp();

    if (waOk) {
      setChannel('whatsapp');
      setWaFallback(false);
      setOtp(Array(OTP_LENGTH_WHATSAPP).fill(''));
      setPhase('otp');
      setResendTimer(60);
    } else {
      // WhatsApp failed — silently fall back to SMS
      const smsOk = await sendSms();
      if (smsOk) {
        setChannel('sms');
        setWaFallback(true);
        setOtp(Array(OTP_LENGTH_SMS).fill(''));
        setPhase('otp');
        setResendTimer(60);
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    }
    setLoading(false);
  };

  // ── Initiate SMS directly (bypass WhatsApp) ─────────────────────────────
  const handleSendSmsDirectly = async () => {
    if (!isValidPhone(phone)) {
      setError('Please enter a valid Moroccan phone number');
      return;
    }
    setSmsDirectLoading(true);
    setError('');

    const smsOk = await sendSms();
    if (smsOk) {
      setChannel('sms');
      setWaFallback(false);
      setOtp(Array(OTP_LENGTH_SMS).fill(''));
      setPhase('otp');
      setResendTimer(60);
    } else {
      setError('Failed to send SMS. Please try again.');
    }
    setSmsDirectLoading(false);
  };

  // ── Resend OTP ──────────────────────────────────────────────────────────
  const handleResend = async () => {
    setResendLoading(true);
    try {
      if (channel === 'whatsapp') {
        const { error } = await supabase.functions.invoke('whatsapp-send', {
          body: { phone: toE164(phone), lang: 'en' },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone: toE164(phone),
          options: {
            channel: 'sms',
            data: { full_name: fullName || 'Customer', phone_number: toE164(phone) },
          },
        });
        if (error) throw error;
      }
      setResendTimer(60);
      setOtp(Array(otpLength).fill(''));
      setError('');
      hiddenInputRef.current?.focus();
    } catch {
      setError('Failed to resend code');
    }
    setResendLoading(false);
  };

  // ── Hidden input handler for paste + keyboard ───────────────────────────
  const handleHiddenInputChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, otpLength).split('');
    while (digits.length < otpLength) digits.push('');
    setOtp(digits);

    if (digits.every((d) => d !== '') && !verifyLoading) {
      setTimeout(() => verifyOtp(digits.join('')), 300);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────
  const verifyOtp = async (code?: string) => {
    const otpCode = code ?? otp.join('');
    if (otpCode.length !== otpLength) return;

    setVerifyLoading(true);
    setError('');

    try {
      if (channel === 'whatsapp') {
        const { data, error: fnError } = await supabase.functions.invoke('whatsapp-auth', {
          body: { phone: toE164(phone), code: otpCode, full_name: fullName },
        });

        if (fnError) {
          setError('Verification failed. Please try again.');
          resetOtp();
          setVerifyLoading(false);
          return;
        }

        if (data?.error) {
          if (data.error === 'invalid_code') {
            setError('Invalid code. Please check and try again.');
          } else {
            setError(data.error || 'Verification failed');
          }
          resetOtp();
          setVerifyLoading(false);
          return;
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        if (sessionError) {
          setError(sessionError.message);
          resetOtp();
          setVerifyLoading(false);
          return;
        }

        // Grab user ID from the client-side session so the server action can use it
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        if (!userId) {
          setError('Failed to retrieve user. Please try again.');
          resetOtp();
          setVerifyLoading(false);
          return;
        }

        setVerifyLoading(false);
        onVerified(toE164(phone), userId);
        return;
      } else {
        const { data: vData, error: vError } = await supabase.auth.verifyOtp({
          phone: toE164(phone),
          token: otpCode,
          type: 'sms',
        });

        if (vError) {
          setError(vError.message);
          resetOtp();
          setVerifyLoading(false);
          return;
        }
        if (!vData.session) {
          setError('Invalid code');
          resetOtp();
          setVerifyLoading(false);
          return;
        }

        // SMS auth sets cookies, but grab the userId from the client too
        const userId = vData.session.user.id;
        setVerifyLoading(false);
        onVerified(toE164(phone), userId);
        return;
      }

      setVerifyLoading(false);
      onVerified(toE164(phone), '');
    } catch {
      setError('An unexpected error occurred');
      resetOtp();
      setVerifyLoading(false);
    }
  };

  const resetOtp = () => {
    setOtp(Array(otpLength).fill(''));
    hiddenInputRef.current?.focus();
  };

  const disabled = !isValidPhone(phone) || loading || smsDirectLoading;
  const smsDisabled = !isValidPhone(phone) || loading || smsDirectLoading;

  // ── Render: Phone Entry Phase ───────────────────────────────────────────
  if (phase === 'phone') {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <p className="text-sm text-gray-500">
            We'll send a verification code to your phone.
          </p>

          {/* Phone input */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div
              className="flex items-center rounded-xl border overflow-hidden transition-all"
              style={{
                borderColor: error ? '#EF4444' : '#E5E7EB',
                backgroundColor: '#F9FAFB',
              }}
            >
              <div className="flex items-center gap-1.5 pl-4 pr-3 py-3 border-r border-gray-200">
                <span className="text-lg">🇲🇦</span>
                <span className="text-sm font-bold text-gray-800">+212</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="6XXXXXXXX"
                className="flex-1 px-3 py-3 text-sm bg-transparent outline-none"
                style={{ color: '#1A1A1A' }}
                maxLength={10}
                onFocus={(e) => {
                  e.currentTarget.parentElement!.style.borderColor = ACCENT;
                  e.currentTarget.parentElement!.style.boxShadow =
                    '0 0 0 3px rgba(208,40,40,0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.parentElement!.style.borderColor = error
                    ? '#EF4444'
                    : '#E5E7EB';
                  e.currentTarget.parentElement!.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: '#F3F4F6' }}>
          {/* Primary: WhatsApp */}
          <button
            onClick={handleSendCode}
            disabled={disabled}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              backgroundColor: disabled ? '#D1D5DB' : '#25D366',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.filter = 'brightness(0.95)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 211, 102, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = '';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {loading ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Verify via WhatsApp
              </>
            )}
          </button>

          {/* Secondary: SMS */}
          <button
            onClick={handleSendSmsDirectly}
            disabled={smsDisabled}
            className="w-full py-2.5 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: '#9CA3AF' }}
            onMouseEnter={(e) => {
              if (!smsDisabled) {
                e.currentTarget.style.color = '#6B7280';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            {smsDirectLoading ? 'Sending...' : 'Verify via SMS'}
          </button>

          <button
            onClick={() => onCancel()}
            className="w-full py-2.5 text-xs font-semibold transition-colors cursor-pointer"
            style={{ color: '#9CA3AF' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#6B7280';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ── Render: OTP Verification Phase ──────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Channel badge */}
        <div className="flex justify-center mb-4">
          <span
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: '#FEF2F2', color: ACCENT }}
          >
            {waFallback ? 'SMS (WhatsApp unavailable)' : channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
          </span>
        </div>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the {otpLength}-digit code sent to{' '}
          <span className="font-semibold text-gray-800">{toE164(phone)}</span>
        </p>

        {/* Hidden input for paste / keyboard */}
        <input
          ref={hiddenInputRef}
          type="tel"
          value={otp.join('')}
          onChange={(e) => handleHiddenInputChange(e.target.value)}
          className="absolute opacity-0 w-0 h-0"
          maxLength={otpLength}
          autoComplete="one-time-code"
        />

        {/* OTP Boxes */}
        <div
          className="flex justify-center mb-6"
          style={{ gap: otpLength === 6 ? '0.5rem' : '0.625rem' }}
          onClick={() => hiddenInputRef.current?.focus()}
        >
          {otp.map((digit, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-xl border-2 transition-all"
              style={{
                width: otpLength === 6 ? '44px' : '52px',
                height: otpLength === 6 ? '52px' : '60px',
                borderColor: digit ? ACCENT : '#E5E7EB',
                backgroundColor: digit ? '#FFF5F5' : '#FAFAFA',
                boxShadow: digit ? '0 2px 8px rgba(208,40,40,0.15)' : 'none',
              }}
            >
              <span
                className="text-xl font-bold"
                style={{ color: '#1A1A1A' }}
              >
                {digit}
              </span>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm font-medium mb-4"
            style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}
          >
            {error}
          </div>
        )}

        {/* Loading spinner */}
        {verifyLoading && (
          <div className="flex justify-center mb-4">
            <svg className="animate-spin w-6 h-6" style={{ color: ACCENT }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {/* Resend */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <span className="text-xs text-gray-400">Resend code in {resendTimer}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              style={{ color: resendLoading ? '#9CA3AF' : ACCENT }}
            >
              {resendLoading ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>
      </div>

      {/* Back button */}
      <div className="px-5 py-4 border-t" style={{ borderColor: '#F3F4F6' }}>
        <button
          onClick={() => {
            setPhase('phone');
            setError('');
          }}
          className="w-full py-2.5 text-xs font-semibold transition-colors cursor-pointer"
          style={{ color: '#9CA3AF' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#6B7280';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#9CA3AF';
          }}
        >
          Change phone number
        </button>
      </div>
    </div>
  );
}