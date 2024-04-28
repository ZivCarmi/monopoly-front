import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useUpdateNickname from "@/hooks/useUpdateNickname";
import { setNickname } from "@/slices/user-slice";
import { PLAYER_NAME_STORAGE_KEY } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { NicknameSchema } from "@ziv-carmi/monopoly-utils";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import Loader from "../ui/loader";

const NicknameForm = () => {
  const { nickname } = useAppSelector((state) => state.user);
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const updateNickname = useUpdateNickname();
  const form = useForm<z.infer<typeof NicknameSchema>>({
    resolver: zodResolver(NicknameSchema),
    defaultValues: {
      nickname,
    },
  });
  const watchedNickname = form.watch("nickname");

  const submitHandler = (nickname: z.infer<typeof NicknameSchema>) => {
    updateNickname(nickname);
    form.setValue("nickname", nickname.nickname);
  };

  const onNicknameSelected = (nickname: string) => {
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, nickname);
    form.setValue("nickname", nickname);
    dispatch(setNickname(nickname));
  };

  useEffect(() => {
    const STORAGED_NAME = localStorage.getItem(PLAYER_NAME_STORAGE_KEY);

    if (STORAGED_NAME?.trim()) {
      form.setValue("nickname", STORAGED_NAME);
    }

    socket.on("nickname_selected", onNicknameSelected);

    return () => {
      socket.off("nickname_selected", onNicknameSelected);
    };
  }, []);

  return (
    <>
      {form.formState.isSubmitting && (
        <div className="fixed inset-1/2">
          <Loader />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="relative w-fit m-auto flex items-center justify-center gap-2"
        >
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="הכינוי שלך..."
                    maxLength={30}
                  />
                </FormControl>
                <FormMessage className="absolute [bottom:calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-full text-center" />
              </FormItem>
            )}
          />
          {watchedNickname !== nickname && form.formState.isValid && (
            <button className="absolute h-8 top-1 left-1 duration-200 z-10 p-2 bg-background">
              <CheckCircle className="w-5 h-5 hover:text-green-500 duration-200" />
            </button>
          )}
        </form>
      </Form>
    </>
  );
};

export default NicknameForm;
