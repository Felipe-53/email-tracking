import { useEffect, useState } from "react";
import { fetchJson } from "../utils/fetchJson";
import EmailUpdates from "../components/EmailUpdates";
import NewTracker from "../components/NewTracker";
import StyledDialog from "../components/Dialog";
import TrackerList from "../components/TrackerList";

export interface Email {
  id: string;
  title: string;
  emailUpdates: EmailUpdate[];
}

export interface EmailUpdate {
  id: string;
  event: "CREATED" | "REGISTERED" | "OPENED";
  timestamp: string;
}

const EmailTracker = () => {
  const [emails, setEmails] = useState<Email[] | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [openNewTracker, setOpenNewTracker] = useState(false);
  const [newTrackerCreated, setNewTrackerCreated] = useState(false);

  useEffect(() => {
    if (newTrackerCreated) {
      setTimeout(() => {
        setNewTrackerCreated(false);
      }, 2500);
    }
  }, [newTrackerCreated]);

  useEffect(() => {
    fetchJson<Email[]>("/emails", {}).then((response) => {
      console.log(response);
      setEmails(response);
    });
  }, []);

  useEffect(() => {
    if (selectedEmail) {
      const selected = emails?.find((e) => e.id === selectedEmail.id);
      setSelectedEmail(selected ? selected : null);
    }
  }, [emails]);

  function updateEmail(email: Email) {
    setEmails((prev) => {
      if (prev) {
        return prev.map((e) => {
          if (e.id === email.id) {
            return email;
          }
          return e;
        });
      }
      return prev;
    });
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <h1 className="text-center font-bold text-4xl">SEUS EMAILS</h1>

      <StyledDialog
        open={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
      >
        <EmailUpdates email={selectedEmail} updateEmail={updateEmail} />
      </StyledDialog>

      <StyledDialog
        open={openNewTracker}
        onClose={() => setOpenNewTracker(false)}
      >
        <NewTracker
          closeModal={() => setOpenNewTracker(false)}
          setNewTrackerCreated={setNewTrackerCreated}
          setEmails={setEmails}
        />
      </StyledDialog>

      <button
        onClick={() => setOpenNewTracker(true)}
        className="btn btn-sm btn-primary"
      >
        Novo Tracker
      </button>

      <TrackerList emails={emails} setSelectedEmail={setSelectedEmail} />

      {newTrackerCreated && (
        <div className="alert alert-success max-w-xs text-center flex justify-center shadow-lg py-1 fixed font-semibold bottom-4">
          <span>Tracker criado com sucesso!</span>
        </div>
      )}
    </div>
  );
};

export default EmailTracker;
