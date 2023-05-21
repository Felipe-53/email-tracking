import React from "react";
import { Email } from "../types";
import { toDateTimeString } from "../utils/toDateTimeString";
import { fetchJson } from "../utils/fetchJson";
import FetchBtn from "./FetchBtn";
import { CopyTrackerBtn } from "./CopyTrackerBtn";

interface Props {
  email: Email | null;
  updateEmail: (email: Email) => void;
}

const eventNameMap = {
  CREATED: "Criado",
  REGISTERED: "Registrado",
  OPENED: "Aberto",
};

const EmailUpdates: React.FC<Props> = ({ updateEmail, email }) => {
  if (!email) return null;

  async function refreshEmail() {
    const updated = await fetchJson<{ data: Email }>(
      `/emails/${email!.id}`,
      {}
    );

    console.log(updated);
    updateEmail(updated.data);
  }

  email.emailUpdates = email.emailUpdates.sort((a, b) => {
    const aDate = new Date(a.timestamp);
    const bDate = new Date(b.timestamp);

    return aDate.getTime() - bDate.getTime();
  });

  const emailUpdatesCount = email.emailUpdates.length;

  let copyTrackerBtn: JSX.Element | null = null;
  if (emailUpdatesCount < 2) {
    copyTrackerBtn = <CopyTrackerBtn email={email} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-bold text-3xl text-center">{email.title}</h2>

      {copyTrackerBtn}

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

      <FetchBtn fetchFunction={refreshEmail} />
    </div>
  );
};

export default EmailUpdates;
