import { useAppDispatch } from "@/app/hooks";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { setNickname } from "@/slices/user-slice";
import { getMaxLengthForPropertyInSchema } from "@/utils";
import { PLAYER_NAME_STORAGE_KEY } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { NicknameSchema } from "@ziv-carmi/monopoly-utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";

type FormData = z.infer<typeof NicknameSchema>;

const NicknameForm = () => {
  const STORAGED_NAME = localStorage.getItem(PLAYER_NAME_STORAGE_KEY);
  const dispatch = useAppDispatch();
  const form = useForm<FormData>({
    resolver: zodResolver(NicknameSchema),
    defaultValues: { nickname: STORAGED_NAME || "" },
  });

  const submitHandler = ({ nickname }: FormData) => {
    dispatch(setNickname(nickname));
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, nickname);
  };

  useEffect(() => {
    const validateForm = async () => {
      await form.trigger("nickname", { shouldFocus: true });

      const { error } = form.getFieldState("nickname");

      // trimming the nickname to match the max length of the schema
      if (error && error.type === "too_big") {
        const maxLength = getMaxLengthForPropertyInSchema(
          NicknameSchema,
          "nickname"
        );
        const trimmedNickname = form
          .getValues("nickname")
          .substring(0, maxLength);

        form.setValue("nickname", trimmedNickname);
        localStorage.setItem(PLAYER_NAME_STORAGE_KEY, trimmedNickname);
      }
    };

    validateForm();
  }, []);

  useEffect(() => {
    const subscription = form.watch(() => form.handleSubmit(submitHandler)());
    return () => subscription.unsubscribe();
  }, [form.handleSubmit, form.watch]);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative m-auto flex items-center justify-center"
      >
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormControl>
              <Input
                {...field}
                placeholder="הכינוי שלך..."
                className="[unicode-bidi:plaintext]"
                maxLength={30}
              />
            </FormControl>
          )}
        />
      </form>
    </Form>
  );
};

export default NicknameForm;
