export const getMediaType = (mimeType: string) => {
  return mimeType.includes("video") ? "video" : "image";
};

export const waitUntil = async (conditionFn: () => boolean, checkInterval: number = 100) => {
  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        if (conditionFn()) {
          clearInterval(interval);
          resolve();
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, checkInterval);
  });
};
