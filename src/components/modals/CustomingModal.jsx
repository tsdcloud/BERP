import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';

export default function CustomingModal({ children, title, buttonText }) {
    const [open, setOpen] = useState(false);
 
    const showModal = () => {
        console.log("open modal is true");
        setOpen(true);
    };

    const handleCancel = () => {
        console.log('Bouton x annuler cliqué');
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
                onCancel={handleCancel}
                footer={null}
            >
                {/* {children} */}
                {React.cloneElement(children, { setOpen })}
            </Modal>
        </div>
    );
}
   // Ajout de la validation des props
   CustomingModal.propTypes = {
    children: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
};