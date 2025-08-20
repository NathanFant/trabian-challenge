import type { Filters } from "../types";

export function FiltersBar({
  value, onChange, categories
}: { value: Filters; onChange: (f: Filters)=>void; categories: string[] }) {
  return (
    <div className="glass p-3 flex flex-wrap items-end gap-3">
      <div className="flex flex-col">
        <label className="text-xs text-zinc-400">From</label>
        <input className="input" type="date" value={value.from ?? ""} onChange={e=>onChange({ ...value, from: e.target.value || undefined })} />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-zinc-400">To</label>
        <input className="input" type="date" value={value.to ?? ""} onChange={e=>onChange({ ...value, to: e.target.value || undefined })} />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-zinc-400">Category</label>
        <select className="input" value={value.category ?? ""} onChange={e=>onChange({ ...value, category: e.target.value || undefined })}>
          <option value="">All</option>
          {categories.map(c=>(<option key={c} value={c}>{c}</option>))}
        </select>
      </div>
      <button className="btn" onClick={()=>onChange({})}>Reset</button>
    </div>
  );
}
