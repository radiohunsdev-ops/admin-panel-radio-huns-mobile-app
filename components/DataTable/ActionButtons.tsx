import DeleteButton from "@/common/DeleteButton";
import { IconButton } from "@/common/IconButton";
import { COLORS } from "@/constants/colors";
import { Eye, Pencil } from "lucide-react";

interface ActionButtonsProps {
  viewUrl: string;
  editUrl: string;
  deleteId: string;
  deleteType:
    | "user"
    | "livestream"
    | "host"
    | "show"
    | "schedule";
}

export function ActionButtons({
  viewUrl,
  editUrl,
  deleteId,
  deleteType,
}: ActionButtonsProps) {
  return (
    <div className="flex justify-end gap-3">
      {viewUrl && (
        <IconButton
          href={viewUrl}
          icon={<Eye size={18} color={COLORS.text} />}
        />
      )}

      {editUrl && (
        <IconButton
          href={editUrl}
          icon={<Pencil size={18} color={COLORS.primary} />}
        />
      )}

      {deleteId && deleteType && (
        <DeleteButton
          id={deleteId}
          type={deleteType}
          title={`Delete ${deleteType}`}
          description="This action cannot be undone."
        />
      )}
    </div>
  );
}