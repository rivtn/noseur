
import React from "react";
import { ObserverHandler } from "../utils/DOMUtils";
import { ResizeDimension } from "../sensor/ResizeSensor";

export function useScreenDimension() {

    let documentResizeListener: any;
    const [screenDimension, setScreenDimension] = React.useState<ResizeDimension>({ width: 0, height: 0 });

    React.useEffect(() => {
        if (!documentResizeListener) {
            documentResizeListener = (_: any) => {
                const width = document.documentElement.clientWidth;
                const height = document.documentElement.clientHeight;
                setScreenDimension({ width, height });
            }
            ObserverHandler.observe("resize", documentResizeListener);
        }

        return () => {
            if (documentResizeListener) {
                ObserverHandler.unobserve("resize", documentResizeListener);
                documentResizeListener = undefined;
            }
        };
    }, []);

    return {
        ...screenDimension
    };

}
