import React, { useRef, useState } from "react";
import firebase from "@/utils/firebase";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";
import TextEditor from "./TextEditor";
import { MenuItem, Select } from "@mui/material";
import { replyNestedPost, replyPost } from "@/api/reply-post-api";
import { useRouter } from "next/router";

export default function CreatePostSection({handleCancel, parentType, parentId}) {
    const router = useRouter();
    const editorRef = useRef(null);
    const [tags, setTags] = useState([]);
    const [isContentEmpty, setIsContentEmpty] = useState(false);
    const [isSubmit, setIsSubmit] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isSubmit) {
          if (editorRef.current.getContent().length > 0 && tags.length > 0) {
            setIsContentEmpty(false);
            const requestBody = JSON.stringify({
              post: {
                tag: tags.join(),
                content: editorRef.current.getContent(),
                creator: JSON.parse(getCookie("auth"))?.user_id,
              },
              initial_post: parentId,
              reply_post: parentId,
            });
    
            if (parentType === "initial") {
              replyPost(requestBody).then(() => {
                toast.success("Berhasil membuat reply post");
                router.reload(window.location.pathname)
              });
            } else if (parentType === "reply") {
              replyNestedPost(requestBody).then((data) => {
                toast.success("Berhasil membuat nested reply post");
                router.reload(window.location.pathname)
              });
            } else {
              toast.error("maaf gabisa bos")
            }
          } else {
            setIsContentEmpty(true);
          }
        }
      };

      const handleChangeTag = (event) => {
        const {
          target: { value },
        } = event;
        setTags(
          // On autofill we get a stringified value.
          typeof value === "string" ? value.split(",") : value
        );
      };

      const tagOptions = ["pertanyaan", "pendapat", "bingung"];

      // const handleCancel = () => {
      //   setIsSubmit(false);
      //   router.push(`/forum/${pid}`)
      // }

  return (
    <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 text-sm"
    >
        <TextEditor editorRef={editorRef}></TextEditor>
        {isContentEmpty && (
        <p className="text-amber text-xs">
            <ErrorIcon />{" "}
            <span className="text-black">
            Please fill out this field.
            </span>
        </p>
        )}
        <Select
        className="bg-white w-1/2 text-sm"
        multiple
        required
        value={tags}
        onChange={handleChangeTag}
        >
        {tagOptions.map((name) => (
            <MenuItem key={name} value={name} className="text-sm">
            {name}
            </MenuItem>
        ))}
        </Select>
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
    </form>
  );
}
