import Header from "../components/header";
import Body from "../components/body";
import Footer from "../components/footer";
import ChromeLink from "../components/chromeLink";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        <Body />
        <ChromeLink />
      </main>
      <Footer />
    </div>
  );
};

export default Page;
