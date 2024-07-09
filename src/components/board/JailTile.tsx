import TileName from "./TileName";

const JailTile = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="grow flex items-center justify-center">
        <TileName className="text-muted-foreground">ביקורים</TileName>
      </div>
      <div className="relative z-10 basis-[60%] w-[75%] rounded-bl-md rounded-tr-md border-t-2 border-r-2 border-neutral-500">
        <div className="w-full h-full grid grid-cols-6">
          {[...Array(6)].map((_, idx) => (
            <span key={idx} className="border-l-2 border-neutral-500" />
          ))}
        </div>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <TileName>כלא</TileName>
        </span>
      </div>
    </div>
  );
};

export default JailTile;
