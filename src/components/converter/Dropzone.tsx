"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, RefreshCw } from "lucide-react";
import { Action } from "@/types";
import { getFileType } from "@/utils/getFileType";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import FileCard from "./FileCard";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";

export default function Dropzone() {
    const [actions, setActions] = useState<Action[]>([]);

    // const { convert, isLoading } = useFFmpeg();
    
    // Fix: Load FFmpeg once when the page opens so the first conversion doesn't have to wait for FFmpeg initialization.
    const { convert, load, isLoading } = useFFmpeg();
    useEffect(() => {
        load();
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newActions: Action[] = acceptedFiles.map((file) => {
            const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
            return {
                file,
                fileName: file.name,
                fileSize: file.size,
                fileType: getFileType(file.type),
                from: extension,
                to: null,
                status: "idle",
            };
        });
        setActions((prev) => [...prev, ...newActions]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
            "audio/*": [],
            "video/*": [],
        },
    });

    const updateFormat = (index: number, format: string) => {
        setActions((prev) =>
            prev.map((a, i) => (i === index ? { ...a, to: format } : a))
        );
    };

    const removeAction = (index: number) => {
        const action = actions[index];
        if (action.url) URL.revokeObjectURL(action.url);
        setActions((prev) => prev.filter((_, i) => i !== index));
    };

    const reset = () => {
        actions.forEach((a) => { if (a.url) URL.revokeObjectURL(a.url); });
        setActions([]);
    };

    const convertAll = async () => {
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            if (!action.to || action.status !== "idle") continue;

            setActions((prev) =>
                prev.map((a, idx) =>
                    idx === i ? { ...a, status: "converting" } : a
                )
            );

            try {
                const { url, outputFileName } = await convert(action.file, action.to);
                setActions((prev) =>
                    prev.map((a, idx) =>
                        idx === i
                            ? { ...a, status: "done", url, outputFileName }
                            : a
                    )
                );
            } catch {
                setActions((prev) =>
                    prev.map((a, idx) =>
                        idx === i ? { ...a, status: "error" } : a
                    )
                );
            }
        }
    };

    const canConvert = actions.some(
        (a) => a.to && a.status === "idle"
    );
    const allDone = actions.length > 0 &&
        actions.every((a) => a.status === "done" || a.status === "error");

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Drop zone */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer",
                    "flex flex-col items-center justify-center gap-3 transition-all duration-200",
                    isDragActive
                        ? "border-primary bg-primary/5 scale-[1.01]"
                        : "border-border hover:border-primary/60 hover:bg-muted/40"
                )}
            >
                <input {...getInputProps()} />
                <UploadCloud
                    size={40}
                    className={cn(
                        "transition-colors",
                        isDragActive ? "text-primary" : "text-muted-foreground"
                    )}
                />
                <div>
                    <p className="font-semibold text-foreground">
                        {isDragActive ? "Drop your files here" : "Click, or drop your files here"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Supports images, audio, and video
                    </p>
                </div>
            </div>

            {/* File list */}
            {actions.length > 0 && (
                <div className="flex flex-col gap-3">
                    {actions.map((action, index) => (
                        <FileCard
                            key={`${action.fileName}-${index}`}
                            action={action}
                            onFormatChange={(fmt) => updateFormat(index, fmt)}
                            onRemove={() => removeAction(index)}
                        />
                    ))}
                </div>
            )}

            {/* Action buttons */}
            {actions.length > 0 && (
                <div className="flex items-center justify-end gap-3">
                    <Button variant="secondary" onClick={reset}>
                        <RefreshCw size={14} />
                        Reset
                    </Button>

                    {!allDone && (
                        <Button
                            onClick={convertAll}
                            disabled={!canConvert || isLoading}
                            isLoading={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner size="sm" />
                                    Loading FFmpeg...
                                </>
                            ) : (
                                "Convert All"
                            )}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
