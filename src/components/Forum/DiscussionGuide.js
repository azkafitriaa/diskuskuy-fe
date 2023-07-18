import React, { useState } from "react";
import { formatDateDeadline } from "@/utils/util";
import { format } from 'date-fns'
import { useRouter } from "next/router";
import { editThread } from "@/api/edit-thread-api";
import { toast } from "react-hot-toast";

export default function DiscussionGuide({
  threadId,
  deadlineData,
  description,
  mechAndExp,
  onSeeDiscussionGuide,
  showEditButton
}) {
  const router = useRouter();
  const [deadline, setDeadline] = useState(
    deadlineData ? formatDateDeadline(deadlineData) : null
  );
  const [deadlineInput, setDeadlineInput] = useState(deadlineData.substring(0, deadlineData.length-1));
  const [descriptionInput, setDescriptionInput] = useState(description);
  const [mechAndExpInput, setMechAndExpInput] = useState(mechAndExp);
  const minDate = format(new Date(), "yyyy-MM-ddTMM:ss");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestBody = {
      deadline: deadlineInput,
      description: descriptionInput,
      mechanism_expectation: mechAndExpInput,
    };
    editThread(threadId, requestBody).then((data) => {
      if (data.status === 200) {
        toast.success("Berhasil Mengedit Panduan Diskusi")
        router.reload(window.location.pathname)
      };
    });
  };

  const handleCancel = () => {
    setIsEditMode(false)
  }

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleChangeDeadline = (event) => {
    setDeadlineInput(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescriptionInput(event.target.value);
  };

  const handleChangeMechAndExp = (event) => {
    setMechAndExpInput(event.target.value);
  };

  return (
    <div className="section">
      <div className="flex flex-row justify-between">
        <div>
          <h3 className="font-bold text-gray">Panduan Diskusi</h3>
          <div className="h-1 w-5 bg-grey"></div>
        </div>
        {showEditButton && (
          <button 
          className="normal-case text-black font-bold bg-white rounded-lg border border-grey py-1 px-4 text-xs hover:border-green hover:bg-green4"   
          onClick={ handleEdit }>
            Edit
          </button>
        )}
      </div>
      {isEditMode && <form
        onSubmit={handleSubmit}>
      <label>Deadline</label>
      <input
        value={deadlineInput}
        onChange={handleChangeDeadline}
        required
        type="datetime-local"
        min={minDate}
        className="appearance-none block border w-full rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white text-sm"
        id="deadline"
      />
      <label>Deskripsi</label>
      <textarea
        value={descriptionInput}
        onChange={handleChangeDescription}
        required
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline min-h-[100px]"
      />
      <label>Mekanisme dan Ekspektasi</label>
      <textarea
        value={mechAndExpInput}
        onChange={handleChangeMechAndExp}
        required
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline min-h-[100px]"
      />
      <div className="flex flex-row gap-5 mt-10 justify-end">
        <button
            className="w-1/4 bg-white border text-black p-2 rounded cursor-pointer"
            onClick={handleCancel}
        >
            Batal
        </button>
        <input
            type="submit"
            value="Simpan"
            className="w-1/4 bg-green text-white p-2 rounded cursor-pointer"
        />
      </div>
      </form>}
      {!isEditMode && <>
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
      <p>{mechAndExp}</p>
      <a
        onClick={onSeeDiscussionGuide}
        className="text-blue cursor-pointer text-xs font-bold"
      >
        Lihat panduan diskusi
      </a>
      </>}
    </div>
  );
}
