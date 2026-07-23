function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="🔍 Search your notes..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "25px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px",
        boxSizing: "border-box",
      }}
    />
  );
}

export default SearchBar;