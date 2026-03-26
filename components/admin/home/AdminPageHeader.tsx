export function AdminPageHeader() {
  return (
    <div className="mb-8 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-lg backdrop-blur sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
        Admin Access
      </p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Manage restaurants, menu items, testimonials, and media content in one streamlined workspace.
      </p>
    </div>
  );
}
