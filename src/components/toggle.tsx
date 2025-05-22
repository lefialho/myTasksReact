import { useEffect, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { MoonIcon } from "./icons/moon";
import { SunIcon } from "./icons/sun";
// import "../index.css";
// import { Switch } from "radix-ui";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    const themeFromLocalStorage = localStorage.getItem("theme");

    if (themeFromLocalStorage) {
      setTheme(themeFromLocalStorage);
      document.documentElement.classList.toggle(
        "dark",
        themeFromLocalStorage === "dark"
      );
    }
  }, []);

  return (
    <>
      <Switch.Root className="w-5 h-5 outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded p-[1px]" onClick={toggleTheme}>
        <Switch.Thumb>
          {theme === "light" && <SunIcon />}
          {theme === "dark" && <MoonIcon />}
        </Switch.Thumb>
      </Switch.Root>
    </>
  );
}
