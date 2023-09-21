import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import styles from "@/styles/DiscussionGuide.module.css";
import { discussionGuideConstants } from "@/constants/DiscussionGuide";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  // fetchDiscussionGuideDataByThreadId,
  // updateDiscussionGuideStateById,
  updateThreadStateById,
} from "@/api/discussion-guide-api";
import { formatDate, formatDateDeadline, formatTime } from "@/utils/util";
import DiscussionGuideUpdateConfirmationPopUp from "@/components/Forum/DiscussionGuideUpdateConfirmationPopUp";
import Navbar from "@/components/Navbar";
import { fetchBreadcrumbByThreadId, fetchThreadDataById } from "@/api/forum-api";
import { fetchProfileData } from "@/api/auth-api";
import { getCookie, getCookies } from "cookies-next";
import Head from "next/head";

export default function DiscussionGuide() {
  const router = useRouter();
  const { pid } = router.query;

  const [breadcrumb, setBreadcrumb] = useState("");
  const [forumData, setForumData] = useState({});
  // const [discussionGuideData, setDiscussionGuideData] = useState({});
  const [deadline, setDeadline] = useState("");
  const [profileData, setProfileData] = useState({});
  const [
    showDiscussionGuideUpdateConfirmationPopUp,
    setShowDiscussionGuideUpdateConfirmationPopUp,
  ] = useState(false);

  const [role, setRole] = useState(
    typeof window !== "undefined" ? JSON.parse(getCookie("auth"))?.role : null
  );
  const [isLecturer, setIsLecturer] = useState(
    role == "lecturer" ? true : false
  );

  useEffect(() => {
    const path = location.pathname;
    const pathArray = path.split("/");
    const threadId = pathArray[pathArray.length - 2];

    fetchThreadDataById(threadId).then((data) => {
      setForumData(data);
      setDeadline(formatDateDeadline(data.deadline));
    });

    // fetchDiscussionGuideDataByThreadId().then((data) => {
    //   setDiscussionGuideData(data);
    //   setDeadline(formatDateDeadline(data.deadline));
    // });

    fetchBreadcrumbByThreadId(threadId).then((data) => {
      setBreadcrumb(data);
    });

    fetchProfileData().then((data) => setProfileData(data));
  }, []);

  const handleChangeCheckbox = () => {
    setShowDiscussionGuideUpdateConfirmationPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowDiscussionGuideUpdateConfirmationPopUp(false);
  };

  const handleUpdateState = () => {
    updateThreadStateById(
      forumData.id,
      parseInt(forumData.state) + 1
    ).then((data) => {
      if (data) window.location.reload();
    });
  };

  const checkboxDisabled = (i) => {
    return (
      !isLecturer ||
      i + 1 < forumData.state ||
      i + 1 > forumData.state
    );
  };

  return (
    <>
      <Head>
        <title>Panduan Diskusi: {forumData.title}</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.mainContent}>
          <div className="flex flex-row items-center text-xs pb-5">
            <a className="cursor-pointer" href="/">
              Sistem Interaksi Genap 2022/2023
            </a>
            <ChevronRightIcon />
            <a className="cursor-pointer" href="/">
              Forum Diskusi {breadcrumb.week_name}
            </a>
            <ChevronRightIcon />
            <a className="cursor-pointer" href={`/forum/${pid}`}>
              Thread: {forumData.title}
            </a>
            <ChevronRightIcon />
            <a className="font-bold">Panduan Diskusi</a>
          </div>
          <div className="section">
            <a
              onClick={() => router.back()}
              className="text-xs text-purple cursor-pointer font-bold"
            >
              <ChevronLeftIcon /> Kembali ke Thread
            </a>
            <h1 className="font-bold">Panduan Diskusi</h1>
            <div className="flex flex-row gap-5">
              <div className="flex flex-col basis-2/3 gap-5">
                <p>
                  Halo <strong>{profileData.name}</strong>,
                </p>
                <p className="text-sm">
                  Pada diskusi ini, kamu sebagai peserta diskusi akan melakukan{" "}
                  <strong>4 tahap inquiry</strong> dalam menjawab pertanyaan
                  pemicu diskusi.
                </p>
                <p>
                  Empat tahap tersebut dideskripsikan pada poin berikut ini.
                </p>
                {discussionGuideConstants.map((object, i) => (
                  <div
                    key={i}
                    className="block p-6 bg-white rounded-lg flex flex-row gap-5 test"
                    style={{
                      borderBottom:
                        forumData.state == i + 1
                          ? "5px solid #2ECC71"
                          : null,
                      cursor: !checkboxDisabled(i) ? "pointer" : "auto",
                      boxShadow: !checkboxDisabled(i)
                        ? "0 25px 50px -12px rgb(0 0 0 / 0.25)"
                        : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    }}
                    onClick={
                      !checkboxDisabled(i) ? handleChangeCheckbox : () => {}
                    }
                  >
                    <h1 className="font-bold">{object.id}</h1>
                    <div className="flex flex-col">
                      <p className="font-bold">{object.title}</p>
                      <h1>{isLecturer} </h1>
                      <p
                        dangerouslySetInnerHTML={{ __html: object.description }}
                      ></p>
                      {object.hints != null && (
                        <>
                          <p className="font-bold">Hints</p>
                          <p
                            dangerouslySetInnerHTML={{ __html: object.hints }}
                          ></p>
                        </>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={i + 1 < forumData.state}
                      disabled={checkboxDisabled(i)}
                    />
                  </div>
                ))}
                <p>
                  Bila ada yang dirasa membingungkan, jangan ragu untuk bertanya
                  langsung pada thread diskusi ya :)
                </p>
              </div>
              <div className="basis-1/3">
                <div className="border-dashed border-2 border-grey rounded-lg flex flex-col p-5">
                  <p className="font-bold">
                    Deadline:{" "}
                    <span style={{ color: "#FF5023" }}>{deadline}</span>
                  </p>
                  <p className="font-bold">Deskripsi:</p>
                  <p>{forumData.description}</p>
                  <p className="font-bold">Mekanisme dan Ekspektasi:</p>
                  <p>{forumData.mechanism_expectation}</p>
                </div>
              </div>
            </div>
          </div>
          <DiscussionGuideUpdateConfirmationPopUp
            open={showDiscussionGuideUpdateConfirmationPopUp}
            onClose={handleClosePopUp}
            onYesAction={handleUpdateState}
          />
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