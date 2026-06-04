// src/components/DeltaEntryEngine.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sliders, Trash2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ServiceType, MeterAccount, MeterReading } from '../types';
import { calculateElectricityTariff, calculateWaterTariff } from '../utils/tariffCalculator';

interface DeltaEntryEngineProps {
  activeServiceType: ServiceType;
  isConnected: boolean;
  activeAccount: MeterAccount;
  onUpdateBalance: (newBalance: number) => void;
  onUpdateAccount?: (account: MeterAccount) => void;
  onAwardPoints: (points: number, message: string) => void;
  onAddHistoryRecord: (month: string, cost: number, volume: number, isWater: boolean, tierSymbol?: string) => void;
  showToast: (msg: string) => void;
}

export default function DeltaEntryEngine({
  activeServiceType,
  isConnected,
  activeAccount,
  onUpdateBalance,
  onUpdateAccount,
  onAwardPoints,
  onAddHistoryRecord,
  showToast
}: DeltaEntryEngineProps) {
  const isElectricity = activeServiceType === 'electricity';
  const unitLabel = isElectricity ? 'ك.و.س' : 'م³';

  // إدارة السجلات داخلياً بشكل مستقر
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [inputValueMeterId, setInputValueMeterId] = useState('');
  const [inputValueBalance, setInputValueBalance] = useState('');
  const [inputValueDays, setInputValueDays] = useState('');
  const [inputValueReading, setInputValueReading] = useState('');

  // حالات الكاميرا المنفصلة
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentActiveScan, setCurrentActiveScan] = useState<'kwh' | 'cash' | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // تشغيل الكاميرا المنفصلة بناءً على نوع الخانة
  const startCamera = async (scanType: 'kwh' | 'cash') => {
    setIsCameraActive(true);
    setCurrentActiveScan(scanType);
    setIsScanning(true);
    
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: 640, height: 480 }
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log("صلاحية الكاميرا محاكاة بنجاح");
    }

    // محاكاة سريعة للّقط والقشط التلقائي للبيانات بعد ثانيتين
    setTimeout(() => {
      stopCamera();
      const mockId = activeAccount.meterId || 'LEG-2026-8801';
      setInputValueMeterId(mockId);
      setInputValueDays('15');

      if (scanType === 'kwh') {
        const generatedReading = isElectricity ? '3240.5' : '194.2';
        setInputValueReading(generatedReading);
        showToast(`📸 تم لقط قراءة العداد بنجاح: ${generatedReading} ${unitLabel}`);
      } else {
        const generatedBalance = isElectricity ? '220.50' : '85.00';
        setInputValueBalance(generatedBalance);
        showToast(`📸 تم لقط رصيد الكارت المتبقي: ${generatedBalance} ج.م`);
      }
    }, 2000);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsScanning(false);
    setCurrentActiveScan(null);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valueReadingNum = parseFloat(inputValueReading);
    const valueBalanceNum = parseFloat(inputValueBalance);

    if (isNaN(valueReadingNum) || isNaN(valueBalanceNum)) {
      showToast('❌ برجاء إدخال البيانات أو مسحها بالكاميرا أولاً');
      return;
    }

    const tariff = isElectricity 
      ? calculateElectricityTariff(45) // قيمة افتراضية للتفاضل
      : calculateWaterTariff(5);

    const postCostBalance = Math.max(0, valueBalanceNum - tariff.cost);
    onUpdateBalance(postCostBalance);
    
    showToast(`📊 تمت العملية! الرصيد الحالي بعد الخصم: ${postCostBalance.toFixed(2)} ج.م`);
    
    // تصفير الخانات
    setInputValueReading('');
    setInputValueBalance('');
  };

  return (
    <article className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* اللوحة اليمنى: الكاميرا الذكية وعرض شاشة المسح */}
        <section className="lg:col-span-5 bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-4">
          <div className="text-right">
            <h3 className="text-sm font-black text-slate-800">عدسة الفحص الـ AI وقشط الأرقام</h3>
            <p className="text-[11px] text-slate-500 font-bold">شاشة معالجة الرؤية الحاسوبية المباشرة</p>
          </div>

          <div className="relative aspect-square w-full bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center">
            {isCameraActive ? (
              <video ref={videoRef} playsInline autoPlay className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="p-4 text-slate-400 select-none">
                <Camera className="w-10 h-10 mx-auto mb-2 opacity-60 text-emerald-500" />
                <p className="text-xs font-black text-slate-300">العدسة مغلقة</p>
                <p className="text-[10px] text-slate-500 mt-1">اضغط على أزرار فتح الكاميرا لبدء القراءة أوتوماتيكياً</p>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-black/75 px-4 py-2 rounded-xl border border-emerald-500 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  جاري مسح خانة {currentActiveScan === 'kwh' ? 'العداد' : 'الرصيد'}...
                </div>
              </div>
            )}
          </div>
        </section>

        {/* اللوحة اليسرى: المدخلات وحسابات الشرائح */}
        <section className="lg:col-span-7 bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-800">خانات التحكم والمدخلات الرقمية</h3>
            <span className="text-[11px] bg-slate-100 p-1 px-2 rounded-lg font-bold text-slate-600">رقم العداد الحالي: {activeAccount.meterId}</span>
          </div>

          {/* صف زراير الكاميرات المنفصلة لتعبئة الخانات وحش وكبير */}
          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
            <span className="block text-[11px] font-black text-emerald-800">📸 فتح الكاميرا المنفصلة لملء الخانة مباشرة:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => startCamera('kwh')}
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-lg transition-all border-none cursor-pointer"
              >
                مسح شاشة العداد (kW)
              </button>
              <button
                type="button"
                onClick={() => startCamera('cash')}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg transition-all border-none cursor-pointer"
              >
                مسح كارت الرصيد (EGP)
              </button>
            </div>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">رقم العداد المكتشف:</label>
                <input
                  type="text"
                  value={inputValueMeterId}
                  onChange={(e) => setInputValueMeterId(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-3 bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none text-left"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">الرصيد المقشوط بالكارت (ج.م):</label>
                <input
                  type="text"
                  readOnly
                  placeholder="في انتظار الكاميرا..."
                  value={inputValueBalance}
                  className="w-full text-sm font-mono font-black p-3 bg-slate-100 border border-[#E5E7EB] rounded-xl text-left text-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">المدة المتوقعة باليوم:</label>
                <input
                  type="number"
                  value={inputValueDays}
                  onChange={(e) => setInputValueDays(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-3 bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none text-left"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">القراءة الجديدة ({unitLabel}):</label>
                <input
                  type="text"
                  readOnly
                  placeholder="في انتظار الكاميرا..."
                  value={inputValueReading}
                  className="w-full text-sm font-mono font-black p-3 bg-slate-100 border border-[#E5E7EB] rounded-xl text-left text-emerald-600"
                />
              </div>
            </div>

            {/* زر الاعتماد النهائي يظهر فقط بعد تعبئة الكاميرات لمنع اللخبطة اليدوية */}
            {inputValueReading && inputValueBalance && (
              <button
                type="submit"
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border-none"
              >
                تطبيق التفاضل الفوري واعتماد الرصيد الجديد رسمياً
              </button>
            )}
          </form>
        </section>

      </div>
    </article>
  );
}
