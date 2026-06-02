import Dropzone from "@/components/converter/Dropzone";

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
            {/* Hero */}
            <div className="text-center flex flex-col gap-3">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    Free Unlimited File Converter
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Convert images, audio, and video — all processed{" "}
                    <strong className="text-foreground">
                        locally on your device for enhanced privacy and security
                    </strong>
                    . No uploads, no limits.
                </p>
            </div>

            {/* Converter */}
            <Dropzone />
        </div>
    );
}
