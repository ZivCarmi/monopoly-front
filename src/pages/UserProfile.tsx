import ProfileHeader from "@/components/profile/ProfileHeader";
import UserNotFound from "@/components/profile/UserNotFound";
import UserStats from "@/components/profile/UserStats";
import { UserProfile as UserProfileType } from "@/types/Auth";
import { useLoaderData } from "react-router-dom";

const UserProfilePage = () => {
  const profile = useLoaderData() as UserProfileType | null;

  if (!profile) {
    return <UserNotFound />;
  }

  return (
    <div>
      <ProfileHeader />
      <UserStats />
    </div>
  );
};

export default UserProfilePage;
