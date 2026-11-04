"use client";

import { useState } from "react";

type Props = {
  imageUrl: string;
  imageBlob: Blob;
  title: string;
  score: number;
  fileName: string;
  shareText: string;
  againLabel: string;
  onAgain: () => void;
};

export default function ResultCard({ imageUrl, imageBlob, title, score, fileName, shareText, againLabel, onAgain }: Props) {
  const [toast, setToast] = useState("");

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  function save() {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = fileName;
    a.click();
  }

  async function share() {
    const file = new File([imageBlob], fileName, { type: "image/png" });
    try {
      // mobile: share the actual image to Instagram, KakaoTalk, etc.
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
        return;
      }
      if (navigator.share) {
        await navigator.share({ text: shareText, url: location.href });
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${location.href}`);
      flash("링크를 복사했어요");
    } catch (err) {
      // user closed the share sheet -> not an error
      if ((err as Error).name !== "AbortError") flash("공유하지 못했어요. 이미지를 저장해서 올려주세요");
    }
  }

  return (
    <section className="flex flex-col items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- blob URL, next/image can't optimize it */}
      <img
        src={imageUrl}
        alt={`${title}, ${score}점`}
        className="w-full max-w-[300px] rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
      />
      <p className="text-center text-[13px] text-ink-dim">모바일에서는 이미지를 길게 눌러도 저장돼요</p>

      <div className="flex w-full gap-2.5">
        <button className="btn btn-ghost flex-1" onClick={save}>
          이미지 저장
        </button>
        <button className="btn flex-1" onClick={share}>
          공유하기
        </button>
      </div>
      <button className="btn btn-big w-full" onClick={onAgain}>
        {againLabel}
      </button>

      <p role="status" className="min-h-5 text-sm text-lamp">
        {toast}
      </p>
    </section>
  );
}
