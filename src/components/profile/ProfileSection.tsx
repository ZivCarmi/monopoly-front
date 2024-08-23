import { cn } from "@/utils";

interface ProfileSection extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

const ProfileSection = ({
  title,
  children,
  className,
  ...props
}: ProfileSection) => {
  return (
    <section
      className={cn("bg-card rounded-2xl p-8 mt-16", className)}
      {...props}
    >
      <h2 className="text-card-foreground font-bold leading-4 tracking-wide mb-8">
        {title}
      </h2>
      {children}
    </section>
  );
};

export default ProfileSection;
