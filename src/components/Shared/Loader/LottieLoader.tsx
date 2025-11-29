"use client";

import * as animation from "../../../../public/animation/docotor_dancing.json";
import { useLottie } from "lottie-react";

export default function LottieLoader() {
  // Create a mutable copy of the animationData
  const mutableAnimationData = JSON.parse(JSON.stringify(animation));
  // const logo = "/logo/ejazah.png";
  const defaultOptions = {
    animationData: mutableAnimationData,
    loop: true,
  };

  const { View } = useLottie(defaultOptions);

  return <div className="w-72 h-72">{View}</div>;
}
