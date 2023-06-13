import StartNavBar from "./StartNavBar";
import StartContent from "./StartContent";

export default function StartView() {
    // console.log('StartView >> invoked');

    return (
        <div className="start-view">
            <StartNavBar />
            <StartContent />
        </div>
    );
}
