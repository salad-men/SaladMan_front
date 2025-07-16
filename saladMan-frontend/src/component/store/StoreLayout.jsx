import { Outlet } from "react-router-dom"
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