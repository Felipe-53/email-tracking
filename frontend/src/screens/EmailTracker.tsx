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

  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <h1 className="text-center font-bold text-4xl">SEUS EMAILS</h1>

      <StyledDialog
        open={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
      >
        <EmailUpdates email={selectedEmail} />
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
