
import React from "react";
import { ObjectHelper } from "../utils/ObjectHelper";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { ObserverHandler } from "../utils/DOMUtils";

export interface ResizeDimension {
    width: number;
    height: number;
}

export type ResizeSensorRenderIfHandler = (clientWidth: number, clientHeight: number) => boolean;
export type ResizeSensorDimensionChangeHandler = (event: any, dimension: ResizeDimension) => void;

export interface ResizeSensorManageRef {
}

export interface ResizeSensorProps extends ComponentBaseProps<HTMLDivElement, ResizeSensorManageRef> {
    minDimension: Partial<ResizeDimension>;
    maxDimension: Partial<ResizeDimension>;

    renderIf: ResizeSensorRenderIfHandler;
    onDimensionChange: ResizeSensorDimensionChangeHandler;
}

interface ResizeSensorState {
    renderChildren: boolean;
}

class ResizeSensorComponent extends React.Component<ResizeSensorProps, ResizeSensorState> {

    public static defaultProps: Partial<ResizeSensorProps> = {
    };

    state: ResizeSensorState = {
        renderChildren: this.shouldRenderChildren(this.props.minDimension, this.props.maxDimension, document.documentElement.clientWidth, document.documentElement.clientHeight),
    };

    documentResizeListener?: any;

    constructor(props: ResizeSensorProps) {
        super(props);
    }

    componentDidMount() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = (event: any) => {
                const width = document.documentElement.clientWidth;
                const height = document.documentElement.clientHeight;
                this.props.onDimensionChange?.(event, { width: width, height: height });
                this.setState({ renderChildren: this.shouldRenderChildren(this.props.minDimension, this.props.maxDimension, width, height) });
            }
            ObserverHandler.observe("resize", this.documentResizeListener);
        }
    }

    componentWillUnmount() {
        if (this.documentResizeListener) {
            ObserverHandler.unobserve("resize", this.documentResizeListener);
            this.documentResizeListener = undefined;
        }
    }

    shouldRenderChildren(minDimension: Partial<ResizeDimension>, maxDimension: Partial<ResizeDimension>, screenWidth: number, screenHeight: number) {
        if (this.props.renderIf?.(screenWidth, screenHeight)) return true;
        if (!minDimension && !maxDimension) {
            return true;
        }
        if (minDimension) {
            if (minDimension.width !== undefined && minDimension.height !== undefined && minDimension.width < screenWidth && minDimension.height < screenHeight) {
                return true;
            } else if (minDimension.width !== undefined && minDimension.width < screenWidth) {
                return true;
            } else if (minDimension.height !== undefined && minDimension.height < screenHeight) {
                return true;
            }
        } else if (maxDimension) {
            if (maxDimension.width !== undefined && maxDimension.height !== undefined && maxDimension.width > screenWidth && maxDimension.height > screenHeight) {
                return true;
            } else if (maxDimension.width !== undefined && maxDimension.width > screenWidth) {
                return true;
            } else if (maxDimension.height !== undefined && maxDimension.height > screenHeight) {
                return true;
            }
        }
        return false;
    }

    render() {
        let childrenProps = ObjectHelper.conditionalClone(this.props, (key) => key in [...Object.keys(this.props), "children"]);
        const children = !this.state.renderChildren ? null : React.Children.map(this.props.children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { ...(child.props as any ?? {}), ...childrenProps });
            }
            return child;
        });

        return (<React.Fragment key={this.props.key}>
            {(this.state.renderChildren) ? children : null}
        </React.Fragment>)
    }

}

export const ResizeSensor = ({ ref, ...props }: Partial<ResizeSensorProps>) => (
    <ResizeSensorComponent {...props} forwardRef={ref} />
);


