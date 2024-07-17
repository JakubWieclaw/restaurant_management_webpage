import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import { forwardRef, ReactElement, Ref } from "react";

export const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
