import { useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";

const usePreviousLocation = () => {
  const location = useLocation();
  const prevLocationRef = useRef();

  useEffect(() => {
    prevLocationRef.current = location;
  }, [location]);

  return prevLocationRef.current;
};

export default usePreviousLocation;
