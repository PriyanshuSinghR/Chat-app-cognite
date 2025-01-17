import Chat from "@/components/Chat/Chat";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <Chat />
    </Suspense>
  );
};

export default page;
