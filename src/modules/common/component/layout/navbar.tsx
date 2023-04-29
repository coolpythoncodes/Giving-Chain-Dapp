import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { navlinks } from "~/utils/data";
import { ConnectButton } from "@particle-network/connect-react-ui";
import "@particle-network/connect-react-ui/dist/index.css";
import { useModalState } from "@particle-network/connect-react-ui";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { accountModalOpen } = useModalState();

  useEffect(() => {
    document.body.style.overflow = "visible";
    const htmlElement = document.getElementsByTagName("html")[0];
    if (htmlElement) {
      htmlElement.style.overflow = "visible";
    }
  }, [accountModalOpen]);

  return (
    <nav
      className={`font-space ${
        router.pathname === "/"
          ? "bg-[#190E0A]"
          : router.pathname.includes("/campaign")
          ? "bg-[#FCFCFC]"
          : "bg-[#F5F5F5]"
      }`}
    >
      <div className="layout-container flex h-12 items-center justify-between md:h-20">
        <Link
          href="/"
          className={`font-space text-base font-bold leading-[41px] md:text-[32px] ${
            router.pathname === "/" ? "text-white" : "text-black"
          }`}
        >
          GivingChain
        </Link>
        <div className="hidden items-center gap-x-4 lg:flex xl:gap-x-8">
          <ul className="flex items-center gap-x-4 xl:gap-x-8">
            {navlinks.map((item, index) => (
              <li key={`navlinks-${index}`}>
                <Link
                  href={item.to}
                  className={`text-base font-normal capitalize  ${
                    router.pathname === "/" ? "text-white" : "text-black"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <ConnectButton />
          {/* <Button className="border-none bg-[#FF6B00] text-white">
            Connect wallet
          </Button> */}
        </div>
        <MenuOutlined
          onClick={showDrawer}
          className={`lg:hidden ${router.pathname === "/" ? "text-white" : ""}`}
        />
      </div>
      {/* ------------------  mobile side bar -----------------------  */}
      <Drawer
        placement="left"
        {...{ onClose, open }}
        headerStyle={{ background: "#0E0916" }}
        bodyStyle={{ background: "#0E0916" }}
        closable={false}
        title={
          <div className="flex justify-end">
            <CloseOutlined onClick={onClose} className=" text-white" />
          </div>
        }
      >
        <ul className="mb-10 flex flex-col gap-y-10 font-space text-base font-normal capitalize leading-[19px] text-white">
          {navlinks.map((item, index) => (
            <li key={`mobile-navline-${index}`}>
              <Link href={item.to}>{item.name}</Link>
            </li>
          ))}
        </ul>
        {/* <ConnectButton /> */}
      </Drawer>
    </nav>
  );
};

export default Navbar;
