import { ReactNode } from "react";
import { COLORS } from "@/constants/colors";

export interface TableColumn<T> {
  header: string;
  className?: string;
  render: (item: T) => ReactNode;
}

interface Props<T> {
  data: T[];
  columns: TableColumn<T>[];
  emptyMessage?: string;
}

export default function DataTable<T>({
  data,
  columns,
  emptyMessage = "No data found.",
}: Props<T>) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full">
        <thead style={{ backgroundColor: COLORS.softCard }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                className={`p-5 ${column.className ?? "text-left"}`}
                style={{ color: COLORS.muted }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-10 text-center"
                style={{ color: COLORS.muted }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className="border-t"
                style={{ borderColor: COLORS.border }}
              >
                {columns.map((column) => (
                  <td key={column.header} className="p-5">
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}