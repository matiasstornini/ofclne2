import BaseLayout from "@/components/BaseLayout";
import WalletInterface from "./wallet-interface";

const Page = () => {
	return (
		<BaseLayout renderRightPanel={false}>

					<WalletInterface />

		</BaseLayout>
	);
};
export default Page;
