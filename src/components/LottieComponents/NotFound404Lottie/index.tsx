import Lottie, { Options } from "react-lottie";
import animationData from "./notFound404Lottie.json";

type Props = {
  options?: Options;
  width?: number | string;
  height?: number | string;
};

const defaultOptions: Options = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const NotFound404Lottie = ({
  options = defaultOptions,
  width,
  height,
}: Props) => {
  return (
    <Lottie
      isClickToPauseDisabled={true}
      options={options}
      width={width}
      height={height}
    />
  );
};
