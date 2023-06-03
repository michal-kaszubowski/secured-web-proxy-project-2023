export default function Auth() {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    // Here will be code for sending ${authorizationCode} to the confidential proxy server!

    return (
        <div className="auth">
            <p>I'm Auth!</p>
            <p>This is your authorization code. Don't show it to anyone ;)</p>
            <p>{authorizationCode}</p>
        </div>
    );
}
