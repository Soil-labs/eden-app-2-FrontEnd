// components/OgImageTemplate.tsx

import React from "react";

interface OgImageTemplateProps {
  title: string;
  company: string;
}

const OgImageTemplate: React.FC<OgImageTemplateProps> = ({
  title,
  company,
}) => {
  return (
    <div className="text-red-900 text-2xl">Hi</div>
    // <div
    //   style={{
    //     display: "flex", // Explicitly setting display to flex
    //     flexDirection: "column",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     backgroundColor: "#3b82f6",
    //     width: "1200px",
    //     height: "630px",
    //   }}
    // >
    //   <div
    //     style={{
    //       display: "flex", // Explicitly setting display to flex
    //       flexDirection: "column",
    //       textAlign: "center",
    //     }}
    //   >
    //     <h1
    //       style={{
    //         fontSize: "4rem",
    //         color: "white",
    //         margin: 0, // Resetting default margin
    //       }}
    //     >
    //       {title}
    //     </h1>
    //     <p
    //       style={{
    //         fontSize: "1.875rem",
    //         color: "#d1d5db",
    //         margin: 0, // Resetting default margin
    //       }}
    //     >
    //       {company}
    //     </p>
    //   </div>
    // </div>
  );
};

export default OgImageTemplate;
