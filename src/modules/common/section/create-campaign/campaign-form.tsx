/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Button, Form } from "antd";

import back from "../../../../../public/assets/campaign/back.svg";
import { TextArea, TextInput } from "../../component/inputs";
import { generalRoutes } from "../../../../utils/data/routes.data";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  type CrowdFundContract,
  useContractContext,
} from "~/context/ContractContext";
import { ethers } from "ethers";

const initialFormData = {
  amount: "",
  description: "",
};

const CampaignForm = () => {
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [form] = Form.useForm();
  const { initCrowdFundContractAddress } = useContractContext();

  const handleCreateCampaign = async () => {
    const notification = toast.loading("Please wait...Don't leave this page");
    setCreatingCampaign(true);
    console.log(Math.floor(new Date().getTime() / 1000.0));
    console.log(Math.floor(new Date().getTime() / 1000.0) + 86400)

    try {
      const contract = initCrowdFundContractAddress() as CrowdFundContract;

      const txHash = await contract.createCampaign(
        "Education",
        5000,
        "School fees",
        Math.floor(new Date().getTime() / 1000.0) + 1000,
        Math.floor(new Date().getTime() / 1000.0) + 86400,
        "Nigeria",
        "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/robots.jpg"
      );
      const receipt = txHash.wait();
      if (receipt) {
        console.log("see TxHash", receipt.transactionHash);
        setCreatingCampaign(false);
        toast.success("Campaign created successfully", {
          id: notification,
        });
      }
    } catch (error) {
      console.log("error", error.message);
      setCreatingCampaign(false);
      toast.error("something went wrong", {
        id: notification,
      });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const values = await form.validateFields();

    console.log(values);
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
                <Button
                  // onClick={handleSubmit}
                  onClick={handleCreateCampaign}
                  className="mt-4 h-[43px] w-[96px] border-none bg-[#FF6B00] text-base text-white md:mt-6"
                >
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
