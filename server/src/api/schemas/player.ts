import { z } from "zod";
import { Characters, Colors, NewPlayer } from "../types/Player";

export const playerSchema: z.ZodType<NewPlayer> = z.object({
  name: z
    .string({
      required_error: "שם הוא שדה חובה",
    })
    .min(2, {
      message: "שם חייב להיות לפחות 2 תווים",
    })
    .max(30, {
      message: "שם יכול להכיל עד 30 תווים",
    }),
  character: z.nativeEnum(Characters),
  color: z.nativeEnum(Colors),
});
