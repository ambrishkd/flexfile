export type FileStatus = "idle" | "converting" | "done" | "error";

export type Action = {
    file: File;
    fileName: string;
    fileSize: number;
    fileType: string;
    from: string;
    to: string | null;
    status: FileStatus;
    url?: string;
    outputFileName?: string;
};
