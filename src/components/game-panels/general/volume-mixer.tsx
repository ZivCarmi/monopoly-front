import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setVolume } from "@/slices/ui-slice";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SOUND_VOLUME_STORAGE_KEY } from "@/utils/constants";

const VolumeMixer = () => {
  const { volume } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const toggleMuteHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const volumeValue = volume > 0 ? 0 : 1;

    localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, `${volumeValue}`);
    dispatch(setVolume(volumeValue));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleMuteHandler}>
            {volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : volume < 0.51 ? (
              <Volume1 className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
            <span className="sr-only">שינוי עוצמת קול</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="w-52 py-4 px-6 flex items-center gap-2 rounded-full ltr"
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <VolumeSlider volume={volume} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const VolumeSlider = ({ volume }: { volume: number }) => {
  const dispatch = useAppDispatch();

  const volumeChangeHandler = useCallback((volume: number[]) => {
    localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, `${volume[0]}`);
    dispatch(setVolume(volume[0]));
  }, []);

  return (
    <>
      <Slider
        className="w-3/4"
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={volumeChangeHandler}
      />
      <span className="text-sm w-1/4 text-end">
        {Math.trunc(volume * 100)}%
      </span>
    </>
  );
};

export default VolumeMixer;
