import React from "react";
import { Email } from "../types";

interface Props {
  emails: Email[] | null;
  setSelectedEmail: React.Dispatch<React.SetStateAction<Email | null>>;
}

const TrackerList: React.FC<Props> = ({ emails, setSelectedEmail }) => {
  let state: "loading" | "empty" | "ok";
  if (emails === null) {
    state = "loading";
  } else if (emails.length === 0) {
    state = "empty";
  } else {
    state = "ok";
  }

  const map: Record<typeof state, React.JSX.Element> = {
    loading: <span className="text-center">Carregando...</span>,
    empty: <span className="text-center">Nenhum tracker criado ☹️</span>,
    ok: (
      <>
        {emails &&
          emails.map((email) => {
            const { timestamp } = email.emailUpdates.find(
              (update) => update.event === "CREATED"
            )!;

            const createdAt = new Date(timestamp);

            return (
              <button
                className="flex justify-between btn"
                style={{ textTransform: "none" }}
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                }}
              >
                <span>{email.title}</span>
                <span>
                  {createdAt.toLocaleDateString("pt-br", {
                    timeZone: "America/Recife",
                  })}
                </span>
              </button>
            );
          })}
      </>
    ),
  };

  return (
    <div className="flex flex-col gap-4 px-6 w-full max-w-xl">{map[state]}</div>
  );
};

export default TrackerList;
