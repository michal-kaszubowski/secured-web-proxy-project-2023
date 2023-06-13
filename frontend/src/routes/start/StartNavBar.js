import pkceChallenge from 'react-native-pkce-challenge';

function Login() {
    const issuer = "http://localhost:8080/realms/myrealm"
    const clientId = "wsx2375"
    const redirect = "http://localhost:3000/oauth/intercept"

    function handleLogin() {
        let pkce = pkceChallenge();
        sessionStorage.setItem('codeVerifier', pkce.codeVerifier);

        // >> Security leak
        // console.log(`Login >> sending user to auth server with pkce verifier: ${pkce.codeVerifier}`);

        window.location.href = `${issuer}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}&state=XXXX&redirect_uri=${redirect}&code_challenge=${pkce.codeChallenge}&code_challenge_method=S256`;
    }

    // console.log('Login >> invoked');

    return (
        <button onClick={handleLogin}>login</button>
    );
}

export default function StartNavBar() {
    // console.log('StartNavBar >> invoked');

    return (
        <div className='nav-bar'>
            <h2>MENU</h2>
            <Login />
        </div>
    );
}
