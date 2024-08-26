import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStats from "@/components/profile/UserStats";
import { UserProfile as UserProfileType } from "@/types/Auth";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

type RouteLoaderType = { userProfile: UserProfileType } | null;

export const UserProfilePage = () => {
  const data = useLoaderData() as RouteLoaderType;

  return (
    <Suspense fallback={<p className="text-center">טוען פרופיל משתמש...</p>}>
      <Await
        resolve={data?.userProfile}
        errorElement={<p>Error loading user profile!</p>}
      >
        <ProfileHeader />
        <UserStats />
      </Await>
    </Suspense>
  );
};
