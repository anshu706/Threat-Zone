import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Indian Standard Time
      const istTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentTime(istTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="dh-footer">
      <div className="dh-footer__top">
        <h2 className="dh-footer__headline">
          Threat Zone safeguards critical energy infrastructure through rigorous consequence physics & autonomous blast intelligence.
        </h2>
        <p className="dh-footer__lead">
          Modeling VCE overpressure and BLEVE thermal radiation envelopes across 10 major refineries and chemical plants in India.
        </p>
      </div>

      {/* Operational Centers & Live Clocks */}
      <div className="dh-footer__operationalGrid">
        <div className="dh-footer__cityItem">
          <span className="dh-footer__cityTitle">Jamnagar, Gujarat</span>
          <span className="dh-footer__cityTime">{currentTime || '21:30:00'} IST</span>
          <span className="dh-footer__cityFacility">Reliance Complex (1.24M BPD)</span>
        </div>

        <div className="dh-footer__cityItem">
          <span className="dh-footer__cityTitle">Mumbai, Maharashtra</span>
          <span className="dh-footer__cityTime">{currentTime || '21:30:00'} IST</span>
          <span className="dh-footer__cityFacility">BPCL / HPCL Chembur Hub</span>
        </div>

        <div className="dh-footer__cityItem">
          <span className="dh-footer__cityTitle">Panipat, Haryana</span>
          <span className="dh-footer__cityTime">{currentTime || '21:30:00'} IST</span>
          <span className="dh-footer__cityFacility">IOCL Petrochemical Complex</span>
        </div>

        <div className="dh-footer__cityItem">
          <span className="dh-footer__cityTitle">Kochi, Kerala</span>
          <span className="dh-footer__cityTime">{currentTime || '21:30:00'} IST</span>
          <span className="dh-footer__cityFacility">BPCL Marine Terminal</span>
        </div>
      </div>

      {/* Subscription & Regulatory Links */}
      <div className="dh-footer__bottom">
        <div className="dh-footer__subscribeWrap">
          <span className="dh-footer__subscribeLabel">
            Hazard Bulletins & Consequence Advisories
          </span>
          {subscribed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Subscribed to Indian HazMat alerts</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="dh-footer__subscribeForm">
              <input
                type="email"
                placeholder="ENTER CORPORATE HSE EMAIL..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="dh-footer__input"
              />
              <button type="submit" className="dh-footer__submitBtn" aria-label="Subscribe">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        <ul className="dh-footer__bottomLinks">
          <li><button type="button" onClick={() => scrollTo('scenarios')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}>Scenarios</button></li>
          <li><button type="button" onClick={() => scrollTo('map')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}>World Radar</button></li>
          <li><button type="button" onClick={() => scrollTo('simulator')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}>Simulator</button></li>
          <li><button type="button" onClick={() => scrollTo('results')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}>Blast Results</button></li>
          <li><button type="button" onClick={() => scrollTo('charts')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}>Decay Curves</button></li>
          <li><button type="button" onClick={() => scrollTo('safety')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}>Safety Protocols</button></li>
        </ul>

        <div className="dh-footer__copy">
          © {new Date().getFullYear()} THREAT ZONE · OISD-116 / 169 & TNO MULTI-ENERGY COMPLIANT
        </div>
      </div>
    </footer>
  );
};
