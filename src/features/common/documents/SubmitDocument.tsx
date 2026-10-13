'use client';
import { FC, useState } from 'react';
import Link from 'next/link';
import { useLoading } from '@/common/context/loading';
import { useSubmitting } from '@/common/context/submitting';
import postDocument from '@/common/documents/postDocument';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
import useUserStore from '../store';
import Upload from '@/components/icons/Upload';
import Trash from '@/components/icons/Trash';
import { NecessaryDocuments } from '@/constants/necessaryDocuments';

type SubmitDocumentProps = {
    document: NecessaryDocuments;
    title: string;
    description?: string;
    Help?: FC<any>;
};
const SubmitDocument: FC<SubmitDocumentProps> = ({ document, title, description, Help }) => {
    const { ref, username, name, type, initUser, applicationRef, getDocuments } = useUserStore(
        useShallow((state) => ({
            ref: state.ref,
            username: state.username,
            name: state.name,
            knownAs: state.knownAs,
            type: state.applicationType,
            initUser: state.initUser,
            applicationRef: state.applicationRef,
            getDocuments: state.getDocuments
        }))
    );

    const { setIsLoading } = useLoading();
    const { startSubmitting, endSubmitting } = useSubmitting();
    const router = useRouter();

    const [fileData, setFileData] = useState<any>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // Does it need preview?
    const [filePreview, setFilePreview] = useState<any>();

    // upload from input
    const handleUpload = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                // 10MB in bytes
                setErrorMessage('Error: File size must be 10MB or less.');
            } else {
                setErrorMessage(null);
                handleUploadFiles(file);
            }
        }
    };
    const handleUploadFiles = (file: any) => {
        setFileData([file]); // set file data as array, TODO: review
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result == null) return;
            setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };
    const handleSubmit = async () => {
        try {
            const files = fileData;
            if (files == undefined) return;
            if (files.length > 0) {
                startSubmitting();
                setIsLoading(true);
                const file = files[0];
                const formData = new FormData();
                formData.append('file', file);
                await postDocument({ document: document, formData: formData, applicationRef: applicationRef, userRef: ref });
                setIsLoading(false);
                getDocuments(username, ref);
                router.push('/apply/documents/complete');
            } else {
                setIsLoading(false);
                return;
            }
        } catch (e) {
            alert('Something went wrong. Could not upload your document.');
            setIsLoading(false);
        } finally {
            endSubmitting();
        }
    };
    const handleDelete = () => {
        setFileData([]);
    };
    const DraggableField = () => {
        const handleDragEnter = (e: any) => {
            e.preventDefault();
            setIsDragging(true);
        };
        const handleDragOver = (e: any) => {
            e.preventDefault();
            setIsDragging(true);
        };
        const handleDragLeave = () => {
            setIsDragging(false);
        };
        // upload from drag&drop
        const handleDrop = (e: any) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            handleUploadFiles(file);
        };
        return (
            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ margin: '3rem', width: '30rem' }}
            >
                <div style={{ padding: '2%', backgroundColor: `${isDragging ? 'lightcyan' : '#f5f5f5'}` }}>
                    <div
                        style={{
                            color: 'gray',
                            border: '5px lightblue dashed',
                            padding: '5%',
                            textAlign: 'center',
                            display: 'grid',
                            justifyContent: 'center',
                            justifyItems: 'center'
                        }}
                    >
                        <h1 style={{ fontSize: '2rem' }}>Drop a file here</h1>
                        <h1 style={{ fontSize: '1.2rem' }}>or</h1>
                        <label htmlFor="pdfInput" className="btn">
                            <input
                                id="pdfInput"
                                type="file"
                                accept=".pdf,image/png, image/jpeg"
                                onInput={handleUpload}
                                style={{ padding: '1rem', display: 'none' }}
                            />
                            <span style={{ color: 'white', fontSize: '1.2rem' }}>Browse File</span>
                        </label>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <>
            <>
                <div className="relative flex flex-col items-center justify-center pt-10 pb-8 text-center min-h-screen text-white overflow-hidden">
                    <span style={{ fontSize: '2rem' }}>{title}</span>
                    {description && <p className="max-w-xl mx-4 mt-3 text-base leading-snug">{description}</p>}
                    {fileData.length == 0 && (
                        <>
                            <div className="md:hidden m-5">
                                <label htmlFor="pdfInput" className="btn flex">
                                    <input id="pdfInput" type="file" onInput={handleUpload} hidden accept=".pdf,image/png, image/jpeg" />
                                    <span className="mr-2 flex items-center">
                                        <Upload />
                                    </span>
                                    <span>Upload File</span>
                                </label>
                            </div>
                            <div className="hidden md:block">
                                <DraggableField />
                            </div>
                        </>
                    )}
                    <div>
                        {fileData.length > 0 ? (
                            <>
                                {filePreview && (
                                    <div className="m-5 max-w-[500px] h-fit">
                                        <img src={filePreview} alt="Preview not available" style={{ width: 'auto', height: 'auto' }} />
                                    </div>
                                )}
                                <div className="flex justify-center w-full">
                                    <div className="flex justify-center relative w-fit">
                                        <div className="rounded-full bg-white bg-opacity-20 flex text-center justify-center">
                                            <span className="pl-2" style={{ fontSize: '1.5rem', color: 'lightgreen' }}>
                                                ✓
                                            </span>
                                            <span className="p-2 self-center">{fileData[0].name}</span>
                                        </div>
                                        <span
                                            className="absolute -right-[40px] flex flex-wrap content-center justify-center cursor-pointer"
                                            onClick={handleDelete}
                                        >
                                            <Trash />
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <span></span>
                        )}
                    </div>{' '}
                    {errorMessage && <div className="text-lg text-red-500">{errorMessage}</div>}
                    <button className="btn" onClick={async () => await handleSubmit()}>
                        Click to Submit
                    </button>
                    <div className="text-xl m-2">{Help && <Help />}</div>
                    <Link href="/contact" className="link">
                        Need Help? Contact Us
                    </Link>
                    <Link href="/apply/documents" className="btn">
                        Go to Documents Top
                    </Link>
                </div>
            </>
        </>
    );
};
export default SubmitDocument;
