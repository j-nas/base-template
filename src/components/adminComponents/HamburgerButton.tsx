type Props = {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
};

export default function HamburgerButton({ toggleSidebar, sidebarOpen }: Props) {
  return (
    <>
      <label
        aria-label="nav menu"
        className={`swap-rotate swap disabled btn-md btn-circle btn scale-90 pl-4 md:hidden`}
      >
        <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />

        <svg
          className="swap-off -translate-x-2 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
        >
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
        </svg>

        <svg
          className="swap-on -translate-x-2 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
        >
          <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
        </svg>
      </label>
    </>
  );
}
