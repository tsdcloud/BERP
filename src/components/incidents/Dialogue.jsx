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

const Dialogue = ({header, content, footer, buttonText, isOpenned}) => {
  const [isOpen, setIsOpen] = useState(isOpenned);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button className="bg-primary text-white font-normal outline-none text-xs" onClick={() => setIsOpen(!isOpenned)} id="close-dialog">{buttonText}</Button>
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