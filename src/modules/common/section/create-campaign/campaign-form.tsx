/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import Image from "next/image";
import { Button, Form } from "antd";

import back from "../../../../../public/assets/campaign/back.svg";
import { TextArea, TextInput } from "../../component/inputs";
import { generalRoutes } from "../../utils/data/routes.data";
import Link from "next/link";

const initialFormData = {
    amount: '',
    description: '',
  };

const CampaignForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const values = await form.validateFields();

    console.log(values)
  };

  return (
    <main className="bg-[#F5F5F5]">
      <div className="layout-container flex justify-center lg:py-[76px] md:py-[50px] py-[40px]">
        <div className="w-full md:w-[80%] lg:w-[60%]">
          <Link href={generalRoutes.campaign} className="">
            <Image src={back} alt="back" />
          </Link>

          <div
            className="bg-white p-5 md:px-[32px] md:py-[40px] mt-[48px]"
            style={{ border: "1px solid #D0D5DD", borderRadius: "8px" }}
          >
            <h1 className="text-[#1F1F1F] font-bold text-2xl md:text-[32px] md:leading-[36px] md:mb-3">Create campaign</h1>
            <p className="text-[#727581] text-base font-normal mb-3">Give details of what you want</p>
            <Form autoComplete="on" form={form}>
              <Form.Item
                initialValue={initialFormData.amount}
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Amount is required.",
                  },
                ]}
              >
                <TextInput
                  label="How much would you like to raise?"
                  placeholder="$0"
                  id="amount"
                  name="amount"
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
              <div className="flex w-full justify-end">
                <Button onClick={handleSubmit} className="mt-4 h-[43px] w-[96px] border-none bg-[#FF6B00] text-base text-white md:mt-6">
                  Next
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
