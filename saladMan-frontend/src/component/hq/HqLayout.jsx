import { Outlet } from "react-router"
import HqHeader from "./HqHeader";

const HqLayout = (props) => {
    return(
        <>
            <HqHeader{...props}/>
            <Outlet/>
        </>
    )
}

export default HqLayout;