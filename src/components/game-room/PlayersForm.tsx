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
        if (!takenColors.includes(color)) {
          availableColors.push(color);
        }
      });

      return availableColors;
    };

    const colors = getAvailableColors();
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    form.setValue("color", randomColor as Colors);
  }, []);

  return (
    <Modal
      key="players-form"
      className="grid w-full max-w-lg gap-4 p-6 shadow-lg rounded-lg md:w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="max-w-60 w-full m-auto space-y-8"
        >
          {!nickname && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-4">
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
              <FormItem className="space-y-8">
                <FormLabel className="text-lg">בחר את נראות השחקן:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(e: Colors) => field.onChange(e)}
                    className="flex flex-wrap justify-center gap-10"
                  >
                    {Object.values(Colors).map((_color) => {
                      const takenColor = players.find(
                        ({ color }) => color === _color
                      );
                      const isSelected =
                        colorWatch === _color || hoveredChar === _color;

                      return (
                        <FormItem key={_color}>
                          <FormControl>
                            <RadioGroupItem
                              disabled={!!takenColor}
                              value={_color}
                              className="hidden"
                            />
                          </FormControl>
                          <FormLabel>
                            <PlayerCharacter
                              className={
                                !!takenColor
                                  ? "opacity-25 cursor-not-allowed"
                                  : "cursor-pointer"
                              }
                              color={_color as Colors}
                              size={1.75}
                              onMouseEnter={() => setHoveredChar(_color)}
                              onMouseLeave={() => setHoveredChar("")}
                              style={{
                                filter: isSelected
                                  ? `drop-shadow(0px 0px 16px ${_color})`
                                  : undefined,
                              }}
                            />
                          </FormLabel>
                        </FormItem>
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
