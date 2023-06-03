import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

export default function Root() {
    return (
        <div className="root">
            <p>I'm Root!</p>
            <Nav />
            <Outlet />
        </div>
    );
}
