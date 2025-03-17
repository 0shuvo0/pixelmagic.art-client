
async function base64ToFile(base64String, fileName) {
    // Function to convert base64 to a Blob
    function base64ToBlob(base64, contentType) {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }

    // Extract the base64 part and content type from the base64 string
    const [base64Header, base64Data] = base64String.split(',');
    const contentType = base64Header.split(':')[1].split(';')[0];
    const blob = base64ToBlob(base64Data, contentType);

    // Return a File object
    return new File([blob], fileName, { type: contentType });
}

export {
    base64ToFile
}