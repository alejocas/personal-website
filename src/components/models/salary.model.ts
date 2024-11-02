interface GrossIncome {
  salaryInFx: number
  salaryInLocal: number
}

export interface RiskLevels {
  [key: number]: number
}

export type IncomeCalculationSection = {
  annual: GrossIncome
  monthly: GrossIncome
}

export type ParafiscalsSection = {
  ibc: number
  healthTax: number
  retirementSavingsTax: number
  professionalRisksTax: number
  socialSecurityTotal: number
  suggestedMonthlyIncomeTax: number
  parafiscalsTotal: number
}

export type IndependentSalaryOutput = {
  incomeCalculation: IncomeCalculationSection
  parafiscals: ParafiscalsSection
  netIncome: number
}
