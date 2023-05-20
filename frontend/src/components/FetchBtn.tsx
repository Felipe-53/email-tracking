import React, { useEffect, useRef, useState } from "react";

interface Props {
  fetchFunction: () => Promise<void>;
}

export type FetchState = "idle" | "loading" | "error" | "success";

const FetchBtn: React.FC<Props> = ({ fetchFunction }) => {
  const [fetchState, setFetchState] = useState<FetchState>("idle");

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    clearTimeout(timerRef.current || -1);
    if (fetchState === "error" || fetchState === "success") {
      timerRef.current = setTimeout(() => {
        setFetchState("idle");
      }, 1000);
    }
  }, [fetchState]);

  async function performFetch() {
    setFetchState("loading");
    try {
      await fetchFunction();
      setFetchState("success");
    } catch {
      setFetchState("error");
    }
  }

  return (
    <button
      onClick={performFetch}
      className={`btn btn-primary btn-sm relative ${
        fetchState === "loading" ? "btn-disabled" : ""
      }`}
    >
      {fetchState === "loading" ? "Carregando..." : "Atualizar"}

      <span className="absolute -bottom-6 text-sm lowercase">
        {fetchState === "error" && (
          <span className="text-red-500">Erro ao atualizar</span>
        )}
        {fetchState === "success" && (
          <span className="text-green-500">Atualizado!</span>
        )}
      </span>
    </button>
  );
};

export default FetchBtn;
