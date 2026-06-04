import React, { useState } from 'react';
import DeltaEntryEngine from './components/DeltaEntryEngine';
import { ServiceType, MeterAccount } from './types';
import { Zap, Droplet, User } from 'lucide-react';

export default function App() {
  // 1. المرفق النشط (كهرباء أو مياه)
  const [activeService, setActiveService] = useState<ServiceType>('electricity');
  
  // 2. حالة الاتصال بالعداد الذكي
  const [isConnected] = useState<boolean>(true);

  // 3. بيانات حسابك الافتراضية بخطوط واضحة
  const [account, setAccount] = useState<MeterAccount>({
    meterId: 'LEG-2026-8801',
    customerName: 'محمد شعبان فرغلي',
    balance: 150.00,
    predictedDays: 12,
    lastReadingDate: new Date().toISOString().split('T')[0],
    meterType: 'prepaid'
  });

  // الدوالي الأساسية لتحديث الرصيد والبيانات
  const handleUpdateBalance = (newBalance: number) => {
    setAccount(prev => ({ ...prev, balance: newBalance }));
  };

  const handleUpdateAccount = (updated: MeterAccount) => {
    setAccount(updated);
  };

  // التعديل هنا: تم إصلاح الدمج النصي بطريقة آمنة ومضمونة 100% بدون أي Crash
  const handleAwardPoints = (points: number, message: string) => {
    alert("🎉 نظام النقاط: كسبت +" + points + " نقطة!\n" + message);
  };

  const handleAddHistoryRecord = (month: string, cost: number, volume: number, isWater: boolean, tierName?: string) => {
    console.log(`[سجل جديد] شريحة: ${tierName} | تكلفة: ${cost} ج.م`);
  };

  const showToast = (msg: string) => {
    alert(msg); // تنبيه سريع ونظيف للموبايل
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-right p-4" dir="rtl">
      {/* البار العلوي كروت كبيرة */}
      <header className="bg-white border border-[#E5E7EB] p-4 rounded-2xl mb-6 shadow-xs max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <h1 className="text-base font-black text-slate-800">منظومة VoltSync الذكية على بياض</h1>
        </div>

        {/* كارت حساب محمد */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2 px-4">
          <div className="text-right">
            <p className="text-xs font-black text-slate-700">{account.customerName}</p>
            <p className="text-sm font-black text-emerald-600 mt-0.5">{account.balance.toFixed(2)} ج.م</p>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <User className="w-5 h-5" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        
        {/* زراير التبديل الكبيرة بين المرافق */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <button
            onClick={() => setActiveService('electricity')}
            className={`py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-none ${
              activeService === 'electricity'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" /> عداد الكهرباء
          </button>
          
          <button
            onClick={() => setActiveService('water')}
            className={`py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-none ${
              activeService === 'water'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Droplet className="w-4 h-4" /> عداد المياه
          </button>
        </div>

        {/* استدعاء محرك الكاميرات والـ OCR */}
        <DeltaEntryEngine
          activeServiceType={activeService}
          isConnected={isConnected}
          activeAccount={account}
          onUpdateBalance={handleUpdateBalance}
          onUpdateAccount={handleUpdateAccount}
          onAwardPoints={handleAwardPoints}
          onAddHistoryRecord={handleAddHistoryRecord}
          showToast={showToast}
        />

      </main>
    </div>
  );
}
