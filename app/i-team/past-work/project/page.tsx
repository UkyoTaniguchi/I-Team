"use client";

import React, {Suspense} from "react";
import FormProject from "@/app/components/past-work";

const Project = () => {
  return(
    <Suspense>
      <FormProject/>
    </Suspense>
  );
};

export default Project;
