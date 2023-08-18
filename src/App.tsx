import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useZodForm } from "@/lib/zod-form";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./components/ui/form";
import { cn } from "./lib/utils";
import { Input } from "./components/ui/input";
import { useState } from "react";

export function App() {
  const [showDialog, setShowDialog] = useState(false);

  const form = useZodForm({
    schema: z.object({
      email: z.string().email(),
      twitter: z.string().optional(),
      description: z.string().max(200).optional(),
      repository: z
        .string()
        .optional()
        .refine((v) => {
          if (!v) return true;
          return v.split("/").length === 2
            ? true
            : "Invalid repository format. Expected: username/repo";
        }),
    }),
  });

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button>Join the waitlist</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the waitlist</DialogTitle>
          <DialogDescription>
            {`Would you mind sharing some details on what you're building? If not, just enter your email and we'll add you to the waitlist once a spot opens up.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              console.log("Submitting with data", data);
              await new Promise((resolve) => setTimeout(resolve, 1000));
              form.reset();
              setShowDialog(false);
            })}
            className="flex w-full max-w-lg flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="john@doe.com" />
                  </FormControl>
                  <FormDescription>Your email address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter handle</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="@acme" />
                  </FormControl>
                  <FormDescription>
                    Your twitter handle (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repository"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="acme/trpc" />
                  </FormControl>
                  <FormDescription>
                    {`Mind sharing what you're building? (optional)`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="I'm building..." />
                  </FormControl>
                  <FormDescription>
                    {`If your repo is private, you can add a short description of what you're building instead. (optional)`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className={cn("flex w-64")}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Joining waitlist...
                </>
              ) : (
                <>Join the waitlist</>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
