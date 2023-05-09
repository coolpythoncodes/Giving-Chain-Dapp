import React, { useEffect, useState } from "react";
import axios from "axios";

import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { type UploadChangeParam } from "antd/lib/upload/interface";
import { Button, Spin, Upload } from "antd";

const IPFS_URL = "https://rpc.particle.network/ipfs/upload";

interface UploadFile {
  uid: string;
  name: string;
  status?: string;
  url?: string;
  thumbUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;
}

interface ApiResponse {
  cid: string;
}

interface UploadFormProps {
  onChange: (data: string) => void;
}

const UploadForm = ({ onChange }: UploadFormProps) => {
  const [file, setFile] = useState<UploadFile | File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {

    if (file) {
      if (file.size / 1024 ** 2 > 100) {
        toast.error("File Size too large, minimum is 100mb");
        return;
      } else {
        setLoading(true)
        const form2 = new FormData();
        form2.append("file", file as File);

        try {
          const res = await axios.post<ApiResponse>(IPFS_URL, form2, {
            headers: { "content-type": "multipart/form-data" },
            auth: {
              username: `${process.env.NEXT_PUBLIC_PROJECT_ID as string}`,
              password: `${process.env.NEXT_PUBLIC_SERVER_KEY as string}`,
            },
          });
          onChange(`https://ipfs.io/ipfs/${res.data.cid}`);
          console.log(`https://ipfs.io/ipfs/${res.data.cid}`)
          setLoading(false)
        } catch (err) {
          setLoading(false)
        }
      }
    }
  };

  useEffect(() => {
    if (file) {
      void handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setFile(info.file.originFileObj);
  };

  return (
    <Spin spinning={loading}>
      <Upload
        name="campaignImageUrl"
        accept=".jpg,.jpeg,.png"
        maxCount={1}
        onChange={handleFileChange}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </Spin>
  );
};

export default UploadForm;
