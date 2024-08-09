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
import { setNickname } from "@/slices/user-slice";
import { getAllColors, getAvailableRandomColor, isColorTaken } from "@/utils";
import { PLAYER_NAME_STORAGE_KEY } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors, PlayerSchema } from "@ziv-carmi/monopoly-utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import PlayerCharacter, {
  PlayerCharacterProps,
} from "../player/PlayerCharacter";
import { Input } from "../ui/input";
import Modal from "../ui/modal";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const PlayersForm = () => {
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

  const submitHandler = (player: z.infer<typeof PlayerSchema>) => {
    socket.emit("create_player", player);
    dispatch(setNickname(player.name));
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, player.name);
  };

  useEffect(() => {
    setTimeout(() => {
      form.setValue("color", getAvailableRandomColor(), {
        shouldValidate: true,
      });
    }, 0);
  }, []);

  return (
    <Modal
      key="players-form"
      data-testid="players-form"
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
                      data-testid="nick-input"
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
                    {getAllColors().map((color) => {
                      const takenColor = isColorTaken(color);

                      return (
                        <FormItem key={color}>
                          <FormControl>
                            <RadioGroupItem
                              disabled={takenColor}
                              value={color}
                              className="hidden"
                              checked={colorWatch === color}
                            />
                          </FormControl>
                          <FormLabel data-testid="character-select">
                            <CharacterSelection
                              size={1.75}
                              color={color}
                              isDisabled={takenColor}
                              isSelected={colorWatch === color}
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
            <Button
              data-testid="enter-game-btn"
              type="submit"
              variant="primaryFancy"
            >
              הכנס למשחק
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

type CharacterSelectionProps = {
  isDisabled: boolean;
  isSelected?: boolean;
} & PlayerCharacterProps;

export const CharacterSelection = ({
  color,
  isDisabled,
  isSelected,
  ...props
}: CharacterSelectionProps) => {
  const [hoveredChar, setHoveredChar] = useState("");
  isSelected = isSelected || hoveredChar === color;

  return (
    <PlayerCharacter
      className={
        isDisabled ? "opacity-25 cursor-not-allowed" : "cursor-pointer"
      }
      color={color}
      onMouseEnter={() => setHoveredChar(color)}
      onMouseLeave={() => setHoveredChar("")}
      style={{
        filter: isSelected ? `drop-shadow(0px 0px 16px ${color})` : undefined,
      }}
      {...props}
    />
  );
};

export default PlayersForm;
