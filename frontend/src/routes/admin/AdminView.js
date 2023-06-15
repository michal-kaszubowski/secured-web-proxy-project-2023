function AdminNavBar() {
    return (
        <div className="navbar">
            <p>Logo</p>
            <button>logout</button>
        </div>
    );
}

function AdminContent() {
    const userNick = localStorage.getItem('userNick');

    return (
        <div className="content">
            <h2>Hello {userNick}!</h2>
        </div>
    );
}

export default function AdminView() {
    return (
        <div className="admin">
            <AdminNavBar />
            <AdminContent />
        </div>
    );
}
