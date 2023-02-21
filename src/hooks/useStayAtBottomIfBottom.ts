import {useEffect} from "react";
import useIsVisible from "./useIsVisible";

const useStayAtBottomIfBottom = (
  changeDetection: unknown,
  elementAtTheBottom?: HTMLElement
) => {
  const isElementAtTheBottomVisible = useIsVisible(elementAtTheBottom);

  const smoothScrollToBottom = () => {
    elementAtTheBottom?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isElementAtTheBottomVisible) {
      smoothScrollToBottom();
    }
  }, [changeDetection]);
};

export default useStayAtBottomIfBottom;
