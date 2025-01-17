import { useEffect, useState } from "react"

export interface ImageCommonProps {
    src: string,
    width?: number,
    height?: number,
    alt?: string,
    style?: object,
    className?: string,
    imgError?: string
}

export function ImageCommon({
    src,
    width,
    height,
    alt,
    style,
    className,
    imgError = '/icon/logo-dino.svg'
}: ImageCommonProps) {
    const [isError, setIsError] = useState(false)
    const handleImageError = () => {
        setIsError(true)
    }

    useEffect(() => {
        setIsError(false)
    }, [src])

    return <img
        src={!isError ? src : imgError}
        width={width ? width : 24}
        height={height ? height : 24}
        alt={alt ? alt : 'dinoDex'}
        style={style}
        onError={handleImageError}
        loading="lazy"
        className={className}
    />;
}