import { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';

export default function CustomingModal({ children, title, buttonText, isOpen }) {
    const [open, setOpen] = useState(isOpen || false);
    const [confirmLoading, setConfirmLoading] = useState(false);
 
    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        console.log('Bouton x annuler cliqué');
        setOpen(false);
    };

    useEffect(()=>{
        setOpen(isOpen);
        console.log(isOpen);
    },[isOpen]);

    return (
        <div>
            <Button className='bg-blue-900 text-white text-xs' onClick={showModal}>
                {buttonText}
            </Button>
            <Modal
                title={title}
                open={open}
                // onOk={handleOk}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={()=>{}}
            >
                {children}
            </Modal>
        </div>
    );
}