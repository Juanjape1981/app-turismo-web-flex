import imageCompression from 'browser-image-compression';

export const compressAndConvertToBase64 = async (file: File): Promise<string> => {
    const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => {
                if (reader.result) {
                    resolve(reader.result.toString());
                } else {
                    reject(new Error("Error al convertir la imagen a base64"));
                }
            };
        });
    } catch (error) {
        console.error('Error al comprimir la imagen:', error);
        throw error;
    }
};

export const compressAndConvertMultipleToBase64 = async (files: File[]): Promise<string[]> => {
    const compressedImagesPromises = files.map(file => compressAndConvertToBase64(file));
    return await Promise.all(compressedImagesPromises);
};
