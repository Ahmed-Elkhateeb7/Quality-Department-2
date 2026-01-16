
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ComposedChart, Line
} from 'recharts';
import { Product, KPIData, PageView } from '../types';
import { 
  Package, TrendingUp, Download, Eye, ShieldCheck, Clock, ArrowRight, 
  BarChart3, PlusCircle, Zap, Activity, Calendar as CalendarIcon, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  products: Product[];
  kpiData: KPIData[];
  handleGenerateReport: () => void;
  navigate: (view: PageView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, kpiData, handleGenerateReport, navigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalProducts = products.length;
  const totalKpis = kpiData.length;
  const lastQualityRate = kpiData.length > 0 ? kpiData[kpiData.length - 1].qualityRate : 0;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const formattedDate = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentTime);

  const formattedTime = currentTime.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const handleExportCSV = () => {
    const statsHeaders = ['المقياس', 'القيمة'];
    const kpiHeaders = ['الشهر', 'معدل الجودة (%)', 'عدد العيوب'];
    const statsRows = [
        ['تقرير ملخص النظام', new Date().toLocaleDateString('ar-EG')],
        ['إجمالي المنتجات', totalProducts],
        ['إجمالي تقارير الأداء', totalKpis],
    ];
    const kpiRows = kpiData.map(d => [d.month, d.qualityRate, d.defects]);
    const csvContent = [
        '\uFEFF' + statsHeaders.join(','),
        ...statsRows.map(r => r.join(',')),
        '',
        'تحليل مؤشرات الأداء',
        kpiHeaders.join(','),
        ...kpiRows.map(r => r.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TQM_Dashboard_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
      dir="rtl"
    >
      {/* 0. Real-time Clock & Date Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center bg-white px-8 py-4 rounded-[2rem] border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-royal-50 text-royal-700 rounded-2xl">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 mb-0.5">التاريخ اليوم</p>
            <p className="text-sm font-black text-slate-800">{formattedDate}</p>
          </div>
        </div>
        <div className="hidden md:block h-8 w-px bg-gray-100"></div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 mb-0.5">الوقت الحالي</p>
            <p className="text-xl font-black text-slate-800 font-mono tracking-wider">{formattedTime}</p>
          </div>
        </div>
      </motion.div>

      {/* 1. Header & Welcome Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-l from-royal-900 via-royal-800 to-royal-700 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold">
               <Zap className="w-4 h-4 text-amber-400" />
               نظام إدارة الجودة الشاملة نشط الآن
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">نظرة عامة على الأداء</h2>
            <p className="text-royal-100 text-lg max-w-xl font-medium opacity-90">
              مرحباً بك في لوحة القيادة المركزية. تابع معدلات الجودة، الإنتاج، والامتثال للمعايير في مكان واحد.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-royal-900 rounded-2xl font-black shadow-lg hover:bg-royal-50 transition-all active:scale-95"
            >
                <Download className="w-5 h-5" />
                تصدير التقرير التنفيذي
            </button>
            <button 
                onClick={() => navigate('products')}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-royal-600/30 backdrop-blur-md border border-white/30 text-white rounded-2xl font-black hover:bg-royal-600/50 transition-all"
            >
                <Eye className="w-5 h-5" />
                استعراض كافة المنتجات
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Advanced Metrics Grid - Adjusted to 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'إجمالي المنتجات', value: totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: '+14%' },
          { label: 'معدل الجودة', value: `${lastQualityRate}%`, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: '+2.4%' },
          { label: 'تقارير الأداء', value: totalKpis, icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', trend: 'محدث' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className={`bg-white p-6 rounded-[2rem] border ${stat.border} shadow-sm group hover:shadow-xl transition-all duration-500`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-gray-50 text-gray-400 rounded-lg uppercase tracking-wider">{stat.trend}</span>
            </div>
            <p className="text-gray-500 text-sm font-bold mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-slate-800">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* 3. Dynamic Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800">مؤشر الجودة والعيوب</h3>
              <p className="text-gray-400 text-xs mt-1">تحليل الاتجاه العام للشهور الماضية</p>
            </div>
            <div className="flex gap-2">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-royal-50 text-royal-700 rounded-full text-[10px] font-bold">
                 <div className="w-2 h-2 rounded-full bg-royal-600"></div> معدل الجودة
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold">
                 <div className="w-2 h-2 rounded-full bg-rose-600"></div> كمية العيوب
               </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 700}} tickLine={false} axisLine={false} reversed={true} />
                <YAxis yAxisId="left" stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 700}} tickLine={false} axisLine={false} orientation="right" />
                <YAxis yAxisId="right" stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 700}} tickLine={false} axisLine={false} orientation="left" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', color: '#fff', textAlign: 'right', fontStyle: 'Cairo' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="qualityRate" name="معدل الجودة" fill="#eff6ff" stroke="#3b82f6" strokeWidth={4} />
                <Bar yAxisId="right" dataKey="defects" name="العيوب" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Access Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-full">
            <h3 className="text-xl font-black text-slate-800 mb-6">الوصول السريع</h3>
            <div className="space-y-4">
              {[
                { label: 'إضافة منتج جديد', icon: PlusCircle, view: 'products', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'رفع وثيقة معتمدة', icon: FileText, view: 'documents', color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'تحديث مؤشرات الأداء', icon: Activity, view: 'kpi', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'قاعدة البيانات', icon: Clock, view: 'database', color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => navigate(action.view as PageView)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700">{action.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-royal-600 group-hover:-translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            <div className="mt-8 p-6 bg-royal-900 rounded-[1.5rem] text-white relative overflow-hidden">
                <ShieldCheck className="absolute -bottom-4 -left-4 w-24 h-24 text-white/5" />
                <h4 className="font-black mb-2 flex items-center gap-2">تأمين البيانات</h4>
                <p className="text-[10px] text-royal-200 font-medium leading-relaxed">
                  يتم حفظ كافة البيانات محلياً في قاعدة بيانات IndexedDB لضمان الخصوصية والسرعة.
                </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Recent Items Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800">أحدث المنتجات المضافة</h3>
                    <p className="text-gray-400 text-xs mt-1">عرض آخر 5 منتجات تم تسجيلها في النظام</p>
                </div>
            </div>
            <button 
                onClick={() => navigate('products')}
                className="text-royal-600 text-sm font-black hover:text-royal-800 flex items-center gap-2 bg-royal-50 px-5 py-2.5 rounded-xl transition-all"
            >
                إدارة كافة المنتجات <ArrowRight className="w-4 h-4" />
            </button>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-right">
                 <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-black">
                     <tr>
                         <th className="px-8 py-5">هوية المنتج</th>
                         <th className="px-8 py-5">المواصفات والشركة</th>
                         <th className="px-8 py-5 text-center">الإجراء</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {products.slice(0, 5).map((product) => (
                         <tr key={product.id} className="hover:bg-royal-50/20 transition-colors">
                             <td className="px-8 py-5">
                                 <div className="flex items-center gap-5">
                                     <div className="relative w-16 h-16 shrink-0">
                                        <img src={product.image} alt="" className="w-full h-full rounded-2xl object-cover bg-gray-100 border border-gray-200 shadow-sm" />
                                     </div>
                                     <div className="text-right">
                                         <p className="font-black text-slate-800 text-base">{product.name}</p>
                                         <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">ID: #{product.id.slice(-6)}</p>
                                     </div>
                                 </div>
                             </td>
                             <td className="px-8 py-5">
                                 <div className="space-y-1">
                                    <p className="text-sm text-slate-600 font-medium truncate max-w-[300px]">{product.specs}</p>
                                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-black">{product.manufacturer || 'شركة غير محددة'}</span>
                                 </div>
                             </td>
                             <td className="px-8 py-5 text-center">
                                 <button 
                                    onClick={() => navigate('products')}
                                    className="p-3 text-slate-300 hover:text-royal-600 hover:bg-royal-50 rounded-2xl transition-all"
                                 >
                                     <Eye className="w-5 h-5" />
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
             {products.length === 0 && (
                <div className="p-20 text-center space-y-4">
                    <Package className="w-16 h-16 text-gray-100 mx-auto" />
                    <p className="text-gray-400 font-bold">لا توجد منتجات مسجلة حالياً</p>
                </div>
             )}
         </div>
      </motion.div>
    </motion.div>
  );
};
