import { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';

export default function CustomingModal({ children, title, buttonText }) {

    // Ajout de la validation des props
    CustomingModal.propTypes = {
        children: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        buttonText: PropTypes.string.isRequired,
    };

    const [open, setOpen] = useState(false);
    // const [confirmLoading, setConfirmLoading] = useState(false);
 
    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        console.log('Bouton x annuler cliqué');
        setOpen(false);
    };

    // useEffect(()=>{
    //     setOpen(isOpen);
    //     console.log(isOpen);
    // },[isOpen]);

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
                {children({ setOpen })}
            </Modal>
        </div>
    );
}