import { useSocket } from "@/app/socket-context";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CallbackResponseData } from "@/types/Socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatMessageSchema } from "@ziv-carmi/monopoly-utils";
import { Send } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SendMessageResponseData = CallbackResponseData &
  (
    | {
        success: true;
        lastMessageTime: number;
      }
    | {
        success: false;
      }
  );

const ChatMessageForm = () => {
  const lastMessageTimeRef = useRef<number | null>(null);
  const socket = useSocket();
  const form = useForm<z.infer<typeof ChatMessageSchema>>({
    resolver: zodResolver(ChatMessageSchema),
    defaultValues: {
      text: "",
    },
  });
  const { toast } = useToast();

  const submitHandler = (text: z.infer<typeof ChatMessageSchema>) => {
    const now = new Date().getTime();
    const { current } = lastMessageTimeRef;
    const toastMessage = () =>
      toast({
        variant: "destructive",
        title: "יש לחכות מעט בין שליחת הודעות",
        duration: 2500,
      });

    if (!current || now - current >= 1000) {
      return socket.emit(
        "send_message",
        text,
        (response: SendMessageResponseData) => {
          console.log(response);

          if (!response.success) {
            return toastMessage();
          }

          lastMessageTimeRef.current = response.lastMessageTime;
          form.resetField("text");
          form.setFocus("text");
        }
      );
    }

    toastMessage();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="w-full flex gap-4"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl>
                <Input
                  {...field}
                  autoFocus={true}
                  className="border-none rounded-full"
                  placeholder="ההודעה שלך..."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-center">
          <Button
            size="icon"
            variant="outline"
            className="border-none rounded-full"
            disabled={!form.getValues("text")}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChatMessageForm;
