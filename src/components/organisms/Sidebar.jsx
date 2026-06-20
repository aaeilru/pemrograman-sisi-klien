const Sidebar = () => {
  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
      <div className="flex justify-between items-center p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">Admin</span>
      </div>

      <nav className="p-4 space-y-2">
        <a
          href="#"
          className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-blue-700"
        >
          <span className="text-lg">🏠</span>
          <span className="hidden lg:inline">Dashboard</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-2 px-4 py-2 rounded bg-blue-700"
        >
          <span className="text-lg">🎓</span>
          <span className="hidden lg:inline">Mahasiswa</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;