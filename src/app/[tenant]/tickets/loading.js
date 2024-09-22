export default function Loading() {
  return (
    <div className="animate-pulse space-y-6 p-4">
      {/* Header */}
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>

      {/* Users section */}
      <div className="space-y-2">
        <div className="h-6 bg-slate-200 rounded w-1/6"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>

      {/* Add user button */}
      <div className="flex justify-end">
        <div className="h-10 bg-slate-200 rounded w-24"></div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-3 gap-4">
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
      </div>

      {/* Table rows */}
      {[...Array(3)].map((_, index) => (
        <div key={index} className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4 justify-self-end"></div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-8 w-8 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
