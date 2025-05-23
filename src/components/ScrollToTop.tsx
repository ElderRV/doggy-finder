import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop({ children }: { children: React.ReactNode}): React.ReactNode {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return children;
}