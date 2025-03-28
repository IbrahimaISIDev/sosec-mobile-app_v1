export const getImageName = (uri: string) => {
    return uri.split('/').pop() || 'image.jpg';
  };