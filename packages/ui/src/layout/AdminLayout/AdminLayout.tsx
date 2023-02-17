import { LoginButton } from "@eden/package-ui";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import {
  MdClose,
  MdOutlineError,
  MdOutlineGraphicEq,
  MdOutlineHome,
  MdOutlineSensorDoor,
} from "react-icons/md";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: MdOutlineHome, current: true },
  {
    name: "My reports",
    href: "/admin/reports",
    icon: MdOutlineGraphicEq,
    current: false,
  },
  {
    name: "Party Rooms",
    href: "/admin/party-rooms",
    icon: MdOutlineSensorDoor,
    current: false,
  },
  {
    name: "Grants",
    href: "/admin/grants",
    icon: FaMoneyBillWaveAlt,
    current: false,
  },
  {
    name: "Error Logs",
    href: "/admin/error-log",
    icon: MdOutlineError,
    current: false,
  },
  // { name: "Calendar", href: "#", icon: MdReply, current: false },
  // { name: "Documents", href: "#", icon: MdReply, current: false },
  // { name: "Reports", href: "#", icon: MdReply, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export interface IAdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: IAdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="bg-background flex h-screen min-w-0 flex-col lg:overflow-y-hidden">
        <>
          <div>
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-40 md:hidden"
                onClose={setSidebarOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 z-40 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                          <button
                            type="button"
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="sr-only">Close sidebar</span>
                            <MdClose
                              className="h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                          <span className="text-darkGreen ml-2 text-2xl font-bold">
                            🌱 Eden.
                          </span>
                        </div>
                        <nav className="mt-5 space-y-1 px-2">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? "text-gray-500"
                                    : "text-gray-400 group-hover:text-gray-500",
                                  "mr-4 h-6 w-6 flex-shrink-0"
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                  <div className="w-14 flex-shrink-0">
                    {/* Force sidebar to shrink to fit close icon */}
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-shrink-0 items-center px-4">
                    <span className="text-darkGreen ml-2 text-2xl font-bold">
                      🌱 Eden.
                    </span>
                  </div>
                  <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 h-6 w-6 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col md:pl-64">
              <div className="sticky top-0 z-10 flex h-16 border-b bg-white pl-1 pt-1 shadow-lg shadow-slate-500/10 sm:pl-3 sm:pt-3 md:hidden">
                <button
                  type="button"
                  className="-ml-0.5 -mt-0.5 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="text-darkGreen ml-2 text-2xl font-bold">
                    🌱 Eden.
                  </span>
                </button>
                <div className="ml-auto mt-2 pr-2 md:pr-4">
                  <LoginButton inApp={true} />
                </div>
              </div>
              <div
                className={`sticky top-0 z-10 hidden h-16 justify-between border-b bg-white md:flex `}
              >
                <div></div>
                <div className="ml-auto mt-4 pr-2 md:pr-4">
                  <LoginButton inApp={true} />
                </div>
              </div>
              <main className="flex flex-grow">{children}</main>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default AdminLayout;
