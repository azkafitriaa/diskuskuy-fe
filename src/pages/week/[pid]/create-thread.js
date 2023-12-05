import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/CreateThread.module.css";
import { format } from 'date-fns'
import TextEditor from "@/components/Forum/TextEditor";
import { createReferenceFile, createThread, fetchAllGroup } from "@/api/create-thread-api";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/router";
import ErrorIcon from "@mui/icons-material/Error";
import Navbar from "@/components/Navbar";
import { fetchWeekDataById } from "@/api/home-api";
import { getCookie, getCookies } from "cookies-next";
import Head from "next/head";

export default function CreateThread() {
  const router = useRouter();
  const editorRef = useRef(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [mechAndExp, setMechAndExp] = useState("");
  const [referenceFileList, setReferenceFileList] = useState([]);
  const [tags, setTags] = useState([]);
  const [group, setGroup] = useState("");
  const [isInitialPostEmpty, setIsInitialPostEmpty] = useState(false);
  const minDate = format(new Date(), "yyyy-MM-ddTMM:ss");
  const [isLoading, setLoading] = useState(false);
  const [weekName, setWeekName] = useState("");
  const [groupOptions, setGroupOptions] = useState([]);

  const tagOptions = ["pendapat", "pertanyaan", "bingung"];

  const { pid } = router.query;

  useEffect(() => {
    const path = location.pathname;
    const pathArray = path.split("/");
    const weekId = pathArray[pathArray.length - 2];

    fetchWeekDataById(weekId).then((data) => setWeekName(data.name));
    fetchAllGroup().then((data) => setGroupOptions([{"id": 0, "name": "All"}].concat(data)));
  }, []);

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleChangeDeadline = (event) => {
    setDeadline(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleChangeMechAndExp = (event) => {
    setMechAndExp(event.target.value);
  };

  const handleReferenceFileChange = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    const uploaded = [...referenceFileList];
    chosenFiles.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
      }
    });
    setReferenceFileList(uploaded);
  };

  const handleChangeGroup = (event) => {
    setGroup(event.target.value);
  };

  const handleChangeTag = (event) => {
    setTags(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    if (
      editorRef.current &&
      editorRef.current.getContent() &&
      editorRef.current.getContent().length > 0
    ) {
      setIsRequesting(true);
      const requestBody = {
        initial_post: {
          post: {
            tag: tags.join(),
            content: editorRef.current.getContent(),
            creator: JSON.parse(getCookie("auth"))?.user_id,
          },
        },
        reference_file: [],
        title: title,
        deadline: deadline,
        description: description,
        mechanism_expectation: mechAndExp,
        week: pid,
        group: group!= 0 ? group : null
      };

      createThread(requestBody).then((data) => {
        if (data.status === 201) {
          referenceFileList.forEach((file) => {
            createReferenceFile(file, data.data.id);
          });
        }
      });
      setIsRequesting(false);
    } else {
      setIsInitialPostEmpty(true);
    }
  };

  const files = referenceFileList ? [...referenceFileList] : [];

  const handleCancel = () => {
    router.push(`/`)
  }


  return (
    <>
      <Head>
        <title>Buat Thread</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.mainContent}>
          {isRequesting && (
            <div className="flex flex-row justify-center">
              <CircularProgress color="inherit" />
            </div>
          )}
          {!isRequesting && (
            <>
              <div className="flex flex-row items-center text-xs pb-5">
                <a className="cursor-pointer" href="/">
                  Sistem Interaksi Genap 2022/2023
                </a>
                <ChevronRightIcon />
                {/* TODO: replace #{num} pake week keberapa & nama week*/}
                <a className="cursor-pointer" href="/#4">
                  Forum Diskusi {weekName}
                </a>
                <ChevronRightIcon />
                <a className="font-bold">Buat Thread</a>
              </div>
              <div className="section">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 text-sm"
                >
                  <div className="flex flex-row gap-5">
                    <div className=" basis-1/2 flex flex-col gap-2">
                      <h3 className="font-bold">Group</h3>
                      <div className="h-1 w-5 bg-grey"></div>
                      <div>
                        <Select
                          className="bg-white w-full text-sm"
                          value={group}
                          onChange={handleChangeGroup}
                        >
                          {groupOptions.map((group, i) => (
                            <MenuItem
                              key={group.name}
                              value={group.id}
                              className="text-sm"
                            >
                              {group.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                      <h3 className="font-bold">Judul Thread</h3>
                      <div className="h-1 w-5 bg-grey"></div>
                      <input
                        value={title}
                        onChange={handleChangeTitle}
                        required
                        type="text"
                        className="appearance-none block border w-full rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        id="grid-first-name"
                      />
                      <h3 className="font-bold">Panduan Diskusi</h3>
                      <div className="h-1 w-5 bg-grey"></div>
                      <label>Deadline</label>
                      <input
                        value={deadline}
                        onChange={handleChangeDeadline}
                        required
                        type="datetime-local"
                        min={minDate}
                        className="appearance-none block border w-full rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        id="deadline"
                      />
                      <label>Deskripsi</label>
                      <textarea
                        value={description}
                        onChange={handleChangeDescription}
                        required
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[100px]"
                      />
                      <label>Mekanisme dan Ekspektasi</label>
                      <textarea
                        value={mechAndExp}
                        onChange={handleChangeMechAndExp}
                        required
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[100px]"
                      />
                      <h3 className="font-bold">Referensi Diskusi</h3>
                      <div className="h-1 w-5 bg-grey"></div>
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          onChange={handleReferenceFileChange}
                          multiple
                          required
                        />
                        {files.map((file, i) => (
                          <div
                            className="flex flex-row items-center gap-2"
                            key={i}
                          >
                            {file.type == "application/pdf" && (
                              <img src="/images/pdf-icon.png" width={"30px"} />
                            )}
                            {file.type == "image/png" && (
                              <img src="/images/png-icon.png" width={"30px"} />
                            )}
                            {file.type != "application/pdf" &&
                              file.type != "image/png" && (
                                <img src="/images/url-icon.png" width={"30px"} />
                              )}
                            <div className="flex flex-col">
                              <p>{file.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="basis-1/2 flex flex-col gap-2">
                      <h3 className="font-bold">Initial Post</h3>
                      <div className="h-1 w-5 bg-grey"></div>
                      <label>Konten</label>
                      {isInitialPostEmpty && (
                        <p className="text-amber text-xs">
                          <ErrorIcon />{" "}
                          <span className="text-black">
                            Please fill out this field.
                          </span>
                        </p>
                      )}
                      <TextEditor editorRef={editorRef} />
                      <label>Tag</label>
                      <div>
                        <Select
                          className="bg-white w-full text-sm"
                          multiple
                          required
                          value={tags}
                          onChange={handleChangeTag}
                        >
                          {tagOptions.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                              className="text-sm"
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-5 mt-10 justify-end">
                    <input
                      value="Batal"
                      onClick={handleCancel}
                      className="bg-white text-black p-2 rounded cursor-pointer w-1/4 text-center border"
                    />
                    <input
                      type="submit"
                      value={isLoading ? "Loading..." : "Simpan"}
                      // value={"Simpan"}
                      className="bg-green text-white p-2 rounded cursor-pointer w-1/4"
                      disabled={isLoading}
                    />
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  if (!getCookies({ req, res })?.auth) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
}