import { Form, Field, type FormInstance, type FieldInstance } from "houseform";
import { type RouterOutputs } from "../../utils/api";
import { z } from "zod";
import ImageSelectDialog from "./dialogs/ImageSelectDialog";
import { CldImage } from "next-cloudinary";
import { env } from "../../env/client.mjs";
import { type ForwardedRef, forwardRef, useRef } from "react";

export type FormData = {
  id: string;
  name: string;
  email: string;
  avatarImage: string | undefined;
};

type Props = {
  user: RouterOutputs["user"]["getSelf"];
  handleSubmit: (formData: FormData) => void;
};

export const UserProfile = forwardRef(function UserProfile(
  { user, handleSubmit }: Props,
  formRef: ForwardedRef<FormInstance>
) {
  const avatarImageRef = useRef<FieldInstance>(null);
  const handleImageChange = (value: string, _position: string) => {
    avatarImageRef.current?.setValue(value);
  };

  return (
    <div>
      <div className="mx-auto flex h-full w-full flex-wrap justify-evenly justify-items-stretch gap-4">
        <Form
          onSubmit={(values) =>
            handleSubmit({ ...values, id: user.id } as FormData)
          }
          ref={formRef}
        >
          {({ submit, errors }) => (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col">
                <Field<string>
                  name="name"
                  initialValue={user.name}
                  onChangeValidate={z
                    .string()
                    .min(1, { message: "Required" })
                    .max(50, { message: "Max 50 characters" })
                    .regex(/^[a-zA-Z0-9 ']*$/, {
                      message: "Only letters, numbers and spaces",
                    })}
                >
                  {({ value, setValue, isDirty, errors }) => (
                    <div className="mx-auto flex w-52 flex-col">
                      <label
                        className={`font-bold tracking-wide text-sm 
                              ${(errors.length > 0 && "!text-error") || ""}
                              
                              ${(isDirty && "text-success") || ""} 
                            }`}
                      >
                        Name
                      </label>
                      <input
                        className={`input-bordered input ${
                          (isDirty && "input-success") || ""
                        } ${(errors.length > 0 && "input-error") || ""}`}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      {errors.length > 0 &&
                        errors.map((error) => (
                          <span key={error} className="text-error text-xs">
                            {error}
                          </span>
                        ))}
                    </div>
                  )}
                </Field>
                <Field<string>
                  name="email"
                  initialValue={user.email}
                  onChangeValidate={z
                    .string()
                    .min(1, { message: "Required" })
                    .max(50, { message: "Max 50 characters" })
                    .email({ message: "Invalid email" })}
                >
                  {({ value, setValue, isDirty, errors }) => (
                    <div className="mx-auto flex w-52 flex-col">
                      <label
                        className={`font-bold tracking-wide text-sm 
                              ${(errors.length > 0 && "!text-error") || ""}
                              
                              ${(isDirty && "text-success") || ""} 
                            }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className={`input-bordered input ${
                          (isDirty && "input-success") || ""
                        } ${(errors.length > 0 && "input-error") || ""}`}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      {errors.length > 0 &&
                        errors.map((error) => (
                          <span key={error} className="text-error text-xs">
                            {error}
                          </span>
                        ))}
                    </div>
                  )}
                </Field>
              </div>

              <Field<string>
                initialValue={user.avatarImage.public_id}
                name="avatarImage"
                ref={avatarImageRef}
              >
                {({ value, isDirty }) => (
                  <div className="flex flex-col">
                    <label
                      className={`font-bold tracking-wide text-sm ${
                        (isDirty && "text-success") || ""
                      }`}
                    >
                      Avatar Image
                    </label>
                    <ImageSelectDialog
                      position="avatar"
                      handleImageChange={handleImageChange}
                    >
                      <button
                        className={`btn btn-outline btn-square h-fit w-fit p-6 ${
                          (isDirty && "btn-success") || ""
                        }`}
                      >
                        <div className="overflow-hidden rounded-xl">
                          {value ? (
                            <CldImage
                              src={
                                env.NEXT_PUBLIC_CLOUDINARY_FOLDER + "/" + value
                              }
                              alt="Avatar Image"
                              width={158}
                              height={158}
                              className="rounded-xl object-center transition-all hover:scale-110"
                              crop="thumb"
                              gravity="face"
                              placeholder="empty"
                            />
                          ) : (
                            <div className="flex h-40 w-40 flex-col place-content-center rounded-xl bg-base-300 text-center">
                              None Selected
                            </div>
                          )}
                        </div>
                      </button>
                    </ImageSelectDialog>
                  </div>
                )}
              </Field>

              <div className="col-span-full mb-8">
                <button
                  onClick={submit}
                  className={`btn btn-success btn-block ${
                    (errors.length > 0 && "btn-disabled") || ""
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
});

export default UserProfile;
