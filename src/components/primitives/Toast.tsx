import { toast as sonnerToast } from "sonner";

export function toast(toast: Omit<Partial<ToastProps>, "id">) {
  return sonnerToast.custom((id) => (
    <Toast id={id} title={toast.title} description={toast.description} />
  ));
}

function Toast(props: Partial<ToastProps>) {
  const { title, description, button, id } = props;

  return (
    <div className="flex mx-auto rounded-full bg-black text-sm font-medium text-white shadow-popover ring-1 ring-black/5 w-full items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="mt-1 text-sm opacity-70">{description}</p>
          )}
        </div>
      </div>
      {button && (
        <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
          <button
            className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
            onClick={() => {
              button.onClick();
              sonnerToast.dismiss(id);
            }}
          >
            {button.label}
          </button>
        </div>
      )}
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  button: {
    label: string;
    onClick: () => void;
  };
}
