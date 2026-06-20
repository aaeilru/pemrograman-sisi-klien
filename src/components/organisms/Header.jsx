const Header = ({ title, onToggleProfile }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <button
          onClick={onToggleProfile}
          className="w-8 h-8 rounded-full bg-gray-300"
        />
      </div>
    </header>
  );
};

export default Header;