import logo from "@/assets/brand/logo_light.png";
import logoDark from "@/assets/brand/logo_dark.png";
import { cn } from "@/lib/utils";
export default function Logo({
  className,
}: {
  className?: string;
  isDarkMode?: boolean;
}) {
  return (
    <>
      <img
        src={logo}
        alt="Ad Paws Logo"
        className={cn(className, "dark:hidden")}
      />
      <img
        src={logoDark}
        alt="Ad Paws Logo"
        className={cn(className, "hidden dark:block")}
      />
    </>
  );
}
