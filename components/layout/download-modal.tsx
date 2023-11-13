"use client";
import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useEffect,
} from "react";

import Image from "next/image";

const DownloadModal = ({
  showDownloadModal,
  setShowDownloadModal,
  deferredPrompt,
  setDeferredPrompt,
}: {
  showDownloadModal: boolean;
  setShowDownloadModal: Dispatch<SetStateAction<boolean>>;
  deferredPrompt: any;
  setDeferredPrompt: Dispatch<any>;
}) => {
  const [requestSent, setRequestSent] = useState(false);

  const [isInstalledForIOSChrome, setIsInstalledIOSChrome] =
    useState<boolean>(false);
  // const [showInstalled, setShowInstalled] = useState<boolean>(false);

  // test values
  let device = "chrome";

  useEffect(() => {
    // 브라우저 환경이 아닐때 예외처리
    if (typeof window === "undefined") return;

    if (device === "iosChrome") {
      // IOS 크롬 브라우저일 경우 pwa작동을 안합니다. 따로 처리 합니다.
      const isStandalone = window.navigator.standalone;
      const isInstalledOnChrome = !isStandalone;
      setIsInstalledIOSChrome(isInstalledOnChrome);
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowDownloadModal(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    if (outcome === "accept") {
      // 코드 생략
    } else if (outcome === "dismissed") {
      // 코드 생략
    }
  }, [deferredPrompt, setDeferredPrompt]);

  return (
    <Modal showModal={showDownloadModal} setShowModal={setShowDownloadModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <a href="https://meethare.site">
            <img
              src="/meetHare-logo.png"
              alt="logo"
              className="h-20 w-20 rounded-full"
              width={30}
              height={30}
            />
          </a>
          <h3 className="font-display text-2xl font-bold">
            MeetHare를 홈화면에 설치해보세요!
          </h3>
          <p className="text-sm text-gray-500">
            일행들을 위한 편리한 약속 서비스를 제공해드려요!
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <button
            id="install"
            className="rounded-full border bg-indigo-500 p-1.5 px-4 text-sm font-medium text-white transition-all"
            onClick={handleInstallClick}
          >
            MeetHare APP 설치하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

function useDownloadModal() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);

  const DownloadModalCallback = useCallback(() => {
    return (
      <DownloadModal
        showDownloadModal={showDownloadModal}
        setShowDownloadModal={setShowDownloadModal}
        deferredPrompt={deferredPrompt}
        setDeferredPrompt={setDeferredPrompt}
      />
    );
  }, [
    showDownloadModal,
    setShowDownloadModal,
    deferredPrompt,
    setDeferredPrompt,
  ]);

  return useMemo(
    () => ({
      DownloadModal: DownloadModalCallback,
    }),
    [DownloadModalCallback],
  );
}

export default function DownloadModalClient() {
  const { DownloadModal } = useDownloadModal();
  return (
    <>
      <DownloadModal />
    </>
  );
}
