import Header from "../components/header";
import Body from "../components/body";
import Footer from "../components/footer";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Body />
      </main>
      <Footer />
    </div>
  );
};

export default Page;
