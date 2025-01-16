import BaseLayout from "@/components/BaseLayout";
import MessagesInterface from "./messages-interface";

const Page = () => {
	return (
		<BaseLayout renderRightPanel={false}>

					<MessagesInterface />

		</BaseLayout>
	);
};
export default Page;
