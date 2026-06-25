import TopHeader from "./TopHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        <TopHeader />
        <Navbar />
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
