//With reference to https://www.geeksforgeeks.org/reactjs/how-to-fix-the-error-window-is-not-defined-in-nextjs/ in solving bug

"use client";

import dynamic from "next/dynamic";

const CodingComponentWrapper = dynamic(() => import("./CodingComponent"), {
  ssr: false,
});

export default CodingComponentWrapper;
