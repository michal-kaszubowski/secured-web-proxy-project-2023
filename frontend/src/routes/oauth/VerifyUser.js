export default function VerifyUser() {
    const proxyURL = 'http://localhost:5000';
    const request = fetch(`${proxyURL}/oauth/userinfo`);

    request.then(response => {
        response.json().then(data => {
            localStorage.setItem('userNick', data.nick);
            (data.roles.includes("admin")) ?
                window.location.href = '../../admin' :
                window.location.href = '../../user';
        })
    }).catch(error => console.error(error));
}
