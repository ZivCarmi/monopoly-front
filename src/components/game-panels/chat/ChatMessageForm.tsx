import { useSocket } from "@/app/socket-context";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatMessageSchema } from "@ziv-carmi/monopoly-utils";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ChatMessageForm = () => {
  const socket = useSocket();
  const form = useForm<z.infer<typeof ChatMessageSchema>>({
    resolver: zodResolver(ChatMessageSchema),
    defaultValues: {
      text: "",
    },
  });

  const submitHandler = (text: z.infer<typeof ChatMessageSchema>) => {
    socket.emit("send_message", text);
    form.resetField("text");
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
                  className="rounded-full"
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
            className="rounded-full"
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
