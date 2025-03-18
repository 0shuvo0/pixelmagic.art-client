
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

function downloadBase64Image(base64String, fileName = 'picmagic.png') {
    // Convert Base64 to a Blob
    const byteCharacters = atob(base64String.split(",")[1]); // Remove the "data:image/png;base64," part
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" }); // Change type if needed
    
    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


export {
    base64ToFile,
    downloadBase64Image
}