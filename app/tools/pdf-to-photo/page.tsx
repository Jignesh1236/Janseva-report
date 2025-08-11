"use client";
export const dynamic = "force-dynamic";
import dynamicImport from "next/dynamic";

const PDFToPhotoClient = dynamicImport(() => import("./PDFToPhotoClient"), { ssr: false });

export default function PDFToPhotoPage() {
  return <PDFToPhotoClient />;
} 
