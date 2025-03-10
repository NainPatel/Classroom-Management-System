import { Button, Label, Progress, Textarea, TextInput } from "flowbite-react";
import { MdTitle, MdDescription, MdCloudUpload, MdAttachFile } from "react-icons/md";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { UploadMaterialFetch } from "../../fetch_components/fetchComponents.jsx";

const UploadMaterial = (props) => {
    // eslint-disable-next-line react/prop-types
    const files = props.props.files;
    // eslint-disable-next-line react/prop-types
    const setfiles = props.props.setFiles;
    // eslint-disable-next-line react/prop-types
    const setMaterials = props.props.setMaterials;
    // eslint-disable-next-line react/prop-types
    const setIssubmited = props.props.setIssubmited;
    // eslint-disable-next-line react/prop-types
    const setMaterialModal = props.props.setMaterialModal;
    // eslint-disable-next-line react/prop-types
    const storage = getStorage();
    const [progressbar, setProgressbar] = useState(0.0);
    const [isUploading, setIsUploading] = useState(false);

    const upload = async (data) => {
        setIsUploading(true);
        setIssubmited(true);
        let length = data.files.length;
        let progress = 0;
        let urls = [];
        let file_names = [];
        for (const file of data.files) {
            const storageRef = ref(storage, `Materials/${data.code}/${file.name}`);
            await uploadBytes(storageRef, file).then(async () => {
                progress = progress + 1;
                setProgressbar(progress / length * 100);
                await getDownloadURL(storageRef).then(
                    (url) => {
                        file_names.push((file.name).toString());
                        urls.push(url);
                    }
                );
            });
        }
        let upload_data = {
            uid: data.uid,
            code: data.code,
            title: data.title,
            description: data.description,
            urls: urls,
            file_names: file_names
        };
        const response = await UploadMaterialFetch(upload_data);
        response.json().then(
            (value) => {
                setMaterials(value);
                setIsUploading(false);
                setIssubmited(false);
                setProgressbar(0);
                setfiles([]);
                setMaterialModal(false);
            }
        );
    };

    const removeFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setfiles(updatedFiles);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={
                async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const auth = getAuth();
                    const user = auth.currentUser;
                    let data = {
                        // eslint-disable-next-line react/prop-types
                        uid: user.uid,
                        // eslint-disable-next-line react/prop-types
                        code: props.props.class_id,
                        title: formData.get('title'),
                        description: formData.get('description'),
                        files: files
                    };

                    await upload(data);
                }
            }>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <MdCloudUpload className="mr-2 text-blue-500" size={24} />
                            Add Materials
                        </h3>
                        <Button 
                            color="gray" 
                            size="sm" 
                            onClick={() => setMaterialModal(false)}
                            className="dark:bg-gray-700"
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="title" className="text-lg font-medium" value="Topic Name" />
                            </div>
                            <TextInput
                                icon={MdTitle}
                                id="title"
                                name="title"
                                placeholder="Enter topic name"
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description" className="text-lg font-medium" value="Description" />
                            </div>
                            <Textarea 
                                id="description" 
                                name="description"
                                placeholder="Add description..." 
                                required 
                                rows={2}
                                className="w-full"
                                icon={MdDescription}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label
                            htmlFor="dropzone-file"
                            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                            <div className="flex flex-col items-center justify-center py-4">
                                <MdCloudUpload className="mb-2 h-10 w-10 text-blue-500" />
                                <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span className="font-bold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Documents, images, and other files
                                </p>
                            </div>
                            <input 
                                id="dropzone-file" 
                                type="file" 
                                multiple 
                                onChange={
                                    async (event) => {
                                        let obj = event.target.files;
                                        let file = [...files];
                                        for (const key of Object.keys(obj)) {
                                            file.push(obj[key]);
                                        }
                                        await setfiles(file);
                                    }
                                } 
                                className="hidden"
                            />
                        </Label>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-lg font-medium mb-2 flex items-center">
                                <MdAttachFile className="mr-1 text-blue-500" />
                                Selected Files ({files.length})
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200 dark:border-gray-600 last:border-0">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {file.name}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                ({(file.size / 1024).toFixed(1)} KB)
                                            </span>
                                        </div>
                                        <Button 
                                            color="failure" 
                                            size="xs"
                                            onClick={() => removeFile(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {progressbar > 0 && (
                        <div className="w-full mt-4">
                            <Progress 
                                progress={progressbar} 
                                color="blue"
                                progressLabelPosition="inside"
                                size="lg"
                                labelProgress
                                labelText={`Uploading... ${progressbar.toFixed(0)}%`}
                            />
                        </div>
                    )}

                    <div className="flex justify-end mt-6">
                        <Button 
                            type="submit"
                            disabled={files.length === 0 || isUploading}
                            color="blue"
                            className="px-6"
                        >
                            <MdCloudUpload className="mr-2" />
                            {isUploading ? 'Uploading...' : 'Upload Materials'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UploadMaterial;