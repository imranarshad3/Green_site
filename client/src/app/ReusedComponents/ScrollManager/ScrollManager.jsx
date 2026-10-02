import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const savedPositions = new Map();

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ScrollManager() {
  const { key, pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return undefined;

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const save = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => savedPositions.set(key, window.scrollY));
    };

    window.addEventListener("scroll", save, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", save);
    };
  }, [key]);

  useLayoutEffect(() => {
    const pathChanged = lastPathname.current !== pathname;
    lastPathname.current = pathname;

    if (navigationType === "POP") {
      window.scrollTo({ top: savedPositions.get(key) ?? 0, left: 0, behavior: "instant" });
    } else if (pathChanged && !hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [key, pathname, hash, navigationType]);

  useEffect(() => {
    if (!hash || (navigationType === "POP" && savedPositions.has(key))) return undefined;

    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [key, hash, navigationType]);

  return null;
}

export default ScrollManager;
