export const imageFormats = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff"] as const;

export const audioFormats = ["mp3", "wav", "ogg", "aac", "flac", "m4a"] as const;

export const videoFormats = ["mp4", "mov", "avi", "mkv", "webm", "gif"] as const;

export const formatsByType = {
    image: imageFormats,
    audio: audioFormats,
    video: videoFormats,
} as const;

export type ImageFormat = (typeof imageFormats)[number];
export type AudioFormat = (typeof audioFormats)[number];
export type VideoFormat = (typeof videoFormats)[number];