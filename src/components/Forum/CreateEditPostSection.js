import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";
import TextEditor from "./TextEditor";
import { MenuItem, Select } from "@mui/material";
import { replyNestedPost, replyPost } from "@/api/reply-post-api";
import { useRouter } from "next/router";
import { editPost } from "@/api/edit-reply-api";
import { editThread } from "@/api/edit-thread-api";

export default function CreateEditPostSection({isEdit, isInitialPost, threadId, handleCancel, parentType, parentId, postId, initialContent, initialTags, initialThreadTitle}) {
    const router = useRouter();
    const editorRef = useRef(null);
    const [threadTitle, setThreadTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [isContentEmpty, setIsContentEmpty] = useState(false);
    const [isSubmit, setIsSubmit] = useState(true);

    useEffect(() => {
      setThreadTitle(initialThreadTitle)
      setContent(initialContent);
      if (initialTags) {
        const tagLowered = initialTags.map(tag => {
          return tag.toLowerCase();
        })
        setTags(tagLowered);
      }
    }, [editorRef]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isSubmit) {
          if (!isEdit) {
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
                replyNestedPost(requestBody).then(() => {
                  toast.success("Berhasil membuat nested reply post");
                  router.reload(window.location.pathname)
                });
              } else {
                toast.error("Terjadi kesalahan")
              }
            } else {
              setIsContentEmpty(true);
            }
          } else {
            if (editorRef.current.getContent().length > 0 && tags.length > 0) {
              if (isInitialPost) {
              const requestBodyTitle = {
                title: threadTitle,
              };
              editThread(threadId, requestBodyTitle).then((data) => {
                // masih error di bagian upload file
                if (data.status === 200) {
                  toast.success("Berhasil Mengedit Thread")
                  // router.push(`/forum/${forumData.id}`)
                };
              });
            }
              const requestBody = JSON.stringify({
                tag: tags.join(),
                content: editorRef.current.getContent(),
              });
      
              editPost(requestBody, postId).then((data) => {
                toast.success("Berhasil mengedit post");
                router.reload(window.location.pathname)
              });
            } else {
              toast.error("Harap isi konten");
            }
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

      const handleChangeTitle = (event) => {
        setThreadTitle(event.target.value);
      };

  return (
    <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 text-sm"
    >
        {initialThreadTitle && <>
        <h3 className="font-bold text-">Judul Thread</h3>
        <div className="h-1 w-5 bg-[#C4C4C4]"></div>
        <input
          value={threadTitle}
          onChange={handleChangeTitle}
          required
          type="text"
          className="appearance-none block border w-full rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
          id="grid-first-name"
        />
        <h3 className="font-bold">Initial Post</h3>
        <div className="h-1 w-5 bg-[#C4C4C4]"></div>
        </>
        }
        <label>Konten</label>
        <TextEditor editorRef={editorRef} defaultValue={content}></TextEditor>
        {isContentEmpty && (
        <p className="text-amber text-xs">
            <ErrorIcon />{" "}
            <span className="text-black">
            Please fill out this field.
            </span>
        </p>
        )}
        <label>Tag</label>
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
