const PanelTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="text-center text-pretty text-muted-foreground">
      {children}
    </h2>
  );
};

export default PanelTitle;
