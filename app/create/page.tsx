import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CreatePostForm } from "@/components/create-post-form";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingLink } from "@/components/loading-link";

export default async function CreatePostPage() {
  // cuma user yg bisa create post
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6 animate-fade-in">
        <LoadingLink href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </LoadingLink>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Create New Post
          </h1>
          <p className="text-muted-foreground">
            Share your thoughts with the community
          </p>
        </div>

        <CreatePostForm />
      </div>
    </div>
  );
}