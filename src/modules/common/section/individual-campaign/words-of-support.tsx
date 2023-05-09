import {
  type CrowdFundContract,
  useContractContext,
} from "~/context/ContractContext";
import { type FormEvent, useEffect, useState } from "react";
import {
  type AddressType,
  type ICampaigns,
  type IDonors,
  type IWordsOfSupport,
} from "~/utils/interface/contract.interface";
import { UserOutlined } from "@ant-design/icons";
import { covertToReadableDate, formatUnit } from "~/utils/helper";
import ReactTimeAgo from "react-time-ago";
import { useAccount } from "@particle-network/connect-react-ui";
import { toast } from "react-hot-toast";

type WordsOfSupportProps = {
  campaignId: number;
  campaign: ICampaigns;
};

const WordsOfSupport = ({ campaignId, campaign }: WordsOfSupportProps) => {
  const account = useAccount() as AddressType;
  const [wordsOfSupport, setWordsOfSupport] = useState<IWordsOfSupport[]>([]);
  const { getWordsOfSupport, getDonors } = useContractContext();
  const [donors, setDonors] = useState<IDonors[]>([]);
  const [supportWord, setSupportWord] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { initCrowdFundContractAddress } = useContractContext();
  const isDonor = donors.filter(
    (item) => item.donorAddress.toLowerCase() === account.toLowerCase()
  );

  const reversedwordsOfSupport = [...wordsOfSupport].reverse();

  useEffect(() => {
    if (campaignId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getWordsOfSupport(campaignId).then((res: IWordsOfSupport[]) =>
        setWordsOfSupport(res)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const notification = toast.loading("Submitting words of support");
    try {
      const contract = initCrowdFundContractAddress() as CrowdFundContract;
      const txHash = (await contract.createWordOfSupport(
        campaignId,
        supportWord
      )) as CrowdFundContract;
      const receipt = await txHash.wait();
      if (receipt) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getWordsOfSupport(campaignId).then((res: IWordsOfSupport[]) =>
          setWordsOfSupport(res)
        );
        setSupportWord("");
        setIsSubmitting(false);
        toast.success("submission was successfull", {
          id: notification,
        });
      }
    } catch (error) {
      toast.error("Opps, something went wrong", {
        id: notification,
      });
    }
  };

  useEffect(() => {
    if (campaign) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getDonors(campaign?.campaignId).then((res: IDonors[]) => setDonors(res));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  return (
    <div className="w-full border-b border-[#D0D5DD] py-10">
      <h1 className="mb-4 text-xl font-bold md:text-2xl">
        Words of support ({reversedwordsOfSupport.length})
      </h1>

      <p>Please donate to share words of support.</p>
      {isDonor.length > 0 ? (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit}>
          <textarea
            name="supportWord"
            placeholder="Share some words of encouragement"
            required
            className="mt-4 w-full"
            onChange={(e) => setSupportWord(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 h-[50px] w-full border-none bg-[#FF6B00] text-base text-white"
          >
            Submit
          </button>
        </form>
      ) : null}

      <div className="mt-5 space-y-5">
        {reversedwordsOfSupport?.map((item, index) => (
          <div key={`words-of-support-${index}`} className="flex gap-x-5">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-[#E6F6EF]">
              <UserOutlined className="text-[25px] text-[#458E52]" />
            </div>
            <div className="w-full">
              <h3 className="mb-[6px] text-base font-bold">{item?.donor}</h3>
              <div>
                <div className="mb-[6px] flex w-[full] items-center justify-start text-[14px]">
                  <div className="mx-5 h-[5px] w-[5px] rounded-[50%] bg-[#D0D5DD]" />
                  <p className="">
                    {covertToReadableDate(
                      formatUnit(item?.timestamp) * 10 ** 18
                    ) ? (
                      <ReactTimeAgo
                        date={formatUnit(item?.timestamp) * 10 ** 18 * 1000}
                      />
                    ) : null}
                  </p>
                </div>
                <p className="text-[14px]">{item?.supportWord}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordsOfSupport;
