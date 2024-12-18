import { EyeIcon, NoSymbolIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";


const showUser = (id) => {
    console.log("show user.", id);
};

const disabledUser = (id) => {
    console.log("User is disabled", id);
};

const editedUser = (id) => {
    console.log("edited User", id);
};

const deletedUser = (id) => {
    console.log("deleted User", id);
};



export const columnsUsers = [
    // {
    //     accessorKey: "id",
    //     header: "#",
    // },

    {
        accessorKey: "last_name",
        header: "Nom",
    },
    {
        accessorKey: "first_name",
        header: "Prénom",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Téléphone",
    },
    {
        accessorKey: "username",
        header: "Nom d'utilisateur",
    },
    {
        accessorKey: "isActive",
        header: "Statut",
    },
    {
        accessorKey: "action",
        header: "Actions",
        cell:({row}) => (
            <div className="flex justify-center">
                <EyeIcon className="h-4 w-4 text-green-500" onClick={() => showUser(row.original.id)}/>
                <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => editedUser(row.original.id)}/>
                <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledUser(row.original.id)}/>
                <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedUser(row.original.id)}/>


            </div>
            )
    },
];