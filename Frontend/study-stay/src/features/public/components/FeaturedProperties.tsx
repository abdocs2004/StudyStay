import React from "react";
import { Link } from "react-router-dom";

const FeaturedProperties: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 px-4 lg:px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-12">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-2 md:mb-4">مساكن مختارة</h2>
            <p className="text-on-surface-variant">خيارات سكن منتقاة بعناية لتجربة جامعية عصرية.</p>
          </div>
          <Link to="/search" className="text-primary font-bold flex items-center gap-2 group">
            عرض كل العقارات
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
        
        {/* TODO: These properties are currently dummy data. Replace with API call to backend later. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Property Card 1 */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(20,27,43,0.06)] group cursor-pointer transition-transform hover:-translate-y-2">
            <div className="relative h-64">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt="Cozy sunlit student bedroom with blue accents, a modern desk setup, and bookshelves in a high-end apartment building" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPWgMcM7jNGwEh0aEfSy8zqP0pyQ8nFLccV5-HbMM6sKZ2O2_gcVaMzNv5PqXFE5AqJvsTo95ge8wo2cjRhLKIii50JTXN_TB60E2LIKkV3PDrTzOPhTQS_vgQwqSxTZ5-Dg4YygpdVTv0ZMPgD4DIV_IqdPiCHxQjqisN-B7LuZCpTCxY7i76nnZD1K37Gra8B-iyZV9hI9QcFnXck0DRDlqJOmonnA9Kxg50vsLz1i3fP2XYKihCahPwLlvXR2OKpPDPt8rcdjY"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  موثق
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                4.9
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-headline text-lg font-bold">سكن التجمع المتميز</h4>
                <span className="text-primary font-extrabold text-lg">3,500<span className="text-xs font-normal text-primary"> ج.م/شهر</span></span>
              </div>
              <p className="text-on-surface-variant text-sm flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                التجمع الخامس، القاهرة (بالقرب من الجامعة الأمريكية)
              </p>
              <div className="flex gap-4 pt-4 border-t border-outline-variant/10 text-xs font-medium text-outline">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">bed</span> غرفة واحدة</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">wifi</span> إنترنت فايبر</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">garage</span> موقف دراجات</span>
              </div>
            </div>
          </div>

          {/* Property Card 2 */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(20,27,43,0.06)] group cursor-pointer transition-transform hover:-translate-y-2">
            <div className="relative h-64">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt="Spacious studio apartment for students with large windows, light wood flooring, and a minimalist kitchen area in a historic building" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqvw9vvDe4kfb6rPZbzkZ4_3UFe62fXYbD09CCXc-DeHfZyVYd68xgLxb3lc33HuiBGU9j9KEf0o1fHixZR4UQlSrcZHYwR0OWjxHgcJOvvBaDZRQ9piwRamV5DQ4W-7f-i1eJuvZO6fB4W0hQ2-gKEla64ZNxfRLivET1VoySgtoMZRE_rGO0v3HaUs11_ph_bi3koUqKsT3OHcznepQXeqfBtLQ09QQemsOSreDaNvsKbbZUWhc-otexm6PiqZKYjp7rBdDgWzo"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  موثق
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                4.8
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-headline text-lg font-bold">استوديو الدقي</h4>
                <span className="text-primary font-extrabold text-lg">5,000<span className="text-xs font-normal text-primary"> ج.م/شهر</span></span>
              </div>
              <p className="text-on-surface-variant text-sm flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                الدقي، الجيزة (بالقرب من جامعة القاهرة)
              </p>
              <div className="flex gap-4 pt-4 border-t border-outline-variant/10 text-xs font-medium text-outline">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">apartment</span> استوديو</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">local_laundry_service</span> غسالة داخل الوحدة</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">fitness_center</span> دخول الجيم</span>
              </div>
            </div>
          </div>

          {/* Property Card 3 */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(20,27,43,0.06)] group cursor-pointer transition-transform hover:-translate-y-2">
            <div className="relative h-64">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt="Modern high-rise student apartment building interior with common areas, designer lighting, and floor-to-ceiling glass walls" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0mdnbQLU0hotV3-UrkdEtkbOR3Y7zXeN9VVeCG2WhsVQPBbSqKRmwO_MpClumRwnzwxpoEn4UJN0-5OqY7jt94fhNK5pQh24acEinThnrAuxiFgEGp7PHEKOva-FLOteWUhHT4Afsq-KFC-F9mp_03srpokIDGfQno_yfuZvjRR3-X3KmrU1dOsP-j_FjXrvTHkJzFPdbFTczaWJQPIsgMwYvzDfi8Cr8grvC6_TroJvkWXzGpZHqV4NWsCWXoh-_Xk-YqwHA8NI"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  موثق
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                5.0
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-headline text-lg font-bold">سكن المعادي الهادئ</h4>
                <span className="text-primary font-extrabold text-lg">4,200<span className="text-xs font-normal text-primary"> ج.م/شهر</span></span>
              </div>
              <p className="text-on-surface-variant text-sm flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                المعادي، القاهرة (بالقرب من الأكاديمية الحديثة)
              </p>
              <div className="flex gap-4 pt-4 border-t border-outline-variant/10 text-xs font-medium text-outline">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">chair</span> مفروش</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">pool</span> دخول المسبح</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">security</span> استقبال 24 ساعة</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
