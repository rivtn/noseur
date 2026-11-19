import { Orientation } from "../constants/Orientation";

export const ColorHelper = {

    alpha(a: number | string) {
        let na: number;
        if (typeof a === "string") {
            na = parseInt(a, 16);
        } else {
            na = a;
        }
        if (na > 1) na = na / 255;
        return na;
    },

    hexToRgb(hex: string): { r: number; g: number; b: number; a: number; } {
        const reg = hex.length < 6 ? "\\w" : "\\w\\w";
        const parts = hex.match(new RegExp(reg, "g"))?.map((x: string) => parseInt(x.repeat(2 / x.length), 16))!;
        const rgb: any = { r: parts[0], g: parts[1], b: parts[2] };
        return rgb;
    },

    hexToRgba(hex: string): { r: number; g: number; b: number; a: number; } {
        const reg = hex.length < 6 ? "\\w" : "\\w\\w";
        const parts = hex.match(new RegExp(reg, "g"))?.map((x: string) => parseInt(x.repeat(2 / x.length), 16))!;
        const rgba: any = { r: parts[0], g: parts[1], b: parts[2] };
        rgba["a"] = (parts.length > 3 ? ColorHelper.alpha(parts[3]) : 1);
        return rgba;
    },

    rgbToCmyk(rgb: { r: number; g: number; b: number; }): { c: number; m: number; y: number; k: number; } {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const k = +(1 - Math.max(r, g, b));
        const c = +((1 - r - k) / (1 - k) || 0);
        const m = +((1 - g - k) / (1 - k) || 0);
        const y = +((1 - b - k) / (1 - k) || 0);

        return { c: (c * 1000), m: (m * 1000), y: (y * 1000), k: (k * 1000) };
    },

    hexToColor(hex?: string) {
        if (!hex) return undefined;
        const { r, g, b, a } = ColorHelper.hexToRgba(hex);
        const alpha = a;
        const rgb = { r, g, b };
        return {
            hex,
            rgb,
            alpha,
            hsb: ColorHelper.rgbToHsb(rgb),
            cmyk: ColorHelper.rgbToCmyk(rgb),
        }
    },

    hsbToColor(hsb?: { h: number; s: number; b: number; }, alpha: number = 1) {
        if (!hsb) return undefined;
        const { r, g, b } = ColorHelper.hsbToRgb(hsb);
        const rgb = { r, g, b };
        return {
            hsb,
            rgb,
            alpha,
            hex: ColorHelper.hsbToHex(hsb),
            cmyk: ColorHelper.rgbToCmyk(rgb),
        }
    },

    hexToHsb(hex: string) {
        return ColorHelper.rgbToHsb(ColorHelper.hexToRgba(hex));
    },

    hexWithAlpha(hex: string, alpha: number) {
        const baseHex = hex.startsWith('#') ? hex : `#${hex}`;
        const clampedAlpha = Math.max(0, Math.min(1, alpha));
        const alphaHex = Math.round(clampedAlpha * 255)
            .toString(16)
            .toUpperCase()
            .padStart(2, '0');

        return `${baseHex.slice(0, 7)}${alphaHex}`;
    },

    rgbToHex(rgba: { r: number; g: number; b: number; a?: number; }) {
        let hex = [rgba.r.toString(16), rgba.g.toString(16), rgba.b.toString(16)];

        for (let key in hex) {
            if (hex[key].length === 1) {
                hex[key] = '0' + hex[key];
            }
        }

        return "#" + hex.join('');
    },

    hsbToHex(hsb: { h: number; s: number; b: number; }) {
        return ColorHelper.rgbToHex(ColorHelper.hsbToRgb(hsb));
    },

    rgbToHsb(rgba: { r: number; g: number; b: number; a?: number; }) {
        let hsb = {
            h: 0,
            s: 0,
            b: 0
        };
        let min = Math.min(rgba.r, rgba.g, rgba.b);
        let max = Math.max(rgba.r, rgba.g, rgba.b);
        let delta = max - min;

        hsb.b = max;
        hsb.s = max !== 0 ? (255 * delta) / max : 0;

        if (hsb.s !== 0) {
            if (rgba.r === max) {
                hsb.h = (rgba.g - rgba.b) / delta;
            } else if (rgba.g === max) {
                hsb.h = 2 + (rgba.b - rgba.r) / delta;
            } else {
                hsb.h = 4 + (rgba.r - rgba.g) / delta;
            }
        } else {
            hsb.h = -1;
        }

        hsb.h = hsb.h * 60;

        if (hsb.h < 0) {
            hsb.h = hsb.h + 360;
        }

        hsb.s = hsb.s * (100 / 255);
        hsb.b = hsb.b * (100 / 255);

        return hsb;
    },

    hsbToRgb(hsb: { h: number; s: number; b: number; }) {
        let rgb: any = {
            r: null,
            g: null,
            b: null
        };
        let h = Math.round(hsb.h);
        let s = Math.round((hsb.s * 255) / 100);
        let v = Math.round((hsb.b * 255) / 100);

        if (s === 0) {
            rgb = {
                r: v,
                g: v,
                b: v
            };
        } else {
            let t1 = v;
            let t2 = ((255 - s) * v) / 255;
            let t3 = ((t1 - t2) * (h % 60)) / 60;

            if (h === 360) {
                h = 0;
            }

            if (h < 60) {
                rgb.r = t1;
                rgb.b = t2;
                rgb.g = t2 + t3;
            } else if (h < 120) {
                rgb.g = t1;
                rgb.b = t2;
                rgb.r = t1 - t3;
            } else if (h < 180) {
                rgb.g = t1;
                rgb.r = t2;
                rgb.b = t2 + t3;
            } else if (h < 240) {
                rgb.b = t1;
                rgb.r = t2;
                rgb.g = t1 - t3;
            } else if (h < 300) {
                rgb.b = t1;
                rgb.g = t2;
                rgb.r = t2 + t3;
            } else if (h < 360) {
                rgb.r = t1;
                rgb.g = t2;
                rgb.b = t1 - t3;
            } else {
                rgb.r = 0;
                rgb.g = 0;
                rgb.b = 0;
            }
        }

        return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
    },

    normalizeHsB(hsb: { h: number; s: number; b: number; }) {
        return {
            h: Math.min(360, Math.max(0, hsb.h)),
            s: Math.min(100, Math.max(0, hsb.s)),
            b: Math.min(100, Math.max(0, hsb.b))
        };
    },

    /**
     * Generates a color similar to the input rgb.
     * @param {string} rgb - The target color (e.g., { r: 121, g: 3, b: 20})
     * @param {number} deviationAmount - Deviation amount (0 to 1, default 0.1)
     */
    similarColor(rgb: { r: number; g: number; b: number; }, deviationAmount: number = 0.1) {
        let { r, g, b } = rgb;

        const jitter = (val: number) => {
            const range = 255 * deviationAmount;
            const noise = (Math.random() * range * 2) - range;
            return Math.min(255, Math.max(0, Math.round(val + noise)));
        };
        const newR = jitter(r);
        const newG = jitter(g);
        const newB = jitter(b);

        return { r: newR, g: newG, b: newB };
    },

    parseCssToCanvasGradient(width: number, height: number, cssGradient: string, ctx?: any): CanvasGradient | null {
        const match = cssGradient.match(/linear-gradient\((.*)\)/i);
        if (!match) return null;
        const tokens = match[1].split(/,(?![^(]*\))/);

        let directionToken = tokens[0].trim();
        let stopTokens = tokens.slice(1);

        if (!directionToken.includes('to') && !directionToken.includes('deg')) {
            stopTokens = tokens;
            directionToken = 'to bottom';
        }

        let x0 = 0, y0 = 0, x1 = 0, y1 = 0;

        switch (directionToken.toLowerCase()) {
            case 'to left':
                x0 = width; y0 = 0; x1 = 0; y1 = 0;
                break;
            case 'to right':
                x0 = 0; y0 = 0; x1 = width; y1 = 0;
                break;
            case 'to top':
                x0 = 0; y0 = height; x1 = 0; y1 = 0;
                break;
            case 'to bottom':
            default:
                x0 = 0; y0 = 0; x1 = 0; y1 = height;
                break;
        }

        if (!ctx) {
            const tempCanvas = document.createElement('canvas');
            ctx = tempCanvas.getContext('2d');
            if (!ctx) return null;
        }

        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

        stopTokens.forEach((token, index) => {
            const trimmed = token.trim();
            const stopMatch = trimmed.match(/(rgba?\(.*?\)|hsla?\(.*?\)|#[\da-fA-F]+|[a-zA-Z]+)(?:\s+(\d+)%)?/);

            if (stopMatch) {
                const colorValue = stopMatch[1];
                const offset = stopMatch[2]
                    ? parseInt(stopMatch[2], 10) / 100
                    : index / (stopTokens.length - 1);

                gradient.addColorStop(offset, colorValue);
            }
        });

        return gradient;
    },

    /**
     * Scans a live slider <div> element's background gradient to find the percentage position of a target color.
     * @param {HTMLElement} sliderElement - The actual DOM node of your slider track.
     * @param {Object} targetRgbaOrAlpha - The RGB target color to find, e.g., { r: 255, g: 0, b: 0, a } or alpha only
     * @param {Orientation} orientation - The orientation, HORIZONTAL or VERTICAL
     * @param {number} tolerance - Allowed variance per channel (default 10) to catch minor browser interpolation differences.
     */
    findColorPercentageFromElement(sliderElement: Element, targetRgbaOrAlpha: { r: number; g: number; b: number; a: number; } | number, orientation: Orientation = Orientation.HORIZONTAL, tolerance = 10) {
        if (!sliderElement) return { pixelPosition: 0, percentage: 0 };
        const elRect = sliderElement.getBoundingClientRect();
        let width = elRect.width;
        let height = elRect.height;
        const computedStyle = window.getComputedStyle(sliderElement);
        const backgroundStyle = computedStyle.backgroundImage || computedStyle.background;

        if (orientation === Orientation.VERTICAL) {
            width = 1;
        } else {
            height = 1;
        }

        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) return { pixelPosition: 0, percentage: 0 };
        if (backgroundStyle.includes("linear-gradient")) {
            const gradient = ColorHelper.parseCssToCanvasGradient(width, height, backgroundStyle, ctx);
            if (gradient) ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = backgroundStyle;
        } // TODO handle CanvasPattern
        try {
            ctx.fillRect(0, 0, width, height);
        } catch (e) {
            console.warn("Direct gradient painting context fallback triggered.");
        }
        const imgData = ctx.getImageData(0, 0, width, height).data;
        const isAlphaOnly = typeof targetRgbaOrAlpha === "number";
        const iter = orientation === Orientation.VERTICAL ? height : width;
        for (let x = 0; x < iter; x++) {
            const i = x * 4;
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            const a = imgData[i + 3];
            if (!isAlphaOnly && (targetRgbaOrAlpha.a === undefined && a === 0)) continue;
            if ((isAlphaOnly && Math.abs((255 * targetRgbaOrAlpha) - a) <= tolerance) || (!isAlphaOnly && Math.abs(r - targetRgbaOrAlpha.r) <= tolerance &&
                Math.abs(g - targetRgbaOrAlpha.g) <= tolerance &&
                Math.abs(b - targetRgbaOrAlpha.b) <= tolerance &&
                (targetRgbaOrAlpha.a === undefined || Math.abs((255 * targetRgbaOrAlpha.a) - a) <= tolerance))) {
                const percentage = (x / iter) * 100;
                return {
                    pixelPosition: x,
                    percentage: parseFloat(percentage.toFixed(2))
                };
            }
        }

        return { pixelPosition: 0, percentage: 0 };
    }

}
