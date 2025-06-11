import { Outlet } from "react-router"
import Header from "./Header";

const StoreLayout = () => {
    return(
        <>
            <Header/>
            <Outlet/>
        </>
    )
}

export default StoreLayout;