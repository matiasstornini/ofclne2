import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CoverImage from "./CoverImage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserProfileProps } from "@/types";

interface UserProfilePropsWithOwnership extends UserProfileProps {
  isOwner: boolean;
}

const UserProfile = ({ user, isOwner }: UserProfilePropsWithOwnership) => {
  if (!user) {
    return <p>No user found</p>;
  }

  return (
    <div className="flex flex-col">
      <CoverImage adminName={user.name || "User"} />

      <div className="flex flex-col p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Avatar className="w-20 h-20 border-2 -mt-10">
            <AvatarImage
              src={user.image || "/user-placeholder.png"}
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex">
            {isOwner ? (
              <Button asChild className="rounded-full flex gap-10">
                <Link href="/update-profile">
                  <span className="uppercase font-semibold tracking-wide">
                    Edit Profile
                  </span>
                </Link>
              </Button>
            ) : (
              <>
                {!user.isSubscribed && (
                  <Button asChild className="rounded-full flex gap-10">
                    <Link href="/pricing">
                      <span className="uppercase font-semibold tracking-wide">
                        Subscribe!
                      </span>
                    </Link>
                  </Button>
                )}

                {user.isSubscribed && (
                  <Button className="rounded-full flex gap-10" variant="outline">
                    <span className="uppercase font-semibold tracking-wide">
                      Subscribed
                    </span>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm mt-2 md:text-md">
            {user.description || "No description available"}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="h-2 w-full bg-muted" />
    </div>
  );
};

export default UserProfile;
