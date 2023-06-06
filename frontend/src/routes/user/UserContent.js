export default function UserContent() {
    const userNick = localStorage.getItem('userNick');

    return (
        <div className="content">
            <h2>Hello {userNick}!</h2>
        </div>
    );
}
