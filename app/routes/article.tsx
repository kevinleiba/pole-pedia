import { Link, Outlet } from "@remix-run/react";
import classNames from "classnames";
import logo from "~/components/icons/logo.svg";

export default function ArticlePage() {
  return (
    <div className="min-h-screen flex flex-row">
      <div className={classNames(
        "w-[164px] h-screen sticky top-0 left-0 self-start flex flex-col items-center p-l",
        "bg-gradient-to-b from-white via-lightGrey to-white"
      )
      }>
        <div className="h-[100px] w-[100px]" >
          <Link to="/"><img src={logo} alt="polepedia logo" /></Link>
        </div>
        <div className="absolute w-[1px] z-10 top-0 bottom-0 right-0 bg-gradient-to-b from-white via-vividBlue to-vividBlue"></div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}