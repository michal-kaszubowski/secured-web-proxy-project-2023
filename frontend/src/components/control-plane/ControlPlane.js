import { useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import VerifyUser from "./VerifyUser";
import RedirectUser from "./RedirectUser";

export default function ControlPlane() {
    const [authorized, setAuthorized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [id, setId] = useState(null);

    const handleRedirectForwarding = () => setAuthorized(true);

    console.log(`ControlPlane >> invoked with state [${authorized}, ${authenticated}]`);

    return (
        <div className="control-plane">
            <Outlet context={handleRedirectForwarding} />
            {(!authorized && !authenticated) ? <LoadingPage /> : null}
            {(authorized && !authenticated) ? <VerifyUser handleAuthenticated={setAuthenticated} handleAdmin={setIsAdmin} handleId={setId} /> : null}
            {(authorized && authenticated) ? <RedirectUser isAdmin={isAdmin} id={id} /> : null}
        </div>
    );
}
