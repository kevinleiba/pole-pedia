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
          <Link to="/">
            <img src={logo} alt="polepedia logo" />
            <h3 className="text-center mt-xs font-light">Pole Pedia</h3>
            <p className="text-xs text-center">Your Encyclopieda</p>
          </Link>
          <div className="mt-l flex flex-col">
            <Link to="/" className="text-darkBlue hover:underline text-xs mb-xs">Main page</Link>
            <Link to="/" className="text-darkBlue hover:underline text-xs mb-xs">Random Article</Link>
            <Link to="/article/new" className="text-darkBlue hover:underline text-xs">Create Article</Link>
          </div>
        </div>
        <div className="absolute w-[1px] z-10 top-0 bottom-0 right-0 bg-gradient-to-b from-white via-vividBlue to-vividBlue"></div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}