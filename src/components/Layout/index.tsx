import s from "./styles.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

  return (
    <div className={s.layout}>
      <header>
        <div>
          <h2>Guitar Emulator</h2>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;