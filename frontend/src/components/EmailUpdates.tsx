import React, { useEffect, useRef, useState } from "react";
import { Email } from "../screens/EmailTracker";
import { toDateTimeString } from "../utils/toDateTimeString";
import { BtnWithFeedback } from "./BtnWithFeedback";
const baseUrl = import.meta.env.VITE_BASE_URL;

interface Props {
  email: Email | null;
}

const eventNameMap = {
  CREATED: "Criado",
  REGISTERED: "Registrado",
  OPENED: "Aberto",
};

const EmailUpdates: React.FC<Props> = ({ email }) => {
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<null | number>(null);

  useEffect(() => {
    if (copied) {
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2500);
    }
  }, [copied]);

  if (!email) return null;

  email.emailUpdates = email.emailUpdates.sort((a, b) => {
    const aDate = new Date(a.timestamp);
    const bDate = new Date(b.timestamp);

    return aDate.getTime() - bDate.getTime();
  });

  const emailUpdatesCount = email.emailUpdates.length;

  let actionButton;
  if (emailUpdatesCount > 1) {
    actionButton = <></>;
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

      <div className="flex flex-col">
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
