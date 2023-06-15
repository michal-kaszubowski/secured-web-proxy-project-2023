function UserNavBar() {
    const handleLogout = () => {        
        window.location.href = '';
    };

    return (
        <div className="navbar">
            <p>Logo</p>
            <button onClick={handleLogout}>logout</button>
        </div>
    );
}

function UserContent() {
    const userNick = localStorage.getItem('userNick');

    return (
        <div className="content">
            <h2>Hello {userNick}!</h2>
        </div>
    );
}

export default function UserView() {
    return (
        <div className="user">
            <UserNavBar />
            <UserContent />
        </div>
    );
}
