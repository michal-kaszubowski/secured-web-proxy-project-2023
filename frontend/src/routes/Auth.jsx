export default function Auth() {
    const proxyURL = 'http://localhost:5000';
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    fetch(`${proxyURL}/oauth/flow/init?code=${authorizationCode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code_verifier: localStorage.getItem('codeVerifier') })
    })
        .then(response => {
            return (
                <div className="auth">
                    Hello! Auth here. There is a response from the proxy:
                    <div className="response: ">{response}</div>
                </div>
            );
        })
        .catch(err => {
            return (
                <div className="auth">
                    Hello! Auth here. There is an error from the fetch function:
                    <div className="error: ">{err}</div>
                </div>
            );
        });

    return (
        <div className="auth">
            <p>I'm Auth!</p>
            <p>This is your authorization code. Don't show it to anyone ;)</p>
            <p>{authorizationCode}</p>
            <p>And this is your one use PKCE code verifier. This is also secret!!!</p>
            <p>{localStorage.getItem('codeVerifier')}</p>
        </div>
    );
}
