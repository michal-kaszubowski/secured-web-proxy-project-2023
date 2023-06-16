import { useState, useEffect } from 'react';

function AdminNavBar() {
    const handleLogout = () => {
        const logoutRequest = fetch('http://localhost:5000/oauth/end');
        logoutRequest.then(() => window.location.href = '../home');
    };

    return (
        <div className="navbar">
            <p>Logo</p>
            <button onClick={handleLogout}>logout</button>
        </div>
    );
}

function AdminContent() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/forward?request=adminpublic')
            .then(response => response.json())
            .then(realData => setData(realData.data))
            .catch(error => {
                console.error(error);
                setData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="admin">
            {loading && <div>Loading...</div>}
            {data && (<div className="data">{data}</div>)}
        </div>
    )
}

export default function AdminView() {
    return (
        <div className="admin">
            <AdminNavBar />
            <AdminContent />
        </div>
    );
}
