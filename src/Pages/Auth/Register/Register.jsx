import React from "react";
import { useForm } from "react-hook-form";
import regLogo from "../../../assets/image-upload-icon.png";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import { useState } from "react";
import useAxios from "../../../Hooks/useAxios";

const Register = () => {
  const navigate = useNavigate();
  const axiosIns = useAxios();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then(async (res) => {
        console.log(res.user);
        //post user info in database
        const userInfo = {
          email: data.email,
          role: "user",
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };

        const userRes = await axiosIns.post("/users", userInfo);
        console.log(userRes.data);

        //updating firebase info
        const userProfileInfo = {
          displayname: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfileInfo)
          .then(() => {
            console.log("profile updated");
          })
          .catch((err) => {
            console.log(err);
          });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    //upload in imgbb
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_imgbb_key
    }`;
    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };
  console.log(profilePic);

  return (
    <div className="font-inter space-y-4">
      <h1 className="font-extrabold text-4xl">Create an Account</h1>
      <p className="">Register with Profast</p>
      <div className="relative mb-4">
        <img
          src={regLogo}
          alt="Preview"
          className="object-cover cursor-pointer rounded-lg"
          onClick={() => document.getElementById("fileInput").click()}
        />
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <div>
            <label className="font-medium">Name</label>
            <input
              type="name"
              className="input"
              {...register("name", { required: true })}
              placeholder="Name"
            />
          </div>

          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              className="input"
              {...register("email", { required: true })}
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p role="alert" className="text-red-500 mt-1">
                Email is required
              </p>
            )}
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              {...register("password", { required: true, minLength: 6 })}
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p role="alert" className="text-red-500 mt-1">
                Password is required
              </p>
            )}
            {errors.password?.type === "minLength" && (
              <p role="alert" className="text-red-500 mt-1">
                Password must be 6 characters or more
              </p>
            )}
          </div>
          <button className="btn btn-primary text-black mt-4">Register</button>
        </fieldset>
        <p className="my-2">
          Already have an account?{" "}
          <Link to="/login">
            <span className="text-primary">Login</span>
          </Link>
        </p>
      </form>
      <SocialLogin />
    </div>
  );
};

export default Register;
