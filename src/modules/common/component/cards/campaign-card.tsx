import Image from "next/image";
import { formatUnit } from "~/utils/helper";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { useAccount } from "@particle-network/connect-react-ui";
import { ethers } from "ethers";
import { crowdFundABI, crowdFundContractAddress } from "~/utils/data";

const CampaignCard = ({ campaign }) => {
  const [donors, setDonors] = useState();
  const account = useAccount();

  const getDonors = async () => {
    if (!account) setDonors([]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    const _contract = new ethers.Contract(
      crowdFundContractAddress,
      crowdFundABI.abi,
      provider
    );

    const response = await _contract.getDonors(parseInt(campaign.campaignId));
    return response;
  };

  //   getDonors
  useEffect(() => {
    getDonors().then((res) => setDonors(res));
  }, [account]);
  return (
    <div className="error">
      <Image src={campaign?.campaignImageUrl} alt="" width={413} height={227} className="w-full" />
      <p className="mb-4 mt-2 line-clamp-3">{campaign?.description}</p>
      <p className="">
        {numeral(formatUnit(campaign?.amountRaised)).format(",")} USDC raised -{" "}
        {donors?.length} donations
      </p>
    </div>
  );
};

export default CampaignCard;
