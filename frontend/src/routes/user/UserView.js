import { useState, useEffect } from 'react';

function UserNavBar({ handleLogout }) {
    return (
        <div className="navbar">
            <p>Logo</p>
            <button onClick={handleLogout}>logout</button>
        </div>
    );
}

function UserPublicContent() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/forward?request=userpublic')
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
        <div className="public">
            {loading && <div>Loading...</div>}
            {data && (<div className="data">{data}</div>)}
        </div>
    )
}

function UserPrivateContent() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/forward?request=userprivate')
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
        <div className="private">
            {loading && <div>Loading...</div>}
            {data && (<div className="data">{data}</div>)}
        </div>
    )
}

export default function UserView() {
    const userNick = localStorage.getItem('userNick');
    const handleLogout = () => {
        const logoutRequest = fetch('http://localhost:5000/oauth/end');
        logoutRequest.then(() => window.location.href = '../home');
    };

    useEffect(() => {
        const sleep = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));
        sleep(1800).then(() => handleLogout());
    }, []);

    return (
        <div className="user">
            <UserNavBar handleLogout={handleLogout}/>
            <div className="greeting">Greetings, {userNick}!</div>
            <UserPublicContent />
            <UserPrivateContent />
        </div>
    );
}
