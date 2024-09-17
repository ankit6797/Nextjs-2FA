"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function index() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const localData = localStorage.getItem("user");

    if (!localData) {
      router.push("/login");
    } else {
      setUser(localData);
    }
  }, []);

  return (
    <>
      <div className="text-end me-2 mt-2">
        <button
          onClick={() => {
            localStorage.clear(), router.push("/login");
          }}
          className="bg-red-500 px-3 py-2 rounded-md hover:bg-white hover:text-red-500"
        >
          Log out
        </button>
      </div>
      <div className="grid items-center text-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p className="text-3xl font-bold"> Hello</p>
        <p className="text-3xl font-bold"> {user}</p>
        <p className="text-3xl font-bold"> Welcome !!!</p>
      </div>
    </>
  );
}
