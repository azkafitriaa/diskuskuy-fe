import React, { useState, useEffect } from "react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import styles from "@/styles/Forum.module.css";
import DiscussionAnalytics from "@/components/Forum/DiscussionAnalytics";
import DiscussionSummary from "@/components/Forum/DiscussionSummary";
import DiscussionGuide from "@/components/Forum/DiscussionGuide";
import PostComponent from "@/components/Forum/postComponent";
import References from "@/components/Forum/References";
import Onboarding from "@/components/Forum/Onboarding";
import {
  dataObd1,
  dataObd2,
  dataObd3,
  dataObd4,
} from "@/constants/OnboardingConstants";
import {
  fetchThreadDataById,
  fetchReplyDataById,
  fetchSummary,
  fetchNestedReply,
  fetchReferences,
  fetchAnalytics,
  fetchBreadcrumbByThreadId,
  addInitialPostSeen,
} from "@/api/forum-api";
import CircularProgress from "@mui/material/CircularProgress";
import { isObjectEmpty } from "@/utils/util";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { getCookie, getCookies } from "cookies-next";
import Head from "next/head";

export default function Forum() {
  const router = useRouter();
  const { pid } = router.query;

  const [forumData, setForumData] = useState({});
  const [initialPost, setInitialPost] = useState({});
  const [initialSummary, setInitialSummary] = useState({});
  const [initialNested, setInitialNested] = useState([]);
  const [references, setReferences] = useState([]);
  const [onboardingData, setOnboardingData] = useState([]);
  const [isLecturer, setIsLecture] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState("");
  const [seenBy, setIsSeenBy] = useState([]);

  const handleNestedReply = () => {
    router.push("/create-post");
  };

  useEffect(() => {
    const path = location.pathname;
    const pathArray = path.split("/");
    const threadId = pathArray[pathArray.length - 1];

    if (navigator.onLine) {
      console.log("online");
    } else {
      console.log("offline");
    }

    fetchAnalytics(threadId).then((data) => {
      setAnalytics(data);
    });

    setIsLecture(
      getCookie("auth")
        ? JSON.parse(getCookie("auth"))?.role === "lecturer"
        : false
    );

    fetchThreadDataById(threadId).then((data) => {
      setForumData(data);
      addInitialPostSeen(data?.initial_post?.id).then((data) => {
        setShowOnboarding(data?.first ?? true)
        setIsSeenBy(data?.seen)
      });
      setOnboardingData(
        data?.discussion_guide?.state == 1
          ? dataObd1
          : data?.discussion_guide?.state == 2
          ? dataObd2
          : data?.discussion_guide?.state == 3
          ? dataObd3
          : dataObd4
      );
      if (data?.discussion_guide?.state > 4) {
        setShowOnboarding(false);
      }
      setReferences(data?.reference_file ?? []);
      setInitialSummary(data?.summary);

      fetchReplyDataById(data?.initial_post?.id).then((data) => {
        setInitialPost(data);
      });
    });
    fetchNestedReply().then((data) => {
      setInitialNested(data);
    });

    fetchBreadcrumbByThreadId(threadId).then((data) => {
      setBreadcrumb(data);
    });
  }, [pid]);

  return (
    <>
      <Head>
        <title>Thread: {forumData.title}</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.mainContent}>
          {isObjectEmpty(forumData) && (
            <div className="flex flex-row justify-center">
              <CircularProgress color="inherit" />
            </div>
          )}
          {!isObjectEmpty(forumData) && (
            <>
              <div className="flex flex-row items-center text-xs pb-5">
                <a className="cursor-pointer" href="/">
                  Sistem Interaksi Genap 2022/2023
                </a>
                <ChevronRightIcon />
                {/* TODO: replace #{num} pake week keberapa & nama week*/}
                <a className="cursor-pointer" href={"/#" + forumData.week}>
                  Forum Diskusi {breadcrumb.week_name}
                </a>
                <ChevronRightIcon />
                <a className="font-bold">Thread: {forumData.title}</a>
              </div>
              <div className="flex flex-row gap-5">
                <div className="flex flex-col basis-2/3 gap-5">
                  <PostComponent
                    parent
                    parentId={pid}
                    threadTitle={forumData.title}
                    threadGroup={forumData.group_name}
                    post={forumData.initial_post?.post}
                    threadId={forumData?.initial_post?.id}
                    seenBy={seenBy}
                    type="initial"
                  />
                  {initialPost?.reply_post
                    ?.sort((prev, next) => next?.id - prev?.id)
                    .map((object, i) => (
                      <React.Fragment key={i}>
                        <PostComponent
                          post={object.post}
                          parent
                          parentId={object?.id}
                          threadId={pid}
                          type="reply"
                        />

                        {initialNested
                          ?.filter((_res) => _res?.reply_post === object?.id)
                          ?.map((_res, key) => (
                            <PostComponent
                              key={key}
                              post={{ ...object.post, ..._res.post }}
                              parent
                              parentId={_res?.id}
                              type="nestedReply"
                              threadId={pid}
                            />
                          ))}
                      </React.Fragment>
                    ))}
                </div>
                <div className="flex flex-col basis-1/3 gap-5">
                  <DiscussionGuide
                    threadId={pid}
                    deadlineData={forumData.deadline}
                    description={forumData.description}
                    mechAndExp={forumData.mechanism_expectation}
                    onSeeDiscussionGuide={() =>
                      router.push(forumData.id + "/discussion-guide")
                    }
                    showEditButton={isLecturer}
                  />
                  <References
                    references={references}
                    pid={pid}
                    refresh={() => {
                      fetchReferences().then((data) => {
                        setReferences(
                          (data ?? [])?.filter((res) => res.thread == pid)
                        );
                      });
                    }}
                  />
                  <DiscussionAnalytics
                    analytics={analytics}
                    reply={initialPost}
                    nestedReply={initialNested}
                  />
                  <DiscussionSummary
                    content={initialSummary?.content ?? ""}
                    id={initialSummary?.id ?? ""}
                  />
                </div>
              </div>
              {showOnboarding && (
                <Onboarding
                  data={onboardingData}
                  deadline={forumData?.discussion_guide?.deadline}
                />
              )}
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