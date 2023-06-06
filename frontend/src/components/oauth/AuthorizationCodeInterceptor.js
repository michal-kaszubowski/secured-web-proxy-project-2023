import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function AuthorizationCodeInterceptor() {
    const onResolved = useOutletContext();

    const proxyURL = 'http://localhost:5000';
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    // >> Security leak
    console.log(`AuthorizationCodeInterceptor >> invoked with authorization code: ${authorizationCode}`);

    useEffect(() => {
        console.log('AuthorizationCodeInterceptor >> using effect to fetch a resource');
        fetch(`${proxyURL}/oauth/flow/init?code=${authorizationCode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code_verifier: localStorage.getItem('codeVerifier') })
        })
            .then(() => {
                console.log('AuthorizationCodeInterceptor >> fetch promise resolved');
                onResolved();
            })
            .catch(err => console.error(err))
    });
}
