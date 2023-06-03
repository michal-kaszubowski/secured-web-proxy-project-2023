import '../styles/Nav.css'
import pkceChallenge from 'react-native-pkce-challenge';

export function Login() {
    const issuer = "http://localhost:8080/realms/myrealm"
    const clientId = "wsx2375"
    const redirect = "http://localhost:3000/oauth"

    function handleLogin() {
        let pkce = pkceChallenge();
        localStorage.setItem('codeVerifier', pkce.codeVerifier);
        window.location.href = `${issuer}/protocol/openid-connect/auth?response_type=code&client_id=${clientId}&state=XXXX&redirect_uri=${redirect}&code_challenge=${pkce.codeChallenge}&code_challenge_method=S256`;
    }

    return (
        <button onClick={handleLogin}>login</button>
    );
}

export default function Nav() {
    return (
        <div className='nav-bar'>
            <h2>MENU</h2>
            <Login />
        </div>
    );
}
