import { Outlet } from "react-router"
import StoreHeader from "./StoreHeader";


const StoreLayout = () => {
    return(
        <>
            <StoreHeader/>
            <Outlet/>
        </>
    )
}

export default StoreLayout;