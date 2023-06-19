import StartNavBar from "./StartNavBar";

function StartContent() {
    return (
        <div className="start-content">
            <h1>Hello to my super-app!</h1>
            <div className="logo">Logo</div>
        </div>
    );
}

export default function StartView() {
    return (
        <div className="start-view">
            <StartNavBar />
            <StartContent />
        </div>
    );
}
