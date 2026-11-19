
import React, { HTMLAttributes } from "react";

export type ImageProps = {
    alt: string;
    src: string;
    fallback?: string;
} & HTMLAttributes<HTMLImageElement>;

export function Image({ src, alt, fallback, ...props }: ImageProps) {

    const [imgSrc, setImgSrc] = React.useState(src ?? fallback);

    return (
        <img
            {...props}
            alt={alt}
            src={imgSrc}
            onError={fallback ? () => {
                setImgSrc(fallback);
            } : undefined}
        />
    );
}