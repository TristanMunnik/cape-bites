function CuisineFilter({ cuisines, selectedCuisine, onCuisineChange }) {
    return (
        <div className="cuisine-filter" role="group" aria-label="Filter by cuisine">
            {['All', ...cuisines].map((cuisine) => (
                <button
                    key={cuisine}
                    type="button"
                    aria-pressed={selectedCuisine === cuisine}
                    onClick={() => onCuisineChange(cuisine)}
                >
                    {cuisine}
                </button>
            ))}
        </div>
    )
}

export default CuisineFilter
