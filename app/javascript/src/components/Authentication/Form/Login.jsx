import React from "react";

import { Link } from "react-router-dom";

import Button from "components/Button";
import Input from "components/Input";

const Login = ({ handleSubmit, setEmail, setPassword, loading }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div className="w-full max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold leading-9 text-bb-gray-700">
        Sign In
      </h2>
      <div className="text-center">
        <Link
          className="focus:outline-none mt-2 text-sm font-medium text-bb-purple transition duration-150 ease-in-out focus:underline"
          data-testid="login-register-link"
          to="/signup"
        >
          Or Register Now
        </Link>
      </div>
      <form className="mt-8" onSubmit={handleSubmit}>
        <Input
          dataTestId="login-email-field"
          label="Email"
          placeholder="oliver@example.com"
          type="email"
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          dataTestId="login-password-field"
          label="Password"
          placeholder="********"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          buttonText="Sign In"
          dataTestId="login-submit-button"
          loading={loading}
          type="submit"
        />
      </form>
    </div>
  </div>
);

export default Login;
