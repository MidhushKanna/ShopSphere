import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUserProfile } from "../actions/UserAction";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { USER_UPDATE_PROFILE_RESET } from "../constants/UserConstant";
import "../styles/UserProfile.css";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import CheckIcon from "@material-ui/icons/Check";

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const userDetails = useSelector((state) => state.userDetails);
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);

  const { userInfo } = userSignin;
  const { loading, error, user } = userDetails;
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch({
        type: USER_UPDATE_PROFILE_RESET,
      });
      dispatch(detailsUser(userInfo._id));
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, userInfo._id, user]);

  const updateDetails = (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setPassError("Passwords do not match.");
    } else {
      setPassError("");
      dispatch(
        updateUserProfile({
          userId: user._id,
          name,
          email,
          password,
        }),
      );
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card-wrapper">
        <form className="form profile-form" onSubmit={updateDetails}>
          <div className="profile-header-block">
            <div className="profile-avatar-large">
              {name ? name.charAt(0).toUpperCase() : <PersonOutlineIcon />}
            </div>
            <h1>Account Profile</h1>
            <p>Manage your personal information and security credentials</p>
          </div>

          {loading ? (
            <LoadingBox text="Loading profile details..." />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {loadingUpdate && <LoadingBox text="Updating profile..." />}
              {errorUpdate && (
                <MessageBox variant="danger">{errorUpdate}</MessageBox>
              )}
              {passError && <MessageBox variant="danger">{passError}</MessageBox>}
              {successUpdate && (
                <MessageBox variant="success">
                  Profile information updated successfully!
                </MessageBox>
              )}

              <div className="form-ip-sec">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-ip-sec">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-ip-sec">
                <label htmlFor="password">New Password (leave empty to keep current)</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-ip-sec">
                <label htmlFor="confirmpassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmpassword"
                  placeholder="Confirm new password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button className="submit-btn update-profile-btn" type="submit" disabled={loadingUpdate}>
                <CheckIcon fontSize="small" />
                <span>Save Profile Changes</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
