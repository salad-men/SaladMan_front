import { Outlet } from "react-router"
import Header from "./Header";

const HqLayout = () => {
    return(
        <>
            <Header/>
            <Outlet/>
        </>
    )
}

export default HqLayout;