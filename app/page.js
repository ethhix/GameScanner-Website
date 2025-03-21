import Body from "../components/body";
import ChromeLink from "../components/chromeLink";

const Page = () => {
  return (
    <div className="h-fit mb-8 flex flex-col w-full">
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        <Body />
        <ChromeLink />
      </main>
    </div>
  );
};

export default Page;
