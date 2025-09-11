export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
            resolve({ base64, mimeType });
        };
        reader.onerror = error => reject(error);
    });
};

export const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};

export const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const parseAspectRatio = (ratioStr: string): number | null => {
    if (ratioStr === 'full') return null;
    const parts = ratioStr.split(':');
    if (parts.length !== 2) return 1;
    const [w, h] = parts.map(Number);
    if (isNaN(w) || isNaN(h) || h === 0) return 1;
    return w / h;
};

export const cropImageToAspectRatio = (
    imageUrl: string,
    aspectRatio: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const targetRatio = parseAspectRatio(aspectRatio);
        if (targetRatio === null) {
            return resolve(imageUrl); // 'full' aspect ratio, no crop
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            const imgRatio = img.width / img.height;
            let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

            if (imgRatio > targetRatio) {
                // Image is wider than target, crop width
                sWidth = img.height * targetRatio;
                sx = (img.width - sWidth) / 2;
            } else if (imgRatio < targetRatio) {
                // Image is taller than target, crop height
                sHeight = img.width / targetRatio;
                sy = (img.height - sHeight) / 2;
            }

            canvas.width = sWidth;
            canvas.height = sHeight;

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (err) => reject(new Error(`Failed to load image: ${err}`));
        img.src = imageUrl;
    });
};
