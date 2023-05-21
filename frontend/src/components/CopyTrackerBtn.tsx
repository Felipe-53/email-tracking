import React from "react";
import { BtnWithFeedback } from "./BtnWithFeedback";
import { Email } from "../types";
import { env } from "../env";

interface Props {
  email: Email;
}

const CopyTrackerBtn: React.FC<Props> = ({ email }) => {
  const { baseUrl } = env;

  function trackerScript() {
    return `function addTrackerToEmail() {
      const emailBody = document.querySelector('div[role="textbox"]');
    
      if (!emailBody) {
        throw Error("Could not find the email body element");
      }
    
      const trackerImage = '<img src="${baseUrl}/tracking?id=${email.id}" />';
    
      emailBody.innerHTML = emailBody.innerHTML + trackerImage;
    }
    
    addTrackerToEmail();
    `;
  }

  return (
    <BtnWithFeedback
      feedbackProps={{
        message: "copiado!",
        timeout: 1000,
      }}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(trackerScript());
      }}
    >
      script
    </BtnWithFeedback>
  );
};

export { CopyTrackerBtn };
