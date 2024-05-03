import { useAppDispatch, useAppSelector } from "@/app/hooks";
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
import { selectPlayers } from "@/slices/game-slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors, PlayerSchema } from "@ziv-carmi/monopoly-utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import PlayerCharacter from "../player/PlayerCharacter";
import Modal from "../ui/modal";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { PLAYER_NAME_STORAGE_KEY } from "@/utils/constants";
import { setNickname } from "@/slices/user-slice";

const PlayersForm = () => {
  const [hoveredChar, setHoveredChar] = useState("");
  const socket = useSocket();
  const { nickname } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof PlayerSchema>>({
    resolver: zodResolver(PlayerSchema),
    defaultValues: {
      name: nickname || "",
      color: undefined,
    },
  });
  const colorWatch = form.watch("color");
  const players = useAppSelector(selectPlayers);

  const submitHandler = (player: z.infer<typeof PlayerSchema>) => {
    socket.emit("create_player", player);
    dispatch(setNickname(player.name));
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, player.name);
  };

  useEffect(() => {
    const getAvailableColors = () => {
      const colors = Object.keys(Colors);
      const takenColors = players.map(({ color }) => color.toLowerCase());
      const availableColors: string[] = [];

      colors.forEach((color) => {
        const colorLower = color.toLowerCase();
        if (!takenColors.includes(colorLower)) {
          availableColors.push(colorLower);
        }
      });

      return availableColors;
    };

    const colors = getAvailableColors();
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    form.setValue("color", randomColor as Colors);
  }, []);

  return (
    <Modal className="grid w-full max-w-lg gap-4 border p-6 shadow-lg rounded-lg md:w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">
          {!nickname && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="הכינוי שלך..."
                      maxLength={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormLabel className="text-muted-foreground">
                  בחר שחקן
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(e: Colors) => field.onChange(e)}
                    className="max-w-60 w-full m-auto flex flex-wrap justify-center gap-10"
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
                            <FormLabel>
                              <PlayerCharacter
                                className="cursor-pointer"
                                color={color as Colors}
                                size={1.75}
                                showHalo={
                                  colorWatch === colorLower ||
                                  hoveredChar === colorLower
                                }
                                onMouseEnter={() => setHoveredChar(colorLower)}
                                onMouseLeave={() => setHoveredChar("")}
                              />
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
          <div className="flex items-center justify-center">
            <Button type="submit" variant="primaryFancy">
              הכנס למשחק
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default PlayersForm;
