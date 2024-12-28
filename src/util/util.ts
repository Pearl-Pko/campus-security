export const getMediaType = (mimeType: string) => {
    return mimeType.includes("video") ? "video" : "image"
}