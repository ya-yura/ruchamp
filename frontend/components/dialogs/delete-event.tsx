import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog';
import { Toaster, toast } from 'sonner';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Form } from 'react-hook-form';
import { Button } from '../ui/button';
import { Spinner } from '../spinner';

export function DeleteEventDialog() {
  return (
    <>
    </>
    // <Dialog onOpenChange={(open: boolean) => setIsOpen(!isOpen)} open={isOpen}>
    //   <Toaster />
    //   <DialogTrigger asChild>
    //     {/* <Button className={cn(className)} variant={'ruchampDefault'}>
    //       Создать событие
    //     </Button> */}
    //   </DialogTrigger>
    //   <DialogContent className="top-[25%] h-fit w-[752px] max-w-[752px] translate-y-[0]">
    //     <DialogHeader className="absolute left-0 right-0 top-[-92px] flex flex-col">
    //       <DialogTitle>Событие</DialogTitle>
    //     </DialogHeader>
    //     <form>
    //       <DialogFooter>
    //         <Button
    //           className="absolute bottom-[-86px] right-[-24px] text-white"
    //           variant={'ruchampDefault'}
    //           type="submit"
    //           disabled={isLoading}
    //         >
    //           {isLoading && <Spinner className="h-6 w-6" />}
    //           Создать событие
    //         </Button>
    //       </DialogFooter>
    //     </form>
    //   </DialogContent>
    // </Dialog>
  );
}
