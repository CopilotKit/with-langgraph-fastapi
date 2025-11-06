type ApprovalRequestProps = {
  message: string;
  onApprove: () => void;
  onDeny: () => void;
};

export function ApprovalRequest({ message, onApprove, onDeny }: ApprovalRequestProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      <p className="text-gray-800">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Approve
        </button>
        <button
          onClick={onDeny}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Deny
        </button>
      </div>
    </div>
  );
}

type ApprovalResultProps = {
  message: string;
  status: "approve" | "deny";
};

export function ApprovalResult({ message, status }: ApprovalResultProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      <p className="text-gray-800">{message}</p>
      <div className="flex items-center gap-2">
        <span
          className={`px-4 py-2 rounded font-semibold ${
            status === "approve"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status === "approve" ? "✓ Approved" : "✗ Denied"}
        </span>
      </div>
    </div>
  );
}

