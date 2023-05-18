import { PropsWithChildren } from "react";
import { Dialog } from "@headlessui/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const StyledDialog = ({
  open,
  onClose,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Dialog className="relative z-50" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-zinc-800 text-gray-50 p-14 rounded-lg max-w-lg">
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default StyledDialog;
