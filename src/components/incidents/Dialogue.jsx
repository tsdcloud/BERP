import React,{useState} from 'react'
import {Button} from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { PlusIcon } from 'lucide-react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const Dialogue = ({header, content, footer, buttonText, isOpenned}) => {
  const [isOpen, setIsOpen] = useState(isOpenned);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-secondary text-white font-semibold outline-none text-sm w-full md:w-auto" onClick={() => setIsOpen(!isOpenned)} id="close-dialog">
              <PlusIcon className='h-3' />
              <span>{buttonText}</span>
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>{header}</DialogHeader>
            {React.cloneElement(content, { onClose: handleClose })}
            <DialogFooter>{footer}</DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default Dialogue