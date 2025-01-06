import React from 'react'
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

const Dialogue = ({header, content, footer, buttonText}) => {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" className="bg-primary text-white font-normal">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>{header}</DialogHeader>
        {content}
        <DialogFooter>{footer}</DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default Dialogue