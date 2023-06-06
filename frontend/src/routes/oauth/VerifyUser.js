export default function VerifyUser() {
    console.log('VerifyUser >> invoked');

    const proxyURL = 'http://localhost:5000';

    const request = fetch(`${proxyURL}/oauth/userinfo`);

    request.then(response => {
        response.json().then(data => {
            localStorage.setItem('userNick', data.preferred_username);
            
            if (!data.realm_access.roles.includes("admin")) {
                window.location.href = '../../user';
            } else {
                window.location.href = '../../admin';
            }
        })
    }).catch(err => console.error(err));
}
