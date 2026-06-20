const TablePagination = ({
  search,
  setSearch,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  limit,
  setLimit,
  page,
  setPage,
  totalPages,
  totalCount,
  sortOptions = [],
  placeholder = "Cari data...",
}) => {
  const safeTotalPages = totalPages || 1;

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, safeTotalPages));
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            Pencarian
          </label>
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="lg:col-span-3">
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            Urutkan
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {sortOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-1">
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            Per Halaman
          </label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value={5}>5 data</option>
            <option value={10}>10 data</option>
            <option value={25}>25 data</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-gray-500">
          Halaman{" "}
          <span className="font-bold text-gray-800">{page}</span>{" "}
          dari{" "}
          <span className="font-bold text-gray-800">{safeTotalPages}</span>{" "}
          | Total{" "}
          <span className="font-bold text-gray-800">{totalCount}</span>{" "}
          data
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={page === 1}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-blue-600 px-3 text-sm font-bold text-white">
            {page}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={page === safeTotalPages}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;