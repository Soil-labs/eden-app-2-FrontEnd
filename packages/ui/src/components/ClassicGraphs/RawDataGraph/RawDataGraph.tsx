import dynamic from "next/dynamic";
import { RefObject, useEffect, useRef, useState } from "react";

const GraphVisual = dynamic(
  () => import("@eden/package-ui/g6/GraphVisual/GraphVisual"),
  {
    ssr: false,
  }
);

export interface IRawDataGraphProps {
  rawData: any;
  disableZoom: boolean;
}

export const RawDataGraph = ({ rawData, disableZoom }: IRawDataGraphProps) => {
  const refContainer = useRef<HTMLDivElement>();

  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const getwidth = () => {
      setWidth(refContainer.current?.offsetWidth!);
    };

    // when the component gets mounted
    setWidth(refContainer.current?.offsetWidth!);

    // to handle page resize
    window.addEventListener("resize", getwidth);
    // remove the event listener before the component gets unmounted
    return () => window.removeEventListener("resize", getwidth);
  }, []);

  const [graph, setGraph] = useState<any>();

  return (
    <>
      {refContainer && (
        <div
          className="h-full w-full"
          ref={refContainer as RefObject<HTMLDivElement>}
        >
          {rawData?.nodes?.length > 0 ? (
            <GraphVisual
              data2={rawData}
              width={width}
              height={refContainer.current?.offsetHeight!}
              hasMenu={false}
              graph={graph}
              setGraph={setGraph}
              disableZoom={disableZoom}
            />
          ) : (
            <p>Dont have Graph Data Yet</p>
          )}
        </div>
      )}
    </>
  );
};
