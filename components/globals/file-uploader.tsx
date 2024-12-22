"use client"

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { DeleteFiles } from "@/lib/server_action";
import { cn } from "@/lib/utils";

interface props {
    multiple?: boolean
    onSingleChange?: (data: string) => void
    onMultipleChange?: (data: string[]) => void
    initialValue?: string | string[]
    max: number
    disabled?: boolean
}
export const FileUploader = ({ multiple, onMultipleChange, onSingleChange, initialValue, disabled, max }: props) => {
    const [file, setFile] = useState<string>(!Array.isArray(initialValue) && initialValue ? initialValue : '')
    const [files, setFiles] = useState<string[]>(Array.isArray(initialValue) ? initialValue : [])
    const [isDeleting, setIsDeleting] = useState(false)

    /** Files remove funtion also deletes from the uploadthing */
    const onFileRemove = async (data: string) => {
        if (!data) return
        const endValue = data.split('/')?.pop();
        if (!endValue) return
        setIsDeleting(true)
        const res = await DeleteFiles([endValue])
        setIsDeleting(false)
        if (res?.success) {
            toast.info(res.message)
            if (multiple) {
                const newFiles = files.filter((fl) => fl !== data)
                setFiles(newFiles)
                onMultipleChange !== undefined && onMultipleChange(newFiles)
            } else {
                setFile('')
                onSingleChange !== undefined && onSingleChange('')
            }
        } else {
            toast.warning(res?.message)
        }
    }

    return (
        <div className="w-full space-y-4">
            {((multiple && files.length < max) || (!multiple && !file)) && (
                <UploadDropzone
                    disabled={isDeleting || disabled}
                    endpoint={multiple ? "multipleImage" : 'singleImage'}
                    appearance={{
                        container: `border-2 border-slate-500 !px-4 !py-2 !flex-row items-center justify-between ${disabled && "opacity-40"}`,
                        label: "!hidden",
                        uploadIcon: "!align-start !m-0",
                        button: "!text-xs !h-8 !w-28 !mt-0"
                        
                    }}
                    onClientUploadComplete={(res) => {
                        if (res.length > 0) {
                            toast.success('Files uploaded successfully')
                        }
                        if (multiple) {
                            const urls = res.map((fl) => fl.url)
                            onMultipleChange !== undefined && onMultipleChange(urls)
                            setFiles(urls)
                        } else {
                            setFile(res[0]?.url || '')
                            onSingleChange !== undefined && onSingleChange(res[0]?.url)
                        }
                    }}
                />
            )}

            <div className="flex flex-wrap gap-x-2 gap-y-4">
                {multiple ? files.map((img) => (
                    <div key={img} className="border-2 border-gray-300 p-0.5 rounded-md w-20 h-16 relative">
                        <button
                            className={cn(
                                "w-5 h-5 grid place-items-center absolute -right-2 -top-2 border border-destructive text-destructive-foreground bg-destructive rounded-full transition-all duration-300",
                                isDeleting && "disabled:opacity-70 w-20 h-16 top-0 right-0 bg-secondary rounded-md"
                            )}
                            disabled={isDeleting}
                            onClick={() => onFileRemove(img)}
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-3 h-3" />}
                        </button>
                        <Image src={img} alt="file" width={80} height={40} className="w-full h-full rounded object-cover overflow-hidden" />
                    </div>
                )) : (
                    file && (
                        <div key={file} className="border-2 border-gray-300 p-0.5 rounded-md w-20 h-16 relative">
                            <button
                                className={cn(
                                    "w-5 h-5 grid place-items-center absolute -right-2 -top-2 border border-destructive text-destructive-foreground bg-destructive rounded-full transition-all duration-300",
                                    isDeleting && "disabled:opacity-70 w-20 h-16 top-0 right-0 bg-secondary rounded-md"
                                )}
                                disabled={isDeleting}
                                onClick={() => onFileRemove(file)}
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-3 h-3" />}
                            </button>
                            <Image src={file} alt="file" width={80} height={40} className="w-full h-full rounded object-cover overflow-hidden" />
                        </div>
                    )
                )}
            </div>
        </div>
    )
}