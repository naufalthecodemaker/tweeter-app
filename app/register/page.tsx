import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Join Tweeter
          </h1>
          <p className="text-muted-foreground">
            Create an account to start sharing your thoughts
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
