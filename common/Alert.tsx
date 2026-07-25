interface AlertProps {
  type: "error" | "success";
  message?: string;
}

export function Alert({ type, message }: AlertProps) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "bg-red-500/10 border-red-500 text-red-500"
      : "bg-green-500/10 border-green-500 text-green-500";

  return (
    <div className={`mb-5 rounded-2xl border p-4 ${styles}`}>
      {message}
    </div>
  );
}