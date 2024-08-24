import { BASE_URL } from "@/api/config";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setNickname } from "@/slices/user-slice";
import { UserProfile } from "@/types/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { NicknameSchema } from "@ziv-carmi/monopoly-utils";
import { Check, Pencil, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField } from "../ui/form";
import Icon from "../ui/icon";
import { Input } from "../ui/input";
import Loader from "../ui/loader";
import Overlay from "../ui/overlay";

const EditNameDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogClose />
          <EditNameForm closeDialog={setIsOpen} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

type FormData = z.infer<typeof NicknameSchema>;

type EditNameFormProps = {
  closeDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditNameForm = ({ closeDialog }: EditNameFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user_id } = useLoaderData() as UserProfile;
  const { nickname } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const form = useForm<FormData>({
    resolver: zodResolver(NicknameSchema),
    defaultValues: { nickname },
  });

  const updateName = async (name: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/user/${user_id}/update-name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update user name");
      }

      const updatedName: string = await response.json();

      dispatch(setNickname(updatedName));
      closeDialog((open) => !open);
    } catch (error) {
      console.error("Failed to update user name:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitHandler = async ({ nickname: name }: FormData) => {
    if (nickname === name) return;
    updateName(name);
  };

  return (
    <Form {...form}>
      <form
        className="relative grid justify-items-center items-center gap-4"
        onSubmit={form.handleSubmit(submitHandler)}
      >
        <DialogTitle className="text-center text-card-foreground mb-4">
          שנה שם
        </DialogTitle>
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormControl>
              <Input
                {...field}
                placeholder="הכינוי שלך..."
                className="w-fit [unicode-bidi:plaintext]"
                maxLength={30}
                autoFocus
              />
            </FormControl>
          )}
        />
        <DialogDescription className="max-w-64 text-center text-balance text-xs mb-4">
          כך יראו אותך שחקנים אחרים, שמור על שם ייחודי וידידותי
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => updateName("")}
            disabled={isLoading}
          >
            <Icon icon={RotateCcw} />
            אפס לברירת מחדל
          </Button>
          <Button variant="primaryFancy" type="submit" disabled={isLoading}>
            <Icon icon={Check} />
            שמור שינויים
          </Button>
        </DialogFooter>
        {isLoading && (
          <>
            <Overlay className="backdrop-blur-0" />
            <Loader className="absolute z-50" />
          </>
        )}
      </form>
    </Form>
  );
};

export default EditNameDialog;
