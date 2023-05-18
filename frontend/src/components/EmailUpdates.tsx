import React, { useEffect, useRef, useState } from "react";
import { Email } from "../screens/EmailTracker";
import { toDateTimeString } from "../utils/toDateTimeString";
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
  if (!email) return null;
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<null | number>(null);

  useEffect(() => {
    if (copied) {
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2500);
    }
  }, [copied]);

  email.emailUpdates = email.emailUpdates.sort((a, b) => {
    const aDate = new Date(a.timestamp);
    const bDate = new Date(b.timestamp);

    return aDate.getTime() - bDate.getTime();
  });

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

        {email.emailUpdates.length === 1 && (
          <button
            className=" relative px-2 font-bold btn btn-sm btn-primary my-4 "
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(
                `${baseUrl}/tracking?id=${email.id}`
              );
              if (timerRef.current) clearTimeout(timerRef.current);
              setCopied(true);
            }}
          >
            Link
            {copied && (
              <span className="absolute -bottom-6 lowercase text-green-600">
                Copiado!
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailUpdates;
