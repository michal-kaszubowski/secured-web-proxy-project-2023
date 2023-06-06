export default function AuthorizationCodeInterceptor() {
    const proxyURL = 'http://localhost:5000';
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    // >> Security leak
    console.log(`AuthorizationCodeInterceptor >> invoked with authorization code: ${authorizationCode}`);

    const request = fetch(`${proxyURL}/oauth/init?code=${authorizationCode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code_verifier: sessionStorage.getItem('codeVerifier') })
    });

    request.then(() => {
        console.log('AuthorizationCodeInterceptor >> fetch promise resolved');
        window.location.href = 'verify';
    }).catch(err => console.error(err));
}
