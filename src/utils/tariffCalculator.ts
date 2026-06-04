// src/utils/tariffCalculator.ts

export interface TariffResult {
  cost: number;
  tierName: string;
  breakdown: string[];
}

// حساب شرائح الكهرباء المصرية (مثال مبسط ومستقر)
export function calculateElectricityTariff(kwh: number): TariffResult {
  let cost = 0;
  let tierName = "الشريحة الأولى";
  
  if (kwh <= 50) {
    cost = kwh * 0.68;
    tierName = "الشريحة الأولى (٠-٥٠ ك.و.س)";
  } else if (kwh <= 100) {
    cost = 50 * 0.68 + (kwh - 50) * 0.78;
    tierName = "الشريحة الثانية (٥١-١٠٠ ك.و.س)";
  } else {
    cost = kwh * 1.25;
    tierName = "الشريحة الثالثة (المستهلك العادي)";
  }

  return {
    cost,
    tierName,
    breakdown: [`حجم الاستهلاك: ${kwh.toFixed(1)} ك.و.س`, `إجمالي الحساب الصافي: ${cost.toFixed(2)} ج.م`]
  };
}

// حساب شرائح المياه
export function calculateWaterTariff(cubicMeters: number): TariffResult {
  let cost = cubicMeters * 1.50;
  let tierName = "الشريحة المنزلية العادية";
  
  if (cubicMeters > 15) {
    tierName = "الشريحة المرتفعة";
  }

  return {
    cost,
    tierName,
    breakdown: [`حجم استهلاك المياه: ${cubicMeters.toFixed(1)} م³`, `إجمالي حساب المرفق: ${cost.toFixed(2)} ج.م`]
  };
}

