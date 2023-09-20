import { fetchProfileData } from "@/api/auth-api";
import { useEffect, useState } from "react";
import {
  deleteCookie, getCookie, setCookies,
} from 'cookies-next'
import { useRouter } from "next/router";
import firebase from "@/utils/firebase";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Profile() {
  const router = useRouter()
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    fetchProfileData().then((data) => setProfileData(data));
  }, []);

  const handleEditProfilePhoto = () => {
    
  }

  return (
    <div
      className="profileSection"
    >
      <div className="flex flex-row items-center gap-2">
        <a
          onClick={() => {}}
          className="cursor-pointer h-16 w-16 relative"
        >
          <img src={JSON.parse(getCookie("auth"))?.photo_url ? JSON.parse(getCookie("auth"))?.photo_url : "/images/default-prof-pic.png"} alt="prof-pic" className="rounded-full object-cover h-16 w-16"
          />
          <img
            src="/images/edit-profile-pic.png"
            alt="edit-profile-picture"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "20px",
            }}
          />
        </a>
        <div className="flex flex-col">
          <p className="font-bold text-lg">{profileData.name}</p>
          <p className="text-xs">{profileData.nim}</p>
          <a className="text-xs text-blue cursor-pointer mt-2"
          onClick={() => {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/png, image/jpeg, image/jpg ")

            input.onchange = function () {
              var file = this.files[0];
              const upload = firebase
              .storage()
              .ref(`/photo_profile/${JSON.parse(getCookie("auth"))?.user_id}/`)
              .child(file.name)
              .put(file)

              upload.then(() => {
                upload.snapshot.ref.getDownloadURL().then((url) => {
                  axios.put(`${process.env.NEXT_PUBLIC_BE_URL}/auth/profile/`, {
                    photo_url: url,
                  }, {headers: {
                    "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
                  }},
                  ).then(() => {
                    // localStorage.setItem('photoUrl', url)
                    const oldAuthCookies = JSON.parse(getCookie("auth"))
                    oldAuthCookies.photo_url = url
                    setCookies("auth", JSON.stringify(oldAuthCookies));
                    toast.success("Berhasil mengubah foto profil")
                    window.location.reload()
                  })
                })
                })
              
            };
            input.click();
          }}>
            Ubah foto profil
          </a>
        </div>
      </div>
      <div className="h-[0.5px] bg-grey"></div>
      <a onClick={() => {
        deleteCookie('auth');
        // localStorage.removeItem('token');
        // localStorage.removeItem('userId');
        // localStorage.removeItem('role');
        // localStorage.removeItem('photoUrl');
        router.replace("/login");
      }} className="text-xs cursor-pointer">
        Logout
      </a>
    </div>
  );
}
