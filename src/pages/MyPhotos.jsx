import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import "../styleSheets/myPhotos.css";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

const MyPhotos = () => {

    const PHOTO_SLOTS = ["updatePhoto", "updatePhoto1", "updatePhoto2", "updatePhoto3", "updatePhoto4",];
    const { id, myProfile, role } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMyProfile(id));
    }, [id, dispatch]);

    const handlePhotoUpload = async (slot, file) => {
        if (!file || !id) return;

        if (file.size > 20 * 1024) {
            toast.error("Image must be under 20 KB");
            return;
        }

        console.log("slot: ", slot);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.put(`/profile-photos/${slot}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Photo uploaded successfull");
            dispatch(fetchMyProfile(id));
        } catch (err) {
            console.error("Upload failed:", err);
            toast.error("Photo uploaded failed");
        }
    };

    const handleDeletePhoto = async (slot) => {
        try {
            await api.delete(`/profile-photos/${slot}/${id}`);
            dispatch(fetchMyProfile(id));
            toast.success("Photo deleted successfull");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Photo deleted failed");
        }
    };
    console.log("profile: ", myProfile);

    return (
        <div className="myPhotos">
            <h2 className="photo-header">Photos</h2>
            <b>Kindly make sure the image is under 20 KB</b>

            <div className="photo-grid">
                {PHOTO_SLOTS.map((slot, index) => {
                    const photo = myProfile?.[slot];

                    return (
                        <div key={slot} className="photo-box">
                            {photo ? (
                                <>
                                    <img
                                        src={photo}
                                        alt={`photo-${index}`}
                                        draggable={false}
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeletePhoto(slot)}
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="upload-label"
                                        onClick={() =>
                                            document.getElementById(`upload-${slot}`).click()
                                        }
                                    >
                                        +
                                    </button>

                                    <input
                                        id={`upload-${slot}`}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) handlePhotoUpload(slot, file);
                                            e.target.value = ""; // allow reselect same image
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
};

export default MyPhotos;