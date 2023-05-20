import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

interface Props {
  feedbackProps: FeedbackProps;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface FeedbackProps {
  message: string;
  timeout: number;
}

const BtnWithFeedback = ({
  onClick,
  feedbackProps,
  children,
}: PropsWithChildren<Props>) => {
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (copied) {
      typeof timerRef == "number" && clearTimeout(timerRef);
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, feedbackProps.timeout);
    }
  }, [copied]);

  return (
    <button
      className="relative font-bold btn btn-sm btn-primary"
      onClick={(e) => {
        onClick(e);
        setCopied(true);
      }}
    >
      {children}

      {copied && (
        <span className="absolute -bottom-6 lowercase text-green-600">
          {feedbackProps.message}
        </span>
      )}
    </button>
  );
};

export { BtnWithFeedback };
