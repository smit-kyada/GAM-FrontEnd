
// Download Image function
export const DownloadImage = (src) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${src}`;
      const imageFileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = imageFileName;
      link.click();
      URL.revokeObjectURL(blobUrl);
      resolve(true)
    }
    catch (error) { reject(error) }
  })
};
