const IMAGEKIT_UPLOAD_URL = process.env.NEXT_PUBLIC_IMAGEKIT_UPLOAD_URL ;
const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ;
const IMAGEKIT_PRIVATE_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY ;
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ;

export const uploadToImageKit = async (file, fileName) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    
    const timestamp = Math.floor(Date.now() / 1000);
    formData.append('timestamp', timestamp);
    
    const response = await fetch(IMAGEKIT_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(IMAGEKIT_PRIVATE_KEY + ':')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return {
      success: true,
      url: result.url,
      fileId: result.fileId,
      name: result.name
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const downloadFromImageKit = (url, fileName) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'resume.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};