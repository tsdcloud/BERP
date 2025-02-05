import React, {useState, useEffect} from 'react'
import Dialogue from '../incidents/Dialogue';
import { Upload } from 'antd';
import { Button } from '../ui/button';

const FileUpload = ({uploadUrl}) => {

    const [file, seFile] = useState("");
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isOpenned, setIsOpenned] = useState(false);
    const [message, setMessage] = useState("");
    const [canUpload, setCanUpload] = useState(false);
    let token = localStorage.getItem("token");

    const handleUpload = async(options) =>{
        const { file, onSuccess, onError } = options;

    setUploading(true);
        if (!file) {
            setMessage("Bien vouloir choisir un fichier");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(uploadUrl, {
                method:"POST",
                body:JSON.stringify(formData),
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${token}`
                },
            });
            // setMessage(response.data.message);
            // Notify the Upload component that the upload was successful
            onSuccess(response.data, file);
            message.success("File uploaded successfully");
            message.error("File upload failed");
        } catch (error) {
            setMessage("Une erreur est survenu");
            console.error(error);
        }
    }

    useEffect(()=>{
        if(token){
            setCanUpload(true);
        }
    },[]);

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

  return (
    canUpload &&
    <Dialogue 
        buttonText={"Import"}
        header={"Importer un fichier"}
        isOpenned={isOpenned}
        content={
        <Upload 
            // onChange={handleChange}
            customRequest={handleUpload}
            accept=".xlsx"
        >
            <Button className="bg-primary text-white">Choisir un fichier</Button>
        </Upload>}
    />
  )
}

export default FileUpload