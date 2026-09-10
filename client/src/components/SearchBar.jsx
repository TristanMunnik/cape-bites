function SearchBar({ searchTerm, onSearchChange }) {
    return (
        <input
            type="search"
            placeholder="Search restaurants"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
        />
    )
}

export default SearchBar
