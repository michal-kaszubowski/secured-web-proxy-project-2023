import pkceChallenge from 'react-native-pkce-challenge';

function Login() {
    // Auth Server Config
    const authorizationEndpoint = 'http://localhost:8080/realms/myrealm/protocol/openid-connect/auth';
    const clientId = 'wsx2375';
    const redirect = 'http://localhost:3000/oauth/intercept';

    function handleLogin() {
        let pkce = pkceChallenge();
        sessionStorage.setItem('codeVerifier', pkce.codeVerifier);
        window.location.href = `${authorizationEndpoint}?response_type=code&client_id=${clientId}&state=XXXX&redirect_uri=${redirect}&code_challenge=${pkce.codeChallenge}&code_challenge_method=S256&scope=openid%20profile%20email`;
    }

    return (
        <button onClick={handleLogin}>login</button>
    );
}

export default function StartNavBar() {
    return (
        <div className='nav-bar'>
            <h2>MENU</h2>
            <Login />
        </div>
    );
}
