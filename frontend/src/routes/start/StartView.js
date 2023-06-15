import StartNavBar from "./StartNavBar";

function StartContent() {
    return (
        <div className="start-content">
            <h1>Hello to my super App!</h1>
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
