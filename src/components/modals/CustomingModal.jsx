import { useState } from 'react';
import { Button, Modal } from 'antd';

export default function CustomingModal({ children, title, buttonText }) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            console.log("object");
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Bouton annuler cliqué');
        setOpen(false);
    };

    return (
        <div>
            <Button className='bg-blue-900 text-white text-xs' onClick={showModal}>
                {buttonText}
            </Button>
            <Modal
                title={title}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={()=>{}}
            >
                {children}
            </Modal>
        </div>
    );
}