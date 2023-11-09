"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";

export default function NavBar({ token }: { token: String | null }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/meet-removebg-preview.png"
              alt="Precedent logo"
              width="180"
              height="50"
              className="mr-2 rounded-sm"
            ></Image>
          </Link>
          <div>
            {/* {!token && (
            <button
              className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
              onClick={() => setShowSignInModal(true)}
            >
            Sign In
            </button>
          )} */}

            {token ? (
              <UserDropdown token={token} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
