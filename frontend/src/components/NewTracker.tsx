import React, { useEffect, useRef, useState } from "react";
import { fetchJson } from "../utils/fetchJson";
import { Email } from "../types";

type Status = "idle" | "loading" | "created" | "error";

interface Props {
  closeModal: () => void;
  setNewTrackerCreated: (value: boolean) => void;
  setEmails: React.Dispatch<React.SetStateAction<Email[] | null>>;
}

const NewTracker: React.FC<Props> = ({
  closeModal,
  setEmails,
  setNewTrackerCreated,
}) => {
  const [emailTitle, setEmailTitle] = useState("");
  const [createEmailStatus, setCreateEmailStatus] = useState<Status>("idle");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function createEmailTracker() {
    setCreateEmailStatus("loading");

    try {
      await fetchJson("/emails", {
        method: "POST",
        body: JSON.stringify({
          title: emailTitle,
        }),
      });

      const emails = await fetchJson<Email[]>("/emails", {});
      setEmails(emails);
      closeModal();
      setNewTrackerCreated(true);
    } catch (err) {
      console.log(err);
      setCreateEmailStatus("error");
    }
  }

  const map: Record<Status, React.JSX.Element> = {
    idle: (
      <button onClick={createEmailTracker} className="btn btn-sm btn-primary">
        Novo Tracker
      </button>
    ),
    loading: <div>Carregando...</div>,
    error: <span className="text-red-500">Erro ao criar tracker</span>,
    created: <></>,
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-3xl font-bold">Título</h2>

      <input
        ref={inputRef}
        onChange={(e) => {
          setEmailTitle(e.target.value);
        }}
        className="input input-primary min-w-[30ch]"
        type="text"
      />

      {map[createEmailStatus]}
    </div>
  );
};

export default NewTracker;
