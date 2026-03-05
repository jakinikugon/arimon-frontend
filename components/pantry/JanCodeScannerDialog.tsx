"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  BrowserMultiFormatReader,
  type IScannerControls,
} from "@zxing/browser";
import { Camera, Loader2, ScanLine, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type JanCodeScannerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (janCode: string) => void;
  onError?: (message: string) => void;
  title?: string;
  description?: string;
  beepOnSuccess?: boolean;
};

function isJanCode(value: string) {
  return /^\d{13}$/.test(value);
}

let successJanAudio: HTMLAudioElement | null = null;

function playSuccessBeep() {
  try {
    if (!successJanAudio) {
      successJanAudio = new window.Audio("/sounds/success_jan.mp3");
      successJanAudio.preload = "auto";
    }

    successJanAudio.pause();
    successJanAudio.currentTime = 0;
    const playPromise = successJanAudio.play();
    if (playPromise) {
      void playPromise.catch(() => {
        // 音再生に失敗しても読み取り結果は優先して返す
      });
    }
  } catch {
    // 音再生に失敗しても読み取り結果は優先して返す
  }
}

export function JanCodeScannerDialog({
  open,
  onOpenChange,
  onDetected,
  onError,
  title = "JANコードを読み取る",
  description = "カメラにバーコードをかざしてください。読み取り後は自動で閉じます。",
  beepOnSuccess = true,
}: JanCodeScannerDialogProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const detectedRef = useRef(false);
  const onDetectedRef = useRef(onDetected);
  const onErrorRef = useRef(onError);
  const onOpenChangeRef = useRef(onOpenChange);

  const [isStarting, setIsStarting] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    readerRef.current = null;
    detectedRef.current = false;
  }, []);

  useEffect(() => {
    onDetectedRef.current = onDetected;
    onErrorRef.current = onError;
    onOpenChangeRef.current = onOpenChange;
  }, [onDetected, onError, onOpenChange]);

  useEffect(() => {
    if (!open) {
      stopScanner();
      setIsStarting(false);
      setScanError(null);
      return;
    }

    const hasMediaDevices =
      typeof navigator !== "undefined" && !!navigator.mediaDevices;
    if (!hasMediaDevices) {
      const message = "この環境ではカメラを利用できません。";
      setScanError(message);
      onErrorRef.current?.(message);
      return;
    }

    let cancelled = false;

    const startScanner = async () => {
      // Portal 描画直後は ref 未設定の場合があるため、数フレーム待機する
      let targetVideo: HTMLVideoElement | null = videoRef.current;
      for (let i = 0; !targetVideo && i < 20; i += 1) {
        await new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => resolve());
        });
        targetVideo = videoRef.current;
      }

      if (!targetVideo) {
        return;
      }

      setIsStarting(true);
      setScanError(null);
      detectedRef.current = false;

      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      try {
        const onScan = (
          result: { getText: () => string } | undefined,
          _error: unknown,
          controls: IScannerControls,
        ) => {
          if (!result || detectedRef.current) {
            return;
          }

          const normalized = result.getText().replace(/\D/g, "");
          if (!isJanCode(normalized)) {
            return;
          }

          detectedRef.current = true;
          controls.stop();

          if (beepOnSuccess) {
            playSuccessBeep();
          }

          onDetectedRef.current(normalized);
          onOpenChangeRef.current(false);
        };

        let controls: IScannerControls;
        try {
          controls = await reader.decodeFromConstraints(
            {
              audio: false,
              video: {
                facingMode: {
                  ideal: "environment",
                },
              },
            },
            targetVideo,
            onScan,
          );
        } catch {
          controls = await reader.decodeFromVideoDevice(
            undefined,
            targetVideo,
            onScan,
          );
        }

        if (cancelled) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
      } catch {
        const message =
          "カメラを起動できませんでした。権限設定を確認するか手入力してください。";
        setScanError(message);
        onErrorRef.current?.(message);
      } finally {
        if (!cancelled) {
          setIsStarting(false);
        }
      }
    };

    void startScanner();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [beepOnSuccess, open, stopScanner]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="size-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="bg-muted relative aspect-video overflow-hidden rounded-lg border">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <div className="pointer-events-none absolute inset-0 border-2 border-dashed border-white/60" />
          </div>

          {isStarting ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" />
              カメラを起動しています...
            </div>
          ) : (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <ScanLine className="size-4" />
              バーコードを中央に合わせると自動で読み取ります。
            </div>
          )}

          {scanError ? (
            <div
              className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              <XCircle className="size-4 shrink-0" />
              <p>{scanError}</p>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
