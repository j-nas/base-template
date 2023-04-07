import Logo from "@/Logo";
import { Form, Field } from "houseform";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../LoadingSpinner";

export default function Login() {
  const [success, setSuccess] = useState(false);
  const { status } = useSession();

  if (status === "loading")
    return (
      <div className="flex h-screen flex-col place-items-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="flex h-screen  flex-col ">
      <Logo className="mx-auto w-72   fill-base-content stroke-base-content" />
      {!success ? (
        <>
          <div className="">
            <Form
              onSubmit={(values) =>
                signIn("email", {
                  email: values.email as string,
                  redirect: false,
                }).then((res) => {
                  if (res && res.ok) {
                    setSuccess(true);
                  }
                })
              }
            >
              {({ errors, submit }) => (
                <div className="form-control place-items-center gap-4 place-self-center">
                  <Field<string>
                    name="email"
                    onChangeValidate={z
                      .string()
                      .min(1, "Cannot be blank")
                      .email("Please enter a valid email")}
                  >
                    {({ value, setValue, onBlur }) => (
                      <div className="flex flex-col">
                        <label className={`font-bold tracking-wide text-sm `}>
                          Email
                        </label>
                        <input
                          value={value}
                          type="email"
                          autoComplete="off"
                          className="input-primary input"
                          onBlur={onBlur}
                          onChange={(e) => setValue(e.target.value)}
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              void submit();
                            }
                          }}
                        ></input>
                      </div>
                    )}
                  </Field>
                  <button
                    type="submit"
                    className={`btn ${
                      errors.length > 0
                        ? "btn-disabled btn-error"
                        : "btn-primary"
                    }`}
                    onClick={submit}
                  >
                    Login with email
                  </button>
                  {errors.map((e) => (
                    <div key={e} className="text-error">
                      {e}
                    </div>
                  ))}
                </div>
              )}
            </Form>
          </div>
          <span className="mt-32 place-self-center text-center">
            <p>Trouble logging in?</p>
            <a className="link" href="mailto://support@shorecel.com">
              Email support
            </a>
          </span>
        </>
      ) : (
        <div className="flex flex-col place-items-center gap-4 place-self-center">
          <h1 className="font-bold text-2xl">Check your email</h1>
          <p className="text-center">
            We&apos;ve sent you a link to log in to your account. If you
            don&apos;t see it, check your spam folder.
          </p>
        </div>
      )}
    </div>
  );
}
