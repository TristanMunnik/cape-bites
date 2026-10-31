function StatusMessage({ title, message, children }) {
    return (
        <div className="status-message" role="status">
            <h2>{title}</h2>
            {message && <p>{message}</p>}
            {children && <div className="status-actions">{children}</div>}
        </div>
    )
}

export default StatusMessage
