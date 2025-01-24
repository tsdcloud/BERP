import React from 'react';
// import CreatePermissionForm from './CreatePermissionForm';
import CreatePermissionForm from './CreatePermissionForm';
import CustomingModal from '../../modals/CustomingModal';
import PropTypes from 'prop-types';

export default function CreatePermissionModal({ setOpen, onSubmit }) {
    return (
        <CustomingModal
            title="Ajouter une nouvelle permission"
            buttonText="Créer une permission"
        >
            <CreatePermissionForm onSubmit={onSubmit} />
        </CustomingModal>
    );
}

CreatePermissionModal.propTypes = {
    setOpen: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
