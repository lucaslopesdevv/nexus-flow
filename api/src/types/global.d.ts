declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    HOST: string
    DATABASE_URL: string
    JWT_SECRET: string
    CORS_ORIGINS: string
  }
}

declare module '@prisma/client' {
  export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'
  export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
  export type FocusType = 'focus' | 'break'
  export type TransactionType = 'income' | 'expense'
  export type TransactionCategory =
    | 'salary'
    | 'investment'
    | 'other_income'
    | 'food'
    | 'transportation'
    | 'utilities'
    | 'entertainment'
    | 'shopping'
    | 'healthcare'
    | 'other_expense'
} 