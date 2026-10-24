import React from 'react';
import { aidList } from '../data/initialData';

export const Quake: React.FC = () => {
  return (
    <section className="quake" id="quake">
      <div className="quake-crack" aria-hidden="true"></div>
      <div className="wrap">
        <div className="quake-head">
          <span className="kicker kicker-light">ملف خاص</span>
          <h2>
            زلزال الحوز<br />
            <small>شتنبر 2023</small>
          </h2>
          <p>
            منذ الساعات الأولى للزلزال سخّر المكتب الإقليمي طاقاته وكفاءاته للتدخل بتنسيق مع جمعيات المجتمع المدني، وواصل العمل دون انقطاع خلال الأشهر الأولى قبل وصول الاتحاد الدولي وبعده.
          </p>
        </div>

        <div className="quake-facts">
          <div>
            <b>24/24</b>
            <span>فرق للمساعدة الصحية بالمستشفى الرئيسي بتحناوت</span>
          </div>
          <div>
            <b>+6 أشهر</b>
            <span>خلية للخدمات الصحية بأسني قرب المستشفى العسكري</span>
          </div>
          <div>
            <b>45</b>
            <span>متطوعة ومتطوعًا، لا يقل عددهم عن 10 في كل برنامج</span>
          </div>
          <div>
            <b>165</b>
            <span>أسرة من المكفوفين استفادت من مساعدات بدعم USAID في يناير 2024</span>
          </div>
        </div>

        <div className="quake-body">
          <div className="quake-map">
            <h3>أين تدخّلنا؟</h3>
            <p className="muted-light">مرّر المؤشر على نوع المساعدة لتظهر المنطقة المعنية.</p>
            <div className="aid-table">
              {aidList.map((item, idx) => (
                <div className="aid-row" tabIndex={0} key={idx}>
                  <span className="type">{item.type}</span>
                  <span className="place">{item.place}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quake-mosaic">
            <img src="/images/eq_trucks.jpg" alt="شاحنات المساعدات في الجبل" loading="lazy" />
            <img src="/images/eq_tents.jpg" alt="مخيم الخيام" loading="lazy" />
            <img src="/images/eq_kids.jpg" alt="أنشطة الدعم النفسي للأطفال" loading="lazy" />
            <img src="/images/eq_truck.jpg" alt="تفريغ المساعدات" loading="lazy" />
            <img src="/images/eq_aid.jpg" alt="توزيع الأفرشة والأغطية" loading="lazy" />
          </div>
        </div>

        <div className="partners-quake">
          <span>شركاء هذه المرحلة:</span>
          <em>جمعية طريق النجاح</em>
          <em>جمعية شمس</em>
          <em>الكشفية الحسنية المغربية</em>
          <em>جمعية المغرب الباسم</em>
          <em>جمعية المسرح والسينما</em>
          <em>جمعية فضاءات التنمية – الرباط</em>
          <em>USAID</em>
          <em>الاتحاد الدولي للصليب والهلال الأحمر</em>
        </div>
      </div>
    </section>
  );
};
