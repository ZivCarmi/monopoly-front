const JailTile = () => {
  return (
    <div className="absolute w-full h-full grid grid-cols-8">
      {[...Array(8)].map((_, idx) => (
        <span className="border-x border-neutral-600" key={idx} />
      ))}
    </div>
  );
};

export default JailTile;
