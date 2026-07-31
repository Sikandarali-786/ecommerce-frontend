import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface TableColumn<T = Record<string, unknown>> {
  /** Column header label */
  header: string;
  /** Key of row data or render function */
  accessor?: keyof T;
  /** Custom cell renderer — receives the row item */
  cell?: (row: T) => ReactNode;
  /** Optional extra className on the <td> */
  tdClassName?: string;
}

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  /** Optional className on a <tr> — receives the row */
  rowClassName?: (row: T) => string;
  /** Shown when data is empty */
  emptyState?: ReactNode;
}

// ── Sub-components ────────────────────────────────────────────────────────────
export const Th = ({ children }: { children: ReactNode }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
    {children}
  </th>
);

export const Td = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <td className={`px-6 py-4 text-sm text-gray-700 ${className}`}>
    {children}
  </td>
);

// ── Main Component ────────────────────────────────────────────────────────────
function Table<T = Record<string, unknown>>({
  columns,
  data,
  rowKey,
  rowClassName,
  emptyState,
}: TableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <Th key={i}>{col.header}</Th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              className={`hover:bg-gray-50 transition-colors ${rowClassName ? rowClassName(row) : ''}`}
            >
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={`px-6 py-4 text-sm text-gray-700 ${col.tdClassName ?? ''}`}
                >
                  {col.cell
                    ? col.cell(row)
                    : col.accessor != null
                    ? String(row[col.accessor] ?? '')
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
