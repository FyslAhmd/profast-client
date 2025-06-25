import React from "react";
import ProFastLogo from "../../Shared/ProFastLogo/ProFastLogo";
import { useForm } from "react-hook-form";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <ProFastLogo />
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            {...register("email")}
            placeholder="Email"
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            {...register("password", { required: true, minLength: 6 })}
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p role="alert" className="text-red-500">
              Password is required
            </p>
          )}
          {errors.password?.type === "minLength" && (
            <p role="alert" className="text-red-500">
              Password must be 6 characters or more
            </p>
          )}

          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
        </fieldset>
        <button className="btn btn-neutral mt-4">Login</button>
      </form>
      <SocialLogin />
    </div>
  );
};

export default Login;
