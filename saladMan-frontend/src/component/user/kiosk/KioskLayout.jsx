import { Outlet } from "react-router"
import KioskHeader from "./KioskHeader";

const KioskLayout = ()=>{
    return(
        <>
            <KioskHeader/>
            <Outlet/>
        </>
    )
}

export default KioskLayout;