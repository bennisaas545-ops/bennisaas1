import React from "react";

interface LogoProps {
  variant?: "header" | "footer";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "header",
  className = "",
}) => {
  const iconSize =
    variant === "footer"
      ? "h-8 w-8 sm:h-9 sm:w-9"
      : "h-7 w-7 sm:h-8 sm:w-8";

  const textStyle =
    variant === "footer"
      ? "text-base sm:text-lg"
      : "text-[14px] md:text-[13px] lg:text-[15px] xl:text-[17px] max-w-[215px] sm:max-w-none truncate";

  return (
    <span
      className={`inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={`${iconSize} shrink-0`}
      >
        {/* Minimalist geometric B-monogram: yellow structural spine & upper loop */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5 8C5 6.34315 6.34315 5 8 5H21.5C24.8137 5 27.5 7.68629 27.5 11C27.5 14.3137 24.8137 17 21.5 17H11V28C11 29.6569 9.65685 31 8 31C6.34315 31 5 29.6569 5 28V8ZM11 9.5V12.5H21C21.8284 12.5 22.5 11.8284 22.5 11C22.5 10.1716 21.8284 9.5 21 9.5H11Z"
          fill="#EAB308"
        />
        {/* Lower workflow automation module */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.5 21C13.5 19.8954 14.3954 19 15.5 19H24.5C27.8137 19 30.5 21.6863 30.5 25C30.5 28.3137 27.8137 31 24.5 31H15.5C14.3954 31 13.5 30.1046 13.5 29V21ZM18 23.25V26.75H24C24.9665 26.75 25.75 25.9665 25.75 25C25.75 24.0335 24.9665 23.25 24 23.25H18Z"
          fill="#1E40AF"
        />
      </svg>
      <span
        className={`font-[var(--font-display)] font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 ${textStyle}`}
      >
        Bennisaas Solutions LLC
      </span>
    </span>
  );
};
