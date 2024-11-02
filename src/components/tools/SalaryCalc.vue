<script setup lang="ts">
import {
  type IncomeCalculationSection,
  type IndependentSalaryOutput,
  type ParafiscalsSection,
  type RiskLevels,
} from '@/components/models/salary.model'
import { ref } from 'vue'

const salaryRef = ref(0)
const exchangeRateRef = ref(0)
const independentSalaryOutput = ref<IndependentSalaryOutput | null>(null)
const calculatedSalaryFlag = ref(false)

function calculateIndependentSalary(
  salary: number,
  exchangeRate: number,
  riskLevel: number = 1,
  preferredAutoRetentionPercentage: number = 0.17,
) {
  const minimumWage = 1_300_000
  const salaryInLocal = salary * exchangeRate
  const annualSalaryInLocal = salaryInLocal * 12
  const incomeCalculation: IncomeCalculationSection = {
    annual: {
      salaryInFx: salary * 12,
      salaryInLocal: annualSalaryInLocal,
    },
    monthly: {
      salaryInFx: salary,
      salaryInLocal: salaryInLocal,
    },
  }
  const salaryIbcCalculation = salaryInLocal * 0.4
  const ibc =
    salaryIbcCalculation > minimumWage ? salaryIbcCalculation : minimumWage // IBC: Ingreso Base de Cotización
  const healthPercentage = 0.125
  const retirementPercentage = 0.16
  const riskLevelPercentage: RiskLevels = {
    1: 0.00522,
    2: 0.01044,
    3: 0.02436,
    4: 0.0435,
  }
  const suggestedAutoRetention =
    salaryInLocal * preferredAutoRetentionPercentage
  const socialContribution =
    ibc *
      (healthPercentage +
        retirementPercentage +
        riskLevelPercentage[riskLevel]) +
    suggestedAutoRetention
  const netSalary = salaryInLocal - socialContribution
  const parafiscals: ParafiscalsSection = {
    ibc,
    healthTax: ibc * healthPercentage,
    retirementSavingsTax: ibc * retirementPercentage,
    professionalRisksTax: ibc * riskLevelPercentage[riskLevel],
    socialSecurityTotal: socialContribution - suggestedAutoRetention,
    suggestedMonthlyIncomeTax: suggestedAutoRetention,
    parafiscalsTotal: socialContribution,
  }
  const salaryOutput: IndependentSalaryOutput = {
    incomeCalculation,
    parafiscals,
    netIncome: netSalary,
  }
  independentSalaryOutput.value = salaryOutput
  calculatedSalaryFlag.value = true
}

function formatCurrency(
  numberToFormat: number,
  region: Intl.LocalesArgument,
  formatOpts: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(region, formatOpts).format(numberToFormat)
}

function formatCurrencyInLocal(numberToFormat: number | undefined) {
  return formatCurrency(numberToFormat || 0, 'es-CO', {
    style: 'currency',
    currency: 'COP',
  })
}

function formatCurrencyInFx(numberToFormat: number | undefined) {
  return formatCurrency(numberToFormat || 0, 'en-US', {
    style: 'currency',
    currency: 'USD',
  })
}
</script>

<template>
  <!-- HTML -->
  <section>
    <h2>Variables</h2>
    <p>
      <label for="sc_salary">Salario en la moneda extranjera:</label>
      <input
        type="number"
        id="sc_salary"
        name="sc_salary"
        v-model="salaryRef"
      />
      <br />
      <label for="sc_exchange_rate">Tasa de cambio:</label>
      <input
        type="number"
        id="sc_exchange_rate"
        name="sc_exchange_rate"
        v-model="exchangeRateRef"
      />
      <input
        type="button"
        @click="() => calculateIndependentSalary(salaryRef, exchangeRateRef)"
        value="Calcular"
      />
    </p>
  </section>
  <section v-if="calculatedSalaryFlag">
    <h2>Resultado cálculo:</h2>
    <span>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tasa de cambio utilizada:</td>
            <td>{{ formatCurrencyInLocal(exchangeRateRef) }}</td>
          </tr>
          <tr>
            <td>Salario anual bruto (FX):</td>
            <td>
              {{
                formatCurrencyInFx(
                  independentSalaryOutput?.incomeCalculation.annual.salaryInFx,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Salario anual bruto (Local):</td>
            <td>
              {{
                formatCurrencyInLocal(
                  independentSalaryOutput?.incomeCalculation.annual
                    .salaryInLocal,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Salario mensual bruto (FX):</td>
            <td>
              {{
                formatCurrencyInFx(
                  independentSalaryOutput?.incomeCalculation.monthly.salaryInFx,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Salario mensual bruto (Local):</td>
            <td>
              {{
                formatCurrencyInLocal(
                  independentSalaryOutput?.incomeCalculation.monthly
                    .salaryInLocal,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>IBC:</td>
            <td>
              {{
                formatCurrencyInLocal(independentSalaryOutput?.parafiscals.ibc)
              }}
            </td>
          </tr>
          <tr>
            <td>Aportes a salud:</td>
            <td>
              {{
                formatCurrencyInLocal(
                  independentSalaryOutput?.parafiscals.healthTax,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Aportes a pensión:</td>
            <td>
              {{
                formatCurrencyInLocal(
                  independentSalaryOutput?.parafiscals.retirementSavingsTax,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Aportes a riesgos profesionales:</td>
            <td>
              {{
                formatCurrencyInLocal(
                  independentSalaryOutput?.parafiscals.professionalRisksTax,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Ahorro sugerido impuestos (17%):</td>
            <td>
              {{
                formatCurrencyInLocal(
                  independentSalaryOutput?.parafiscals
                    .suggestedMonthlyIncomeTax,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Total seguridad social (salud, pensión, riesgos):</td>
            <td>
              {{
                formatCurrencyInLocal(
                  independentSalaryOutput?.parafiscals.socialSecurityTotal,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Total parafiscales (salud, pensión, riesgos, impuestos):</td>
            <td>
              {{
                formatCurrencyInLocal(
                  independentSalaryOutput?.parafiscals.parafiscalsTotal,
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Salario neto mensual:</td>
            <td>
              {{ formatCurrencyInLocal(independentSalaryOutput?.netIncome) }}
            </td>
          </tr>
        </tbody>
      </table>
    </span>
  </section>
</template>

<style lang="css" scoped>
/** CSS */
</style>
