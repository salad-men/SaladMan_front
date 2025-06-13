import { Outlet } from "react-router"
import HqHeader from "./HqHeader";

const HqLayout = () => {
    return(
        <>
            <HqHeader/>
            <Outlet/>
        </>
    )
}

export default HqLayout;