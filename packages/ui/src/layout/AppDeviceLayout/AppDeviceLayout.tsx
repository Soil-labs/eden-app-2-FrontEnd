// import { MdMobileOff } from "react-icons/md";

interface IAppDeviceLayoutProps {
  children: any;
}

export const AppDeviceLayout = ({ children }: IAppDeviceLayoutProps) => {
  console.log(children);

  // const UA = navigator.userAgent;
  // const isMobile = Boolean(
  //   UA.match(
  //     /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  //   )
  // );

  return <h1>h</h1>;

  // if (isMobile) {
  //   return (
  //     <>
  //       {isMobile && (
  //         <section className="fixed top-0 left-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-white">
  //           <h1 className="text-edenGreen-600">Eden</h1>
  //           <p className="mb-2 text-center">
  //             Mobile site is
  //             <br /> under construction.
  //             <br /> Use your laptop.
  //           </p>
  //           <MdMobileOff className="text-2xl" />
  //         </section>
  //       )}
  //     </>
  //   );
  // } else {
  //   return children;
  // }
};

export default AppDeviceLayout;
