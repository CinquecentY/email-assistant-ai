import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Unlink } from "lucide-react";
import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "sonner";

const DeleteAccountButton = ({
  deleteAccountId,
}: {
  deleteAccountId: string;
}) => {
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  const deleteAccountMutation = api.mail.deleteAccount.useMutation();

  function deleteAccount(deleteAccountId: string) {
    deleteAccountMutation.mutate(
      { accountId: deleteAccountId },
      {
        onSuccess: () => {
          if (deleteAccountId === accountId) {
            setAccountId("");
          }
          window.location.reload();
          toast.success("Account deleted successfully", {});
        },
        onError: (error: { message: string }) => {
          toast.error("An error has occurred", { description: error.message });
        },
      },
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="delete-account"
          data-testid="delete-account-button"
          size="icon"
          variant="ghost"
          className="rounded-lg bg-transparent text-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <Unlink />
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="delete-account-dialog" className="rounded-xl">
        <DialogHeader>
          <DialogTitle>Unlink Account?</DialogTitle>
          <DialogDescription>This action is irreversible.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              aria-label="delete-account-confirm"
              variant={"destructive"}
              type="submit"
              className="hover:bg-destructive"
              onClick={() => deleteAccount(deleteAccountId)}
              data-testid="delete-account-button-confirm"
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountButton;
