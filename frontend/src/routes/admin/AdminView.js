import AdminNavBar from "./AdminNavBar";
import AdminContent from "./AdminContent";

export default function AdminView() {
    return (
        <div className="admin">
            <AdminNavBar />
            <AdminContent />
        </div>
    );
}
