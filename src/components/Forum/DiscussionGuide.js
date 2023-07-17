import React, { useState } from "react";
import { formatDateDeadline } from "@/utils/util";

export default function DiscussionGuide({
  deadlineData,
  description,
  mechanism_expectation,
  onSeeDiscussionGuide,
}) {
  const [deadline, setDeadline] = useState(
    deadlineData ? formatDateDeadline(deadlineData) : null
  );

  return (
    <div className="section">
      <h3 className="font-bold text-gray">Panduan Diskusi</h3>
      <div className="h-1 w-5 bg-grey"></div>
      {deadline != null && (
        <p>
          <strong>Deadline:</strong> {deadline}
        </p>
      )}
      <p>
        <strong>Deskripsi:</strong>
      </p>
      <p>{description}</p>
      <p>
        <strong>Mekanisme dan Ekspektasi:</strong>
      </p>
      <p>{mechanism_expectation}</p>
      <a
        onClick={onSeeDiscussionGuide}
        className="text-blue cursor-pointer text-xs font-bold"
      >
        Lihat panduan diskusi
      </a>
    </div>
  );
}
