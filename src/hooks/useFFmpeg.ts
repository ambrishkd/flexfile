"use client";

import { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export type ConvertResult = {
    url: string;
    outputFileName: string;
};

export function useFFmpeg() {
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function load() {
        if (ffmpegRef.current) return;
        setIsLoading(true);
        const ffmpeg = new FFmpeg();
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.wasm`,
                "application/wasm"
            ),
        });
        ffmpegRef.current = ffmpeg;
        setIsLoaded(true);
        setIsLoading(false);
    }

    async function convert(
        file: File,
        outputExtension: string
    ): Promise<ConvertResult> {
        if (!ffmpegRef.current) await load();
        const ffmpeg = ffmpegRef.current!;
        const inputName = file.name;
        const baseName = inputName.substring(0, inputName.lastIndexOf("."));
        const outputName = `${baseName}.${outputExtension}`;
        await ffmpeg.writeFile(inputName, await fetchFile(file));
        await ffmpeg.exec(["-i", inputName, outputName]);
        const data = await ffmpeg.readFile(outputName);
        const blob = new Blob([data as Uint8Array<ArrayBuffer>]);
        const url = URL.createObjectURL(blob);
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
        return { url, outputFileName: outputName };
    }

    return { load, convert, isLoaded, isLoading };
}
