import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CoverImage from "./CoverImage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/db/prisma";
import { getUserProfileAction } from "@/app/update-profile/actions";

const UserProfile = async () => {
  const currentUser = await getUserProfileAction();

  if (!currentUser) {
    return <p>No user found</p>;
  }

  return (
    <div className="flex flex-col">
      <CoverImage adminName={currentUser.name || "User"} />

      <div className="flex flex-col p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Avatar className="w-20 h-20 border-2 -mt-10">
            <AvatarImage
              src={currentUser.image || "/user-placeholder.png"}
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex">
            {!currentUser.isSubscribed && (
              <Button asChild className="rounded-full flex gap-10">
                <Link href={"/pricing"}>
                  <span className="uppercase font-semibold tracking-wide">
                    Subscribe
                  </span>
                </Link>
              </Button>
            )}

            {currentUser.isSubscribed && (
              <Button className="rounded-full flex gap-10" variant={"outline"}>
                <span className="uppercase font-semibold tracking-wide">
                  Subscribed
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <p className="text-lg font-semibold">{currentUser.name}</p>
          <p className="text-sm mt-2 md:text-md">
            Discover daily tips and tricks for horse health and care, along with insights into my personal routine with my horses. Subscribe now to gain access to exclusive content and become part of the community.
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="h-2 w-full bg-muted" />
    </div>
  );
};

export default UserProfile;
