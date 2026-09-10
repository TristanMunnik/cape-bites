function DirectoryHeader({ resultCount }) {
    return (
        <div className="section-heading">
            <div>
                <p className="eyebrow">A short list to start</p>
                <h2 id="directory-heading">Explore the directory</h2>
            </div>
            <p className="result-count">{resultCount} places</p>
        </div>
    )
}

export default DirectoryHeader
