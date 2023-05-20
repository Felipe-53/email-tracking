import React, { useEffect, useState } from "react";
import { Email } from "../screens/EmailTracker";
import { toDateTimeString } from "../utils/toDateTimeString";
import { BtnWithFeedback } from "./BtnWithFeedback";
import { fetchJson } from "../utils/fetchJson";
const baseUrl = import.meta.env.VITE_BASE_URL;

interface Props {
  email: Email | null;
  updateEmail: (email: Email) => void;
}

const eventNameMap = {
  CREATED: "Criado",
  REGISTERED: "Registrado",
  OPENED: "Aberto",
};

type FetchState = "idle" | "loading" | "error";

const EmailUpdates: React.FC<Props> = ({ updateEmail, email }) => {
  const [fetchState, setFetchState] = useState<FetchState>("idle");

  useEffect(() => {
    if (fetchState === "error") {
      setTimeout(() => {
        setFetchState("idle");
      }, 2000);
    }
  }, [fetchState]);

  if (!email) return null;

  async function refreshEmail() {
    setFetchState("loading");
    try {
      const updated = await fetchJson<{ data: Email }>(
        `/emails/${email!.id}`,
        {}
      );
      updateEmail(updated.data);
      setFetchState("idle");
    } catch {
      setFetchState("error");
    }
  }

  email.emailUpdates = email.emailUpdates.sort((a, b) => {
    const aDate = new Date(a.timestamp);
    const bDate = new Date(b.timestamp);

    return aDate.getTime() - bDate.getTime();
  });

  const emailUpdatesCount = email.emailUpdates.length;

  let actionButton;
  if (emailUpdatesCount > 1) {
    actionButton = (
      <button
        onClick={refreshEmail}
        className={`btn btn-primary btn-sm relative ${
          fetchState === "loading" ? "btn-disabled" : ""
        }`}
      >
        {fetchState === "loading" ? "Carregando..." : "Atualizar"}
      </button>
    );
  } else {
    actionButton = (
      <BtnWithFeedback
        feedbackProps={{
          message: "copiado!",
          timeout: 2500,
        }}
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(`${baseUrl}/tracking?id=${email.id}`);
        }}
      >
        link
      </BtnWithFeedback>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-bold text-3xl text-center">{email.title}</h2>

      <div className="flex flex-col gap-4">
        <table className="table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {email.emailUpdates.map((update) => {
              const updateDateTime = new Date(update.timestamp);

              return (
                <tr key={update.id}>
                  <th>{eventNameMap[update.event]}</th>
                  <th>{toDateTimeString(updateDateTime)}</th>
                </tr>
              );
            })}
          </tbody>
        </table>

        {actionButton}
      </div>
    </div>
  );
};

export default EmailUpdates;
