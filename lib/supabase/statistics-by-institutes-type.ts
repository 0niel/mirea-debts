export type StatisticsByInstitutes = {
  [key: string]: {
    debtors: number
    debts: number
    students: number
  }
} | null
