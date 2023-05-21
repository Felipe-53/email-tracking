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
