import { type ReactNode } from "react";
import Footer from "./footer"
import Navbar from "./navbar"

type LayoutProps = {
    children: ReactNode;
}

const Layout = ({children}:LayoutProps) => {
  return (
    <>
    <Navbar />
    <main>{children}</main>
    <Footer />
    </>
  )
}

export default Layout