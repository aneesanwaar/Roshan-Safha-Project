import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    let attempts = 0;
    let timer;
    const scrollToTarget = () => {
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts++ < 25) {
        timer = window.setTimeout(scrollToTarget, 100);
      }
    };
    timer = window.setTimeout(scrollToTarget, 30);
    return () => window.clearTimeout(timer);
  }, [pathname, hash, search]);
  return null;
}

export default ScrollToTop;
