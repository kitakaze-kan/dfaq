import { useStateUploadedCID, useStateUploadStatus } from "@/jotai";

export const useFileUpload = () => {
  const [status, setStatus] = useStateUploadStatus();
  const [cid, setCID] = useStateUploadedCID();

  const upload = async (files: File[]) => {
    setStatus("uploading");
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    const options = {
      method: "POST",
      body: formData,
    };

    try {
      const res = await fetch("/api/web3StorageUploader", options);
      const data = await res.json();
      if (data.cid) {
        setCID(data.cid);
        setStatus("completed");
      } else {
        setStatus("failed");
      }
    } catch (e) {
      console.error(e);
      setStatus("failed");
    }
  };

  const resetUploadStatus = () => {
    setCID(undefined);
    setStatus(undefined);
  };

  return {
    upload,
    status,
    cid,
    resetUploadStatus,
  };
};
