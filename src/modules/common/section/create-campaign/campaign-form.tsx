import Image, { type StaticImageData } from "next/image";
import { Button, DatePicker, Form, Select, Upload } from "antd";

import back from "../../../../../public/assets/campaign/back.svg";
import { TextArea, TextInput } from "../../component/inputs";
import { generalRoutes } from "../../../../utils/data/routes.data";
import Link from "next/link";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import {
  type CrowdFundContract,
  useContractContext,
} from "~/context/ContractContext";
import { toast } from "react-hot-toast";

const initialFormData = {
  title: "",
  goal: 0,
  description: "",
  location: "",
  category: "",
  endAt: 0,
  campaignImageUrl: "",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MAX_FILE_SIZE = 102400 // 100MB

const CampaignForm = () => {
  const [form] = Form.useForm();

  const { initCrowdFundContractAddress } = useContractContext();

  const handleCreateCampaign = async () => {
    const {
      campaignImageUrl,
      category,
      description,
      endAt,
      goal,
      location,
      title,
    } = (await form.validateFields()) as typeof initialFormData;
    const notification = toast.loading("Creating Campaign.(Don't leave this page)");
    try {
      const contract = initCrowdFundContractAddress() as CrowdFundContract;
      const txHash = await contract.createCampaign(
        category,
        goal,
        description,
        title,
        // @ts-expect-error endAt type from antdesign datepicker
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        Math.round(endAt.$d.getTime() / 1000),
        location,
        campaignImageUrl
      )  as CrowdFundContract;
      const receipt = await txHash.wait() ;
      if (receipt) {
        toast.success("Campaign was created successfully", {
          id:notification
        })
      }
    } catch (error) {
      toast.error("Something went wrong", {
        id: notification
      })
    }
  };

  const normFile = (e: unknown) => {
    // @ts-expect-error e type unknown
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if((e.file.size / 1024) < 100) {
      console.log("error")
      toast.error("File Size too large, minimum is 100mb")
      return;
    }
    // @ts-expect-error e type unknown
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log("Upload event:", e.file.size);
    // @ts-expect-error e type unknown
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(e.file.size / 1024)
    if (Array.isArray(e)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return e;
    }
    // @ts-expect-error e type unknown
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return e?.fileList;
  };

  return (
    <main className="bg-[#F5F5F5]">
      <div className="layout-container flex justify-center py-[40px] md:py-[50px] lg:py-[76px]">
        <div className="w-full md:w-[80%] lg:w-[60%]">
          <Link href={generalRoutes.yourCampaign} className="">
            <Image src={back as StaticImageData} alt="back" />
          </Link>

          <div
            className="mt-[48px] bg-white p-5 md:px-[32px] md:py-[40px]"
            style={{ border: "1px solid #D0D5DD", borderRadius: "8px" }}
          >
            <h1 className="text-2xl font-bold text-[#1F1F1F] md:mb-3 md:text-[32px] md:leading-[36px]">
              Create campaign
            </h1>
            <p className="mb-3 text-base font-normal text-[#727581]">
              Give details of what you want
            </p>
            <Form autoComplete="on" form={form}>
              <Form.Item
                initialValue={initialFormData.title}
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Title is required.",
                  },
                ]}
              >
                <TextInput
                  label="Campaign Title"
                  placeholder="Enter campaign title"
                  id="title"
                  name="title"
                  type="string"
                />
              </Form.Item>
              <Form.Item
                initialValue={initialFormData.goal}
                name="goal"
                rules={[
                  {
                    required: true,
                    message: "Amount is required.",
                  },
                ]}
              >
                <TextInput
                  label="How much would you like to raise?"
                  placeholder="USDC 0"
                  id="goal"
                  name="goal"
                  type="number"
                />
              </Form.Item>
              <Form.Item
                initialValue={initialFormData.description}
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Description is required.",
                  },
                ]}
              >
                <TextArea
                  label="Purpose of campaign"
                  placeholder="Enter description"
                  id="description"
                  name="description"
                />
              </Form.Item>
              <Form.Item
                initialValue={initialFormData.location}
                name="location"
                rules={[
                  {
                    required: true,
                    message: "Location is required.",
                  },
                ]}
              >
                <TextInput
                  label="Location"
                  placeholder="Enter the your location"
                  id="location"
                  name="location"
                />
              </Form.Item>
              <Form.Item
                initialValue={initialFormData.category}
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Category is required.",
                  },
                ]}
                label="Category"
              >
                <Select>
                  <Select.Option value="medical">Medical</Select.Option>
                  <Select.Option value="emergency">Emergency</Select.Option>
                  <Select.Option value="education">Education</Select.Option>
                  <Select.Option value="nonprofit">Nonprofit</Select.Option>
                  <Select.Option value="crisis relief">
                    Crisis Relief
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Campaign ends?"
                initialValue={initialFormData.endAt}
                name="endAt"
                rules={[
                  {
                    required: true,
                    message: "Duration is required.",
                  },
                ]}
              >
                <DatePicker
                  name="endAt"
                  disabledDate={(current) => current < dayjs()}
                />
              </Form.Item>
              <Form.Item
                name="upload"
                label="Upload"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  name="logo"
                  action="/upload.do"
                  listType="picture"
                  accept=".png, .jpg"
                  beforeUpload={(file) => {
                    if((file.size / 1024) < 100) {
                      console.log("error")
                      toast.error("File Size too large, minimum is 100mb")
                      return;
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
              <div className="flex w-full justify-end">
                <Button
                  // onClick={handleSubmit}
                  onClick={handleCreateCampaign as VoidFunction}
                  className="mt-4 h-[43px] border-none bg-[#FF6B00] px-5 text-base text-white md:mt-6"
                >
                  Create campaign
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CampaignForm;
