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
import { playerSchema, Characters, Colors } from "@ziv-carmi/monopoly-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function PlayersForm() {
  const socket = useSocket();
  const form = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      character: undefined,
      color: undefined,
    },
  });
  const characterWatch = form.watch("character");
  const colorWatch = form.watch("color");
  const players = useAppSelector(selectPlayers);

  const submitHandler = (player: z.infer<typeof playerSchema>) => {
    socket.emit("create_player", player);
  };

  return (
    <>
      <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <div className="rtl absolute left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border  p-6 shadow-lg duration-200 rounded-lg md:w-full">
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
                                <TooltipProvider delayDuration={0}>
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
            <div className="flex items-center justify-center">
              <Button type="submit" variant="primaryFancy">
                הכנס למשחק
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

export default PlayersForm;
