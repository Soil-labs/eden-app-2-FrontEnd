import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const GridLayout: FC<Props> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-background container mx-auto max-w-screen-2xl flex-grow px-2 py-4 sm:px-5 ${className}`}
    >
      <div className="grid grid-cols-12 gap-4">{children}</div>
    </div>
  );
};

export const GridItemTwo: FC<Props> = ({ children, className = "" }) => {
  return (
    <div className={`col-span-12 md:col-span-12 lg:col-span-2 ${className}`}>
      {children}
    </div>
  );
};

export const GridItemThree: FC<Props> = ({ children, className = "" }) => {
  return (
    <div className={`col-span-12 md:col-span-12 lg:col-span-3 ${className}`}>
      {children}
    </div>
  );
};

export const GridItemFour: FC<Props> = ({ children, className = "" }) => {
  return (
    <div className={`col-span-12 md:col-span-12 lg:col-span-4 ${className}`}>
      {children}
    </div>
  );
};

export const GridItemSix: FC<Props> = ({ children, className = "" }) => {
  return (
    <div className={`col-span-12 md:col-span-12 lg:col-span-6 ${className}`}>
      {children}
    </div>
  );
};

export const GridItemEight: FC<Props> = ({ children, className = "" }) => {
  return (
    <div
      className={`col-span-12 mb-5 md:col-span-12 lg:col-span-8 ${className}`}
    >
      {children}
    </div>
  );
};

export const GridItemNine: FC<Props> = ({ children, className = "" }) => {
  return (
    <div
      className={`col-span-12 mb-5 md:col-span-12 lg:col-span-9 ${className}`}
    >
      {children}
    </div>
  );
};

export const GridItemTwelve: FC<Props> = ({ children, className = "" }) => {
  return <div className={`col-span-12 ${className}`}>{children}</div>;
};

export const CardGrid: FC<Props> = ({ children, className = "" }) => {
  return (
    <div
      className={`grid gap-5 pb-6 pt-2 md:grid-cols-2 2xl:grid-cols-3 ${className}`}
    >
      {children}
    </div>
  );
};
