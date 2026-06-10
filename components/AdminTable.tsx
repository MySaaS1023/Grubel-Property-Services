export function AdminTable({
  columns,
  rows,
  minWidth = "720px",
}: {
  columns: string[];
  rows: string[][];
  minWidth?: string;
}) {
  if (rows.length === 0) {
    return <AdminEmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse text-left text-sm"
        style={{ minWidth }}
      >
        <thead>
          <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-charcoal/50">
            {columns.map((column) => (
              <th className="py-3 pr-4" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className="border-b border-slate-100 last:border-b-0" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  className="py-3 pr-4 font-semibold leading-6 text-charcoal"
                  key={`${cell}-${cellIndex}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminEmptyState() {
  return (
    <p className="rounded-md bg-stonewash p-4 text-sm font-semibold text-charcoal/70">
      No records yet.
    </p>
  );
}
