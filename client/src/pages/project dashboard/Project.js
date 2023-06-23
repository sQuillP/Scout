import HorizontalNavigation from "../../components/HorizontalNavigation";
import VerticalNavigation from "./components/VerticalNavigation";
import { Outlet } from "react-router-dom";



export default function Project() {

    return (
        <>
            <HorizontalNavigation/>
            <VerticalNavigation/>
            <Outlet/>
        </>
    )

}