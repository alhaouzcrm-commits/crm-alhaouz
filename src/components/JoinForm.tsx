import React, { useState } from 'react';
import type { Settings } from '../types';
import { getCleanWhatsApp } from '../utils';

interface JoinFormProps {
  settings: Settings;
}

export const JoinForm: React.FC<JoinFormProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [commune, setCommune] = useState('تحناوت');
  const [interests, setInterests] = useState<string[]>(['الإسعافات الأولية']);
  const [invalidName, setInvalidName] = useState(false);

  const waNumber = getCleanWhatsApp(settings.whatsapp || '+212668963619');

  const handleInterestToggle = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setInvalidName(true);
      return;
    }
    setInvalidName(false);

    const ints = interests.length ? interests.join('، ') : '—';
    const msg = `السلام عليكم، أرغب في التطوع مع الهلال الأحمر المغربي بالحوز.\nالاسم: ${name.trim()}\nالسن: ${age || '—'}\nالجماعة: ${commune}\nمجالات الاهتمام: ${ints}`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="join" id="join">
      <div className="wrap join-grid">
        <div className="join-text">
          <span className="kicker kicker-light">كن جزءًا من الفريق</span>
          <h2>ساعتان من وقتك قد تنقذان حياة.</h2>
          <p>
            نستقبل المتطوعات والمتطوعين من كل جماعات الإقليم، ونقدّم لهم تكوينًا في الإسعافات الأولية والدعم النفسي والسلامة الطرقية، ثم يشاركون في القوافل الطبية والحملات التحسيسية والاستجابة للطوارئ.
          </p>
          <ul className="checks">
            <li>تكوين مجاني ومؤطر</li>
            <li>شهادات مشاركة</li>
            <li>عمل ميداني إلى جانب فريق ذي خبرة</li>
          </ul>
        </div>

        <form className="join-form" onSubmit={handleSubmit} noValidate>
          <h3>طلب التطوع</h3>
          <label>
            الاسم الكامل
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (invalidName && e.target.value.trim()) setInvalidName(false);
              }}
              className={invalidName ? 'invalid' : ''}
              placeholder="الاسم الكامل"
            />
          </label>

          <div className="row2">
            <label>
              السن
              <input
                name="age"
                type="number"
                min="16"
                max="80"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="مثال: 22"
              />
            </label>
            <label>
              الجماعة
              <select
                name="commune"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
              >
                <option value="تحناوت">تحناوت</option>
                <option value="أمزميز">أمزميز</option>
                <option value="أسني">أسني</option>
                <option value="أوريكا">أوريكا</option>
                <option value="آيت أورير">آيت أورير</option>
                <option value="ثلاث نيعقوب">ثلاث نيعقوب</option>
                <option value="مولاي إبراهيم">مولاي إبراهيم</option>
                <option value="إيجوكاك">إيجوكاك</option>
                <option value="أخرى">أخرى</option>
              </select>
            </label>
          </div>

          <fieldset>
            <legend>أرغب في المساهمة في:</legend>
            <label className="tick">
              <input
                type="checkbox"
                checked={interests.includes('الإسعافات الأولية')}
                onChange={() => handleInterestToggle('الإسعافات الأولية')}
              />
              الإسعافات الأولية
            </label>
            <label className="tick">
              <input
                type="checkbox"
                checked={interests.includes('الدعم النفسي')}
                onChange={() => handleInterestToggle('الدعم النفسي')}
              />
              الدعم النفسي
            </label>
            <label className="tick">
              <input
                type="checkbox"
                checked={interests.includes('القوافل الطبية')}
                onChange={() => handleInterestToggle('القوافل الطبية')}
              />
              القوافل الطبية
            </label>
            <label className="tick">
              <input
                type="checkbox"
                checked={interests.includes('التوعية في المدارس')}
                onChange={() => handleInterestToggle('التوعية في المدارس')}
              />
              التوعية في المدارس
            </label>
          </fieldset>

          <button className="btn btn-red btn-block" type="submit">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
            </svg>
            إرسال عبر واتساب
          </button>
          <p className="form-note">
            سيفتح الطلب في واتساب لتتمكن من إرساله مباشرة إلى المكتب الإقليمي.
          </p>
        </form>
      </div>
    </section>
  );
};
