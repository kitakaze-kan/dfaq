import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer: FC = () => {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
    <div>
    <p>Copyright © {new Date().getFullYear()}</p>
  </div> 
</footer>
  );
};
