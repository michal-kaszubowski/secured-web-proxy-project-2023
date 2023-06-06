import UserNavBar from "./UserNavBar";
import UserContent from "./UserContent";

export default function UserView() {
    return (
        <div className="user">
            <UserNavBar />
            <UserContent />
        </div>
    );
}
