import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import DosenInfo from "@/components/Home/DosenInfo";
import { courseName, courseDescription, term } from "@/api/dummy/home";
import { createWeek, fetchDosenData, fetchThreadThisMonth, fetchThreadToday, fetchWeeksData } from "@/api/home-api";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import CreateWeekPopUp from "@/components/Home/CreateWeekPopUp";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { getCookie, getCookies } from "cookies-next";
import Head from "next/head";
import { formatDate, formatDateDeadline, formatDateDeadline2, getDateFromRawDate } from "@/utils/util";
import Calendar from 'react-calendar';
import ServerTime from "@/components/Home/ServerTime";
import TodayTask from "@/components/Home/TodayTask";


export default function Home() {
  const router = useRouter();
  const [weeksData, setWeeksData] = useState([]);
  const [dosenData, setDosenData] = useState([]);
  // const [threadTodayData, setThreadTodayData] = useState([]);
  const [threadThisMonthData, setThreadThisMonthData] = useState([]);
  const [threadSelectedDateData, setThreadSelectedDateData] = useState([]);
  const [showCreateWeekPopUp, setShowCreateWeekPopUp] = useState(false);
  const [weekNameInput, setWeekNameInput] = useState("");
  const [isLecturer, setIsLecture] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [today, setToday] = useState(new Date());
  const [todayMonth, setTodayMonth] = useState(null);
  const [todayYear, setTodayYear] = useState(null);

  const monthList = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  useEffect(() => {
    setIsLoading(true);
    fetchThreadThisMonth().then((data) => {
      setThreadThisMonthData(data)
      setThreadSelectedDateData(data.filter((thread) => getDateFromRawDate(thread.deadline) == today.getDate()))
    });
    fetchWeeksData().then((data) => setWeeksData(data));
    fetchDosenData().then((dosenData) => setDosenData(dosenData));
    setIsLecture(
      getCookie("auth")
        ? JSON.parse(getCookie("auth"))?.role === "lecturer"
        : false
    );
    setIsLoading(false);
    setTodayMonth(monthList[today.getMonth()]);
    setTodayYear(today.getFullYear())
  }, []);

  const handleShowCreateWeekPopUp = () => {
    setShowCreateWeekPopUp(true);
  };

  const handleCloseCreateWeekPopUp = () => {
    setShowCreateWeekPopUp(false);
  };

  const handleSaveActionPopUp = () => {
    createWeek(weekNameInput).then((data) => {
      if (data) window.location.reload();
    });
  };

  const handleWeekNameInputChange = (event) => {
    setWeekNameInput(event.target.value);
  };

  const handleDateValueChange = (value) => {
    setDateValue(value);
    setThreadSelectedDateData(filterThreadBySelectedDate(new Date(value).getDate()))
  }

  const filterThreadBySelectedDate = (date) => {
    return threadThisMonthData.filter((thread) => getDateFromRawDate(thread.deadline) == date)
  }
  return (
    <>
      <Head>
        <title>Sistem Interaksi Genap 2022/2023</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.mainContent}>
          <div className="flex flex-row text-xs pb-5">
            <a className="cursor-pointer font-bold" href="/">
              Sistem Interaksi Genap 2022/2023
            </a>
          </div>
          <div className="flex flex-row gap-5">
          <div className="basis-3/4 flex flex-col gap-5">
            <div className="block p-6 h-44 bg-cover bg-[url('/images/header.png')] bg-purple rounded-lg text-white shadow-lg">
              <h1 className="mb-2 font-bold tracking-tight">{courseName}</h1>
              <p className="font-normal">({term})</p>
            </div>
            <div className="section">
              <div className="flex flex-row gap-2">
                <div className="basis-1/2 flex flex-col gap-5">
                  <h1 className="mb-2 font-bold tracking-tight text-gray-900">
                    Selamat Datang
                  </h1>
                  <p>
                    di mata kuliah {courseName} Semester {term}
                  </p>
                  <p>{courseDescription}</p>
                </div>
                <div className="basis-1/2 flex flex-col gap-5">
                  <h1 className="mb-2 font-bold tracking-tight text-gray-900">
                    Tim Pengajar
                  </h1>
                  <div className="flex flex-row flex-wrap gap-10">
                    {dosenData.map((dosen, i) => (
                      <DosenInfo
                        key={i}
                        photoUrl={dosen?.lecturer.photo_url}
                        name={dosen?.lecturer.name}
                        nim={dosen?.nim}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isLecturer && (
              <>
                {/* <Button
                  startIcon={<AddIcon />}
                  variant="filled"
                  className="normal-case text-black font-bold bg-white w-40 rounded-lg"
                  onClick={handleShowCreateWeekPopUp}
                >
                  Tambah Week
                </Button> */}
                <button className="w-40 normal-case text-black font-bold bg-white rounded-lg border border-grey2 py-2 px-4 text-sm hover:border-green hover:bg-green4" onClick={handleShowCreateWeekPopUp}><AddIcon /> Tambah Week</button>
                <CreateWeekPopUp
                  open={showCreateWeekPopUp}
                  onClose={handleCloseCreateWeekPopUp}
                  onSaveAction={handleSaveActionPopUp}
                  inputValue={weekNameInput}
                  handleInputChange={handleWeekNameInputChange}
                />
              </>
            )}
            {isLoading && (
              <div className="flex flex-row justify-center">
                <CircularProgress color="inherit" />
              </div>
            )}
            {/* TODO: tambahin id pake week keberapa*/}
            {!isLoading &&
              weeksData &&
              weeksData.length > 0 &&
              weeksData
              .map((week, i) => (
                <div className="section" key={week.id} id={week.id}>
                  <div className="flex flex-row justify-between items-center">
                    <h1 className="mb-2 font-bold tracking-tight text-gray-900">
                      {week.name}
                    </h1>
                    {isLecturer && (
                      // <Button
                      //   startIcon={<AddIcon />}
                      //   variant="contained"
                      //   className="normal-case text-black font-bold bg-white w-40 rounded-lg"
                      //   onClick={() =>
                      //     router.push(`week/${week.id}/create-thread`)
                      //   }
                      // >
                      //   Buat Thread
                      // </Button>
                      <button className="normal-case text-black font-bold bg-white rounded-lg border border-grey py-2 px-4 text-sm hover:border-green hover:bg-green4" onClick={() =>
                        router.push(`week/${week.id}/create-thread`)
                      }><AddIcon /> Buat Thread</button>
                    )}
                  </div>
                  {week.threads.length <= 0 && (
                    <p className="italic">Belum ada konten</p>
                  )}
                  {week.threads.length > 0 && (
                    <>
                      <p className="font-bold text-gray-700">
                        Forum Diskusi {week.name}
                      </p>
                      <div className="h-1 w-8 bg-grey"></div>
                      {week.threads.map((thread, i) => (
                        (isLecturer || thread.group == JSON.parse(getCookie("auth"))?.group || thread.group == null) &&
                        <div className={styles.threadCard} key={i}>
                          <div className="group flex items-center">
                            <img
                              className="h-14 w-14 rounded-full object-cover"
                              src={
                                thread?.initial_post?.post?.creator_photo_url ??
                                "/images/default-prof-pic.png"
                              }
                              alt=""
                            />
                            <div className="rtl:mr-3 ml-3">
                              <div className="flex flex-row gap-2">
                                <p className="font-normal text-green">Thread</p>
                                {thread.group_name && <div className="px-2 text-black flex items-center" style={{background: '#EED56B'}}><p className="text-xs">{thread.group_name}</p></div>}      
                              </div>
                              <h3 className="tracking-tight font-semibold">
                                {thread.title}
                              </h3>
                              <p className="text-xs w-full m-0 p-0">
                                {thread?.initial_post?.post?.creator_name} |{" "}
                                {formatDateDeadline2(thread?.deadline)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-row gap-2">
                            <Link href={"/forum/" + thread.id}>
                              <button className="bg-transparent hover:bg-green text-green text-xs font-semibold hover:text-white py-2 px-4 border border-green hover:border-transparent rounded-lg">
                                Lihat
                              </button>
                            </Link>
                            {isLecturer && (
                              <Link href={`/forum/${thread.id}/edit`}>
                                <button className="bg-transparent hover:bg-green text-green text-xs font-semibold hover:text-white py-2 px-4 border border-green hover:border-transparent rounded-lg">
                                  Edit
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
          </div>
          <div className="basis-1/4 flex flex-col gap-5">
            <div className="section">
              <h3 className="font-bold text-gray">Waktu Server</h3>
              <div className="h-1 w-8 bg-grey"></div>
              <ServerTime />
            </div>
            <div className="section">
              <h3 className="font-bold text-gray">Kalender</h3>
              <div className="h-1 w-8 bg-grey"></div>
              <p className="text-[#6B6B6B] font-bold text-center">{todayMonth} {todayYear}</p>
              <div className="h-[1px] w-full bg-[#E2E2E2]"></div>
              <Calendar onChange={handleDateValueChange} value={dateValue} className={styles.calendar} showNeighboringMonth={false} showNavigation={false}/>
            </div>
            <div className="section">
              <h3 className="font-bold text-gray">Daftar Tugas {formatDate(dateValue)}</h3>
              <div className="h-1 w-8 bg-grey"></div>
              {!threadSelectedDateData ||
              threadSelectedDateData.length == 0 &&
              <p className="italic">Belum ada tugas</p>
              }
              {!isLoading &&
              threadSelectedDateData &&
              threadSelectedDateData.length > 0 &&
              threadSelectedDateData.map((thread, i) => (
              <TodayTask thread={thread} />
              ))}
            </div>
          </div>
          </div>
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
