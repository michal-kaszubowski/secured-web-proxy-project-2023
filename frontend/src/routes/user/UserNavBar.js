export default function UserNavBar() {
    const handleLogout = () => {        
        window.location.href = 'http://localhost:8080/realms/myrealm/protocol/openid-connect/logout';
    };

    return (
        <div className="navbar">
            <p>Logo</p>
            <button onClick={handleLogout}>logout</button>
        </div>
    );
}
