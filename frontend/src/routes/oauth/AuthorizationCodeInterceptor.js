export default function AuthorizationCodeInterceptor() {
    const proxyURL = 'http://localhost:5000';
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    const request = fetch(`${proxyURL}/oauth/init?code=${authorizationCode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code_verifier: sessionStorage.getItem('codeVerifier') })
    });

    request.then(() => window.location.href = 'verify').catch(error => console.error(error));
}
