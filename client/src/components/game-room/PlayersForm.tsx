import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { selectPlayers } from "@/slices/game-slice";
import { Characters, Colors, NewPlayer } from "@backend/types/Player";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogContentRelatived,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Username is required",
    })
    .min(2, {
      message: "Username must contain at least 2 characters",
    })
    .max(30, {
      message: "Username must contain at most 30 characters",
    }),
  character: z.nativeEnum(Characters),
  color: z.nativeEnum(Colors),
});

export function PlayersForm() {
  const socket = useSocket();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      character: undefined,
      color: undefined,
    },
  });
  const characterWatch = form.watch("character");
  const colorWatch = form.watch("color");
  const players = useAppSelector(selectPlayers);

  const submitHandler = async (player: z.infer<typeof formSchema>) => {
    const existUsername = players.find(
      (existPlayer) => existPlayer.name === player.name
    );

    if (existUsername) {
      return form.setError("name", {
        message: "Name is already taken, please choose another one",
      });
    }

    const newPlayer: NewPlayer = {
      id: socket.id,
      ...player,
    };

    socket.emit("create_player", { player: newPlayer });
  };

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContentRelatived className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>צור שחקן</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="character"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>דמות</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(e: Characters) => field.onChange(e)}
                      className="grid-cols-3 gap-4"
                    >
                      {Object.keys(Characters).map((char) => {
                        const charLower = char.toLowerCase();
                        const takenChar = players.find(
                          ({ character }) => character === charLower
                        );

                        return (
                          !takenChar && (
                            <FormItem key={char}>
                              <FormControl>
                                <RadioGroupItem
                                  value={charLower}
                                  className="hidden"
                                />
                              </FormControl>
                              <FormLabel className="block text-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <img
                                        src={`/${charLower}.png`}
                                        width={140}
                                        className={
                                          characterWatch === charLower
                                            ? "opacity-100"
                                            : "opacity-40"
                                        }
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>{char}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                            </FormItem>
                          )
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>בחר צבע</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(e: Colors) => field.onChange(e)}
                      className="flex flex-wrap justify-center gap-4"
                    >
                      {Object.keys(Colors).map((color) => {
                        const colorLower = color.toLowerCase();
                        const takenColor = players.find(
                          ({ color }) => color === colorLower
                        );

                        return (
                          !takenColor && (
                            <FormItem key={color}>
                              <FormControl>
                                <RadioGroupItem
                                  value={colorLower}
                                  className="hidden"
                                />
                              </FormControl>
                              <FormLabel
                                className={`w-8 h-8 block rounded-full cursor-pointer ease-in-out duration-75 ${
                                  colorWatch === colorLower
                                    ? "outline outline-offset-2 outline-2"
                                    : ""
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            </FormItem>
                          )
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className="sm:flex-col sm:space-x-0 space-y-2">
              <Button type="submit" variant="secondary" className="w-full">
                הכנס למשחק
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContentRelatived>
    </AlertDialog>
  );
}

export default PlayersForm;
