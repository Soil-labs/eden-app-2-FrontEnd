import { XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
};

export interface BadgeProps {
  colorRGB?: string;
  text?: string;
  className?: string;
  closeButton?: boolean;
  cutText?: number;
  onClose?: () => void;
}
export const Badge = ({
  colorRGB,
  text,
  className = "",
  closeButton = false,
  cutText = 8,
  onClose,
}: BadgeProps) => {
  const [isHover, setIsHover] = useState("");
  const isMounted = useIsMounted();

  if (!text || !isMounted) return null;

  const textShort =
    text?.length > cutText ? text.substring(0, cutText) + "..." : text;

  return (
    <>
      <div
        data-tip={isHover}
        data-for={`badgeTip-${text}`}
        className={`mr-2 mb-1 inline-block cursor-default rounded-full ${className}`}
        style={{ background: `rgba(${colorRGB})` }}
        onMouseEnter={() => {
          setIsHover(`${text}`);
        }}
        onMouseLeave={() => {
          setIsHover("");
        }}
      >
        <div className="flex h-full w-full items-center justify-between px-3">
          <>
            <span className="mb-px">{textShort}</span>
            {closeButton && (
              <button
                aria-label="remove"
                className={`ml-1 -mt-1 -mr-1`}
                onClick={onClose}
              >
                <XIcon
                  className="inline-block h-4 w-4 cursor-pointer text-gray-900 hover:text-slate-400"
                  aria-hidden="true"
                />
              </button>
            )}
          </>
        </div>
      </div>
      <ReactTooltip
        role="tooltip"
        id={`badgeTip-${text}`}
        place="top"
        effect="solid"
      >
        {isHover}
      </ReactTooltip>
    </>
  );
};
