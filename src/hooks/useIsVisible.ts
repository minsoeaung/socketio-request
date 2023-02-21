import {useEffect, useState} from "react";

const OPTIONS_DEFAULT = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

const useIsVisible = (element?: HTMLElement, options = OPTIONS_DEFAULT) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    if (element) {
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [element]);

  return isVisible;
};

export default useIsVisible;
