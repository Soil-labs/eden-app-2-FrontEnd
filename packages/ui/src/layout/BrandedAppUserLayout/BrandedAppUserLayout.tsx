import { useRouter } from "next/router";

import UserButton from "./UserButton";

export interface IBrandedAppUserLayoutProps {
  children: React.ReactNode;
  logoLink?: string;
}

export const BrandedAppUserLayout = ({
  children,
  logoLink = `/`,
}: IBrandedAppUserLayoutProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      <nav className="fixed left-0 top-0 z-40 h-16 w-screen bg-[#EFEFEF]">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4">
          <img
            src="/eden-imagotype.png"
            alt="Eden Protocol"
            width={68}
            className="mr-2 cursor-pointer pb-2"
            onClick={() => {
              router.push(logoLink);
            }}
          />
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="pt-16">{children}</main>
    </div>
  );
};

export default BrandedAppUserLayout;
