/// <reference types="vite/client" />

interface Window {
  initSqlJs: (config: { locateFile: (file: string) => string }) => Promise<SqlJsStatic>
}

interface SqlJsStatic {
  Database: new (data?: ArrayLike<number>) => Database
}

interface Database {
  exec: (sql: string) => QueryExecResult[]
  close: () => void
}

interface QueryExecResult {
  columns: string[]
  values: unknown[][]
}
