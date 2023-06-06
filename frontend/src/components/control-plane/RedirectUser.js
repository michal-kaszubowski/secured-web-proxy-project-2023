export default function RedirectUser({ isAdmin, id }) {
    if (isAdmin) {
        window.location.href = `/admin/:${id}`;
    } else {
        window.location.href = `/user/:${id}`;
    }
}
