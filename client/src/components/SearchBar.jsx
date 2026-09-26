function SearchBar({ searchTerm, onSearchChange }) {
    return (
        <label className="search-bar">
            <span className="search-icon" aria-hidden="true" />
            <input
                type="search"
                aria-label="Search restaurants"
                placeholder="Search restaurants, cuisines, or neighbourhoods"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
            />
        </label>
    )
}

export default SearchBar
