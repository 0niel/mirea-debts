export type StatisticsByDepartments = {
  [key: string]: {
    debtors: number
    debts: number
  }
} | null
